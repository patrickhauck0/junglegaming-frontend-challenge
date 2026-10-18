import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-mono text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-ink hover:bg-[#E89B55]',
        primary: 'bg-primary text-ink hover:bg-[#E89B55]',
        secondary: 'bg-surface-raised text-foreground border border-border hover:border-secondary',
        outline: 'border border-border bg-transparent text-foreground hover:border-primary',
        ghost: 'text-secondary hover:text-foreground hover:bg-surface-card',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-primary to-primary/80 text-ink hover:opacity-95',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-[6px]',
        sm: 'h-8 px-3 rounded-[4px] text-[13px]',
        lg: 'h-[45px] px-8 rounded-[8px] text-[15px]',
        xl: 'h-[60px] px-8 rounded-[40px] text-[16px]',
        icon: 'size-10 rounded-[6px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
