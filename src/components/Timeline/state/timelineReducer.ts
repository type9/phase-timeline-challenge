import { Reducer } from 'react';
import { TimelineState } from '../models/TimelineProvider';
import { getNewDurationTime, getNewPlayheadTime } from '../utils/time';
import { DEFAULT_TIMELINE_CONFIG } from '../constants';

const getNewStateDep = () => performance.now();

export type TimelineAction =
  | { type: 'SET_DURATION_TIME'; payload: number }
  | {
      type: 'SET_PLAYHEAD_TIME';
      payload: number;
    };

export const timelineReducer: Reducer<TimelineState, TimelineAction> = (
  state,
  action
): TimelineState => {
  if (action.type === 'SET_PLAYHEAD_TIME') {
    if (action.payload === state.playheadTime) return state;

    const newPlayheadTime = getNewPlayheadTime({
      playheadTime: action.payload,
      minTime: state.minTime,
      maxTime: state.maxTime,
      durationTime: state.durationTime,
    });

    return {
      ...state,
      playheadTime: newPlayheadTime,
      timeStateDep: getNewStateDep(),
    };
  }

  if (action.type === 'SET_DURATION_TIME') {
    if (action.payload === state.durationTime) return state;

    const newDurationTime = getNewDurationTime({
      durationTime: action.payload,
      minTime: DEFAULT_TIMELINE_CONFIG.minDuration,
      maxTime: DEFAULT_TIMELINE_CONFIG.maxDuration,
    });

    const newPlayheadTime = getNewPlayheadTime({
      playheadTime: state.playheadTime,
      minTime: state.minTime,
      maxTime: state.maxTime,
      durationTime: newDurationTime,
    });

    if (
      newPlayheadTime === state.playheadTime &&
      newDurationTime === state.durationTime
    )
      return state;

    return {
      ...state,
      durationTime: newDurationTime,
      playheadTime: newPlayheadTime,
      timeStateDep: getNewStateDep(),
    };
  }

  throw new Error(`Invalid action format ${action}`);
};
