import { navigate } from './router.js';
import { oneLiner, company } from './data/index.js';

// Landing — logo, the one-liner, two mode buttons, and the honesty framing that
// makes the whole prototype credible.
export default function Landing() {
  return (
    <div className="screen-root" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 860, width: '100%', textAlign: 'center' }}>
        <img
          src="/assets/logo-lockup.jpg"
          alt="AquaVision — Fisheries, Aquaculture, Technology"
          style={{ width: 260, maxWidth: '70%', borderRadius: 16, marginBottom: 8 }}
        />
        <p
          style={{
            letterSpacing: '.28em',
            fontSize: 'var(--fs-xs)',
            color: 'var(--av-current)',
            textTransform: 'uppercase',
            margin: '4px 0 24px',
          }}
        >
          AI-powered aquaculture management, from first pond to smart farm
        </p>

        <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text)', maxWidth: 720, margin: '0 auto 8px' }}>
          “We meet fish farmers where they are — from their first pond to their first drone.”
        </p>
        <p className="muted" style={{ maxWidth: 680, margin: '0 auto 32px', fontSize: 'var(--fs-sm)' }}>
          {oneLiner}
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" style={{ fontSize: 'var(--fs-lg)', padding: '14px 28px' }} onClick={() => navigate('/pitch/1')}>
            ▶ Pitch mode
            <span style={{ fontWeight: 400, fontSize: 'var(--fs-xs)', opacity: 0.85 }}>16-slide guided deck</span>
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 'var(--fs-lg)', padding: '14px 28px' }} onClick={() => navigate('/demo/free/home')}>
            ▤ Demo mode
            <span style={{ fontWeight: 400, fontSize: 'var(--fs-xs)', opacity: 0.85 }}>touch the product</span>
          </button>
        </div>

        <div
          className="card"
          style={{ marginTop: 40, textAlign: 'left', maxWidth: 720, marginInline: 'auto', borderColor: 'color-mix(in srgb, var(--av-critical) 30%, var(--border))' }}
        >
          <div className="section-title" style={{ color: 'var(--av-critical)' }}>A note on honesty</div>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
            This is a concept prototype. The app has <b>zero users</b> and the hardware is <b>TRL 3 — nothing flown</b>.
            Every data figure carries a provenance badge, and anything marked{' '}
            <span style={{ color: 'var(--av-critical)', fontWeight: 600 }}>SAMPLE DATA — NOT REAL</span> is fabricated to
            demonstrate the interface. That discipline is the point, not a disclaimer.
          </p>
        </div>

        <p className="muted" style={{ marginTop: 24, fontSize: 'var(--fs-xs)' }}>
          {company.identity?.one_liner ? '' : ''}
          <a href="#/charts">Chart gallery ↗</a> · Keyboard-driven · Works fully offline
        </p>
      </div>
    </div>
  );
}
