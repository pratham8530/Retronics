import Pickup from '../models/Pickup';
import Listing from '../models/Listing';
import { IListing } from '../types';
import { Types } from 'mongoose';

// Get all listings
export const getAllListings = async (): Promise<IListing[]> => {
  const listings = await Listing.find().sort({ createdAt: -1 }).lean(); // Use .lean() to return plain JavaScript objects
  return listings as unknown as IListing[]; // Explicitly cast to IListing[]
};

// Get seller-specific listings
export const getSellerListings = async (sellerId: string): Promise<any[]> => {
  try {
    const listings = await Listing.find({ sellerId: new Types.ObjectId(sellerId) })
      .lean()
      .exec();

    const listingIds = listings.map((listing) => listing._id);
    const pickups = await Pickup.find({ listingId: { $in: listingIds } })
      .lean()
      .exec();

    const pickupMap = pickups.reduce<Record<string, { facilityName: string; facilityAddress: string; pickupDate: Date; status: string }>>((acc, pickup) => {
      acc[pickup.listingId.toString()] = {
        facilityName: pickup.facilityName,
        facilityAddress: pickup.facilityAddress,
        pickupDate: pickup.pickupDate,
        status: pickup.status,
      };
      return acc;
    }, {});

    const listingsWithPickups = listings.map((listing) => ({
      ...listing,
      pickupDetails: pickupMap[listing._id.toString()] || null,
    }));

    return listingsWithPickups;
  } catch (error) {
    console.error('Error in getSellerListings:', error);
    throw error;
  }
};

// Get listing by ID
export const getListingById = async (id: string): Promise<IListing | null> => {
  const listing = await Listing.findById(id).populate('seller', 'firstName lastName email').lean(); // Use .lean()
  return listing as unknown as IListing | null; // Explicitly cast to IListing or null
};

// Create listing
export const createListing = async (listingData: Partial<IListing>): Promise<IListing> => {
  const listing = await Listing.create(listingData);
  return listing.toObject() as unknown as IListing; // Use .toObject() and explicitly cast to IListing
};

// Update listing
export const updateListing = async (
  id: string,
  listingData: Partial<IListing>,
  sellerId: string
): Promise<IListing> => {
  const existingListing = await Listing.findOne({ _id: id, sellerId });
  if (!existingListing) {
    throw new Error('Listing not found or unauthorized');
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, listingData, {
    new: true,
    runValidators: true,
  })
    .populate('seller', 'firstName lastName email')
    .lean(); // Use .lean()

  if (!updatedListing) {
    throw new Error('Listing not found');
  }

  return updatedListing as unknown as IListing; // Explicitly cast to IListing
};

// Delete listing
export const deleteListing = async (id: string, sellerId: string): Promise<void> => {
  const existingListing = await Listing.findOne({ _id: id, sellerId });
  if (!existingListing) {
    throw new Error('Listing not found or unauthorized');
  }

  await Listing.findByIdAndDelete(id);
};