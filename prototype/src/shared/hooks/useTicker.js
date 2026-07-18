import { useEffect, useRef, useState } from 'react';

// Simple interval ticker for the PondTwin time-scrub playback.
export default function useTicker(active, intervalMs, onTick) {
  const cb = useRef(onTick);
  cb.current = onTick;
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => cb.current(), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
}

export function usePlayState(initial = false) {
  return useState(initial);
}
