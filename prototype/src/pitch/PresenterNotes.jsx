import { pitchOutline } from '../data/index.js';

// Presenter notes overlay (key N). Shows the outline's must_accomplish + caveat
// for this slide, verbatim — the pitch deck literally scripts what each slide
// must land.
export default function PresenterNotes({ slide, onClose }) {
  const spec = pitchOutline.slides.find((s) => s.n === slide.n);
  return (
    <div
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
        background: 'var(--surface)', borderTop: '2px solid var(--av-current)',
        padding: '16px 24px', maxHeight: '46vh', overflowY: 'auto',
        boxShadow: '0 -12px 40px rgba(0,0,0,.4)',
      }}
    >
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="section-title" style={{ margin: 0 }}>Presenter notes — slide {slide.n}</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close (N)</button>
      </div>
      {spec ? (
        <>
          <p style={{ margin: '0 0 8px' }}>
            <b>Must accomplish:</b> {spec.must_accomplish}
          </p>
          {spec.visual && <p className="muted" style={{ margin: '0 0 6px' }}><b>Visual:</b> {spec.visual}</p>}
          {spec.caveat && (
            <p style={{ margin: 0, color: 'var(--av-advisory)' }}><b>Caveat:</b> {spec.caveat}</p>
          )}
        </>
      ) : (
        <p className="muted">No outline notes for this slide.</p>
      )}
    </div>
  );
}
