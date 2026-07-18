// "Invitation, not failure" empty state (dashboard-spec.json). Also used for the
// honest "not enough data yet" states in the premium tier.
export default function EmptyState({ icon = '◇', title, children, tone = 'neutral' }) {
  const color = tone === 'no_data' ? 'var(--av-unknown)' : 'var(--text-2)';
  return (
    <div
      style={{
        border: `1px dashed ${color}`,
        borderRadius: 'var(--r-lg)',
        padding: '28px 22px',
        textAlign: 'center',
        color: 'var(--text-2)',
        background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
      }}
    >
      <div style={{ fontSize: 28, color, marginBottom: 8 }} aria-hidden="true">{icon}</div>
      {title && <div style={{ fontFamily: 'var(--font-display)', color: 'var(--heading)', marginBottom: 6 }}>{title}</div>}
      <div style={{ fontSize: 'var(--fs-sm)' }}>{children}</div>
    </div>
  );
}
