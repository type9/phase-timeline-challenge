import { Dispatch } from 'react';
import { TimelineAction } from '../state/timelineReducer';

export type TimelineState = {
  playheadTime: number;
  minTime: number;
  maxTime: number;
  durationTime: number;
  timeStateDep: number; // used to force a rerender when time values are changed. in particular, this informs that the state object has been recreated.
  horizontalOffset: number;
  verticalOffset: number;
};

export type TimelineContextType = {
  timelineState: TimelineState;
  timelineDispatch: Dispatch<TimelineAction>;
};
