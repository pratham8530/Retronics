import { Request as ExpressRequest, Response } from 'express';
import { AuthRequest as Request } from '../types';
import * as listingService from '../services/listingService';
import Listing from '../models/Listing';
import User from '../models/User';
import Pickup from '../models/Pickup';

// Get all listings
export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await listingService.getAllListings();

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get listing by ID
export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const listing = await listingService.getListingById(id);
    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get seller-specific listings
export const getSellerListings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }
    const sellerId = req.user._id.toString();

    // Use the updated service to get listings with pickup details
    const listings = await listingService.getSellerListings(sellerId);

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Create listing
export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }
    const sellerId = req.user._id;

    const listingData = {
      ...req.body,
      sellerId,
    };

    const listing = await listingService.createListing(listingData);

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update listing
export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.sellerId;
    delete updates.isScrapItem;

    const updatedListing = await Listing.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedListing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }

    res.status(200).json({ success: true, data: updatedListing });
  } catch (error: any) {
    console.error('Error updating listing:', error);
    res.status(500).json({ success: false, message: 'Failed to update listing' });
  }
};

// Delete listing
export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }
    const { id } = req.params;
    const sellerId = req.user._id.toString();

    await listingService.deleteListing(id, sellerId);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get featured listings
export const getFeaturedListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({ isScrapItem: false })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get scrap listings
export const getScrapListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const scrapListings = await Listing.find({ isScrapItem: true }).lean();

    const sellerIds = scrapListings.map((listing) => listing.sellerId.toString());
    const sellers = await User.find({ _id: { $in: sellerIds } }).lean();

    const listingIds = scrapListings.map((listing) => listing._id);
    const pickups = await Pickup.find({ listingId: { $in: listingIds } }).lean();

    const pickupMap = pickups.reduce<Record<string, { facilityName: string; facilityAddress: string; pickupDate: Date; status: string }>>((acc, pickup) => {
      acc[pickup.listingId.toString()] = {
        facilityName: pickup.facilityName,
        facilityAddress: pickup.facilityAddress,
        pickupDate: pickup.pickupDate,
        status: pickup.status,
      };
      return acc;
    }, {});

    const scrapData = sellers.map((seller: any) => {
      const sellerListings = scrapListings.filter(
        (listing) => listing.sellerId.toString() === seller._id.toString()
      );

      const listingsWithPickup = sellerListings.map((listing) => ({
        _id: listing._id,
        title: listing.title,
        estimatedWeight: listing.estimatedWeight || 0,
        pickupDetails: pickupMap[listing._id.toString()] || null,
      }));

      return {
        listingId: sellerListings.length > 0 ? sellerListings[0]._id : null,
        sellerId: seller._id.toString(),
        name: `${seller.firstName} ${seller.lastName}`,
        address: {
          city: seller.address.city,
          area: seller.address.area,
          colony: seller.address.colony,
          coordinates: seller.address.coordinates,
        },
        items: listingsWithPickup.map((listing) => listing.title),
        estimatedWeight: `${listingsWithPickup.reduce(
          (sum, listing) => sum + (listing.estimatedWeight || 0),
          0
        )} kg`,
        listings: listingsWithPickup,
      };
    });

    res.status(200).json({
      success: true,
      data: scrapData,
    });
  } catch (error: any) {
    console.error('Error fetching scrap listings:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};