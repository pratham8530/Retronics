import { cn } from "@/lib/utils";

export const fadeIn = (delay?: number) => 
  cn(
    "opacity-0 animate-fade-in animation-fill-forwards", 
    delay === 100 && "animate-delay-100",
    delay === 200 && "animate-delay-200",
    delay === 300 && "animate-delay-300",
    delay === 400 && "animate-delay-400",
    delay === 500 && "animate-delay-500"
  );

export const fadeUp = (delay?: number) => 
  cn(
    "opacity-0 animate-fade-up animation-fill-forwards", 
    delay === 100 && "animate-delay-100",
    delay === 200 && "animate-delay-200",
    delay === 300 && "animate-delay-300",
    delay === 400 && "animate-delay-400",
    delay === 500 && "animate-delay-500"
  );

export const slideInRight = (delay?: number) => 
  cn(
    "opacity-0 animate-slide-in-right animation-fill-forwards", 
    delay === 100 && "animate-delay-100",
    delay === 200 && "animate-delay-200",
    delay === 300 && "animate-delay-300",
    delay === 400 && "animate-delay-400",
    delay === 500 && "animate-delay-500"
  );

export const subtlePulse = "animate-subtle-pulse";

export const gradientShift = "bg-gradient-to-r from-eco-500 to-tech-500 animate-gradient-shift";