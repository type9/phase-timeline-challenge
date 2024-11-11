import { expect, test } from '@playwright/test';
import {
  getTimelineElements,
  initializeTimeline,
  TimelineElements,
} from './utils';

test.describe('Timeline', () => {
  let elements: TimelineElements;

  test.beforeEach(async ({ page }) => {
    await initializeTimeline(page);
    elements = await getTimelineElements(page);
  });

  test('should render', async () => {
    Object.values(elements).forEach(async locator => {
      await expect(locator).toBeVisible();
    });
  });

  test('RulerContainer and Keyframe list should sync horizontal scroll', async ({
    page,
  }) => {
    const { rulerLocator, keyframeLocator } = elements;

    // Ensure both elements are scrolled to the start
    await expect(rulerLocator).toHaveJSProperty('scrollLeft', 0);
    await expect(keyframeLocator).toHaveJSProperty('scrollLeft', 0);

    const scrollAmount = 600;

    // Scroll the RulerContainer right
    await rulerLocator.hover();
    await page.mouse.wheel(scrollAmount, 0);

    // Wait for for any scroll event handlers to execute
    await page.waitForTimeout(100);

    const rulerScrollLeft = await rulerLocator.evaluate(el => el.scrollLeft);
    const keyframeScrollLeft = await keyframeLocator.evaluate(
      el => el.scrollLeft
    );

    // Keyframe and ruler should be scrolled the same amount
    expect(keyframeScrollLeft).toBe(rulerScrollLeft);
    expect(rulerScrollLeft).toBe(scrollAmount);

    // Scroll the Keyframe list left
    const newScrollAmount = -400;

    await keyframeLocator.hover();
    await page.mouse.wheel(newScrollAmount, 0);

    // Wait briefly
    await page.waitForTimeout(100);

    const rulerScrollLeftAfter = await rulerLocator.evaluate(
      el => el.scrollLeft
    );
    const keyframeScrollLeftAfter = await keyframeLocator.evaluate(
      el => el.scrollLeft
    );

    // Ruler container and keyframe list should be scrolled the same amount
    expect(rulerScrollLeftAfter).toBe(keyframeScrollLeftAfter);
    expect(rulerScrollLeftAfter).toBe(scrollAmount + newScrollAmount);
  });

  test('Keyframe list and Track list should sync vertical scroll', async ({
    page,
  }) => {
    const { keyframeLocator, trackListLocator } = elements;

    // Ensure both elements are scrolled to the top
    await expect(keyframeLocator).toHaveJSProperty('scrollTop', 0);
    await expect(trackListLocator).toHaveJSProperty('scrollTop', 0);

    const scrollAmount = 30;

    // Scroll the Keyframe list vertically
    await keyframeLocator.hover();
    await page.mouse.wheel(0, scrollAmount);

    // Wait for any scroll event handlers to execute
    await page.waitForTimeout(100);

    const keyframeScrollTop = await keyframeLocator.evaluate(
      el => el.scrollTop
    );
    const trackListScrollTop = await trackListLocator.evaluate(
      el => el.scrollTop
    );

    // Keyframe list and track list should be scrolled the same amount vertically
    expect(trackListScrollTop).toBe(scrollAmount);
    expect(keyframeScrollTop).toBe(scrollAmount);

    // Scroll the Track list vertically
    // Should scroll to max of the two scroll amounts
    const newScrollAmount = 10000;

    await trackListLocator.hover();
    await page.mouse.wheel(0, newScrollAmount);

    // Wait briefly
    await page.waitForTimeout(100);

    const keyframeScrollTopAfter = await keyframeLocator.evaluate(
      el => el.scrollTop
    );
    const trackListScrollTopAfter = await trackListLocator.evaluate(
      el => el.scrollTop
    );

    // Keyframe list and track list should be scrolled the same amount vertically
    expect(keyframeScrollTopAfter).toBe(trackListScrollTopAfter);
    expect(trackListScrollTopAfter).toBe(keyframeScrollTopAfter);
  });

  test('Playhead position should move in sync with horizontal scroll', async ({
    page,
  }) => {
    const {
      playheadLocator,
      keyframeLocator,
      currentTimeLocator,
      rulerLocator,
      durationTimeLocator,
    } = elements;
    let updatedPlayheadPosition;

    //sets duration to give space to scroll
    await durationTimeLocator.click();
    await durationTimeLocator.fill('3000');
    await durationTimeLocator.press('Enter');

    //sets current time to give space to scroll
    await currentTimeLocator.click();
    await currentTimeLocator.fill('1500');
    await currentTimeLocator.press('Enter');

    // Scroll right to center the playhead
    await keyframeLocator.hover();
    await page.mouse.wheel(1000, 0);
    await page.waitForTimeout(100);

    // Get the initial playhead position
    const initialPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );

    // Attempt to scroll right
    await keyframeLocator.hover();
    await page.mouse.wheel(10, 0);
    await page.waitForTimeout(100);

    // Should scroll 1:1 ratio
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition - 10);

    // Attempt to scroll left
    await keyframeLocator.hover();
    await page.mouse.wheel(-20, 0);
    await page.waitForTimeout(100);

    // Should scroll 1:1 ratio
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 10);
  });

  // NOTE: Only tests extreme. should add more tests for the exact boundaries by using ruler's bounding box
  test('Playhead should hide itself when outside the timeline', async ({
    page,
  }) => {
    const {
      playheadLocator,
      keyframeLocator,
      currentTimeLocator,
      rulerLocator,
      durationTimeLocator,
    } = elements;

    //Should be initially visiible
    await expect(playheadLocator).toBeVisible();

    //sets duration to give space to scroll
    await durationTimeLocator.click();
    await durationTimeLocator.fill('3000');
    await durationTimeLocator.press('Enter');

    //scroll to the right
    await rulerLocator.hover();
    await page.mouse.wheel(1000, 0);
    await page.waitForTimeout(100);

    //playhead should not be visible
    await expect(playheadLocator).toBeHidden();

    //sets current time to give space to scroll
    await currentTimeLocator.click();
    await currentTimeLocator.fill('1500');
    await currentTimeLocator.press('Enter');

    // Scroll right to center the playhead
    await keyframeLocator.hover();
    await page.mouse.wheel(-1500, 0);
    await page.waitForTimeout(100);

    //playhead should not be visible
    await expect(playheadLocator).toBeHidden();
  });

  //NOTE: Dragging needs to also be implemented but tests weren't able to get mouse up/down drag on ruler to work
  test('Clicking the ruler updates playhead and currentTime with respect to boundaries', async ({
    page,
  }) => {
    const {
      rulerBarLocator,
      playheadLocator,
      currentTimeLocator,
      durationTimeLocator,
    } = elements;

    let updatedPlayheadPosition;
    const initialPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );

    // Current time should be 0
    await expect(currentTimeLocator).toHaveValue('0');

    // Get bounding boxes for calculations
    const rulerBarBox = await rulerBarLocator.boundingBox();
    if (!rulerBarBox)
      throw new Error('Could not get bounding box of rulerLocator');

    // Calculate positions
    const rulerStartX = rulerBarBox.x;
    const rulerEndX = rulerBarBox.x + rulerBarBox.width;
    const rulerBarBoxCenterY = rulerBarBox.y + rulerBarBox.height / 2;

    const clickRulerBar = async (targetX: number) =>
      await page.mouse.click(targetX, rulerBarBoxCenterY);

    await clickRulerBar(rulerStartX + 100);
    await page.waitForTimeout(100);

    // Get the updated currentTime value
    const currentTimeValue = await currentTimeLocator.inputValue();
    expect(currentTimeValue).toBe('100');

    // Playhead position moves with the click
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 100);

    // Try to click the ruler beyond the left boundary. should not update currentTime
    await clickRulerBar(rulerStartX - 100);
    await page.waitForTimeout(100);
    expect(currentTimeValue).toBe('100');

    // Playhead position does not move with the click
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 100);

    // Sets duration time to 200
    await durationTimeLocator.click();
    await durationTimeLocator.fill('200');
    await durationTimeLocator.press('Enter');

    // Try to click the ruler beyond the right boundary. should not update currentTime
    await clickRulerBar(rulerEndX + 100);
    await page.waitForTimeout(100);
    expect(currentTimeValue).toBe('100');
    // Playhead position does not move with the click
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 100);
  });
});
