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
    }
  | { type: 'SET_VERTICAL_OFFSET'; payload: number }
  | { type: 'SET_HORIZONTAL_OFFSET'; payload: number };

export const timelineReducer: Reducer<TimelineState, TimelineAction> = (
  state,
  action
) => {
  if (action.type === 'SET_PLAYHEAD_TIME') {
    const newPlayheadTime = getNewPlayheadTime({
      playheadTime: action.payload,
      minTime: state.minTime,
      maxTime: state.maxTime,
      durationTime: state.durationTime,
    });

    return {
      ...state,
      playheadTime: newPlayheadTime,
      stateDep: getNewStateDep(),
    };
  }

  if (action.type === 'SET_DURATION_TIME') {
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

    return {
      ...state,
      durationTime: newDurationTime,
      playheadTime: newPlayheadTime,
      stateDep: getNewStateDep(),
    };
  }

  if (action.type === 'SET_HORIZONTAL_OFFSET') {
    return {
      ...state,
      horizontalOffset: action.payload,
    };
  }

  if (action.type === 'SET_VERTICAL_OFFSET') {
    return {
      ...state,
      verticalOffset: action.payload,
    };
  }
  throw new Error(`Invalid action format ${action}`);
};
