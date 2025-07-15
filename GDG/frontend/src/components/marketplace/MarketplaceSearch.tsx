import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/GradientButton";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function MarketplaceSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sync local state with URL query parameter on mount or when it changes.
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // Handle onChange to update the URL param immediately for real-time search.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (newValue.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(newValue)}`, { replace: true });
    } else {
      navigate("/marketplace", { replace: true });
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    navigate("/marketplace", { replace: true });
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search for electronics..."
        value={searchQuery}
        onChange={handleChange}
        className="w-full py-6 pl-12 pr-4 rounded-lg bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-eco-300"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
        <GradientButton type="button" className="rounded-md">
          Search
        </GradientButton>
        {searchQuery && (
          <GradientButton
            type="button"
            onClick={handleClear}
            className="rounded-md"
          >
            Clear
          </GradientButton>
        )}
      </div>
    </div>
  );
}
