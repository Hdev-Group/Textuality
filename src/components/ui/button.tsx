import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative overflow-hidden flex flex-row items-center items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-muted hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-neutral-900/5 hover:text-accent-background flex dark:hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-transparent group relative text-primary z-20 overflow-hidden backdrop-blur-lg transition-colors hover:border-muted-foreground border hover:bg-neutral-900/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "group")}
        ref={ref}
        onMouseMove={variant === "gradient" ? handleMouseMove : undefined}
        onMouseEnter={variant === "gradient" ? () => setIsHovering(true) : undefined}
        onMouseLeave={variant === "gradient" ? () => setIsHovering(false) : undefined}
        {...props}
      >
        {variant === "gradient" ? (
          <>
            <span
              className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-lg transition-opacity duration-300 pointer-events-none"
              style={{
                transform: `scale(${isHovering ? 1.2 : 0})`,
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }}
            />
            <span
              className="absolute rounded-full z-0 transition-transform bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-[0.3] blur-lg duration-300 pointer-events-none"
              style={{
                width: "50px",
                height: "50px",
                transform: `scale(${isHovering ? 1 : 0})`,
                top: `${position.y + -20}px`,
                left: `${position.x + -20}px`,
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }}
            />
            <span className="relative z-10">{props.children}</span>
          </>
        ) : (
          <span className="relative z-10 flex flex-row items-center gap-1">{props.children}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
