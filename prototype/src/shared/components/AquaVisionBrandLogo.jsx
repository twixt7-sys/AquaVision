import { cn } from './ui/utils.js';

const LOGO_SRC = './assets/logo.png';
const BRAND_SLOGAN = 'From first pond to first drone.';
const TAGLINE = 'Fisheries · Aquaculture · Technology';

/** Logomark from assets/logo.png — transparent PNG, no chrome box. */
export function AquaVisionLogoMark({ className, size = 'md' }) {
  const dims =
    size === 'sm'
      ? 'h-10 w-10'
      : size === 'lg'
        ? 'h-[4.5rem] w-[4.5rem]'
        : size === 'xl'
          ? 'h-24 w-24'
          : 'h-14 w-14';
  return (
    <img
      src={LOGO_SRC}
      alt=""
      aria-hidden
      className={cn('shrink-0 bg-transparent object-contain', dims, className)}
    />
  );
}

/** Full lockup: mark + wordmark for landing / hero */
export function AquaVisionLogoLockup({ className, width = 220 }) {
  return (
    <div
      className={cn('mx-auto flex max-w-full flex-col items-center gap-2', className)}
      style={{ width }}
    >
      <img
        src={LOGO_SRC}
        alt="AquaVision"
        width={Math.round(width * 0.55)}
        className="h-auto max-w-[55%] bg-transparent object-contain"
      />
      <div className="text-center">
        <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Aqua<span className="text-accent">Vision</span>
        </p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/90">
          {TAGLINE}
        </p>
      </div>
    </div>
  );
}

export function AquaVisionBrandLogo({ size = 'sm', className }) {
  return <AquaVisionLogoMark size={size} className={className} />;
}

export function AquaVisionBrandWordmark({
  className,
  layout = 'stack',
  size = 'default',
  showSlogan = false,
}) {
  const textSize =
    size === 'compact'
      ? 'text-[8px] tracking-wide'
      : size === 'lg'
        ? 'text-xs uppercase tracking-[0.18em]'
        : 'text-[9px] uppercase tracking-[0.16em]';

  return (
    <div className={cn('min-w-0 text-left', layout === 'stack' && 'flex flex-col gap-0', className)}>
      <p className={cn('font-bold leading-none text-foreground', textSize)}>
        Aqua<span className="text-accent">Vision</span>
      </p>
      <p className={cn('mt-0.5 font-semibold leading-none text-primary/90', textSize)}>
        {TAGLINE.split(' · ')[0]}
      </p>
      {showSlogan && (
        <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">{BRAND_SLOGAN}</p>
      )}
    </div>
  );
}

export { BRAND_SLOGAN, TAGLINE, LOGO_SRC };
