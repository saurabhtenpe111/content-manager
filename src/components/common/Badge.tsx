
import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary/10 text-primary": variant === "primary",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-400": variant === "success",
          "bg-amber-100 text-amber-700 dark:bg-amber-700/20 dark:text-amber-400": variant === "warning",
          "bg-rose-100 text-rose-700 dark:bg-rose-700/20 dark:text-rose-400": variant === "danger",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "border border-input": variant === "default",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
