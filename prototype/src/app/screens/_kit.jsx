import { TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '../../shared/components/ui/card.jsx';
import { cn } from '../../shared/components/ui/utils.js';

export function Pad({ children, className }) {
  return (
    <div className={cn('flex flex-col gap-2.5 px-3.5 pb-6 pt-3', className)}>{children}</div>
  );
}

export function ScreenHead({ title, sub }) {
  return (
    <div className="mb-0.5">
      <h3 className="m-0 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      {sub && <p className="m-0 mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

/** Soft Theria-style surface  -  border/50, rounded-2xl, optional left accent. */
export function AppCard({ children, accent, onClick, className }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'gap-0',
        onClick && 'cursor-pointer transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]',
        className,
      )}
      style={
        accent
          ? { borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid' }
          : undefined
      }
    >
      <CardContent className="px-3.5 py-3">{children}</CardContent>
    </Card>
  );
}

export function SoftPanel({ children, className }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/50 bg-muted/40 p-3 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Disclaimer({ children }) {
  return (
    <p className="m-0 flex items-start gap-1.5 text-xs text-[var(--status-advisory)]">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/** Premium section chrome — richer than free AppCard. */
export function PremiumPanel({ children, className, eyebrow }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[#8A6BC4]/25 bg-gradient-to-br from-white via-[#FBF8FF] to-[#F3EEFA] p-3.5 shadow-[0_8px_24px_-12px_rgba(74,58,138,0.35)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#8A6BC4] via-[#44A7D2] to-[#8A6BC4]" />
      {eyebrow && (
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8A6BC4]">{eyebrow}</p>
      )}
      {children}
    </div>
  );
}
