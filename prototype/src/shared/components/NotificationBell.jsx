import { useState } from 'react';
import {
  Bell,
  Droplets,
  TrendingDown,
  Clock,
  UtensilsCrossed,
  Users,
  CheckCheck,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet.jsx';
import { cn } from './ui/utils.js';
import { notifications as initialNotifications } from '../../data/demoFixtures.js';

const ICONS = {
  do: Droplets,
  trend: TrendingDown,
  clock: Clock,
  feed: UtensilsCrossed,
  community: Users,
};

const TONE = {
  warning: 'text-[var(--status-warning)] bg-[var(--status-warning)]/12',
  advisory: 'text-[var(--status-advisory)] bg-[var(--status-advisory)]/12',
  nodata: 'text-[var(--status-nodata)] bg-[var(--status-nodata)]/12',
  nominal: 'text-[var(--status-ok)] bg-[var(--status-ok)]/12',
  community: 'text-accent bg-accent/12',
};

export default function NotificationBell({ className }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative flex size-9 shrink-0 items-center justify-center rounded-xl text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex min-w-[15px] items-center justify-center rounded-full bg-[var(--status-critical)] px-1 text-[9px] font-bold leading-[15px] text-white">
            {unread}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className={cn('w-[320px] gap-0 p-0 sm:max-w-[320px]', className)}>
          <SheetHeader className="border-b border-border/50 px-4 py-4">
            <div className="flex items-center justify-between gap-2 pr-6">
              <div>
                <SheetTitle className="text-sm">Notifications</SheetTitle>
                <SheetDescription className="text-[11px]">
                  {unread ? `${unread} unread` : 'All caught up'}
                </SheetDescription>
              </div>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-accent transition-colors hover:bg-accent/10"
                >
                  <CheckCheck className="size-3.5" /> Mark all read
                </button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-2.5">
            {items.map((n) => {
              const Icon = ICONS[n.icon] || Bell;
              return (
                <div
                  key={n.id}
                  className={cn(
                    'mb-1.5 flex gap-2.5 rounded-xl border px-3 py-2.5 transition-colors',
                    n.unread ? 'border-accent/25 bg-accent/[0.04]' : 'border-border/50 bg-card',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                      TONE[n.tone] || TONE.community,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="m-0 text-xs font-semibold leading-snug text-foreground">{n.title}</p>
                      {n.unread && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />}
                    </div>
                    <p className="m-0 mt-0.5 text-[11px] leading-snug text-muted-foreground">{n.body}</p>
                    <p className="m-0 mt-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground/70">
                      {n.when}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
