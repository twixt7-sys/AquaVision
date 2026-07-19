import { createContext, useCallback, useContext, useState } from 'react';
import { readAviVisible, writeAviVisible } from '../lib/aviVisibilityStorage.js';

const AviContext = createContext(undefined);

export function AviProvider({ children }) {
  const [aviVisible, setState] = useState(() => readAviVisible());

  const setAviVisible = useCallback((visible) => {
    setState((prev) => {
      if (visible === prev) return prev;
      writeAviVisible(visible);
      return visible;
    });
  }, []);

  const toggleAvi = useCallback(() => {
    setState((prev) => {
      const next = !prev;
      writeAviVisible(next);
      return next;
    });
  }, []);

  return (
    <AviContext.Provider value={{ aviVisible, setAviVisible, toggleAvi }}>
      {children}
    </AviContext.Provider>
  );
}

export function useAvi() {
  const context = useContext(AviContext);
  if (!context) throw new Error('useAvi must be used within AviProvider');
  return context;
}
