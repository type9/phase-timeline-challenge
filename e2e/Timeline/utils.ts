import { Browser, Locator, Page } from '@playwright/test';

export type TimelineElements = {
  titleLocator: Locator;
  currentTimeLocator: Locator;
  durationTimeLocator: Locator;
  rulerLocator: Locator;
  rulerBarLocator: Locator;
  playheadLocator: Locator;
  trackListLocator: Locator;
  keyframeLocator: Locator;
  segmentLocator: Locator;
};

export const initializeTimeline = async (page: Page) =>
  await page.goto('http://localhost:3000');

export const getTimelineElements = async (page: Page) => {
  const titleLocator = page.locator('h1');
  const currentTimeLocator = page.locator(
    'input[data-testid=current-time-input]'
  );
  const durationTimeLocator = page.locator('input[data-testid=duration-input]');
  const rulerLocator = page.locator('div[data-testid=ruler]');
  const rulerBarLocator = page.locator('div[data-testid=ruler-bar]');
  const playheadLocator = page.locator('div[data-testid=playhead]');
  const trackListLocator = page.locator('div[data-testid=track-list]');
  const keyframeLocator = page.locator('div[data-testid=keyframe-list]');
  const segmentLocator = page.locator('div[data-testid=segment]').first();

  return {
    titleLocator,
    currentTimeLocator,
    durationTimeLocator,
    rulerLocator,
    rulerBarLocator,
    playheadLocator,
    trackListLocator,
    keyframeLocator,
    segmentLocator,
  };
};
