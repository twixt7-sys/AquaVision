import { navigate } from '../../router.js';
import { Pad, ScreenHead, Disclaimer } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { diseaseCandidates } from '../../data/demoFixtures.js';

// Photo-based disease identification. Shows a ranked candidate list WITH confidence
// bars and, always, a route to a human. Framed as a suggestion, never a diagnosis
// (ai-ml-models.json; banned word: "diagnoses").
export default function DiseaseId() {
  const { candidates, framing, photoCaption } = diseaseCandidates;
  return (
    <Pad>
      <ScreenHead title="Disease ID" sub="A suggestion to help you triage — not a diagnosis" />
      <SampleDataBanner compact />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: 130, background: 'linear-gradient(135deg, var(--surface-2), var(--av-shallow))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
          🐟 sample photo
        </div>
        <div style={{ padding: '8px 12px' }}>
          <span className="tag-mono">{photoCaption}</span>
        </div>
      </div>

      <div className="stack" style={{ gap: 10 }}>
        {candidates.map((c) => (
          <div key={c.name} className="card" style={{ padding: '12px 14px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <b style={{ fontSize: 'var(--fs-sm)' }}>{c.name}</b>
              <span className="num" style={{ color: 'var(--av-current)' }}>{Math.round(c.confidence * 100)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--surface-2)', marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${c.confidence * 100}%`, height: '100%', background: 'var(--av-current)' }} />
            </div>
            <p className="muted" style={{ margin: '6px 0 0', fontSize: 'var(--fs-xs)' }}>{c.note}</p>
          </div>
        ))}
      </div>

      <Disclaimer>{framing}</Disclaimer>
      <div className="row" style={{ gap: 8 }}>
        <button className="btn btn-sm grow" onClick={() => navigate('/demo/premium/consultation')}>Talk to a vet</button>
        <button className="btn btn-ghost btn-sm grow" onClick={() => navigate('/demo/free/forum')}>Ask the community</button>
      </div>
    </Pad>
  );
}
