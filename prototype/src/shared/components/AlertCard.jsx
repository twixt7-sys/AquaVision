import { motion } from 'motion/react';
import StatusBadge from './StatusBadge.jsx';
import ProvenanceBadge from './ProvenanceBadge.jsx';
import { Card, CardContent } from './ui/card.jsx';
import { cn } from './ui/utils.js';

export default function AlertCard({ alert }) {
  if (!alert) return null;
  const {
    severity = 'warning',
    unit_id,
    message_example,
    message,
    provenance,
    whats_unknown,
    action,
  } = alert;
  const body = message || message_example;
  const border =
    severity === 'critical'
      ? 'var(--status-critical)'
      : severity === 'advisory'
        ? 'var(--status-advisory)'
        : 'var(--status-warning)';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <Card className="gap-0" style={{ borderLeftWidth: 4, borderLeftColor: border }}>
        <CardContent className="px-4 py-3.5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={severity} />
            {unit_id && <span className="font-mono text-xs text-muted-foreground">{unit_id}</span>}
            {provenance && <ProvenanceBadge type={provenance} />}
          </div>
          <p className="m-0 mb-2 text-base text-foreground">{body}</p>
          {whats_unknown && (
            <p className="m-0 mb-1.5 text-sm text-muted-foreground">
              <b className="text-foreground">What we don&apos;t know:</b> {whats_unknown}
            </p>
          )}
          {action && (
            <p className={cn('m-0 text-sm text-accent')}>
              <b>Suggested action:</b> {action}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
