import { useHashRoute } from './router.js';
import Landing from './Landing.jsx';
import DemoMode from './app/DemoMode.jsx';
import ChartsGallery from './ChartsGallery.jsx';

// Routes:
//   #/                       landing
//   #/demo/:tier/:screen     demo mode (the product)
//   #/charts                 hidden chart gallery (regression net for the port)
export default function App() {
  const { parts } = useHashRoute();
  const [top] = parts;

  if (top === 'demo') return <DemoMode parts={parts} />;
  if (top === 'charts') return <ChartsGallery />;
  return <Landing />;
}
