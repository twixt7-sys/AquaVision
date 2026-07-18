import { useHashRoute } from './router.js';
import { AviProvider } from './core/state/AviContext.jsx';
import { FrameModeProvider } from './core/state/FrameModeContext.jsx';
import Landing from './Landing.jsx';
import DemoMode from './app/DemoMode.jsx';
import ChartsGallery from './ChartsGallery.jsx';

export default function App() {
  const { parts } = useHashRoute();
  const [top] = parts;

  return (
    <AviProvider>
      <FrameModeProvider>
        {top === 'demo' ? <DemoMode parts={parts} /> : top === 'charts' ? <ChartsGallery /> : <Landing />}
      </FrameModeProvider>
    </AviProvider>
  );
}
