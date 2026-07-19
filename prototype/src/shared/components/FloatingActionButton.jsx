import { useState } from 'react';
import { Plus, Stethoscope, MessageCircle, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigate } from '../../router.js';
import { cn } from './ui/utils.js';

function FabPulseRings({ ringClassName = 'border-2 border-accent', ringCount = 2, duration = 2.1 }) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-full" aria-hidden>
      {Array.from({ length: ringCount }, (_, i) => (
        <motion.span
          key={i}
          className={cn('absolute inset-0 box-border rounded-full', ringClassName)}
          initial={{ scale: 1, opacity: 0.55 }}
          animate={{ scale: [1, 1.42, 1.42], opacity: [0.55, 0.22, 0] }}
          transition={{
            duration,
            repeat: Infinity,
            delay: i * (duration / ringCount),
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

const ACTIONS = [
  { icon: Stethoscope, label: 'Diseases', path: '/demo/free/disease', className: 'bg-rose-600 hover:bg-rose-700' },
  { icon: Users, label: 'Community', path: '/demo/free/forum', className: 'bg-teal-600 hover:bg-teal-700' },
  { icon: MessageCircle, label: 'AI assistant', path: '/demo/free/assistant', className: 'bg-primary hover:bg-primary/90' },
];

export default function FloatingActionButton({
  isOpen: controlledOpen,
  onToggle,
  directAction = null,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = directAction ? false : controlledOpen !== undefined ? controlledOpen : internalOpen;
  const toggle = onToggle || (() => setInternalOpen((v) => !v));

  if (directAction) {
    return (
      <div className="absolute bottom-[5.5rem] right-4 z-50">
        <button
          type="button"
          onClick={directAction.onClick}
          className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95',
            directAction.buttonClass || 'bg-primary hover:bg-primary/90',
          )}
          aria-label={directAction.label}
        >
          <FabPulseRings />
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* dim the app behind the FAB when the quick-actions are open */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close quick actions"
            onClick={toggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-[55] cursor-default bg-[#031820]/55 backdrop-blur-[1.5px]"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-[5.5rem] right-4 z-[60]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-16 right-1 flex flex-col items-end gap-2.5"
            >
              {ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    type="button"
                    initial={{ opacity: 0, x: 16, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 16, scale: 0.9 }}
                    transition={{ delay: (ACTIONS.length - 1 - i) * 0.05 }}
                    onClick={() => {
                      navigate(action.path);
                      toggle();
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-full py-2 pl-4 pr-4 text-sm font-medium text-white shadow-lg ring-1 ring-white/15',
                      action.className,
                    )}
                  >
                    <span className="whitespace-nowrap">{action.label}</span>
                    <Icon size={16} />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggle}
          className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95',
            isOpen && 'bg-muted text-foreground',
          )}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
        >
          {!isOpen && <FabPulseRings />}
          <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
            {isOpen ? <X size={22} strokeWidth={2.5} /> : <Plus size={24} strokeWidth={2.5} />}
          </motion.span>
        </button>
      </div>
    </>
  );
}
