import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from './utils';

/** Theria-style buttons: soft radius, scale on press, no generic pill glow. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] active:scale-[0.98] shadow-sm",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_1px_2px_rgba(4,59,102,0.25)]',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30',
        outline:
          'border border-border/50 bg-card/60 text-foreground hover:bg-muted/80 hover:border-border shadow-none',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/85',
        ghost:
          'shadow-none hover:bg-muted/70 hover:text-foreground',
        link: 'shadow-none text-accent underline-offset-4 hover:underline',
        soft:
          'bg-accent/15 text-accent border border-accent/25 hover:bg-accent/25 shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3 min-h-11',
        sm: 'h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5 min-h-9',
        lg: 'h-11 rounded-xl px-6 has-[>svg]:px-4',
        icon: 'size-9 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
