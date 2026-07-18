// Device bezel for the Phase 1/2 app screens — tells the "median farmer on a
// phone, in sunlight, half awake" story visually. The screen scrolls inside.
export default function PhoneFrame({ children, title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 390,
          maxWidth: '100%',
          height: 780,
          maxHeight: '82vh',
          background: 'var(--bg)',
          border: '10px solid #05263f',
          borderRadius: 40,
          boxShadow: '0 24px 60px rgba(0,0,0,.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* status bar */}
        <div
          style={{
            height: 34,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            fontSize: 12,
            color: 'var(--text-2)',
            fontFamily: 'var(--font-mono)',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span>4:52</span>
          <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '.14em', color: 'var(--av-current)' }}>
            AQUAVISION
          </span>
          <span>▮▮▮ 38%</span>
        </div>
        <div className="hide-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>
      </div>
      {title && <div className="muted" style={{ fontSize: 'var(--fs-xs)' }}>{title}</div>}
    </div>
  );
}
