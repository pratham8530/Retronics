import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/authService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin } from "lucide-react"; 
import { BuyerRequest, User as AppUser } from "@/types/types"; 
import { Navbar } from "@/components/Navbar";
import { toast } from "react-toastify";

export default function BuyerDashboard() {
  const [user, setUser] = useState<AppUser | null>(null); // Use AppUser type
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const loadData = async () => {
          setLoading(true); // Set loading true at the start of loadData
          const token = localStorage.getItem("token");
          if (!token) {
              navigate("/auth/login");
              return;
          }

          try {
              // Load user data
              const userData = await getCurrentUser(token);
              if (userData?.user) {
                  setUser(userData.user);
              } else {
                  console.error("User data not found, redirecting to login.");
                  localStorage.removeItem("token"); // Clear invalid token
                  navigate("/auth/login");
                  return;
              }

              // Load requests
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/buyer`, {
                  headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                  if (response.status === 401) {
                      console.error("Unauthorized access. Redirecting to login.");
                      localStorage.removeItem("token");
                      navigate("/auth/login");
                      return;
                  }
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

        if (!response.ok) {
            // Handle HTTP errors (e.g., 401 Unauthorized, 404 Not Found, 500 Server Error)
            if (response.status === 401) {
                console.error("Unauthorized access. Redirecting to login.");
                localStorage.removeItem('token');
                navigate('/auth/login');
                return; 
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
              const data = await response.json();
              console.log("API Response Data:", data); // Debug: Log the received data

              if (data.success && Array.isArray(data.data)) {
                  setRequests(data.data);
              } else {
                  console.error(
                      "Failed to parse requests or data format incorrect:",
                      data.message || "No data array found"
                  );
                  setRequests([]); // Set to empty array to avoid errors during map
                  toast.error(data.message || "Failed to load requests properly.");
              }
          } catch (error) {
              console.error("Failed to load dashboard data:", error);
              toast.error("Failed to load dashboard data. Please check your connection or try again later.");
          } finally {
              setLoading(false);
          }
      };

      loadData();
  }, [navigate]);

  const handleCancelRequest = async (requestId: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
          toast.error("Authentication error. Please log in again.");
          navigate("/auth/login");
          return;
      }
      try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/${requestId}/cancel`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: "cancelled" }),
          });

          if (response.status === 401) {
              toast.error("Authentication error. Please log in again.");
              navigate("/auth/login");
              return;
          }

          const data = await response.json();
          if (data.success) {
              setRequests((prev) =>
                  prev.map((req) => (req._id === requestId ? { ...req, status: "cancelled" } : req))
              );
              toast.success("Request cancelled successfully.");
          } else {
              toast.error(data.message || "Failed to cancel request.");
          }
      } catch (error) {
          console.error("Cancel request error:", error);
          toast.error("An error occurred while trying to cancel the request.");
      }
  };

  const handleRemoveRequest = async (requestId: string) => {
      try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/${requestId}`, {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          const data = await response.json();
          if (data.success) {
              setRequests((prev) => prev.filter((req) => req._id !== requestId));
              toast.success("Request removed successfully.");
          } else {
              toast.error(data.message || "Failed to remove request.");
          }
      } catch (error) {
          console.error("Failed to remove request:", error);
          toast.error("Failed to remove request.");
      }
  };

  // --- Loading and User Check ---
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  // It's better to show the page structure even if user is briefly null during load,
  // but redirect handled in useEffect. If user becomes null *after* load, something's wrong.
  // This check prevents errors if user data fetch failed silently.
  if (!user) return <div className="min-h-screen flex items-center justify-center">User not found. Redirecting...</div>;

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Removed the gradient background div as it wrapped everything including Navbar */}
      {/* Apply gradient or color to the content area below Navbar if desired */}
      <div className="bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 pt-24 pb-8"> {/* Example gradient */}
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-6">
             <div className="flex items-center">
                <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4 p-2" // Added padding for better click area
                aria-label="Go back" // Accessibility
                >
                <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Welcome, {user.firstName}!
                </h1>
             </div>
             {/* Optional: Add other header elements here */}
          </div>

          {/* Requests Section */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Purchase Requests</h2>

            {requests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't made any purchase requests yet.</p>
                <Button onClick={() => navigate('/marketplace')}>
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Info</th> {/* Changed Header */}
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map(request => (
                      <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        {/* Product */}
                        <td className="px-4 py-4 whitespace-nowrap">
                           {/* Defensive check for listing */}
                          {request.listing ? (
                            <div className="flex items-center">
                               <img
                                src={request.listing.image || '/placeholder.png'} // Add a placeholder image path
                                alt={request.listing.title}
                                className="h-12 w-12 object-cover rounded-md flex-shrink-0"
                                onError={(e) => { e.currentTarget.src = '/placeholder.png'; }} // Handle broken images
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{request.listing.title}</div>
                                <div className="text-sm text-gray-500">{request.listing.category}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-red-500">Listing data missing</span>
                          )}
                        </td>
                        {/* Price */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.listing ? `₹${request.listing.price.toLocaleString()}` : 'N/A'}
                          </div>
                        </td>
                         {/* Seller Info - Conditional Display */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.listing?.sellerId ? (
                            <div>
                              {/* Always show Seller Name */}
                              <div className="font-medium">
                                {request.listing.sellerId.firstName} {request.listing.sellerId.lastName}
                              </div>

                              {/* Show Email and Address only if Accepted */}
                              {request.status === 'accepted' && (
                                <div className="mt-1 text-xs text-gray-600 space-y-1">
                                  {/* Email */}
                                  {request.listing.sellerId.email && (
                                    <div className="flex items-center">
                                      <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                      <a href={`mailto:${request.listing.sellerId.email}`} className="hover:underline">
                                        {request.listing.sellerId.email}
                                      </a>
                                    </div>
                                  )}
                                  {/* Address */}
                                  {request.listing.sellerId.address ? (
                                    <div className="flex items-start"> {/* Use items-start for multi-line address */}
                                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                      <span>
                                        {request.listing.sellerId.address.colony || ''}{request.listing.sellerId.address.colony && ', '}
                                        {request.listing.sellerId.address.area || ''}{request.listing.sellerId.address.area && ', '}
                                        {request.listing.sellerId.address.city || ''}
                                      </span>
                                    </div>
                                  ) : (
                                     <div className="flex items-center text-gray-400">
                                        <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                        <span>Address not available</span>
                                     </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">Seller info unavailable</span>
                          )}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                           <Badge variant={
                              request.status === 'pending' ? 'secondary' :
                              request.status === 'accepted' ? 'default' : // Use 'default' (often green/blue) for accepted
                              request.status === 'completed' ? 'default' : // Use 'default' for completed status
                              request.status === 'rejected' || request.status === 'cancelled' ? 'destructive' : // Use 'destructive' (red)
                              'outline' // Fallback
                           } className="capitalize"> {/* Capitalize first letter */}
                           {request.status}
                           </Badge>
                        </td>
                        {/* Actions */}
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelRequest(request._id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {request.status === 'cancelled' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveRequest(request._id)}
                          >
                            Remove
                          </Button>
                        )}
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}