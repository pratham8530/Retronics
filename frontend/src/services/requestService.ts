// src/services/requestService.ts

import axios, { AxiosError } from "axios";

// Adjust the base URL to your requests API endpoint
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/requests`;

// Interface for the expected structure of a populated request object from the API
// (Same as defined previously)
export interface RequestPopulated {
  _id: string;
  listing: {
    _id: string;
    title: string;
    image?: string | null;
  } | null;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Interface for the typical API response structure
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

/**
 * Fetches requests specifically for the logged-in seller.
 * Requires authentication token.
 * @param token - The authentication JWT token.
 * @returns Promise<ApiResponse<RequestPopulated[]>> - The API response containing seller requests.
 */
export const getSellerRequests = async (token: string): Promise<ApiResponse<RequestPopulated[]>> => {
  try {
    const response = await axios.get<ApiResponse<RequestPopulated[]>>(`${API_BASE_URL}/seller`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<never>>; // Type assertion for better error handling
    console.error("Error fetching seller requests:", axiosError.response?.data?.message || axiosError.message);
    // Re-throw a structured error or the original error
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch seller requests.');
  }
};

/**
 * Updates the status of a specific request (intended for seller actions like accept/reject).
 * Requires authentication token.
 * @param requestId - The ID of the request to update.
 * @param status - The new status ('accepted' or 'rejected').
 * @param token - The authentication JWT token.
 * @returns Promise<ApiResponse<RequestPopulated>> - The API response containing the updated request.
 */
export const updateRequestStatus = async (
    requestId: string,
    status: 'accepted' | 'rejected',
    token: string
): Promise<ApiResponse<RequestPopulated>> => {
  try {
    const response = await axios.patch<ApiResponse<RequestPopulated>>(
      `${API_BASE_URL}/${requestId}/status`,
      { status }, // Data payload for the PATCH request
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
     const axiosError = error as AxiosError<ApiResponse<never>>;
     console.error(`Error updating request ${requestId} status to ${status}:`, axiosError.response?.data?.message || axiosError.message);
     throw new Error(axiosError.response?.data?.message || `Failed to update request status.`);
  }
};

