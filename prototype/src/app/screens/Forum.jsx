import { Pad, ScreenHead } from './_kit.jsx';
import { forumPosts } from '../../data/demoFixtures.js';

export default function Forum() {
  return (
    <Pad>
      <ScreenHead title="Community" sub="Farmers, cooperatives, and extension officers" />
      <div className="stack" style={{ gap: 10 }}>
        {forumPosts.map((p, i) => (
          <div key={i} className="card" style={{ padding: '12px 14px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="pill" style={{ background: 'color-mix(in srgb, var(--av-current) 12%, transparent)', color: 'var(--av-current)' }}>{p.tag}</span>
              <span className="tag-mono">{p.when}</span>
            </div>
            <b style={{ display: 'block', margin: '6px 0 2px', fontSize: 'var(--fs-sm)' }}>{p.title}</b>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: 'var(--fs-xs)' }}>{p.author}</span>
              <span className="muted" style={{ fontSize: 'var(--fs-xs)' }}>💬 {p.replies}</span>
            </div>
          </div>
        ))}
      </div>
    </Pad>
  );
}
