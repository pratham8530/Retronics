import { MarketplaceSearch } from "./MarketplaceSearch";

export function MarketplaceHeader() {
  return (
    <div className="bg-gradient-to-r from-eco-500 to-tech-500 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">E-Waste Marketplace</h1>
          <p className="text-xl opacity-90 mb-8">
            Browse quality-graded electronics ready for a second life
          </p>
          
          {/* Search bar */}
          <MarketplaceSearch />
        </div>
      </div>
    </div>
  );
}
