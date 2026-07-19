import { Camera, Droplets, Thermometer, FlaskConical } from 'lucide-react';
import { Pad, ScreenHead, AppCard, SoftPanel } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import ChartFigure from '../../shared/charts/ChartFigure.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import { PondBuddy } from '../../shared/components/PondBuddy.jsx';
import { useAvi } from '../../core/state/AviContext.jsx';
import { farmerWaterLog } from '../../data/demoFixtures.js';

const FIELDS = [
  { label: 'Dissolved oxygen (mg/L)', icon: Droplets, tone: 'text-accent bg-accent/15' },
  { label: 'Temperature (°C)', icon: Thermometer, tone: 'text-[var(--status-warning)] bg-[var(--status-warning)]/15' },
  { label: 'pH', icon: FlaskConical, tone: 'text-primary bg-primary/15' },
];

export default function WaterLog() {
  const { aviVisible } = useAvi();
  return (
    <Pad>
      <ScreenHead title="Water log" sub="Your own readings, entered by hand" />
      <SampleDataBanner compact />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B608F] to-[#44A7D2] p-3 text-white">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Honesty rule</p>
        <p className="mt-1 text-sm font-medium">Gaps stay gaps. We never invent a line between missing days.</p>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className={`h-8 flex-1 rounded-sm ${[2, 3, 6, 8, 9, 10, 11, 12].includes(i) ? 'bg-white/15' : 'bg-white/70'}`}
              title={[2, 3, 6, 8, 9, 10, 11, 12].includes(i) ? 'Gap' : 'Logged'}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-white/70">
          <span>Day 1</span>
          <span>Logged vs empty</span>
          <span>Day 14</span>
        </div>
      </div>

      {aviVisible && (
        <SoftPanel className="p-3">
          <PondBuddy
            mood="happy"
            lines={[
              'Gaps in this chart are days nobody logged. I **never** draw a line across missing readings.',
              'Manual entries are yours. Sensor data (when you have it) will look different on purpose.',
            ]}
          />
        </SoftPanel>
      )}

      <AppCard>
        <b className="text-sm">New reading</b>
        <div className="mt-2 flex flex-col gap-2">
          {FIELDS.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span className={`flex size-7 items-center justify-center rounded-lg ${f.tone}`}>
                    <Icon size={14} />
                  </span>
                  {f.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">tap to enter</span>
              </div>
            );
          })}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              Save reading
            </Button>
            <Button variant="outline" size="sm">
              <Camera /> Photo strip
            </Button>
          </div>
        </div>
      </AppCard>

      <div>
        <b className="text-sm">Your last two weeks</b>
        <p className="mb-2 mt-0.5 text-xs text-muted-foreground">
          Gaps are the days nobody logged. We never draw a line across missing readings.
        </p>
        <AppCard className="overflow-hidden">
          <ChartFigure doc={farmerWaterLog} showHeader={false} bare />
        </AppCard>
      </div>
    </Pad>
  );
}
