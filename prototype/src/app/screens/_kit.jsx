// Shared layout helpers for the phone-framed app screens.
export function Pad({ children }) {
  return <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>;
}

export function ScreenHead({ title, sub }) {
  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 'var(--fs-xl)' }}>{title}</h3>
      {sub && <p className="muted" style={{ margin: '2px 0 0', fontSize: 'var(--fs-sm)' }}>{sub}</p>}
    </div>
  );
}

export function AppCard({ children, accent, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ padding: '14px 16px', cursor: onClick ? 'pointer' : 'default', borderLeft: accent ? `3px solid ${accent}` : undefined }}
    >
      {children}
    </div>
  );
}

export function Disclaimer({ children }) {
  return (
    <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--av-advisory)' }}>
      ⚠ {children}
    </p>
  );
}
