export type PlayheadProps = {
  playheadRef: React.RefObject<HTMLDivElement>;
  positionX: number;
  visible?: boolean;
};

export const Playhead = ({
  playheadRef,
  positionX,
  visible = true,
}: PlayheadProps) => {
  return (
    <div
      className="absolute z-10 h-full border-l-2 border-yellow-600 border-solid"
      data-testid="playhead"
      style={{
        transform: `translateX(calc(${positionX}px))`,
      }}
      hidden={!visible}
      ref={playheadRef}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
