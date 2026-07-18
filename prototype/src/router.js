import { useEffect, useState, useCallback } from 'react';

// Tiny hash router. Routes are '#/segment/segment'. Gives shareable, refresh-safe
// URLs (e.g. #/pitch/13, #/demo/enterprise/pondtwin) with zero dependencies.
export function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
  return parts;
}

export function useHashRoute() {
  const [parts, setParts] = useState(parseHash());
  useEffect(() => {
    const onChange = () => setParts(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const navigate = useCallback((path) => {
    const clean = path.replace(/^#/, '');
    window.location.hash = clean.startsWith('/') ? clean : `/${clean}`;
  }, []);
  return { parts, navigate };
}

export function navigate(path) {
  const clean = path.replace(/^#/, '');
  window.location.hash = clean.startsWith('/') ? clean : `/${clean}`;
}
