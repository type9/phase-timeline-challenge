export type TrackListProps = {
  containerRef: React.RefObject<HTMLDivElement>;
};

export type TrackListHandle = React.RefObject<HTMLDivElement>;

const tracks = [
  { name: 'Track A' },
  { name: 'Track B' },
  { name: 'Track C' },
  { name: 'Track D' },
  { name: 'Track E' },
  { name: 'Track F' },
  { name: 'Track G' },
  { name: 'Track H' },
  { name: 'Track I' },
  { name: 'Track J' },
];

export const TrackList = ({ containerRef }: TrackListProps) => {
  return (
    <div
      ref={containerRef}
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
      data-testid="track-list"
    >
      {tracks.map((track, index) => (
        <div key={index} className={'p-2'}>
          <div>{track.name}</div>
        </div>
      ))}
    </div>
  );
};
