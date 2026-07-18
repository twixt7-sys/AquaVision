// Accessible segmented tab strip.
export default function Tabs({ tabs, active, onChange, size = 'md' }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        gap: 4,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 999,
        padding: 4,
        flexWrap: 'wrap',
      }}
    >
      {tabs.map((t) => {
        const value = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const on = value === active;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(value)}
            style={{
              border: 'none',
              cursor: 'pointer',
              borderRadius: 999,
              padding: size === 'sm' ? '5px 12px' : '7px 16px',
              fontSize: size === 'sm' ? 'var(--fs-xs)' : 'var(--fs-sm)',
              fontWeight: 600,
              background: on ? 'var(--av-ocean)' : 'transparent',
              color: on ? 'var(--av-white)' : 'var(--text-2)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
