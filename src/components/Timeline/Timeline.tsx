import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Playhead, PlayheadProps } from './Playhead';
import { Ruler, RulerProps } from './Ruler';
import { TrackList, TrackListProps } from './TrackList';
import { KeyframeList, KeyframeListProps } from './KeyframeList';
import { PlayControls, PlayControlsProps } from './PlayControls';
import { TimelineContext } from './TimelineProvider';
import { DEFAULT_TIMELINE_CONFIG } from './constants';
import { calculatePlayheadPosition } from './utils/position';

export const Timeline = () => {
  const rulerContainerRef = useRef<RulerProps['containerRef']['current']>(null);
  const trackListContainerRef =
    useRef<TrackListProps['containerRef']['current']>(null);
  const keyframeListContainerRef =
    useRef<KeyframeListProps['containerRef']['current']>(null);
  const playheadRef = useRef<PlayheadProps['playheadRef']['current']>(null);

  const timelineContext = useContext(TimelineContext);
  if (!timelineContext) {
    throw new Error('Timeline must be used within a TimelineProvider');
  }
  const { timelineState, timelineDispatch } = timelineContext;

  //#region SCROLL HANDLERS
  const handleHorizontalScroll = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLDivElement;
      if (target) {
        timelineDispatch({
          type: 'SET_HORIZONTAL_OFFSET',
          payload: target.scrollLeft,
        });
      }
    },
    [timelineDispatch]
  );

  const handleVerticalScroll = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLDivElement;
      if (target) {
        timelineDispatch({
          type: 'SET_VERTICAL_OFFSET',
          payload: target.scrollTop,
        });
      }
    },
    [timelineDispatch]
  );

  useEffect(() => {
    if (rulerContainerRef.current)
      rulerContainerRef.current.addEventListener('scroll', e =>
        handleHorizontalScroll(e)
      );
    if (keyframeListContainerRef.current)
      keyframeListContainerRef.current.addEventListener('scroll', e =>
        handleHorizontalScroll(e)
      );
    if (keyframeListContainerRef.current)
      keyframeListContainerRef.current.addEventListener('scroll', e =>
        handleVerticalScroll(e)
      );
    if (trackListContainerRef.current)
      trackListContainerRef.current.addEventListener('scroll', e =>
        handleVerticalScroll(e)
      );

    return () => {
      if (rulerContainerRef.current)
        rulerContainerRef.current.removeEventListener('scroll', e =>
          handleHorizontalScroll(e)
        );
      if (keyframeListContainerRef.current) {
        keyframeListContainerRef.current.removeEventListener('scroll', e =>
          handleHorizontalScroll(e)
        );
        keyframeListContainerRef.current.removeEventListener('scroll', e =>
          handleVerticalScroll(e)
        );
      }
      if (trackListContainerRef.current)
        trackListContainerRef.current.removeEventListener('scroll', e =>
          handleVerticalScroll(e)
        );
    };
  }, []);

  useEffect(() => {
    if (rulerContainerRef.current) {
      rulerContainerRef.current.scrollLeft = timelineState.horizontalOffset;
    }
    if (keyframeListContainerRef.current) {
      keyframeListContainerRef.current.scrollLeft =
        timelineState.horizontalOffset;
    }
  }, [timelineState.horizontalOffset]);

  useEffect(() => {
    if (trackListContainerRef.current) {
      trackListContainerRef.current.scrollTop = timelineState.verticalOffset;
    }
    if (keyframeListContainerRef.current) {
      keyframeListContainerRef.current.scrollTop = timelineState.verticalOffset;
    }
  }, [timelineState.verticalOffset]);
  //#endregion

  //#region INPUT HANDLERS
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

  const handleRulerUpdateTime = useCallback<
    NonNullable<RulerProps['onBarDrag']>
  >(
    (_, time) => {
      if (time === undefined) return;
      timelineDispatch({
        type: 'SET_PLAYHEAD_TIME',
        payload: time,
      });
    },
    [timelineDispatch]
  );
  //#endregion

  const segmentWidth = useMemo(
    () => `${timelineState.durationTime.toString()}px`,
    [timelineState.durationTime]
  );

  const playheadPosition = useMemo(
    () =>
      calculatePlayheadPosition({
        currentTime: timelineState.playheadTime,
        leftOffset: timelineState.horizontalOffset,
        leftPadding: DEFAULT_TIMELINE_CONFIG.leftRulerPadding,
        timeToPixelRatio: DEFAULT_TIMELINE_CONFIG.timeToPixelRatio,
      }),
    [timelineState.horizontalOffset, timelineState.playheadTime]
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
      <Ruler
        containerRef={rulerContainerRef}
        width={segmentWidth}
        onBarDrag={handleRulerUpdateTime}
      />
      <TrackList containerRef={trackListContainerRef} />
      <KeyframeList
        containerRef={keyframeListContainerRef}
        segmentWidth={segmentWidth}
      />
      <Playhead
        positionX={playheadPosition}
        playheadRef={playheadRef}
        visible={
          playheadPosition >
          DEFAULT_TIMELINE_CONFIG.leftRulerPadding -
            DEFAULT_TIMELINE_CONFIG.rightRulerPadding //accounts for the padding not being visible
        }
      />
    </div>
  );
};
