import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CloudSun, Cloud, Sun, CloudRain, Droplet, Wind, Waves, Clock, MapPin } from 'lucide-react';
import { cn } from './ui/utils.js';
import { environmentSnapshot } from '../../data/demoFixtures.js';

const CONDITION_ICON = {
  sunny: Sun,
  partly_cloudy: CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
};

// Sky gradients keyed to condition — the card's mood should read before any label does.
const SKY = {
  sunny: 'from-[#2E93C9] via-[#4FB0DC] to-[#8FD3EE]',
  partly_cloudy: 'from-[#1C6E9C] via-[#3E9AC9] to-[#7FC3E4]',
  cloudy: 'from-[#3B5A73] via-[#557A94] to-[#8AA6BC]',
  rain: 'from-[#2A4459] via-[#3E5D75] to-[#5E7E96]',
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Cloud1({ className, style }) {
  return (
    <svg viewBox="0 0 120 48" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M28 40c-11 0-20-8-20-18S17 4 28 4c7 0 13 3.5 17 9 2.4-1.4 5.2-2.2 8.2-2.2 8.4 0 15.3 6.3 16.4 14.4C77 25 84 31 84 39c0 .3 0 .7-.05 1H28z" />
    </svg>
  );
}

/** Site conditions header — animated sky + weather stats. Time is the visitor's live
 * clock; the weather/tide figures are illustrative demo values. */
export default function EnvironmentStrip({ className }) {
  const now = useClock();
  const { conditionLabel, condition, tempC, feelsLikeC, humidityPct, windKph, tide, location } =
    environmentSnapshot;
  const WeatherIcon = CONDITION_ICON[condition] || CloudSun;
  const sky = SKY[condition] || SKY.partly_cloudy;

  const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateLabel = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  const stats = [
    { icon: Droplet, label: 'Feels like', value: `${feelsLikeC}°` },
    { icon: Wind, label: 'Humidity', value: `${humidityPct}%` },
    { icon: Waves, label: tide.label, value: tide.time },
    { icon: Clock, label: 'Local time', value: timeLabel },
  ];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl text-white shadow-[0_12px_30px_-14px_rgba(4,59,102,0.6)]',
        'bg-gradient-to-b',
        sky,
        className,
      )}
    >
      {/* animated sky layer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* sun glow */}
        <motion.div
          className="absolute -right-6 -top-8 size-32 rounded-full bg-white/70 blur-2xl"
          animate={{ opacity: [0.5, 0.75, 0.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute right-3 top-3 size-14 rounded-full bg-gradient-to-br from-[#FFF4C2] to-[#FFD25A] shadow-[0_0_28px_8px_rgba(255,220,120,0.5)]" />
        {/* drifting clouds */}
        <motion.div
          className="absolute left-0 top-6 text-white/45"
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        >
          <Cloud1 className="h-8 w-20" />
        </motion.div>
        <motion.div
          className="absolute left-0 top-14 text-white/25"
          animate={{ x: ['-40%', '140%'] }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear', delay: 4 }}
        >
          <Cloud1 className="h-10 w-28" />
        </motion.div>
        {/* soft water line at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#043B66]/45 to-transparent" />
      </div>

      <div className="relative px-4 pb-3 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="m-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
              <MapPin className="size-3" aria-hidden />
              {location}
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-semibold leading-none tracking-tight tabular-nums">
                {tempC}°
              </span>
              <span className="mb-0.5 text-xs font-medium text-white/85">{conditionLabel}</span>
            </div>
            <p className="m-0 mt-1 text-[11px] text-white/70">{dateLabel}</p>
          </div>
          <WeatherIcon className="size-11 shrink-0 text-white drop-shadow" aria-hidden strokeWidth={1.75} />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-0.5 rounded-lg bg-white/12 px-1 py-1.5 text-center backdrop-blur-sm"
            >
              <s.icon className="size-3.5 text-white/80" aria-hidden />
              <span className="truncate text-[11px] font-semibold leading-none tabular-nums">{s.value}</span>
              <span className="truncate text-[8px] uppercase leading-none tracking-wide text-white/60">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
