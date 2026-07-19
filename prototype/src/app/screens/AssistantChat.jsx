import { Pad, ScreenHead, Disclaimer } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { assistantChat } from '../../data/demoFixtures.js';

// Scripted AI assistant. Every health reply carries a disclaimer and a route to a
// human  -  never a diagnosis, never a claim that the water is "safe"
// (ai-ml-models.json rules; brand voice).
export default function AssistantChat() {
  return (
    <Pad>
      <ScreenHead title="AI assistant" sub="General guidance  -  not a diagnosis" />
      <SampleDataBanner compact />
      <div className="stack" style={{ gap: 10 }}>
        {assistantChat.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '85%',
                background: m.from === 'user' ? 'var(--av-ocean)' : 'var(--surface-2)',
                color: m.from === 'user' ? 'var(--av-white)' : 'var(--text)',
                borderRadius: 14,
                padding: '10px 13px',
                fontSize: 'var(--fs-sm)',
              }}
            >
              <div>{m.text}</div>
              {m.disclaimer && (
                <div style={{ marginTop: 8 }}>
                  <Disclaimer>{m.disclaimer}</Disclaimer>
                </div>
              )}
              {m.actions && (
                <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                  {m.actions.map((a) => (
                    <span
                      key={a}
                      className="pill"
                      style={{ border: '1px solid var(--border)', color: 'var(--av-current)', background: 'transparent' }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className="row"
        style={{ gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '8px 14px', color: 'var(--text-2)' }}
      >
        <span className="grow">Type a message…</span>
        <span>➤</span>
      </div>
    </Pad>
  );
}
