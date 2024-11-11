import { expect, test } from '@playwright/test';
import {
  getTimelineElements,
  initializeTimeline,
  TimelineElements,
} from './utils';

test.describe.serial('Timeline - PlayControls', () => {
  const maxDuration = 6000;
  const currentTimeDefaultValue = 0;
  const durationTimeDefaultValue = 2000;
  const increment = 10;

  let elements: TimelineElements;

  test.beforeEach(async ({ page }) => {
    await initializeTimeline(page);
    elements = await getTimelineElements(page);
  });

  test('currentTime only changes on arrowkeys & confirmation and playhead position reflects currentTime', async () => {
    const {
      currentTimeLocator,
      rulerBarLocator,
      playheadLocator,
      titleLocator,
    } = elements;

    let updatedPlayheadPosition;

    // currentTime should reflect the default value
    await expect(currentTimeLocator).toHaveValue(`${currentTimeDefaultValue}`);
    // Playhead should be at the beginning of the timeline
    const initialBarPosition = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    const initialPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    await expect(initialPlayheadPosition).toBe(initialBarPosition);

    // Fill the input without pressing Enter and verify the value updates in the input field
    await currentTimeLocator.click();
    await currentTimeLocator.pressSequentially('100');
    await expect(currentTimeLocator).toHaveValue('100');

    // Verify that the playhead's position has not changed
    const playheadPositionWhileTyping = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(playheadPositionWhileTyping).toBe(initialPlayheadPosition);

    // Typing a value and hitting escape should revert to the default value
    await currentTimeLocator.press('Escape');
    await expect(currentTimeLocator).toHaveValue(`${currentTimeDefaultValue}`);

    // Click outside to trigger a blur and verify the playhead position updates
    await currentTimeLocator.click();
    await currentTimeLocator.pressSequentially('100');
    await titleLocator.click();

    await expect(currentTimeLocator).toHaveValue('100');
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 100); // Confirm position change

    // NOTE: Would like to simulate increment buttons  too but not sure how to do this

    // Arrow up/down should change the value and update the playhead position immediately
    await expect(currentTimeLocator).toHaveValue('100');
    await currentTimeLocator.click();
    await currentTimeLocator.press('ArrowUp');
    await expect(currentTimeLocator).toHaveValue(`${100 + increment}`);
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    await expect(updatedPlayheadPosition).toBe(
      initialPlayheadPosition + 100 + increment
    );

    // Clicking the up/down buttons should change the value and update the playhead position immediately
    await currentTimeLocator.press('ArrowUp');
    await currentTimeLocator.press('ArrowUp');
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(
      initialPlayheadPosition + 100 + increment * 3
    );

    await currentTimeLocator.press('ArrowDown');
    await currentTimeLocator.press('ArrowDown');
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(
      initialPlayheadPosition + 100 + increment
    );
  });

  test('durationTime only changes on arrowkeys & confirmation - segments and rulerbar width reflects durationTime', async () => {
    const {
      durationTimeLocator,
      segmentLocator,
      rulerBarLocator,
      titleLocator,
    } = elements;

    let updatedSegmentWidth;
    let updatedRulerBarWidth;

    // Duration Time should reflect the default value
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue}`
    );
    // Both the segment and ruler bar should be the same width as duration time
    const initialSegmentWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(initialSegmentWidth).toBe(durationTimeDefaultValue);
    const initialRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(initialRulerBarWidth).toBe(durationTimeDefaultValue);

    // Fill the input without pressing Enter and verify the value updates in the input field
    await durationTimeLocator.click();
    await durationTimeLocator.pressSequentially('600');
    await expect(durationTimeLocator).toHaveValue('600');

    // Verify that the segments/rulerbar have not changed width
    updatedSegmentWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    updatedRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(updatedSegmentWidth).toBe(initialSegmentWidth);
    expect(updatedRulerBarWidth).toBe(initialRulerBarWidth);

    // Typing a value and hitting escape should revert to the default value
    await durationTimeLocator.press('Escape');
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue}`
    );

    // Verify that the segments/rulerbar have not changed width
    updatedRulerBarWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    updatedRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(updatedSegmentWidth).toBe(initialSegmentWidth);
    expect(updatedRulerBarWidth).toBe(initialRulerBarWidth);

    // Click outside to trigger a blur and verify the widths update
    await durationTimeLocator.click();
    await durationTimeLocator.pressSequentially('600');
    await titleLocator.click();

    await expect(durationTimeLocator).toHaveValue('600');
    updatedSegmentWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    updatedRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(updatedSegmentWidth).toBe(600); // Confirm position change
    expect(updatedRulerBarWidth).toBe(600); // Confirm position change

    // NOTE: Would like to simulate increment buttons too but not sure how to do this
    // Arrow up/down should change the value and update the segments width immediately
    await expect(durationTimeLocator).toHaveValue('600');
    await durationTimeLocator.click();
    await durationTimeLocator.press('ArrowUp');
    await expect(durationTimeLocator).toHaveValue(`${600 + increment}`);
    updatedSegmentWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    updatedRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    await expect(updatedSegmentWidth).toBe(600 + increment);
    await expect(updatedRulerBarWidth).toBe(600 + increment);

    // Clicking the up/down buttons should change the value and update the segments width immediately
    await durationTimeLocator.press('ArrowUp');
    await durationTimeLocator.press('ArrowUp');
    updatedSegmentWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    updatedRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(updatedSegmentWidth).toBe(600 + increment * 3);
    expect(updatedRulerBarWidth).toBe(600 + increment * 3);

    await durationTimeLocator.press('ArrowDown');
    await durationTimeLocator.press('ArrowDown');
    updatedSegmentWidth = await segmentLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    updatedRulerBarWidth = await rulerBarLocator.evaluate(
      node => node.getBoundingClientRect().width
    );
    expect(updatedSegmentWidth).toBe(600 + increment);
    expect(updatedRulerBarWidth).toBe(600 + increment);
  });

  test('currentTime cannot exceed durationTime and playhead position reflects currentTime constraints', async () => {
    const { currentTimeLocator, durationTimeLocator, playheadLocator } =
      elements;
    let updatedPlayheadPosition;

    // we assume playhead position is correct
    const initialPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );

    // Set duration to 600 and confirm
    await durationTimeLocator.click();
    await durationTimeLocator.pressSequentially('600');
    await expect(durationTimeLocator).toHaveValue('600');

    // Set currentTime to 700 without confirming
    await currentTimeLocator.click();
    await currentTimeLocator.pressSequentially('700');
    // Current time should immediately say 700
    await expect(currentTimeLocator).toHaveValue('700');

    // Playhead position should not have changed
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition);

    // Confirm currentTime change to 700
    await currentTimeLocator.press('Enter');
    // After confirmation, current time is set to max of Duration time
    await expect(currentTimeLocator).toHaveValue('600');

    // Expect playhead position to be at the end of the timeline at 600
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 600);

    // Double-check values
    await expect(currentTimeLocator).toHaveValue('600');
    await expect(durationTimeLocator).toHaveValue('600');

    // Attempt to increase currentTime by ArrowUp
    await currentTimeLocator.click();
    await currentTimeLocator.press('ArrowUp');
    await currentTimeLocator.press('ArrowUp');
    await currentTimeLocator.press('ArrowUp');
    await expect(currentTimeLocator).toHaveValue('600');
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 600);

    // Double-check ArrowDown still works
    await currentTimeLocator.press('ArrowDown');
    await expect(currentTimeLocator).toHaveValue('590');
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 590);
  });

  test('durationTime reduces currentTime and playhead position reflects currentTime changes', async () => {
    const { durationTimeLocator, currentTimeLocator, playheadLocator } =
      elements;
    let updatedPlayheadPosition;

    // we assume playhead position is correct
    const initialPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );

    // Set duration to 1000 and click outside to trigger blur
    await durationTimeLocator.click();
    await durationTimeLocator.pressSequentially('600');
    await expect(durationTimeLocator).toHaveValue('600');

    // Set currentTime to 1000 anc confirm
    await currentTimeLocator.click();
    await currentTimeLocator.pressSequentially('600');
    await currentTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue('600');

    // Playhead position reflects currentTime
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 600);

    // Manually decrease duration below currentTime
    await durationTimeLocator.click();
    await durationTimeLocator.pressSequentially('500');
    await expect(durationTimeLocator).toHaveValue('500');
    await durationTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue('500');

    // Playhead position reflects currentTime
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 500);

    // Use arrow keys to decrease duration below currentTime
    await durationTimeLocator.click();
    await durationTimeLocator.press('ArrowDown');
    await durationTimeLocator.press('ArrowDown');
    expect(durationTimeLocator).toHaveValue('480');
    expect(currentTimeLocator).toHaveValue('480');

    // Playhead position reflects currentTime
    updatedPlayheadPosition = await playheadLocator.evaluate(
      node => node.getBoundingClientRect().left
    );
    expect(updatedPlayheadPosition).toBe(initialPlayheadPosition + 480);
  });
});
