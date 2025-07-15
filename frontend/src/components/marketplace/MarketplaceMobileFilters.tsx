
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface MarketplaceMobileFiltersProps {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
}

export function MarketplaceMobileFilters({ isMobileFilterOpen, setIsMobileFilterOpen }: MarketplaceMobileFiltersProps) {
  return (
    <div className="lg:hidden sticky top-16 z-30 bg-white border-b p-3">
      <Button 
        variant="outline" 
        className="w-full flex justify-between items-center"
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </div>
        <span>{isMobileFilterOpen ? '↑' : '↓'}</span>
      </Button>
    </div>
  );
}