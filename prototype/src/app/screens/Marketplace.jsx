import { Pad, ScreenHead } from './_kit.jsx';
import { marketplaceListings } from '../../data/demoFixtures.js';

// Marketplace  -  the take rate is visible by design (paid because a third party is
// also getting paid; the revenue mechanism is transparent, not hidden).
export default function Marketplace() {
  return (
    <Pad>
      <ScreenHead title="Marketplace" sub="Feed, equipment, livestock, and buyers" />
      <div className="stack" style={{ gap: 10 }}>
        {marketplaceListings.map((l, i) => (
          <div key={i} className="card" style={{ padding: '12px 14px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <b style={{ fontSize: 'var(--fs-sm)' }}>{l.item}</b>
              <span className="num" style={{ color: 'var(--av-current)' }}>{l.price}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
              <span className="muted" style={{ fontSize: 'var(--fs-xs)' }}>{l.seller}</span>
              <span className="pill" style={{ background: 'color-mix(in srgb, var(--av-advisory) 14%, transparent)', color: 'var(--av-advisory)' }}>
                {l.takeRatePct}% platform fee
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 'var(--fs-xs)' }}>
        The platform fee is shown on every listing. It's how the marketplace pays for itself.
      </p>
    </Pad>
  );
}
