import { useRef, useCallback, useEffect } from 'react';

/*
 * This hook is used to schedule animation frames for intensive updates and immediate updates.
 * It is used to prevent the browser from performing unnecessary repaints and also can sync scrolls and drags immediately rather than waiting an additional frame.
 * It also supposedly implicitly throttles since its limited to the browser's fps.
 * NOTE: This is a naive implementation. Simultaneous animation frames will nullify the oldest one. This only works if there is only one animation frame running at a time.
 */
export const useAnimationFrame = () => {
  const animationFrameIdRef = useRef<number | null>(null);

  const scheduleAnimationFrame = useCallback((callback: () => void) => {
    if (animationFrameIdRef.current !== null) {
      window.cancelAnimationFrame(animationFrameIdRef.current);
    }

    const id = window.requestAnimationFrame(() => {
      callback();
      animationFrameIdRef.current = null;
    });
    animationFrameIdRef.current = id;
  }, []);

  const cancelAnimationFrame = useCallback(() => {
    if (animationFrameIdRef.current !== null) {
      window.cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    // cleanup
    return () => {
      if (animationFrameIdRef.current !== null) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return { scheduleAnimationFrame, cancelAnimationFrame };
};
