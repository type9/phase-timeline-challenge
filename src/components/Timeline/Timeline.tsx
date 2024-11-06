import { useCallback, useContext } from 'react';
import { Playhead } from './Playhead';
import { Ruler } from './Ruler';
import { TrackList } from './TrackList';
import { KeyframeList } from './KeyframeList';
import { PlayControls, PlayControlsProps } from './PlayControls';
import { TimelineContext } from './TimelineProvider';
import { DEFAULT_TIMELINE_CONFIG } from './constants';

export const Timeline = () => {
  const timelineContext = useContext(TimelineContext);
  if (!timelineContext) {
    throw new Error('Timeline must be used within a TimelineProvider');
  }

  const { timelineState, timelineDispatch } = timelineContext;

  console.log('TIMELINE STATE', timelineState);

  const handleCurrentTimeInputChange = useCallback<
    NonNullable<PlayControlsProps['onCurrentTimeInputChange']>
  >(
    (e, currentKeyDown) => {
      if (currentKeyDown === 'ArrowUp' || currentKeyDown === 'ArrowDown')
        timelineDispatch({
          type: 'SET_PLAYHEAD_TIME',
          payload: Number(e.target.value),
        });

      //if no key is pressed, update the playhead time. in particular, this detects increment buttons.
      if (currentKeyDown === undefined)
        timelineDispatch({
          type: 'SET_PLAYHEAD_TIME',
          payload: Number(e.target.value),
        });
    },
    [timelineDispatch]
  );

  const handleDurationTimeInputChange = useCallback<
    NonNullable<PlayControlsProps['onDurationTimeInputChange']>
  >(
    (e, currentKeyDown) => {
      if (currentKeyDown === 'ArrowUp' || currentKeyDown === 'ArrowDown')
        timelineDispatch({
          type: 'SET_DURATION_TIME',
          payload: Number(e.target.value),
        });

      //if no key is pressed, update the playhead time. in particular, this detects increment buttons.
      if (currentKeyDown === undefined)
        timelineDispatch({
          type: 'SET_DURATION_TIME',
          payload: Number(e.target.value),
        });
    },
    [timelineDispatch]
  );

  const handleCurrentTimeInputBlur = useCallback<
    NonNullable<PlayControlsProps['onCurrentTimeBlur']>
  >(
    (e, currentKeyDown) => {
      // on escape we do not dispatch a new state
      if (currentKeyDown === 'Escape') return;
      timelineDispatch({
        type: 'SET_PLAYHEAD_TIME',
        payload: Number(e.target.value),
      });
    },
    [timelineDispatch]
  );

  const handleDurationTimeInputBlur = useCallback<
    NonNullable<PlayControlsProps['onCurrentTimeBlur']>
  >(
    (e, currentKeyDown) => {
      // on escape we do not dispatch a new state
      if (currentKeyDown === 'Escape') return;
      timelineDispatch({
        type: 'SET_DURATION_TIME',
        payload: Number(e.target.value),
      });
    },
    [timelineDispatch]
  );

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls
        increment={DEFAULT_TIMELINE_CONFIG.increment}
        playheadTime={timelineState.playheadTime}
        durationTime={timelineState.durationTime}
        stateDep={timelineState.stateDep}
        onCurrentTimeInputChange={handleCurrentTimeInputChange}
        onCurrentTimeBlur={handleCurrentTimeInputBlur}
        onDurationTimeInputChange={handleDurationTimeInputChange}
        onDurationTimeBlur={handleDurationTimeInputBlur}
      />
      <Ruler />
      <TrackList />
      <KeyframeList />
      <Playhead time={timelineState.playheadTime} />
    </div>
  );
};
