import { Request } from "express";
import { ObjectId } from "mongoose";

// Address interface
export interface Address {
  city: string; // City of the user
  area: string; // Area of the user
  colony: string; // Colony of the user
  coordinates: {
    lat: number; // Latitude
    lng: number; // Longitude
  };
}

// User interfaces
export interface IUser {
  id: any;
  role: string;
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  userType: "seller" | "buyer";
  address: Address; // Address is now an object
}

export interface IUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: "seller" | "buyer";
  address: Address; // Address is now an object
}

// Auth interfaces
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "seller" | "buyer";
  address: Address; // Address is now an object
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

// Extend the Express Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// Listing interfaces
export interface IListing {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  image: string;
  seller: ObjectId;
  estimatedWeight: number; // Added estimatedWeight field
  createdAt: Date;
  updatedAt: Date;
}

export interface IListingRequest {
  title: string;
  description: string;
  price: number;
  image: string;
  estimatedWeight: number; // Added estimatedWeight field
}