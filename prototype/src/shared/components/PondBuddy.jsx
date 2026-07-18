import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

/**
 * Avi  -  AquaVision's pond buddy (Terry-equivalent).
 * Face is a friendly fish derived from the A+fish logo mark, fixed aqua blues
 * so Avi stays on-brand regardless of theme accent.
 */

export function BuddyFace({ mood = 'happy' }) {
  return (
    <svg viewBox="0 0 72 72" className="h-full w-full" aria-hidden>
      <style>{`
        @keyframes avi-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.12); }
        }
        @keyframes avi-look {
          0%, 40%, 100% { transform: translateX(0); }
          46%, 60% { transform: translateX(1.3px); }
          66%, 82% { transform: translateX(-1.1px); }
          88% { transform: translateX(0); }
        }
        @keyframes avi-fin {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes avi-blush {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .avi-eyes {
          animation: avi-blink 4.4s ease-in-out infinite;
          transform-origin: 50% 48%;
          transform-box: fill-box;
        }
        .avi-pupils { animation: avi-look 7s ease-in-out infinite; }
        .avi-fin {
          animation: avi-fin 2.8s ease-in-out infinite;
          transform-origin: 18px 36px;
        }
        .avi-blush { animation: avi-blush 5.2s ease-in-out infinite; }
      `}</style>

      {/* soft water halo */}
      <ellipse cx="36" cy="40" rx="28" ry="24" fill="#44A7D2" opacity="0.12" />

      {/* dorsal fin */}
      <path d="M34 14 C36 8 42 8 44 14 C40 13 36 13 34 14 Z" fill="#0B608F" />

      {/* body  -  rounded fish, aqua gradient via layered shapes */}
      <ellipse cx="36" cy="40" rx="22" ry="18" fill="#0B608F" />
      <ellipse cx="36" cy="40" rx="22" ry="18" fill="#44A7D2" opacity="0.45" />
      <ellipse cx="28" cy="34" rx="12" ry="8" fill="#FFFFFF" opacity="0.18" />

      {/* tail fin  -  sways */}
      <g className="avi-fin">
        <path d="M16 36 L6 28 L8 36 L6 44 Z" fill="#043B66" />
        <path d="M16 36 L8 36" stroke="#44A7D2" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* belly highlight */}
      <ellipse cx="38" cy="48" rx="12" ry="7" fill="#FFFFFF" opacity="0.2" />

      {/* eyes */}
      <g className="avi-eyes">
        <g className="avi-pupils">
          <circle cx="42" cy="36" r="5.2" fill="#EFF2F5" />
          <circle cx="43.2" cy="36.2" r="2.8" fill="#031820" />
          <circle cx="44.2" cy="35" r="1.1" fill="#FFFFFF" opacity="0.95" />
        </g>
      </g>

      {/* concerned brow */}
      {mood === 'concerned' && (
        <path
          d="M36 30 L48 32"
          stroke="#031820"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          fill="none"
        />
      )}

      {/* blush */}
      <g className="avi-blush">
        <ellipse cx="48" cy="44" rx="3" ry="2" fill="#FB7185" />
      </g>

      {/* mouth */}
      {mood === 'happy' && (
        <path
          d="M48 42 Q52 46 50 48"
          stroke="#031820"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'neutral' && (
        <path
          d="M48 44 L52 44"
          stroke="#031820"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'concerned' && (
        <path
          d="M48 46 Q51 43 53 46"
          stroke="#031820"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* little wave under (logo echo) */}
      <path
        d="M18 58 Q28 54 36 58 Q44 62 54 56"
        stroke="#44A7D2"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

const renderBuddyLine = (line) =>
  line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <span key={i} className="font-semibold text-sky-600 dark:text-sky-300">
        {part.slice(2, -2)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

const plainBuddyLine = (line) => line.split('**').join('');

export function PondBuddy({
  lines,
  mood = 'happy',
  name = 'Avi',
  tagline = 'Your pond buddy',
  onDismiss,
}) {
  const [index, setIndex] = useState(0);
  const [bump, setBump] = useState(0);
  const linesKey = lines.join('|');

  useEffect(() => {
    setIndex(0);
  }, [linesKey]);

  if (!lines?.length) return null;
  const safeIndex = index % lines.length;

  const handleTap = () => {
    setIndex((i) => (i + 1) % lines.length);
    setBump((b) => b + 1);
  };

  return (
    <section className="relative">
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={`Dismiss ${name}`}
          className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
      <button
        type="button"
        onClick={handleTap}
        aria-label={`${name} says: ${plainBuddyLine(lines[safeIndex])}. Tap for the next message.`}
        className="relative flex w-full items-center gap-3.5 px-1 py-1 text-left sm:gap-4"
      >
        <div className="flex shrink-0 flex-col items-center">
          <motion.div
            animate={{ rotate: [0, -2, 0, 2, 0] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.07, rotate: -3 }}
            className="h-20 w-20 sm:h-24 sm:w-24"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              <motion.div
                key={bump}
                initial={bump === 0 ? false : { rotate: -10, scale: 0.9, y: 6 }}
                animate={{ rotate: 0, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 12 }}
                className="h-full w-full"
              >
                <BuddyFace mood={mood} />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            aria-hidden
            animate={{ scaleX: [1, 0.78, 1], opacity: [0.4, 0.22, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-1.5 h-1.5 w-12 rounded-full bg-foreground/20 blur-[1px]"
          />
        </div>

        <div className="relative min-w-0 flex-1 rounded-2xl border border-border/50 bg-card px-3.5 py-3 shadow-sm">
          <span
            aria-hidden
            className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-border/50 bg-card"
          />
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent">
            {name} · {tagline}
          </p>
          <div className="mt-1 flex min-h-[2.5rem] items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={safeIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="text-[13px] leading-snug text-foreground sm:text-sm"
              >
                {renderBuddyLine(lines[safeIndex])}
              </motion.p>
            </AnimatePresence>
          </div>
          {lines.length > 1 && (
            <div className="mt-1.5 flex items-center justify-end gap-1">
              {lines.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    i === safeIndex ? 'w-3 bg-accent' : 'w-1 bg-border'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </button>
    </section>
  );
}

export default PondBuddy;
