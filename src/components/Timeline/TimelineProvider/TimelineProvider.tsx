import { createContext, useReducer } from 'react';
import { timelineReducer } from '../state/timelineReducer';
import { TimelineContextType, TimelineState } from '../models/TimelineProvider';

export const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

export const TIMELINE_DEFAULT_STATE: TimelineState = {
  playheadTime: 0,
  minTime: 0,
  maxTime: 0,
  durationTime: 2000,
  stateDep: 0,
  horizontalOffset: 0,
  verticalOffset: 0,
};

export const TimelineProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Partial<TimelineState>;
}) => {
  const [timelineState, timelineDispatch] = useReducer(timelineReducer, {
    ...TIMELINE_DEFAULT_STATE,
    ...initialState,
  });

  return (
    <TimelineContext.Provider value={{ timelineState, timelineDispatch }}>
      {children}
    </TimelineContext.Provider>
  );
};
