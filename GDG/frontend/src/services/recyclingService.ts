// filepath: GDG/frontend/src/services/recyclingService.ts
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/recycling`;

export const getAllRecyclingCenters = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getNearbyRecyclingCenters = async (lat: number, lng: number) => {
  const response = await axios.get(`${API_URL}/nearby`, {
    params: { lat, lng },
  });
  return response.data;
};

export const getRecyclingCenterById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};