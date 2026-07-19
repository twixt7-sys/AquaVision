import { Fish } from 'lucide-react';
import { navigate } from '../../router.js';
import { Pad, ScreenHead, AppCard, Disclaimer } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import { Progress } from '../../shared/components/ui/progress.jsx';
import { diseaseCandidates } from '../../data/demoFixtures.js';

export default function DiseaseId() {
  const { candidates, framing, photoCaption } = diseaseCandidates;
  return (
    <Pad>
      <ScreenHead title="Disease ID" sub="A suggestion to help you triage  -  not a diagnosis" />
      <SampleDataBanner compact />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex h-32 items-center justify-center bg-gradient-to-br from-muted to-[var(--av-shallow)] text-muted-foreground">
          <Fish className="mr-2 size-5" aria-hidden />
          <span className="text-sm">sample photo</span>
        </div>
        <div className="px-3 py-2">
          <span className="font-mono text-xs text-muted-foreground">{photoCaption}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {candidates.map((c) => (
          <AppCard key={c.name}>
            <div className="flex items-center justify-between gap-2">
              <b className="text-sm">{c.name}</b>
              <span className="num text-accent" data-telemetry>
                {Math.round(c.confidence * 100)}%
              </span>
            </div>
            <Progress value={c.confidence * 100} className="mt-2 h-1.5" />
            <p className="mt-1.5 mb-0 text-xs text-muted-foreground">{c.note}</p>
          </AppCard>
        ))}
      </div>

      <Disclaimer>{framing}</Disclaimer>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={() => navigate('/demo/premium/consultation')}>
          Talk to a vet
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/demo/free/forum')}>
          Ask the community
        </Button>
      </div>
    </Pad>
  );
}
