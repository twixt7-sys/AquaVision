import { cva } from 'class-variance-authority';
import {
  CheckCircle2,
  AlertCircle,
  TriangleAlert,
  OctagonAlert,
  CircleDashed,
} from 'lucide-react';
import { cn } from './ui/utils.js';

// Status badge  -  five states from dashboard-spec.json.
// NEVER colour-only: always icon + text. No Data is hollow/dashed, never green.
const STATES = {
  nominal: {
    icon: CheckCircle2,
    label: 'Nominal',
    className: 'text-[var(--status-ok)] bg-[color-mix(in_srgb,var(--status-ok)_16%,transparent)] border-[color-mix(in_srgb,var(--status-ok)_30%,transparent)]',
  },
  advisory: {
    icon: AlertCircle,
    label: 'Advisory',
    className: 'text-[var(--status-advisory)] bg-[color-mix(in_srgb,var(--status-advisory)_16%,transparent)] border-[color-mix(in_srgb,var(--status-advisory)_30%,transparent)]',
  },
  warning: {
    icon: TriangleAlert,
    label: 'Warning',
    className: 'text-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_16%,transparent)] border-[color-mix(in_srgb,var(--status-warning)_30%,transparent)]',
  },
  critical: {
    icon: OctagonAlert,
    label: 'Critical',
    className: 'text-[var(--status-critical)] bg-[color-mix(in_srgb,var(--status-critical)_16%,transparent)] border-[color-mix(in_srgb,var(--status-critical)_30%,transparent)]',
  },
  no_data: {
    icon: CircleDashed,
    label: 'No Data',
    className: 'text-[var(--status-nodata)] bg-transparent border-dashed border-[var(--status-nodata)]',
  },
};

const ALIAS = { ok: 'nominal', unknown: 'no_data', 'no-data': 'no_data', nodata: 'no_data' };

const badgeSize = cva('inline-flex items-center gap-1 rounded-md border font-medium whitespace-nowrap', {
  variants: {
    size: {
      sm: 'px-2 py-0.5 text-xs [&>svg]:size-3',
      lg: 'px-3 py-1 text-sm [&>svg]:size-3.5',
    },
  },
  defaultVariants: { size: 'sm' },
});

export function normalizeStatus(s) {
  const k = String(s || '').toLowerCase().replace(/\s+/g, '_');
  return STATES[k] ? k : ALIAS[k] || 'no_data';
}

export default function StatusBadge({ status, size = 'sm', label }) {
  const key = normalizeStatus(status);
  const s = STATES[key];
  const Icon = s.icon;
  return (
    <span data-slot="status-badge" className={cn(badgeSize({ size }), s.className)}>
      <Icon aria-hidden strokeWidth={2.25} />
      {label || s.label}
    </span>
  );
}

export const STATUS_STATES = STATES;
