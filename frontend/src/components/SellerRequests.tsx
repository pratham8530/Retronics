/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
// Import the axios-based functions
import { getSellerRequests, updateRequestStatus, RequestPopulated } from '@/services/requestService'; // Adjust path as needed
import { useNavigate } from 'react-router-dom'; // Import for potential redirect on auth error

const SellerRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestPopulated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const navigate = useNavigate(); // For redirection

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token"); // Get token
    if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        // Optional: redirect to login
        // navigate('/auth/login');
        return;
    }

    try {
      // Pass the token to the service function
      const response = await getSellerRequests(token);
      // The service now returns the full ApiResponse, but we expect it to throw on failure
      // If it doesn't throw, we assume success based on the try block
      setRequests(response.data);
    } catch (err: any) {
      console.error("Fetch requests error:", err);
      setError(err.message || 'An error occurred while fetching requests.');
      setRequests([]); // Clear requests on error
      // Handle specific auth errors if needed
      if (err.message.includes('Unauthorized') || err.status === 401 || err.message.includes('401')) {
           setError("Session expired or invalid. Please log in again.");
           // Optional: Clear token and redirect
           // localStorage.removeItem("token");
           // navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added navigate to deps if you use it inside useEffect for redirection

  const handleStatusUpdate = async (requestId: string, newStatus: 'accepted' | 'rejected') => {
    setActionLoadingId(requestId);
    setError(null);
    const token = localStorage.getItem("token"); // Get token again
    if (!token) {
        setError("Authentication required. Please log in.");
        setActionLoadingId(null);
        return;
    }

    try {
      // Pass token to update function
      const response = await updateRequestStatus(requestId, newStatus, token);
      setRequests(prevRequests =>
          prevRequests.map(req =>
            req._id === requestId ? { ...req, status: newStatus, updatedAt: response.data.updatedAt } : req
          )
      );
    } catch (updateError: any) {
      console.error(`Error updating request ${requestId} to ${newStatus}:`, updateError);
      setError(updateError.message || `Failed to ${newStatus} request: Please try again.`);
       if (updateError.message.includes('Unauthorized') || updateError.status === 401 || updateError.message.includes('401')) {
            setError("Session expired or invalid. Please log in again.");
           
       }
    } finally {
      setActionLoadingId(null);
    }
  };


    if (loading) {
        return <p className="text-center text-gray-500 py-4">Loading requests...</p>;
    }

    if (error && requests.length === 0) {
       return (
          <div className={`p-4 mb-4 rounded ${error.includes("Authentication required") || error.includes("Session expired") ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`} role="alert">
             <p className="font-bold">{error.includes("Authentication required") || error.includes("Session expired") ? 'Authentication Issue' : 'Error Loading Requests'}</p>
             <p>{error}</p>
             {(error.includes("Authentication required") || error.includes("Session expired")) && (
                 <button onClick={() => navigate('/auth/login')} className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600">
                     Go to Login
                 </button>
             )}
          </div>
       );
    }

    if (!loading && requests.length === 0) {
        return <p className="text-center text-gray-500 py-4">You have no incoming requests.</p>;
    }


    return (
        <div className="space-y-4">
          
            {error && requests.length > 0 && (
                <div className={`p-3 mb-4 rounded text-sm ${error.includes("Authentication required") || error.includes("Session expired") ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`} role="alert">
                    <p><span className="font-semibold">{error.includes("Authentication required") || error.includes("Session expired") ? 'Authentication Issue:' : 'Action Error:'}</span> {error}</p>
                    {(error.includes("Authentication required") || error.includes("Session expired")) && (
                         <button onClick={() => navigate('/auth/login')} className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded hover:bg-blue-600">
                             Login
                         </button>
                     )}
                </div>
            )}

        
             {requests.map((request) => (
                <div
                    key={request._id}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                    >
                   
                    <div className="mb-3 sm:mb-0 flex-grow mr-4">
                        {/* ... details ... */}
                         <p className="text-sm font-semibold text-gray-800">
                           Listing: <span className="font-normal">{request.listing?.title || <span className="text-gray-500 italic">Listing Not Available</span>}</span>
                         </p>
                         <p className="text-sm text-gray-600">
                           Buyer: <span className="font-normal">{request.buyer?.firstName} {request.buyer?.lastName} ({request.buyer?.email || 'N/A'})</span>
                         </p>
                         <p className="text-xs text-gray-500 mt-1">
                           Requested on: {new Date(request.createdAt).toLocaleString()}
                         </p>
                         {request.status !== 'pending' && (
                              <p className="text-xs text-gray-500 mt-1">
                                 Last Updated: {new Date(request.updatedAt).toLocaleString()}
                              </p>
                         )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto flex-shrink-0">
                         {/* Status Badge */}
                         <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                             request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                             request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                             request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                             request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                             request.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : ''
                           }`}>
                           {request.status}
                         </span>

                         {/* Action Buttons */}
                         {request.status === 'pending' && (
                            <div className="flex space-x-2 mt-2 sm:mt-0">
                                <button
                                    onClick={() => handleStatusUpdate(request._id, 'accepted')}
                                    className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={actionLoadingId === request._id}
                                >
                                    {actionLoadingId === request._id ? 'Accepting...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                    className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={actionLoadingId === request._id}
                                >
                                    {actionLoadingId === request._id ? 'Rejecting...' : 'Reject'}
                                </button>
                            </div>
                         )}
                    </div>
                </div>
             ))}
        </div>
    );

};

export default SellerRequests;