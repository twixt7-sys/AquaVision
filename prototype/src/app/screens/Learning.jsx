import { Pad, ScreenHead } from './_kit.jsx';
import { learningModules } from '../../data/demoFixtures.js';

export default function Learning() {
  return (
    <Pad>
      <ScreenHead title="Learning" sub="Short modules built for pond and cage realities" />
      <div className="stack" style={{ gap: 10 }}>
        {learningModules.map((m) => (
          <div key={m.title} className="card" style={{ padding: '12px 14px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <b style={{ fontSize: 'var(--fs-sm)' }}>{m.title}</b>
              <span className="tag-mono">{m.minutes} min</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--surface-2)', marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: `${m.progress * 100}%`, height: '100%', background: m.progress === 1 ? 'var(--av-ok)' : 'var(--av-current)' }} />
            </div>
            <span className="muted" style={{ fontSize: 'var(--fs-xs)' }}>
              {m.progress === 1 ? 'Completed' : m.progress > 0 ? `${Math.round(m.progress * 100)}% done` : 'Not started'}
            </span>
          </div>
        ))}
      </div>
    </Pad>
  );
}
