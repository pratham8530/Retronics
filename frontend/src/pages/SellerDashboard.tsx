import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/authService";
import { createListing, getSellerListings, deleteListing, updateListing } from "@/services/listingService";
import { Navbar } from "@/components/Navbar";
import SellerRequests from "@/components/SellerRequests";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isEditListingOpen, setIsEditListingOpen] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    location: "",
    category: "",
    timeLeft: "",
    estimatedWeight: "",
    grade: "",
    image: null,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myListings");
  const [isDragging, setIsDragging] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }

      try {
        const userData = await getCurrentUser(token);
        setUser(userData?.user || null);

        const listingsResponse = await getSellerListings(token);
        setMyListings(listingsResponse?.data || []);
      } catch (fetchError) {
        console.error("Error fetching seller data:", fetchError);
        setError("Failed to load dashboard data. Please try again.");
        setMyListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [navigate]);

  const toggleAddListing = () => {
    setIsAddListingOpen(!isAddListingOpen);
    if (!isAddListingOpen) {
      setNewListing({
        title: "",
        price: "",
        location: "",
        category: "",
        timeLeft: "",
        estimatedWeight: "",
        grade: "",
        image: null,
        description: "",
      });
      setIsReviewing(false);
      setError(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setNewListing((prev) => ({ ...prev, image: file }));
      setError(null);
    } else {
      setError("Image size exceeds 10MB.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setNewListing((prev) => ({ ...prev, image: file }));
      setError(null);
    } else {
      setError("Image size exceeds 10MB.");
    }
  };

  const handleAddListingSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!newListing.image) {
        throw new Error("Please upload an image");
      }

      const formData = new FormData();
      formData.append("image", newListing.image);

      const uploadResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.message || "Image upload failed");
      }

      setNewListing((prev) => ({
        ...prev,
        title: uploadData.item || "Unknown Item",
        description: uploadData.description || "No description available",
        grade: uploadData.grade || "Not graded",
        image: uploadData.url,
      }));

      setIsReviewing(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmListing = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const listingData = {
        title: newListing.title,
        description: newListing.description,
        grade: newListing.grade,
        price: newListing.price,
        location: newListing.location,
        category: newListing.category,
        timeLeft: newListing.timeLeft,
        estimatedWeight: newListing.estimatedWeight,
        image: newListing.image,
      };

      const formData = new FormData();
      Object.entries(listingData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      await createListing(formData, token);

      const listingsResponse = await getSellerListings(token);
      setMyListings(listingsResponse?.data || []);
      setIsAddListingOpen(false);
      toast("Listing added successfully!");
    } catch (error) {
      console.error("Error adding listing:", error);
      setError("Failed to add listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        await deleteListing(id, token);
        const listingsResponse = await getSellerListings(token);
        setMyListings(listingsResponse?.data || []);
        toast("Listing deleted successfully!");
      } catch (deleteError) {
        console.error("Error deleting listing:", deleteError);
        setError("Failed to delete listing. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditListing = (listing) => {
    setEditListing(listing);
    setIsEditListingOpen(true);
    setError(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setEditListing((prev) => ({ ...prev, newImage: file }));
      setError(null);
    } else {
      setError("Image size exceeds 10MB.");
    }
  };

  const handleEditDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setEditListing((prev) => ({ ...prev, newImage: file }));
      setError(null);
    } else {
      setError("Image size exceeds 10MB.");
    }
  };

  const handleUpdateListing = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let imageUrl = editListing.image;

      if (editListing.newImage) {
        const formData = new FormData();
        formData.append("image", editListing.newImage);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || "Image upload failed");
        }

        imageUrl = uploadData.url;
        setEditListing((prev) => ({
          ...prev,
          title: uploadData.item || prev.title,
          description: uploadData.description || prev.description,
          grade: uploadData.grade || prev.grade,
          image: uploadData.url,
        }));
      }

      const listingData = {
        ...editListing,
        image: imageUrl,
      };

      await updateListing(editListing._id, listingData, token);
      const listingsResponse = await getSellerListings(token);
      setMyListings(listingsResponse?.data || []);
      setIsEditListingOpen(false);
      toast("Listing updated successfully!");
    } catch (submitError) {
      console.error("Error updating listing:", submitError);
      setError("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isAddListingOpen && !isEditListingOpen) {
    return (
      <div className="min-h-screen py-20 bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-green-50 to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <button
            onClick={toggleAddListing}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Add Listing
          </button>
        </div>

        {error && !isAddListingOpen && !isEditListingOpen && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="toast">
            <ToastContainer />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`mr-8 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "myListings"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("myListings")}
              >
                My Listings
              </button>
              <button
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                Requests
              </button>
            </nav>
          </div>

          {activeTab === "myListings" && (
            <div className="mt-6">
              {myListings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You haven't listed any items yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Listing
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Listed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myListings.map((listing) => (
                        <tr key={listing._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={listing.image || "/api/placeholder/120/90"}
                                  alt={listing.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {listing.description || "No description available"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {listing.grade || "Not graded"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {listing.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{listing.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {listing.isScrapItem ? (
                              <div>
                                <p className="text-red-600">Scrap Item</p>
                                {listing.pickupDetails && (
                                  <>
                                    <p>
                                      <strong>Pickup By:</strong> {listing.pickupDetails.facilityName},{" "}
                                      {listing.pickupDetails.facilityAddress}
                                    </p>
                                    <p>
                                      <strong>Pickup Date:</strong>{" "}
                                      {new Date(listing.pickupDetails.pickupDate).toLocaleDateString()}
                                    </p>
                                    <p>
                                      <strong>Status:</strong> {listing.pickupDetails.status}
                                    </p>
                                  </>
                                )}
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditListing(listing)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(listing._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              <SellerRequests />
            </div>
          )}
        </div>

        {isAddListingOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Add New Listing</h2>
                <button onClick={toggleAddListing} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {!isReviewing ? (
                <form onSubmit={handleAddListingSubmit}>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Listing Image (Max 10MB)
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={toggleAddListing}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmListing}>
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newListing.title}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, title: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newListing.description}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, description: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                        Grade
                      </label>
                      <input
                        type="text"
                        id="grade"
                        name="grade"
                        value={newListing.grade}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, grade: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={newListing.price}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, price: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={newListing.location}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, location: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={newListing.category}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, category: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="estimatedWeight" className="block text-sm font-medium text-gray-700">
                        Estimated Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="estimatedWeight"
                        name="estimatedWeight"
                        value={newListing.estimatedWeight}
                        onChange={(e) => setNewListing((prev) => ({ ...prev, estimatedWeight: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={toggleAddListing}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Listing"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {isEditListingOpen && editListing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Edit Listing</h2>
                <button
                  onClick={() => {
                    setIsEditListingOpen(false);
                    setEditListing(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <form onSubmit={handleUpdateListing}>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editListing.title}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editListing.description}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, description: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={editListing.price}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, price: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                      Grade
                    </label>
                    <input
                      type="text"
                      id="grade"
                      name="grade"
                      value={editListing.grade}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, grade: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editListing.location}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, location: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={editListing.category}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, category: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="estimatedWeight" className="block text-sm font-medium text-gray-700">
                      Estimated Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="estimatedWeight"
                      name="estimatedWeight"
                      value={editListing.estimatedWeight}
                      onChange={(e) => setEditListing((prev) => ({ ...prev, estimatedWeight: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Listing Image (Max 10MB)
                    </label>
                    {typeof editListing.image === "string" && (
                      <img src={editListing.image} alt="Current listing" className="mb-2 w-full h-48 object-cover" />
                    )}
                    <div
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                        isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
                      }`}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleEditDrop}
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="edit-file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                          >
                            <span>Upload new image</span>
                            <input
                              id="edit-file-upload"
                              name="edit-file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleEditImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        {editListing.newImage && (
                          <p className="text-xs text-gray-700 mt-1">{editListing.newImage.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditListingOpen(false);
                      setEditListing(null);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}