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
});
