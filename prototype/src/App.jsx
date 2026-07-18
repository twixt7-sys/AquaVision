import { useHashRoute } from './router.js';
import Landing from './Landing.jsx';
import PitchMode from './pitch/PitchMode.jsx';
import DemoMode from './app/DemoMode.jsx';
import ChartsGallery from './ChartsGallery.jsx';

// Routes:
//   #/                       landing
//   #/pitch/:n               pitch mode, slide n
//   #/demo/:tier/:screen     demo mode
//   #/charts                 hidden chart gallery (regression net for the port)
export default function App() {
  const { parts } = useHashRoute();
  const [top] = parts;

  if (top === 'pitch') return <PitchMode parts={parts} />;
  if (top === 'demo') return <DemoMode parts={parts} />;
  if (top === 'charts') return <ChartsGallery />;
  return <Landing />;
}
