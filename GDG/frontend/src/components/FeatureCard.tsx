import { cn } from "@/lib/utils";
import { fadeUp } from "@/utils/animations";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, delay, className }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "glass-card p-6 rounded-xl transition-all duration-300 hover:shadow-xl",
        "border border-gray-200/50 hover:border-white/60",
        fadeUp(delay),
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-eco-100 text-eco-600">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
