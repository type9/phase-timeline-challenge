import { DEFAULT_TIMELINE_CONFIG } from '../constants';

export const roundTime = (time: number) =>
  Math.round(time / DEFAULT_TIMELINE_CONFIG.timeRoundingFactor) *
  DEFAULT_TIMELINE_CONFIG.timeRoundingFactor;

export const getNewPlayheadTime = ({
  playheadTime,
  minTime,
  maxTime,
  durationTime,
}: {
  playheadTime: number;
  minTime: number;
  maxTime: number;
  durationTime: number;
}) => {
  if (playheadTime < minTime) return minTime;
  if (playheadTime > maxTime) return maxTime;
  if (playheadTime > durationTime) return durationTime;
  return roundTime(playheadTime);
};

export const getNewDurationTime = ({
  durationTime,
  minTime,
  maxTime,
}: {
  durationTime: number;
  minTime: number;
  maxTime: number;
}) => {
  if (durationTime < minTime) return minTime;
  if (durationTime > maxTime) return maxTime;
  return roundTime(durationTime);
};
