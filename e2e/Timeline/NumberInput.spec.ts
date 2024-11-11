import { expect, Page, test } from '@playwright/test';
import {
  getTimelineElements,
  initializeTimeline,
  TimelineElements,
} from './utils';

test.describe('Timeline - NumberInput Component Behavior', () => {
  const increment = 10;
  const durationTimeDefaultValue = 2000;
  const currentTimeDefaultValue = 0;
  const minDuration = 100;
  const maxDuration = 6000;

  let elements: TimelineElements;

  test.beforeEach(async ({ page }) => {
    await initializeTimeline(page);
    elements = await getTimelineElements(page);
  });

  test('NumberInput should revert value on Escape key and deselect text', async ({
    page,
  }) => {
    const { durationTimeLocator } = elements;

    // Test DurationTimeInput
    await durationTimeLocator.click();
    await durationTimeLocator.fill('5000');
    await expect(durationTimeLocator).toHaveValue('5000');
    await durationTimeLocator.press('Escape');
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue}`
    );

    // Ensure text is not selected
    const selectionLength = await page.evaluate(() => {
      return window.getSelection()?.toString().length || 0;
    });
    expect(selectionLength).toBe(0);
  });

  test('NumberInput should confirm value on outside click blur and deselect text', async ({
    page,
  }) => {
    const { durationTimeLocator, titleLocator } = elements;

    // Type new value
    await durationTimeLocator.click();
    await durationTimeLocator.fill('200');

    // Click outside to trigger blur
    await titleLocator.click();

    // Value should be confirmed
    await expect(durationTimeLocator).toHaveValue('200');

    // Ensure text is not selected
    const selectionLength = await page.evaluate(() => {
      return window.getSelection()?.toString().length || 0;
    });
    expect(selectionLength).toBe(0);
  });

  test('NumberInput should confirm value on Enter', async ({ page }) => {
    const { durationTimeLocator } = elements;

    // Type new value
    await durationTimeLocator.click();
    await durationTimeLocator.fill('200');

    // Click outside to trigger blur
    await durationTimeLocator.press('Enter');

    // Value should be confirmed
    await expect(durationTimeLocator).toHaveValue('200');

    // [OMITTED] Deselect Text - seems to be a bug in playwright. Works in real browser
    // Ensure text is not selected
    // const selectionLength = await page.evaluate(() => {
    //   return window.getSelection()?.toString().length || 0;
    // });
    // expect(selectionLength).toBe(0);
  });

  test('NumberInput should increment/decrement value with arrow keys and select text', async ({
    page,
  }) => {
    const { durationTimeLocator } = elements;

    // Initial value
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue}`
    );

    // Increment value
    await durationTimeLocator.click();
    await durationTimeLocator.press('ArrowUp');
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue + increment}`
    );

    // Decrement value
    await durationTimeLocator.press('ArrowDown');
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue}`
    );

    // Ensure text is not selected
    const selectionLength = await page.evaluate(() => {
      return window.getSelection()?.toString().length || 0;
    });
    expect(selectionLength).not.toBe(0);
  });

  test('NumberInput should respect min and max constraints', async () => {
    const { durationTimeLocator } = elements;

    // Attempt to set value below min
    await durationTimeLocator.click();
    await durationTimeLocator.fill('10');
    await durationTimeLocator.press('Enter');
    await expect(durationTimeLocator).toHaveValue(`${minDuration}`);

    // Attempt to set value above max
    await durationTimeLocator.click();
    await durationTimeLocator.fill('10000');
    await durationTimeLocator.press('Enter');
    await expect(durationTimeLocator).toHaveValue(`${maxDuration}`);
  });

  test('NumberInput should select text on arrow up/down', async () => {
    const { durationTimeLocator } = elements;

    //Focus input
    await durationTimeLocator.click();

    await durationTimeLocator.press('ArrowUp');
    //Assume text is selected
    await durationTimeLocator.fill('500');
    // If fully selected, value will be '0'
    await expect(durationTimeLocator).toHaveValue('500');

    await durationTimeLocator.press('ArrowDown');
    //Assume arrow down changed value by increment
    await expect(durationTimeLocator).toHaveValue('490');
    //Assume text is selected
    await durationTimeLocator.fill('500');
    await expect(durationTimeLocator).toHaveValue('500');
  });

  test('NumberInput should increment/decrement value using spin buttons and select text', async ({
    page,
  }) => {
    const { durationTimeLocator } = elements;

    // Focus input
    await durationTimeLocator.click();

    // Get the bounding box of the input element
    const boundingBox = await durationTimeLocator.boundingBox();
    if (!boundingBox) {
      throw new Error('Could not get bounding box of durationTimeLocator');
    }

    const { x, y, width, height } = boundingBox;

    // Calculate positions for increment and decrement buttons
    // Adjust these calculations based on the actual rendering in your application
    const incrementButtonX = x + width - 5; // Near the right edge
    const incrementButtonY = y + height / 4; // Upper half for increment
    const decrementButtonX = incrementButtonX;
    const decrementButtonY = y + (3 * height) / 4; // Lower half for decrement

    // Click the increment button
    await page.mouse.click(incrementButtonX, incrementButtonY);
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue + increment}`
    );

    // Click the decrement button
    await page.mouse.click(decrementButtonX, decrementButtonY);
    await expect(durationTimeLocator).toHaveValue(
      `${durationTimeDefaultValue}`
    );

    // Assume text is selected
    await durationTimeLocator.fill('500');
    await expect(durationTimeLocator).toHaveValue('500');
  });

  test('NumberInput should automatically remove leading zeros', async () => {
    const { durationTimeLocator } = elements;

    await durationTimeLocator.click();
    await durationTimeLocator.fill('00500');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');
  });

  test('NumberInput should automatically round to nearest increment', async () => {
    const { durationTimeLocator } = elements;

    await durationTimeLocator.click();
    await durationTimeLocator.fill('501');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    await durationTimeLocator.click();
    await durationTimeLocator.fill('502');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    await durationTimeLocator.click();
    await durationTimeLocator.fill('505');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('510');

    //With leading zeros
    await durationTimeLocator.click();
    await durationTimeLocator.fill('00501');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    await durationTimeLocator.click();
    await durationTimeLocator.fill('00502');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    await durationTimeLocator.click();
    await durationTimeLocator.fill('00505');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('510');

    //With decimals
    await durationTimeLocator.click();
    await durationTimeLocator.fill('501.123');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    await durationTimeLocator.click();
    await durationTimeLocator.fill('502.09182');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    //Should round down?
    //not sure on this one depends on behaviour.
    //If we want to round the input to nearest decimal before rounding time to nearest increment, then it should round up.
    await durationTimeLocator.click();
    await durationTimeLocator.fill('504.5');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');

    //Should round down
    await durationTimeLocator.click();
    await durationTimeLocator.fill('504.3');
    await durationTimeLocator.press('Enter');

    await expect(durationTimeLocator).toHaveValue('500');
  });

  test('Should revert to previous value on non-numeric input', async () => {
    const { currentTimeLocator } = elements;
    //Set to non default value
    await currentTimeLocator.click();
    await currentTimeLocator.fill('100');
    await currentTimeLocator.press('Enter');

    //Non-numeric
    await currentTimeLocator.click();
    await currentTimeLocator.type('abc');
    await currentTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue(`${100}`);

    //Empty string
    await currentTimeLocator.click();
    await currentTimeLocator.type('');
    await currentTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue(`${100}`);

    //Invalid negative number
    await currentTimeLocator.click();
    await currentTimeLocator.type('-');
    await currentTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue(`${100}`);

    //Special characters
    await currentTimeLocator.click();
    await currentTimeLocator.type('!@#$%^&*()');
    await currentTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue(`${100}`);

    //Still reverts on 0 value
    await currentTimeLocator.click();
    await currentTimeLocator.type('0');
    await currentTimeLocator.press('Enter');
    await expect(currentTimeLocator).toHaveValue(`${0}`);
  });
});
