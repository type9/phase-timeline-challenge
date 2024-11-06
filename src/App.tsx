import { Timeline } from './components/Timeline';
import { TimelineProvider } from './components/Timeline/TimelineProvider';

export default function App() {
  return (
    <div className="flex flex-col text-white bg-gray-900 h-dvh">
      <div className="flex-grow p-10">
        <h1 className="mb-4 text-2xl text-gray-50">Phase Timeline Challenge</h1>
        <p className="text-gray-300">
          Please follow the instructions in the README.md.
        </p>
      </div>
      <TimelineProvider initialState={{ minTime: 0, maxTime: 6000 }}>
        <Timeline />
      </TimelineProvider>
    </div>
  );
}
