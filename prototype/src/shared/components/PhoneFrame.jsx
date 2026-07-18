import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from './ui/utils.js';

const PHONE_DEFAULT = { w: 390, h: 780 };
const DESKTOP_DEFAULT = { w: 1024, h: 820 };
const PHONE_MIN = { w: 280, h: 480 };
const DESKTOP_MIN = { w: 560, h: 420 };
const SIZE_KEY = 'aquavision-frame-size';

function loadSize(mode) {
  const fallback = mode === 'desktop' ? DESKTOP_DEFAULT : PHONE_DEFAULT;
  try {
    const raw = localStorage.getItem(`${SIZE_KEY}-${mode}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.w === 'number' && typeof parsed?.h === 'number') {
      return { w: parsed.w, h: parsed.h };
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

function saveSize(mode, size) {
  try {
    localStorage.setItem(`${SIZE_KEY}-${mode}`, JSON.stringify(size));
  } catch {
    /* ignore */
  }
}

function clampSize(mode, w, h) {
  const min = mode === 'desktop' ? DESKTOP_MIN : PHONE_MIN;
  const maxW = Math.min(window.innerWidth - 48, mode === 'desktop' ? 1400 : 520);
  // Leave room for the demo top nav + page padding
  const maxH = Math.min(window.innerHeight - 160, mode === 'desktop' ? 960 : 900);
  return {
    w: Math.round(Math.min(maxW, Math.max(min.w, w))),
    h: Math.round(Math.min(maxH, Math.max(min.h, h))),
  };
}

/** Shared resize handle + size state for pitch frames. */
export function useFrameSize(mode) {
  const [size, setSize] = useState(() => loadSize(mode));

  useEffect(() => {
    const next = loadSize(mode);
    setSize(clampSize(mode, next.w, next.h));
  }, [mode]);

  useEffect(() => {
    const onResize = () => setSize((s) => clampSize(mode, s.w, s.h));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mode]);

  const commit = useCallback(
    (next) => {
      const clamped = clampSize(mode, next.w, next.h);
      setSize(clamped);
      saveSize(mode, clamped);
    },
    [mode],
  );

  return [size, commit];
}

function ResizeHandle({ onDrag }) {
  const drag = useRef(null);

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dw = e.clientX - drag.current.x;
    const dh = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    onDrag(dw, dh);
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <button
      type="button"
      aria-label="Resize frame"
      title="Drag corner to resize frame"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute bottom-0 right-0 z-30 flex h-10 w-10 cursor-nwse-resize items-end justify-end rounded-tl-lg border-0 bg-gradient-to-tl from-[#043B66]/35 via-[#043B66]/10 to-transparent p-1.5 text-[#043B66]/70 transition-colors hover:from-accent/40 hover:text-accent active:text-accent"
    >
      <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden>
        <path d="M11 7v4H7M11 11L6 6M11 4L4 11" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Device bezel for pitch demos: phone shell wrapping Free / Premium screens. */
export default function PhoneFrame({ children, title, className, size, onResize }) {
  const w = size?.w ?? PHONE_DEFAULT.w;
  const h = size?.h ?? PHONE_DEFAULT.h;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className="phone-frame relative flex flex-col overflow-hidden rounded-[2.4rem] border-[10px] border-[#05263f] bg-background shadow-[0_24px_60px_rgba(4,59,102,0.28)]"
        style={{ width: w, height: h, maxWidth: '100%' }}
      >
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/10 bg-[#043B66] px-4 font-mono text-[11px] text-white/80">
          <span>9:41</span>
          <span className="tracking-[0.14em] text-accent">AQUAVISION</span>
          <span>▮▮▮ 72%</span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
          {children}
        </div>
        {onResize && (
          <ResizeHandle onDrag={(dw, dh) => onResize({ w: w + dw, h: h + dh })} />
        )}
      </div>
      {title && <div className="text-xs text-muted-foreground">{title}</div>}
    </div>
  );
}

/** Wider desktop chrome for pitch demos. */
export function DesktopFrame({ children, title, className, size, onResize }) {
  const w = size?.w ?? DESKTOP_DEFAULT.w;
  const h = size?.h ?? DESKTOP_DEFAULT.h;

  return (
    <div className={cn('flex w-full flex-col items-center gap-2', className)}>
      <div
        className="desktop-frame relative flex flex-col overflow-hidden rounded-xl border border-[#1C507A]/40 bg-background shadow-[0_20px_50px_rgba(4,59,102,0.18)]"
        style={{ width: w, height: h, maxWidth: '100%' }}
      >
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-[#043B66] px-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#C63B2F]/80" />
            <span className="size-2.5 rounded-full bg-[#E0A82E]/80" />
            <span className="size-2.5 rounded-full bg-[#2E9E6B]/80" />
          </span>
          <div className="ml-2 flex-1 truncate rounded-md bg-white/10 px-3 py-0.5 font-mono text-[11px] text-white/70">
            aquavision.app / demo
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
          {children}
        </div>
        {onResize && (
          <ResizeHandle onDrag={(dw, dh) => onResize({ w: w + dw, h: h + dh })} />
        )}
      </div>
      {title && <div className="text-xs text-muted-foreground">{title}</div>}
    </div>
  );
}
