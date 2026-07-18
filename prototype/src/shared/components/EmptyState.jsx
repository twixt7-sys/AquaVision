import { cn } from './ui/utils.js';
import { IconComponent } from './IconComponent.jsx';

export default function EmptyState({ icon = 'CircleDashed', title, children, tone = 'neutral' }) {
  const isNoData = tone === 'no_data';
  const Icon = typeof icon === 'string' ? null : icon;
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'rounded-lg border border-dashed px-5 py-7 text-center text-muted-foreground',
        'bg-[color-mix(in_srgb,var(--card)_60%,transparent)]',
        isNoData ? 'border-[var(--status-nodata)]' : 'border-border',
      )}
    >
      <div
        className={cn('mb-2 flex justify-center', isNoData ? 'text-[var(--status-nodata)]' : 'text-muted-foreground')}
        aria-hidden
      >
        {Icon ? <Icon className="size-7" /> : <IconComponent name={typeof icon === 'string' ? icon : 'CircleDashed'} size={28} />}
      </div>
      {title && <div className="mb-1.5 font-medium text-foreground">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
