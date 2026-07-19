import { Fish, Shrimp } from 'lucide-react';

/** Mud crab  -  no crab glyph ships in lucide-react, so this is hand-drawn to match its
 * stroke-based line style (round caps/joins, currentColor, viewBox 24x24). */
function CrabIcon({ size = 24, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <ellipse cx="12" cy="14" rx="6.5" ry="4.5" />
      <path d="M8.5 10 6 6" />
      <circle cx="6" cy="5.3" r="0.9" fill="currentColor" stroke="none" />
      <path d="M15.5 10 18 6" />
      <circle cx="18" cy="5.3" r="0.9" fill="currentColor" stroke="none" />
      <path d="M5.5 12 1.5 9.5" />
      <path d="M1.5 9.5 3.3 8.6M1.5 9.5 1.8 11.9" />
      <path d="M18.5 12 22.5 9.5" />
      <path d="M22.5 9.5 20.7 8.6M22.5 9.5 22.2 11.9" />
      <path d="M7 17.5 4 20.5" />
      <path d="M9.8 18.8 8 22" />
      <path d="M14.2 18.8 16 22" />
      <path d="M17 17.5 20 20.5" />
    </svg>
  );
}

/** Fry / fingerlings  -  a small school built from three scaled Fish glyphs, since a
 * single big fish can't read as "juvenile" the way a cluster of small ones does. */
function FryIcon({ size = 24, className, style }) {
  return (
    <span
      className={className}
      style={{ position: 'relative', display: 'inline-block', width: size, height: size, ...style }}
      aria-hidden
    >
      <Fish size={size * 0.44} style={{ position: 'absolute', left: 0, top: size * 0.4 }} />
      <Fish size={size * 0.56} style={{ position: 'absolute', right: 0, top: 0 }} />
      <Fish size={size * 0.4} style={{ position: 'absolute', left: size * 0.32, bottom: 0 }} />
    </span>
  );
}

/** Brand-blue only  -  status colors (ok/advisory/warning/critical) are reserved for
 * water-quality state and must never double as decorative species tints. */
export const SPECIES_META = {
  tilapia: { icon: Fish, label: 'Tilapia', color: 'var(--av-ocean)' },
  milkfish: { icon: Fish, label: 'Milkfish', color: 'var(--av-current)' },
  crawfish: { icon: Shrimp, label: 'Prawn / crawfish', color: 'var(--av-shallow)' },
  crab: { icon: CrabIcon, label: 'Mud crab', color: 'var(--av-deep)' },
  catfish: { icon: Fish, label: 'Catfish', color: 'var(--av-hull)' },
  fry: { icon: FryIcon, label: 'Tilapia fry', color: 'var(--av-current)' },
};

export default function SpeciesIcon({ species, size = 24, className }) {
  const meta = SPECIES_META[species] || SPECIES_META.tilapia;
  const Icon = meta.icon;
  return <Icon size={size} className={className} style={{ color: meta.color }} aria-hidden />;
}
