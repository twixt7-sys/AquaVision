import { BadgeCheck, Calculator, TrendingUp, Crosshair, FlaskConical, CircleEllipsis } from 'lucide-react';
import { cn } from './ui/utils.js';

const META = {
  verified_external: {
    icon: BadgeCheck,
    label: 'Sourced',
    color: 'var(--prov-sourced)',
  },
  derived_calculation: {
    icon: Calculator,
    label: 'Calculated',
    color: 'var(--prov-calculated)',
  },
  modeled_projection: {
    icon: TrendingUp,
    label: 'Projection',
    color: 'var(--prov-projection)',
  },
  design_target: {
    icon: Crosshair,
    label: 'Target',
    color: 'var(--prov-target)',
  },
  illustrative_synthetic: {
    icon: FlaskConical,
    label: 'SAMPLE DATA · NOT REAL',
    color: 'var(--prov-sample)',
  },
  assumption: {
    icon: CircleEllipsis,
    label: 'Assumption',
    color: 'var(--prov-assumption)',
  },
};

export default function ProvenanceBadge({ type, size = 'sm' }) {
  const m = META[type] || META.assumption;
  const Icon = m.icon;
  const loud = type === 'illustrative_synthetic';
  return (
    <span
      data-slot="provenance-badge"
      title={`Provenance: ${type}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-medium whitespace-nowrap',
        size === 'lg' ? 'px-3 py-1 text-sm [&>svg]:size-3.5' : 'px-2 py-0.5 text-xs [&>svg]:size-3',
        loud && 'tracking-wide',
      )}
      style={{
        color: m.color,
        background: `color-mix(in srgb, ${m.color} 15%, transparent)`,
        borderColor: loud ? m.color : 'transparent',
      }}
    >
      <Icon aria-hidden strokeWidth={2.25} />
      {m.label}
    </span>
  );
}

export const PROVENANCE_META = META;
