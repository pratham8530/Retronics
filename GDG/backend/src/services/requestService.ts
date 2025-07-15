// src/services/requestService.ts
import { BuyerRequest } from '@/types/types';

// Use a direct URL or create a config file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Adjust port as needed

export const getBuyerRequests = async (token: string): Promise<BuyerRequest[]> => {
  const response = await fetch(`${API_URL}/api/requests/buyer`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch requests');
  }
  
  const data = await response.json();
  return data.data;
};

export const cancelRequest = async (requestId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/requests/${requestId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'cancelled' }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to cancel request');
  }
};