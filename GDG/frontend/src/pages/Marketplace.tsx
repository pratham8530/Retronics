import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";
import { MarketplaceMobileFilters } from "@/components/marketplace/MarketplaceMobileFilters";
import { getAllListings } from "@/services/listingService";
import { Listing } from "@/components/marketplace/MarketplaceListings"; // Adjust path if needed

export default function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedGrades, setSelectedGrades] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllListings();
        console.log("API Response:", response.data); // Debug log
        const allApiListings: Listing[] = response.data;

        // Temporarily bypass isScrapItem filter for debugging
        const activeListings = allApiListings; // Remove .filter(listing => !listing.isScrapItem)
        setListings(activeListings);
        setFilteredListings(activeListings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setListings([]);
        setFilteredListings([]);
      }
    };

    fetchListings();
  }, []);

  const applyFilters = () => {
    let filtered = listings;

    // Filter by price range
    filtered = filtered.filter(listing => listing.price >= priceRange[0] && listing.price <= priceRange[1]);

    // Filter by selected grades
    const selectedGradeKeys = Object.keys(selectedGrades).filter(key => selectedGrades[key]);
    if (selectedGradeKeys.length > 0) {
      filtered = filtered.filter(listing => selectedGradeKeys.includes(listing.grade));
    }

    // Filter by selected categories
    const selectedCategoryKeys = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
    if (selectedCategoryKeys.length > 0) {
      filtered = filtered.filter(listing => selectedCategoryKeys.includes(listing.category));
    }

    setFilteredListings(filtered);
  };

  useEffect(() => {
    if (listings.length > 0) {
      applyFilters();
    }
  }, [priceRange, selectedGrades, selectedCategories, listings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <MarketplaceHeader />

      <MarketplaceMobileFilters
        isMobileFilterOpen={isMobileFilterOpen}
        setIsMobileFilterOpen={setIsMobileFilterOpen}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <MarketplaceFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedGrades={selectedGrades}
            toggleGrade={(grade) => setSelectedGrades(prev => ({ ...prev, [grade]: !prev[grade] }))}
            selectedCategories={selectedCategories}
            toggleCategory={(category) => setSelectedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
            isMobileFilterOpen={isMobileFilterOpen}
          />

          <MarketplaceListings listings={filteredListings} />
        </div>
      </div>
    </div>
  );
}