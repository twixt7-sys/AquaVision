import { Switch } from '../../shared/components/ui/switch.jsx';
import { Card, CardContent } from '../../shared/components/ui/card.jsx';

const LAYERS = [
  { key: 'measured', label: 'Measured stations', hint: 'solid, sharp' },
  { key: 'interpolated', label: 'Interpolated field', hint: 'fades with distance' },
  { key: 'confidence', label: 'Confidence field', hint: 'show the uncertainty directly' },
  { key: 'operator', label: 'Operator-supplied', hint: 'testimony, not measurement' },
];

export default function LayerToggles({ layers, setLayers }) {
  const toggle = (k) => setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  return (
    <Card className="gap-0">
      <CardContent className="px-3.5 py-3">
        <div className="section-title">Layers</div>
        <div className="flex flex-col gap-2.5">
          {LAYERS.map((l) => (
            <label key={l.key} className="flex cursor-pointer items-center gap-2.5">
              <Switch checked={!!layers[l.key]} onCheckedChange={() => toggle(l.key)} />
              <span className="text-sm text-foreground">{l.label}</span>
              <span className="grow" />
              <span className="font-mono text-[10px] text-muted-foreground">{l.hint}</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 opacity-60">
            <Switch checked={false} disabled />
            <span className="text-sm">Simulated</span>
            <span className="grow" />
            <span className="font-mono text-[10px] text-[var(--status-nodata)]">does not exist yet</span>
          </label>
        </div>
        <p className="mt-2 mb-0 text-xs text-muted-foreground">
          The simulation layer is empty by design. When it exists it will render in a visually distinct channel, never
          blended with measured data.
        </p>
      </CardContent>
    </Card>
  );
}
