import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'aquavision-ui-density';
/** Component scale inside the pitch frame (not the frame itself). */
export const DENSITY_STEPS = [0.78, 0.86, 0.92, 1, 1.08];
const DEFAULT_INDEX = 1; // slightly compact so the home screen fits better

const UiDensityContext = createContext({
  density: DENSITY_STEPS[DEFAULT_INDEX],
  index: DEFAULT_INDEX,
  canZoomIn: true,
  canZoomOut: true,
  zoomIn: () => {},
  zoomOut: () => {},
  reset: () => {},
});

function loadIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 0 && n < DENSITY_STEPS.length) return n;
  } catch {
    /* ignore */
  }
  return DEFAULT_INDEX;
}

export function UiDensityProvider({ children }) {
  const [index, setIndex] = useState(loadIndex);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(index));
    } catch {
      /* ignore */
    }
  }, [index]);

  const zoomIn = useCallback(() => {
    setIndex((i) => Math.min(DENSITY_STEPS.length - 1, i + 1));
  }, []);

  const zoomOut = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const reset = useCallback(() => setIndex(DEFAULT_INDEX), []);

  const value = {
    density: DENSITY_STEPS[index],
    index,
    canZoomIn: index < DENSITY_STEPS.length - 1,
    canZoomOut: index > 0,
    zoomIn,
    zoomOut,
    reset,
  };

  return <UiDensityContext.Provider value={value}>{children}</UiDensityContext.Provider>;
}

export function useUiDensity() {
  return useContext(UiDensityContext);
}
