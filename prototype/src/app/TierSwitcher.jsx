import { useTier, TIERS, goToTier } from './TierContext.jsx';

// Free / Premium / Enterprise segmented control.
export default function TierSwitcher() {
  const { tier } = useTier();
  return (
    <div
      role="tablist"
      style={{ display: 'inline-flex', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, padding: 4 }}
    >
      {Object.keys(TIERS).map((k) => {
        const on = k === tier;
        return (
          <button
            key={k}
            role="tab"
            aria-selected={on}
            onClick={() => goToTier(k)}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: 999, padding: '6px 16px',
              fontSize: 'var(--fs-sm)', fontWeight: 600,
              background: on ? 'var(--av-ocean)' : 'transparent',
              color: on ? 'var(--av-white)' : 'var(--text-2)',
            }}
          >
            {TIERS[k].label}
          </button>
        );
      })}
    </div>
  );
}
