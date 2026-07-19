import { navigate } from '../../router.js';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Droplets,
  UtensilsCrossed,
  Thermometer,
  FlaskConical,
  Waves,
  Ruler,
  ArrowDownToLine,
  Fish as FishIcon,
  CalendarClock,
} from 'lucide-react';
import { Pad, AppCard } from './_kit.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import StalenessTag from '../../shared/components/StalenessTag.jsx';
import SpeciesIcon, { SPECIES_META } from '../../shared/components/SpeciesIcon.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { pondById } from '../../data/demoFixtures.js';

const HERO = `${import.meta.env.BASE_URL}assets/drone-render.jpg`;

const fmt = (n, digits = 1) => (n == null ? '—' : Number(n).toFixed(digits).replace(/\.0$/, ''));

function DoTrend({ values }) {
  const points = values.map((v, i) => ({ v, i }));
  const nums = values.filter((v) => v != null);
  if (nums.length < 2) return null;
  const min = Math.min(...nums) - 0.4;
  const max = Math.max(...nums) + 0.4;
  const W = 260;
  const H = 56;
  const x = (i) => (i / (values.length - 1)) * (W - 8) + 4;
  const y = (v) => H - 6 - ((v - min) / (max - min)) * (H - 12);

  // Build segments that skip nulls so gaps render as gaps (never interpolated).
  const segments = [];
  let cur = [];
  points.forEach((p) => {
    if (p.v == null) {
      if (cur.length) segments.push(cur);
      cur = [];
    } else {
      cur.push(p);
    }
  });
  if (cur.length) segments.push(cur);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Dissolved oxygen trend">
      {segments.map((seg, si) => (
        <polyline
          key={si}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={seg.map((p) => `${x(p.i)},${y(p.v)}`).join(' ')}
        />
      ))}
      {points.map((p) =>
        p.v == null ? null : (
          <circle key={p.i} cx={x(p.i)} cy={y(p.v)} r="2.4" fill="var(--accent)" />
        ),
      )}
    </svg>
  );
}

function MetaItem({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="m-0 text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="m-0 text-sm font-semibold leading-tight">{value}</p>
        {sub && <p className="m-0 text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function WaterTile({ icon: Icon, label, value, unit }) {
  const awaiting = value == null;
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card px-3 py-2.5">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" aria-hidden /> {label}
      </span>
      {awaiting ? (
        <span className="font-mono text-xs text-[var(--status-nodata)]">awaiting data</span>
      ) : (
        <span className="num text-xl text-accent">
          {value}
          {unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
        </span>
      )}
    </div>
  );
}

export default function PondDetail({ pondId }) {
  const pond = pondById(pondId);

  if (!pond) {
    return (
      <Pad>
        <EmptyState title="Pond not found">
          That pond isn’t in this demo farm. Head back to the dashboard to pick one.
        </EmptyState>
        <Button size="sm" onClick={() => navigate('/demo/free/home')}>
          <ArrowLeft className="size-3.5" /> Back to dashboard
        </Button>
      </Pad>
    );
  }

  const meta = SPECIES_META[pond.species] || SPECIES_META.tilapia;
  const noData = pond.status === 'no_data';

  return (
    <Pad className="gap-3">
      <button
        type="button"
        onClick={() => navigate('/demo/free/home')}
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Dashboard
      </button>

      {/* hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-2xl shadow-[0_14px_32px_-16px_rgba(4,59,102,0.6)]"
      >
        <img src={HERO} alt={`Aerial view of ${pond.label}`} className="h-40 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031820]/90 via-[#043B66]/35 to-transparent" />
        <div className="absolute right-3 top-3">
          <StatusBadge status={pond.status} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-3.5 text-white">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-md"
            style={{ color: meta.color }}
          >
            <SpeciesIcon species={pond.species} size={32} />
          </span>
          <div className="min-w-0">
            <h3 className="m-0 text-xl font-semibold leading-tight">{pond.label}</h3>
            <p className="m-0 text-xs text-white/80">{pond.speciesLabel || meta.label}</p>
            <div className="mt-1">
              <StalenessTag
                minutes={pond.lastReadingMinutes}
                verb="last reading"
                staleAfterMin={noData ? 60 : 180}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* water quality */}
      <div>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Water quality
        </p>
        {noData && (
          <p className="mb-2 rounded-lg border-l-2 border-[var(--status-nodata)] bg-muted/50 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            No recent reading. Grey means <b>unknown</b>, not safe — log a reading to bring this pond back online.
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <WaterTile icon={Droplets} label="Dissolved O₂" value={pond.water.do} unit="mg/L" />
          <WaterTile icon={Thermometer} label="Water temp" value={pond.water.temp} unit="°C" />
          <WaterTile icon={FlaskConical} label="pH" value={pond.water.ph} unit="" />
          <WaterTile icon={Waves} label="Salinity" value={pond.water.salinity} unit="ppt" />
        </div>
      </div>

      {/* DO trend */}
      <AppCard>
        <div className="mb-1 flex items-center justify-between gap-2">
          <b className="text-xs">7-day oxygen trend</b>
          <span className="font-mono text-[10px] text-muted-foreground">morning readings</span>
        </div>
        <DoTrend values={pond.doTrend} />
        <p className="m-0 mt-1 text-[10px] text-muted-foreground">
          Gaps are real gaps — days nobody logged. We never draw a line across them.
        </p>
      </AppCard>

      {/* pond metadata */}
      <div>
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Pond details
        </p>
        <div className="grid grid-cols-2 gap-2">
          <MetaItem icon={Ruler} label="Surface area" value={`${pond.areaM2.toLocaleString()} m²`} />
          <MetaItem icon={ArrowDownToLine} label="Avg depth" value={`${fmt(pond.depthM)} m`} />
          <MetaItem
            icon={FishIcon}
            label="Stocked"
            value={`${pond.stock.toLocaleString()}`}
            sub={pond.speciesLabel}
          />
          <MetaItem
            icon={CalendarClock}
            label="Days in cycle"
            value={`${pond.stockedDaysAgo} days`}
            sub="since stocking"
          />
          <MetaItem
            icon={UtensilsCrossed}
            label="Feed"
            value={`${fmt(pond.feed.dailyKg)} kg/day`}
            sub={pond.feed.type}
          />
          <MetaItem
            icon={Droplets}
            label="Stocking density"
            value={`${Math.round(pond.stock / pond.areaM2)} /m²`}
          />
        </div>
      </div>

      {/* note */}
      <AppCard accent={`var(--status-${noData ? 'nodata' : pond.status === 'ok' ? 'ok' : pond.status})`}>
        <p className="m-0 text-xs leading-relaxed text-muted-foreground">{pond.note}</p>
      </AppCard>

      {/* actions */}
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" className="h-8 text-xs" onClick={() => navigate('/demo/free/water')}>
          <Droplets className="size-3.5" /> Log a reading
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate('/demo/free/feeding')}>
          <UtensilsCrossed className="size-3.5" /> Log feeding
        </Button>
      </div>
    </Pad>
  );
}
