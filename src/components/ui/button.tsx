import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.35)] hover:from-emerald-300 hover:to-emerald-400 active:translate-y-px",
        ghost:
          "bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
        outline:
          "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-11 px-5",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
