import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface GradientButtonProps extends ButtonProps {
  gradientFrom?: string;
  gradientTo?: string;
  hoverScale?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientFrom = "from-eco-500", gradientTo = "to-tech-500", hoverScale = true, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "relative bg-gradient-to-r font-medium transition-all duration-200 overflow-hidden",
          gradientFrom,
          gradientTo,
          hoverScale && "hover:scale-[1.02]",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-white/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton };