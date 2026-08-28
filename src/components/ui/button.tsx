import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:bg-accent/90",
        ghost: "text-fg hover:bg-fg/6",
        outline: "border border-border bg-transparent text-fg hover:bg-fg/6",
        subtle: "bg-raised text-fg hover:bg-fg/8",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-[8px]",
        md: "h-10 px-4 text-sm rounded-[12px]",
        lg: "h-11 px-5 text-sm rounded-[12px]",
        icon: "size-10 rounded-[12px]",
        iconSm: "size-8 rounded-[8px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
