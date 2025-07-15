import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

// Categories for filtering
const categories = [
  { id: "Electronics", name: "Electronics" },
  { id: "Mobile Phones", name: "Mobile Phones" },
  { id: "Audio", name: "Audio Equipment" },
  { id: "Gaming Consoles", name: "Gaming Consoles" },
  { id: "Monitors", name: "Monitors" },
  { id: "PC Parts", name: "PC Parts" },
  { id: "Laptops", name: "Laptops" },
  { id: "Tablets", name: "Tablets" }
];

interface MarketplaceFiltersProps {
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  selectedGrades: Record<string, boolean>;
  toggleGrade: (grade: string) => void;
  selectedCategories: Record<string, boolean>;
  toggleCategory: (category: string) => void;
  isMobileFilterOpen: boolean;
}

export function MarketplaceFilters({
  priceRange,
  setPriceRange,
  selectedGrades,
  toggleGrade,
  selectedCategories,
  toggleCategory,
  isMobileFilterOpen
}: MarketplaceFiltersProps) {
  return (
    <div 
      className={`lg:w-1/4 bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${
        isMobileFilterOpen ? 'block' : 'hidden lg:block'
      } ${isMobileFilterOpen ? 'sticky top-28 z-20' : ''} lg:sticky lg:top-28 lg:h-[calc(100vh-120px)] lg:overflow-auto`}
    >
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <div className="px-2">
          <Slider 
            defaultValue={[0, 10000]} 
            max={10000} 
            step={10} 
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4">Quality Grade</h3>
        <div className="space-y-2">
          {['A', 'B', 'C'].map(grade => (
            <div 
              key={grade}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleGrade(grade)}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                selectedGrades[grade] 
                  ? 'bg-eco-500 border-eco-500 text-white' 
                  : 'bg-white border-gray-300'
              }`}>
                {selectedGrades[grade] && <Check className="h-3 w-3" />}
              </div>
              <span>Grade {grade}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div 
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                selectedCategories[category.id] 
                  ? 'bg-eco-500 border-eco-500 text-white' 
                  : 'bg-white border-gray-300'
              }`}>
                {selectedCategories[category.id] && <Check className="h-3 w-3" />}
              </div>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full" onClick={() => {
          setPriceRange([0, 10000]);
          Object.keys(selectedGrades).forEach((key) => (selectedGrades[key] = false));
          Object.keys(selectedCategories).forEach((key) => toggleCategory(key));
        }}>Reset Filters</Button>
      </div>
    </div>
  );
}