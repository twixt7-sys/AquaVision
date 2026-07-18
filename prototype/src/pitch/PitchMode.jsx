import { useEffect, useMemo, useState, useCallback } from 'react';
import { navigate } from '../router.js';
import useKeyNav from '../shared/hooks/useKeyNav.js';
import { SLIDES, FIVE_MINUTE_NS } from './slides/index.jsx';
import SlideLayout from './SlideLayout.jsx';
import PresenterNotes from './PresenterNotes.jsx';
import AppendixDrawer from './AppendixDrawer.jsx';
import KeyHint from '../shared/components/KeyHint.jsx';

export default function PitchMode({ parts }) {
  const [fiveMin, setFiveMin] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAppendix, setShowAppendix] = useState(false);

  // active slide list depends on the 5-minute toggle
  const active = useMemo(
    () => (fiveMin ? SLIDES.filter((s) => FIVE_MINUTE_NS.includes(s.n)) : SLIDES),
    [fiveMin]
  );

  const routeN = parseInt(parts[1], 10);
  const n = Number.isFinite(routeN) ? routeN : 1;
  const idx = Math.max(0, active.findIndex((s) => s.n === n));
  const current = active[idx] || active[0];

  const go = useCallback((targetN) => navigate(`/pitch/${targetN}`), []);
  const next = useCallback(() => { const t = active[Math.min(idx + 1, active.length - 1)]; if (t) go(t.n); }, [active, idx, go]);
  const prev = useCallback(() => { const t = active[Math.max(idx - 1, 0)]; if (t) go(t.n); }, [active, idx, go]);

  // if current slide isn't in the active set (e.g. after toggling 5-min), snap to nearest
  useEffect(() => {
    if (!active.some((s) => s.n === n)) {
      const nearest = active.reduce((best, s) => (Math.abs(s.n - n) < Math.abs(best.n - n) ? s : best), active[0]);
      go(nearest.n);
    }
  }, [active, n, go]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  useKeyNav(
    {
      ArrowRight: next, ' ': next, PageDown: next,
      ArrowLeft: prev, PageUp: prev,
      Home: () => go(active[0].n), End: () => go(active[active.length - 1].n),
      f: toggleFullscreen, F: toggleFullscreen,
      n: () => setShowNotes((v) => !v), N: () => setShowNotes((v) => !v),
      a: () => setShowAppendix((v) => !v), A: () => setShowAppendix((v) => !v),
      5: () => setFiveMin((v) => !v),
      d: () => current.demo && navigate(current.demo), D: () => current.demo && navigate(current.demo),
      Escape: () => navigate('/'),
    },
    !showAppendix
  );

  const Body = current.Component;

  return (
    <div className="screen-root" style={{ background: 'var(--bg)' }}>
      {/* top bar */}
      <div className="row" style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', gap: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Exit</button>
        <span className="tag-mono">Slide {current.n} · {current.title}</span>
        <div className="grow" />
        {current.demo && <KeyHint keys="D" label="live demo" />}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setFiveMin((v) => !v)}
          style={fiveMin ? { borderColor: 'var(--av-current)', color: 'var(--av-current)' } : undefined}
        >
          {fiveMin ? '5-min ✓' : '5-min'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowNotes((v) => !v)}>Notes (N)</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowAppendix(true)}>Q&A (A)</button>
      </div>

      {/* slide viewport */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1080, padding: '28px 32px 40px' }}>
          <SlideLayout slide={current}>
            <Body fiveMin={fiveMin} />
          </SlideLayout>
        </div>
      </div>

      {/* progress rail */}
      <div className="row" style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', gap: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={prev} disabled={idx === 0}>←</button>
        <div className="row grow" style={{ gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {SLIDES.map((s) => {
            const inFive = FIVE_MINUTE_NS.includes(s.n);
            const isCurrent = s.n === current.n;
            const dim = fiveMin && !inFive;
            return (
              <button
                key={s.n}
                title={`${s.n}. ${s.title}`}
                onClick={() => go(s.n)}
                style={{
                  width: isCurrent ? 26 : 12, height: 12, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: isCurrent ? 'var(--av-current)' : 'var(--surface-2)',
                  opacity: dim ? 0.3 : 1, transition: 'width .15s',
                }}
              />
            );
          })}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={next} disabled={idx === active.length - 1}>→</button>
      </div>

      {showNotes && <PresenterNotes slide={current} onClose={() => setShowNotes(false)} />}
      {showAppendix && <AppendixDrawer onClose={() => setShowAppendix(false)} />}
    </div>
  );
}
