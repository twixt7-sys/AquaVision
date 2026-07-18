// Persistent "SAMPLE DATA — NOT REAL" strip. Pinned to any view fed by the
// synthetic datasets. Per sample-telemetry.json / sample-pond-twin-state.json,
// it must be impossible for a viewer to mistake this data for real.
export default function SampleDataBanner({ compact = false }) {
  return (
    <div
      role="note"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'color-mix(in srgb, var(--av-critical) 12%, var(--surface))',
        borderLeft: '4px solid var(--av-critical)',
        borderRadius: 'var(--r-sm)',
        color: 'var(--text)',
        padding: compact ? '6px 12px' : '10px 14px',
        fontSize: 'var(--fs-sm)',
      }}
    >
      <span
        style={{ color: 'var(--av-critical)', fontWeight: 700, letterSpacing: '.03em', whiteSpace: 'nowrap' }}
      >
        ⚠ SAMPLE DATA — NOT REAL
      </span>
      {!compact && (
        <span className="muted">
          Every number shown here is fabricated to demonstrate the interface. It describes no real pond, fish, or sortie.
        </span>
      )}
    </div>
  );
}
