import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'aquavision-frame-mode';
const FrameModeContext = createContext({ frameMode: 'phone', setFrameMode: () => {} });

export function FrameModeProvider({ children }) {
  const [frameMode, setFrameModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'desktop' || saved === 'phone' ? saved : 'phone';
    } catch {
      return 'phone';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, frameMode);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.frameMode = frameMode;
  }, [frameMode]);

  const setFrameMode = (mode) => {
    if (mode === 'phone' || mode === 'desktop') setFrameModeState(mode);
  };

  return (
    <FrameModeContext.Provider value={{ frameMode, setFrameMode }}>
      {children}
    </FrameModeContext.Provider>
  );
}

export function useFrameMode() {
  return useContext(FrameModeContext);
}
