// src/types/types.ts

// Make sure 'export' is here
export interface Address {
  city: string;
  area: string;
  colony: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// BuyerRequest should already be exported, but double-check
export interface BuyerRequest {
    _id: string;
    buyer: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    seller: {
      _id: string;
      firstName: string;
      lastName: string;
      email?: string;
      address?: Address; // This line needs the exported Address type
    };
    listing: {
      _id: string;
      title: string;
      description: string;
      price: number;
      image: string;
      category: string;
    };
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    message?: string;
    createdAt: string;
    updatedAt: string;
  }

// Add exports for any other types needed elsewhere