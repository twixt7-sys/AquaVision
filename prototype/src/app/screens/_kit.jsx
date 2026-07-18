import { TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '../../shared/components/ui/card.jsx';
import { cn } from '../../shared/components/ui/utils.js';

export function Pad({ children, className }) {
  return (
    <div className={cn('flex flex-col gap-3.5 px-4 pb-7 pt-4', className)}>{children}</div>
  );
}

export function ScreenHead({ title, sub }) {
  return (
    <div className="mb-0.5">
      <h3 className="m-0 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      {sub && <p className="m-0 mt-1 text-sm text-muted-foreground">{sub}</p>}
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
      <CardContent className="px-4 py-3.5">{children}</CardContent>
    </Card>
  );
}

export function SoftPanel({ children, className }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/50 bg-muted/40 p-4 shadow-sm sm:p-5',
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
