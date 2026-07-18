import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  GraduationCap,
  Palette,
  Stethoscope,
  UtensilsCrossed,
  Waves,
} from 'lucide-react';
import { Pad, ScreenHead, AppCard, SoftPanel } from './_kit.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import { Progress } from '../../shared/components/ui/progress.jsx';
import {
  educationCourse,
  loadProgress,
  saveProgress,
  unitProgress,
  courseProgress,
} from '../../data/educationCourse.js';
import { cn } from '../../shared/components/ui/utils.js';

const ICONS = {
  droplets: Droplets,
  palette: Palette,
  utensils: UtensilsCrossed,
  stethoscope: Stethoscope,
};

function DielVisual({ hour, onHour }) {
  const doVal = useMemo(() => {
    // Simple illustrative diel curve: low at dawn, high mid-afternoon
    const h = hour;
    const base = 4.2 + 2.6 * Math.sin(((h - 8) / 24) * Math.PI * 2);
    return Math.max(2.2, Math.min(7.8, base));
  }, [hour]);
  const risk = doVal < 4;

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-[#0B608F]/10 to-transparent p-3">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Surface DO</p>
          <p className={cn('font-mono text-2xl font-bold', risk ? 'text-[var(--status-warning)]' : 'text-[var(--status-ok)]')}>
            {doVal.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">mg/L</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-primary">{String(hour).padStart(2, '0')}:00</p>
          <p className="text-[10px] text-muted-foreground">{risk ? 'Risk window' : 'Usually safer'}</p>
        </div>
      </div>
      <div className="relative mb-2 h-16 overflow-hidden rounded-xl bg-[#043B66]/90">
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent/80 to-accent/20 transition-all duration-300"
          style={{ height: `${((doVal - 2) / 6) * 100}%` }}
        />
        <Waves className="absolute bottom-2 left-1/2 size-6 -translate-x-1/2 text-white/40" />
      </div>
      <input
        type="range"
        min={0}
        max={23}
        value={hour}
        onChange={(e) => onHour(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>Midnight</span>
        <span>Dawn risk</span>
        <span>Afternoon</span>
      </div>
    </div>
  );
}

function SwatchVisual() {
  const swatches = [
    { c: '#2E9E6B', label: 'Pea green', hint: 'Dense algae' },
    { c: '#8B6914', label: 'Tea brown', hint: 'Soil / plankton mix' },
    { c: '#A8D4E8', label: 'Clear blue', hint: 'Low productivity' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {swatches.map((s) => (
        <div key={s.label} className="overflow-hidden rounded-xl border border-border/50 text-center">
          <div className="h-14" style={{ background: s.c }} />
          <div className="px-1 py-1.5">
            <p className="text-[11px] font-semibold">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoopVisual({ scoop, onScoop }) {
  const leftover = Math.max(0, scoop - 55);
  const growth = Math.min(100, scoop * 0.9);
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 p-3">
      <div className="flex items-center justify-between text-sm">
        <span>Ration intensity</span>
        <span className="font-mono font-semibold text-primary">{scoop}%</span>
      </div>
      <input
        type="range"
        min={30}
        max={100}
        value={scoop}
        onChange={(e) => onScoop(Number(e.target.value))}
        className="w-full accent-[var(--status-ok)]"
      />
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-[var(--status-ok)]/10 px-2 py-2">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Growth push</p>
          <p className="font-mono text-lg font-bold text-[var(--status-ok)]">{Math.round(growth)}</p>
        </div>
        <div className="rounded-xl bg-[var(--status-warning)]/10 px-2 py-2">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Leftover risk</p>
          <p className="font-mono text-lg font-bold text-[var(--status-warning)]">{Math.round(leftover)}</p>
        </div>
      </div>
    </div>
  );
}

function MatchVisual({ onComplete }) {
  const [picked, setPicked] = useState(null);
  const options = [
    { id: 'green', label: 'Heavy green', ok: true },
    { id: 'clear', label: 'Crystal clear', ok: false },
    { id: 'foam', label: 'White foam only', ok: false },
  ];
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Which pond look most often pairs with pre-dawn gasping?</p>
      <div className="grid gap-2">
        {options.map((o) => {
          const state =
            picked == null ? 'idle' : o.id === picked ? (o.ok ? 'good' : 'bad') : 'idle';
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked != null}
              onClick={() => {
                setPicked(o.id);
                if (o.ok) onComplete?.();
              }}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                state === 'good' && 'border-[var(--status-ok)] bg-[var(--status-ok)]/10',
                state === 'bad' && 'border-[var(--status-critical)] bg-[var(--status-critical)]/10',
                state === 'idle' && 'border-border hover:bg-muted/50',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TriageVisual({ onComplete }) {
  const items = [
    { id: 'gasp', label: 'Many fish gasping at surface', act: true },
    { id: 'one', label: 'One fish with a torn fin', act: false },
    { id: 'appetite', label: 'Whole pond stopped eating today', act: true },
  ];
  const [answers, setAnswers] = useState({});
  const done = items.every((i) => answers[i.id] != null);
  const allCorrect = done && items.every((i) => answers[i.id] === i.act);

  useEffect(() => {
    if (allCorrect) onComplete?.();
  }, [allCorrect, onComplete]);

  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.id} className="rounded-xl border border-border/60 p-2.5">
          <p className="mb-2 text-sm font-medium">{i.label}</p>
          <div className="flex gap-2">
            {[
              { v: true, label: 'Act today' },
              { v: false, label: 'Monitor' },
            ].map((opt) => {
              const sel = answers[i.id] === opt.v;
              const wrong = sel && opt.v !== i.act;
              const right = sel && opt.v === i.act;
              return (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [i.id]: opt.v }))}
                  className={cn(
                    'flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold',
                    right && 'border-[var(--status-ok)] bg-[var(--status-ok)]/15',
                    wrong && 'border-[var(--status-critical)] bg-[var(--status-critical)]/15',
                    !sel && 'border-border hover:bg-muted/40',
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonBody({ lesson, progress, markInteract, markQuiz, markComplete }) {
  const [hour, setHour] = useState(5);
  const [scoop, setScoop] = useState(60);
  const [quizPick, setQuizPick] = useState(null);

  if (lesson.type === 'story') {
    return (
      <div className="space-y-3">
        {lesson.visual === 'diel' && (
          <div className="relative h-24 overflow-hidden rounded-2xl bg-gradient-to-r from-[#043B66] via-[#0B608F] to-[#44A7D2]">
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-10 bg-white/15"
              animate={{ x: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ clipPath: 'polygon(0 40%, 12% 20%, 28% 45%, 45% 15%, 62% 50%, 78% 25%, 100% 40%, 100% 100%, 0 100%)' }}
            />
            <p className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">Night → dawn oxygen dip</p>
          </div>
        )}
        {lesson.visual === 'swatches' && <SwatchVisual />}
        {lesson.visual === 'feed' && (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-muted/50 py-6">
            <div className="size-14 rounded-full bg-[var(--status-ok)]/20 ring-4 ring-[var(--status-ok)]/30" />
            <ChevronRight className="text-muted-foreground" />
            <div className="size-14 rounded-full bg-[var(--status-warning)]/25 ring-4 ring-[var(--status-warning)]/30" />
            <ChevronRight className="text-muted-foreground" />
            <div className="size-14 rounded-full bg-[var(--status-critical)]/20 ring-4 ring-[var(--status-critical)]/25" />
          </div>
        )}
        {lesson.visual === 'school' && (
          <div className="relative h-28 overflow-hidden rounded-2xl bg-[#0B608F]/15">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                className="absolute size-3 rounded-full bg-primary/70"
                style={{ top: 30 + (i % 3) * 22, left: 20 + i * 36 }}
                animate={{ x: [0, 18, 0], y: [0, i % 2 ? 6 : -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.4 + i * 0.2, ease: 'easeInOut' }}
              />
            ))}
            <p className="absolute bottom-2 left-3 text-xs text-muted-foreground">Watch the whole school</p>
          </div>
        )}
        <p className="text-sm leading-relaxed text-foreground">{lesson.body}</p>
        {!progress.completedLessons[lesson.id] && (
          <Button
            size="sm"
            onClick={() => markComplete(lesson.id)}
          >
            Mark lesson complete
          </Button>
        )}
      </div>
    );
  }

  if (lesson.type === 'interact') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{lesson.body}</p>
        {lesson.visual === 'clock' && (
          <DielVisual
            hour={hour}
            onHour={(h) => {
              setHour(h);
              markInteract(lesson.id);
            }}
          />
        )}
        {lesson.visual === 'scoop' && (
          <ScoopVisual
            scoop={scoop}
            onScoop={(v) => {
              setScoop(v);
              markInteract(lesson.id);
            }}
          />
        )}
        {lesson.visual === 'match' && (
          <MatchVisual onComplete={() => markInteract(lesson.id)} />
        )}
        {lesson.visual === 'triage' && (
          <TriageVisual onComplete={() => markInteract(lesson.id)} />
        )}
        {progress.interactDone[lesson.id] && !progress.completedLessons[lesson.id] && (
          <Button size="sm" onClick={() => markComplete(lesson.id)}>
            Save progress
          </Button>
        )}
        {progress.completedLessons[lesson.id] && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--status-ok)]">
            <CheckCircle2 size={14} /> Interaction saved
          </p>
        )}
      </div>
    );
  }

  if (lesson.type === 'quiz') {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">{lesson.question}</p>
        <div className="grid gap-2">
          {lesson.choices.map((c) => {
            const picked = quizPick === c.id || progress.quizCorrect[lesson.id] === c.id;
            const show = quizPick != null || progress.quizCorrect[lesson.id];
            return (
              <button
                key={c.id}
                type="button"
                disabled={!!progress.quizCorrect[lesson.id]}
                onClick={() => {
                  setQuizPick(c.id);
                  markQuiz(lesson.id, c);
                }}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-left text-sm',
                  show && c.correct && 'border-[var(--status-ok)] bg-[var(--status-ok)]/12',
                  show && picked && !c.correct && 'border-[var(--status-critical)] bg-[var(--status-critical)]/10',
                  !show && 'border-border hover:bg-muted/40',
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        {(quizPick || progress.quizCorrect[lesson.id]) && (
          <p className="text-xs text-muted-foreground">{lesson.explain}</p>
        )}
      </div>
    );
  }

  return null;
}

export default function Learning() {
  const [progress, setProgress] = useState(() => loadProgress());
  const [activeUnitId, setActiveUnitId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const course = educationCourse;
  const overall = courseProgress(course, progress);
  const activeUnit = course.units.find((u) => u.id === activeUnitId);
  const activeLesson = activeUnit?.lessons.find((l) => l.id === activeLessonId);

  const patch = (fn) => setProgress((p) => fn({ ...p }));

  const markComplete = (lessonId) =>
    patch((p) => ({
      ...p,
      completedLessons: { ...p.completedLessons, [lessonId]: true },
    }));

  const markInteract = (lessonId) =>
    patch((p) => ({
      ...p,
      interactDone: { ...p.interactDone, [lessonId]: true },
    }));

  const markQuiz = (lessonId, choice) => {
    if (!choice.correct) return;
    patch((p) => ({
      ...p,
      quizCorrect: { ...p.quizCorrect, [lessonId]: choice.id },
      completedLessons: { ...p.completedLessons, [lessonId]: true },
    }));
  };

  if (activeLesson && activeUnit) {
    const idx = activeUnit.lessons.findIndex((l) => l.id === activeLesson.id);
    const next = activeUnit.lessons[idx + 1];
    return (
      <Pad>
        <button
          type="button"
          className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-primary"
          onClick={() => setActiveLessonId(null)}
        >
          <ArrowLeft size={14} /> Back to unit
        </button>
        <ScreenHead title={activeLesson.title} sub={`${activeUnit.title} · Lesson ${idx + 1} of ${activeUnit.lessons.length}`} />
        <AppCard accent={activeUnit.color}>
          <LessonBody
            lesson={activeLesson}
            progress={progress}
            markComplete={markComplete}
            markInteract={markInteract}
            markQuiz={markQuiz}
          />
        </AppCard>
        {progress.completedLessons[activeLesson.id] && next && (
          <Button
            onClick={() => setActiveLessonId(next.id)}
            className="w-full"
          >
            Next lesson <ChevronRight size={16} />
          </Button>
        )}
        {progress.completedLessons[activeLesson.id] && !next && (
          <Button
            variant="outline"
            onClick={() => {
              setActiveLessonId(null);
              setActiveUnitId(null);
            }}
            className="w-full"
          >
            Back to course map
          </Button>
        )}
      </Pad>
    );
  }

  if (activeUnit) {
    const up = unitProgress(activeUnit, progress);
    const Icon = ICONS[activeUnit.icon] || GraduationCap;
    return (
      <Pad>
        <button
          type="button"
          className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-primary"
          onClick={() => setActiveUnitId(null)}
        >
          <ArrowLeft size={14} /> Course map
        </button>
        <div className="mb-1 flex items-start gap-3">
          <span
            className="flex size-12 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{ background: activeUnit.color }}
          >
            <Icon size={22} />
          </span>
          <ScreenHead title={activeUnit.title} sub={activeUnit.blurb} />
        </div>
        <SoftPanel className="!p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold">Unit progress</span>
            <span className="font-mono text-muted-foreground">
              {up.done}/{up.total}
            </span>
          </div>
          <Progress value={up.ratio * 100} className="h-2" />
        </SoftPanel>
        <div className="flex flex-col gap-2">
          {activeUnit.lessons.map((lesson, i) => {
            const done = !!progress.completedLessons[lesson.id];
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLessonId(lesson.id)}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-3 py-3 text-left shadow-sm transition hover:border-accent/40"
              >
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-bold',
                    done ? 'bg-[var(--status-ok)] text-white' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {done ? <CheckCircle2 size={16} /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{lesson.title}</p>
                  <p className="text-[11px] capitalize text-muted-foreground">{lesson.type}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </Pad>
    );
  }

  return (
    <Pad>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#043B66] via-[#0B608F] to-[#44A7D2] p-4 text-white shadow-md">
        <motion.div
          className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-white/10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <div className="relative flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <GraduationCap size={22} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">{course.badge}</p>
            <h3 className="m-0 text-xl font-semibold tracking-tight">{course.title}</h3>
            <p className="m-0 mt-1 text-sm text-white/85">{course.subtitle}</p>
          </div>
        </div>
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-white/90">Course progress</span>
            <span className="font-mono text-white/80">
              {overall.done}/{overall.total} lessons
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${overall.ratio * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <ScreenHead title="Units" sub="Complete lessons, interactions, and quizzes to fill the track" />

      <div className="relative pl-4">
        <div className="absolute bottom-4 left-[21px] top-4 w-0.5 bg-gradient-to-b from-accent via-primary to-transparent" />
        <AnimatePresence>
          {course.units.map((unit, i) => {
            const up = unitProgress(unit, progress);
            const Icon = ICONS[unit.icon] || GraduationCap;
            return (
              <motion.button
                key={unit.id}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveUnitId(unit.id)}
                className="relative mb-3 flex w-full gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left shadow-sm transition hover:border-accent/50 hover:shadow-md"
              >
                <span
                  className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow"
                  style={{ background: unit.color }}
                >
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <b className="text-sm">{unit.title}</b>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Clock size={10} /> {unit.minutes}m
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{unit.blurb}</p>
                  <div className="mt-2">
                    <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>{up.done === up.total ? 'Completed' : up.done ? `${Math.round(up.ratio * 100)}% done` : 'Not started'}</span>
                      <span className="font-mono">{up.done}/{up.total}</span>
                    </div>
                    <Progress value={up.ratio * 100} className="h-1.5" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </Pad>
  );
}
