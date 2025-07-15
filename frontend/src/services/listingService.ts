import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/listings`;



// Get all listings
export const getAllListings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

// Get seller-specific listings
export const getSellerListings = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/seller`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    throw error;
  }
};

// Get a single listing by ID
export const getListingById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
};

// Create a new listing
export const createListing = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Update an existing listing
export const updateListing = async (id: string, formData: FormData, token: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

// Delete a listing
export const deleteListing = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

// Get featured listings
export const getFeaturedListings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    throw error;
  }
};