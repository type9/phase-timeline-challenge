import { Dispatch } from 'react';
import { TimelineAction } from '../state/timelineReducer';

export type TimelineState = {
  playheadTime: number;
  minTime: number;
  maxTime: number;
  durationTime: number;
  timeStateDep: number;
  horizontalOffset: number;
  verticalOffset: number;
};

export type TimelineContextType = {
  timelineState: TimelineState;
  timelineDispatch: Dispatch<TimelineAction>;
};
