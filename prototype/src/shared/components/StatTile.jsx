import { motion } from 'motion/react';
import StatusBadge from './StatusBadge.jsx';
import StalenessTag from './StalenessTag.jsx';
import ProvenanceBadge from './ProvenanceBadge.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { cn } from './ui/utils.js';

export default function StatTile({
  label,
  value,
  unit,
  status,
  ageMinutes,
  ageVerb = 'measured',
  provenance,
  awaiting = false,
  footnote,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card className={cn('gap-0', className)}>
        <CardContent className="flex flex-col gap-1.5 px-4 py-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{label}</span>
            {status && <StatusBadge status={status} />}
          </div>
          <div>
            {awaiting ? (
              <span className="font-mono text-base text-[var(--status-nodata)]">awaiting data</span>
            ) : (
              <span className="num text-2xl text-accent" data-telemetry>
                {value}
                {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ageMinutes != null && <StalenessTag minutes={ageMinutes} verb={ageVerb} />}
            {provenance && <ProvenanceBadge type={provenance} />}
          </div>
          {footnote && <p className="m-0 text-xs text-muted-foreground">{footnote}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
