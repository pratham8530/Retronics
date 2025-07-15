/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/types.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  condition: 'new' | 'used';
  seller: string;
  createdAt: string;
  requests: Request[]; // Assuming Request is defined elsewhere or should be BuyerRequest?
}

// Define the Address structure if not already defined elsewhere
export interface Address {
  city: string;
  area: string;
  colony: string;
  coordinates?: { // Optional, include if needed/available
    lat: number;
    lng: number;
  };
}

export interface BuyerRequest {
  seller: any; // Consider typing this if possible, e.g., User summary
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  listing: {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    timeLeft: string;
    sellerId: { // This is the seller associated with the listing
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      address: Address; // Add the address object here
    } | null; // Make sellerId potentially null if the backend might not populate it
  };
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  grade: string;
  location: string; // Consider changing this to use the Address type too for consistency
  sellerId: string; // This might just be the ID string
  timeLeft: string;
}

export interface User {
  id: string; // Consider using _id if that's what MongoDB uses
  firstName: string;
  lastName: string;
  email: string;
  userType: 'buyer' | 'seller';
  address?: Address; // Add address to the general User type as well
}

// Add a basic Request type if it's used in Product interface and not defined
export interface Request {
  _id: string;
  // ... other request properties
}