import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { SortDesc } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface Listing {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  grade: string;
  location: string;
  category: string;
  sellerId: string;
  estimatedWeight: number;
  isScrapItem: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  timeLeft: string;
  seller?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

interface MarketplaceListingsProps {
  listings: Listing[];
}

export function MarketplaceListings({ listings = [] }: MarketplaceListingsProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyerRequests, setBuyerRequests] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchBuyerRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/buyer`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setBuyerRequests(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch buyer requests", error);
      }
    };
    fetchBuyerRequests();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    console.log("Search Query:", searchQuery); // Debug log
    const filtered = searchQuery.trim()
      ? listings.filter((listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : listings;
    setFilteredListings(filtered);
  }, [listings, searchParams]);

  const handleRequestPurchase = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }

      if (!selectedListing) {
        throw new Error("No listing selected");
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: selectedListing._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      alert("Request submitted successfully!");

      if (data && data.data) {
        setBuyerRequests((prev) => [...prev, data.data]);
      }
      
      setIsRequestOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit request";
      alert(errorMessage);
      console.error("Request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (listingId: string) => {
    navigate(`/listings/${listingId}`);
  };

  return (
    <div className="lg:w-3/4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Showing {filteredListings.length} results</p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Button variant="outline" size="sm" className="flex items-center">
            <SortDesc className="h-4 w-4 mr-2" />
            Newest
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => {
          const alreadyRequested = buyerRequests.some(
            (request) =>
              request.listing && request.listing._id === listing._id
          );
          return (
            <ListingCard
              key={listing._id}
              {...listing}
              createdAt={typeof listing.createdAt === "string" ? listing.createdAt : listing.createdAt.toISOString()}
              id={listing._id}
              delay={((index + 1) * 100) % 600}
              onRequest={() => {
                if (alreadyRequested) {
                  alert("Request already submitted");
                } else {
                  setSelectedListing(listing);
                  setIsRequestOpen(true);
                }
              }}
              onViewDetails={() => handleViewDetails(listing._id)}
            />
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-eco-50 border-eco-200">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase Request</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedListing.image}
                  alt={selectedListing.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold">{selectedListing.title}</h4>
                  <p className="text-gray-600">
                    ${selectedListing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedListing.category}
                  </p>
                  {selectedListing.seller && (
                    <p className="text-sm text-gray-500">
                      Seller: {selectedListing.seller.firstName}{" "}
                      {selectedListing.seller.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsRequestOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleRequestPurchase} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Confirm Request"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}