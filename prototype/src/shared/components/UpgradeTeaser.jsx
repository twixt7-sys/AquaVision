import { useTier } from '../../app/TierContext.jsx';

// Shown when a Free-tier user opens a Premium/Enterprise view. Demonstrates the
// funnel without dead-ending — the point is that the upgrade path is real.
export default function UpgradeTeaser({ tier = 'Premium', title, children }) {
  const { setTier } = useTier();
  return (
    <div
      className="card"
      style={{ textAlign: 'center', padding: '28px 22px', borderColor: 'var(--av-target-purple)' }}
    >
      <div style={{ fontSize: 26, marginBottom: 8 }} aria-hidden="true">🔒</div>
      <h4 style={{ marginBottom: 6 }}>{title || `${tier} feature`}</h4>
      <p className="muted" style={{ fontSize: 'var(--fs-sm)', maxWidth: 380, margin: '0 auto 14px' }}>
        {children ||
          `This becomes available when a farm outgrows manual logging and upgrades to ${tier}. Upgrade is need-triggered, not pushed.`}
      </p>
      <button className="btn btn-sm" onClick={() => setTier(tier.toLowerCase())}>
        Preview {tier} in the demo →
      </button>
    </div>
  );
}
