import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Playhead, PlayheadHandle } from './Playhead';
import { Ruler, RulerProps } from './Ruler';
import { TrackList, TrackListProps } from './TrackList';
import { KeyframeList, KeyframeListProps } from './KeyframeList';
import { PlayControls } from './PlayControls';
import { TimelineContext } from './TimelineProvider';
import { DEFAULT_TIMELINE_CONFIG } from './constants';
import { useAnimationFrame } from './hooks/useAnimationFrame';

export const Timeline = () => {
  const rulerContainerRef = useRef<RulerProps['containerRef']['current']>(null);
  const rulerRef = useRef<RulerProps['rulerRef']['current']>(null);
  const trackListContainerRef =
    useRef<TrackListProps['containerRef']['current']>(null);
  const keyframeListContainerRef =
    useRef<KeyframeListProps['containerRef']['current']>(null);
  const playheadHandle = useRef<PlayheadHandle>(null);

  //uses animation frames for intensive scroll/drag syncing
  const { scheduleAnimationFrame } = useAnimationFrame();

  const timelineContext = useContext(TimelineContext); //represents some state manage utility
  if (!timelineContext)
    throw new Error('Timeline must be used within a TimelineProvider');

  const { timelineState, timelineDispatch } = timelineContext;

  //left in intentionally for the sake of testing. keep in mind renders happen 2x in strict mode
  console.count('TIMELINE RERENDER');

  const updatePlayhead = useCallback(() => {
    playheadHandle?.current?.updatePlayheadPosition(
      timelineState.playheadTime,
      timelineState.durationTime,
      rulerRef,
      rulerContainerRef
    );
  }, [
    timelineState.playheadTime,
    timelineState.durationTime,
    playheadHandle?.current?.updatePlayheadPosition,
    rulerRef,
    rulerContainerRef,
  ]);

  //updates playhead position when timeline state changes
  useEffect(() => updatePlayhead(), [updatePlayhead]);

  /* #region SCROLL HANDLERS - for the sake of performance we sync referentially
   *
   * I Noticed that even in the demo provided horizontal scroll still has a small lag on the other div. Reading documentation would lead you to believe that animationFrames would sync perfectly.
   * According to https://stackoverflow.com/questions/41740082/scroll-events-requestanimationframe-vs-requestidlecallback-vs-passive-event-lis
   * The scroll event occurs after a browser has rendered a scroll action. So by definition, we cannot perfectly sync the scrolls since the event does not fire until one frame later.
   * My guess only way to perfectly sync would be to capture all possible ways a scroll is triggered and block the main thread to resolve the render.
   */
  const horizontalScrollDivs = useMemo(
    () => [rulerContainerRef, keyframeListContainerRef],
    [rulerContainerRef, keyframeListContainerRef]
  );
  const verticalScrollDivs = useMemo(
    () => [trackListContainerRef, keyframeListContainerRef],
    [trackListContainerRef, keyframeListContainerRef]
  );

  const handleScroll = useCallback(
    (e: Event) =>
      scheduleAnimationFrame(() => {
        //Not sure why HTMLElement is not normally the target type. When I printed the event object I could tell the data was being passed.
        // If this causes browser compatability issues, we can pass in the target ref as an arg.
        const eventTarget = e?.target as HTMLDivElement | null;
        if (!eventTarget) return;

        //only syncs horizontal scrolls when a target is a horizontal scroll div
        if (horizontalScrollDivs.find(ref => ref.current === eventTarget)) {
          horizontalScrollDivs.forEach(ref => {
            if (ref.current && ref.current !== eventTarget)
              ref.current.scrollLeft = eventTarget.scrollLeft;
          });
          updatePlayhead();
        }

        //only syncs vertical scrolls when a target is a vertical scroll div
        if (verticalScrollDivs.find(ref => ref.current === eventTarget))
          verticalScrollDivs.forEach(ref => {
            if (ref.current && ref.current !== eventTarget)
              ref.current.scrollTop = eventTarget.scrollTop;
          });
      }),
    [
      horizontalScrollDivs,
      verticalScrollDivs,
      scheduleAnimationFrame,
      updatePlayhead,
    ]
  );

  // Establishes listeners
  // OPTIMIZE: Can be extracted into a automatic handlesyncing hook. Seems a little extra for now.
  useEffect(() => {
    [...horizontalScrollDivs, ...verticalScrollDivs].forEach(ref =>
      ref?.current?.addEventListener('scroll', e => handleScroll(e))
    );
    return () =>
      [...horizontalScrollDivs, ...verticalScrollDivs].forEach(ref =>
        ref?.current?.removeEventListener('scroll', e => handleScroll(e))
      );
  }, [handleScroll, horizontalScrollDivs, verticalScrollDivs]);
  //#endregion

  const handleRulerUpdateTime = useCallback<
    NonNullable<RulerProps['onBarDrag']>
  >(
    (_, time) =>
      scheduleAnimationFrame(() => {
        //schedules animation frame to prevent lag when drag
        if (time === undefined) return;
        timelineDispatch({
          type: 'SET_PLAYHEAD_TIME',
          payload: time,
        });
      }),
    [timelineDispatch]
  );

  const segmentWidth = useMemo(
    () => `${timelineState.durationTime.toString()}px`,
    [timelineState.durationTime]
  );

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls>
        <PlayControls.CurrentTimeInput
          data-testid="current-time-input"
          value={timelineState.playheadTime.toString()} //impliclty removes leading 0s and forces update when state changes
          onChange={e =>
            timelineDispatch({
              type: 'SET_PLAYHEAD_TIME',
              payload: Number(e.target.value),
            })
          }
          onBlur={e =>
            timelineDispatch({
              type: 'SET_PLAYHEAD_TIME',
              payload: Number(e.target.value),
            })
          }
          step={DEFAULT_TIMELINE_CONFIG.increment}
          min={0}
          max={timelineState.durationTime}
        />
        <PlayControls.DurationTimeInput
          data-testid="duration-input"
          value={timelineState.durationTime.toString()} //impliclty removes leading 0s and forces update when state changes
          onChange={e =>
            timelineDispatch({
              type: 'SET_DURATION_TIME',
              payload: Number(e.target.value),
            })
          }
          onBlur={e =>
            timelineDispatch({
              type: 'SET_DURATION_TIME',
              payload: Number(e.target.value),
            })
          }
          step={DEFAULT_TIMELINE_CONFIG.increment}
          min={DEFAULT_TIMELINE_CONFIG.minDuration}
          max={DEFAULT_TIMELINE_CONFIG.maxDuration}
        />
      </PlayControls>
      <Ruler
        containerRef={rulerContainerRef}
        rulerRef={rulerRef}
        width={segmentWidth}
        onBarDrag={handleRulerUpdateTime}
        onBarClick={handleRulerUpdateTime}
      />
      <TrackList containerRef={trackListContainerRef} />
      <KeyframeList
        containerRef={keyframeListContainerRef}
        segmentWidth={segmentWidth}
      />
      <Playhead ref={playheadHandle} />
    </div>
  );
};
