import { Request, Response } from "express";
import Pickup from "../models/Pickup";
import Listing from "../models/Listing";
import User from "../models/User";
import axios from "axios";
import env from "dotenv";
env.config();

export const schedulePickup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { area, colony, facilityName, facilityAddress, pickupDate } = req.body;

    // Fetch scrap listings from the /scrap endpoint
    const scrapResponse = await axios.get("https://gdg-main-project.onrender.com/api/listings/scrap");
    const scrapListings = scrapResponse.data.data;

    // Filter listings based on area or colony
    const filteredListings = scrapListings.filter((listing: any) => {
      if (area && listing.address.area.toLowerCase() === area.trim().toLowerCase()) {
        return true;
      }
      if (colony && listing.address.colony.toLowerCase() === colony.trim().toLowerCase()) {
        return true;
      }
      return false;
    });

    if (filteredListings.length === 0) {
      res.status(404).json({
        success: false,
        message: "No scrap listings found in the specified area or colony.",
      });
      return;
    }

    // Create pickup records for the filtered listings
    const pickups = await Promise.all(
      filteredListings.map(async (listing: any) => {
        return Pickup.create({
          listingId: listing.listingId, // Use listing ID from the /scrap data
          sellerId: listing.sellerId, // Use seller ID from the /scrap data
          area: listing.address.area,
          colony: listing.address.colony,
          facilityName,
          facilityAddress,
          pickupDate,
        });
      })
    );

    res.status(201).json({
      success: true,
      message: "Pickup scheduled successfully.",
      data: pickups,
    });
  } catch (error: any) {
    console.error("Error scheduling pickup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to schedule pickup.",
    });
  }
};

export const completePickup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pickupId } = req.params;

    const pickup = await Pickup.findByIdAndUpdate(
      pickupId,
      { status: "completed" },
      { new: true }
    );

    if (!pickup) {
      res.status(404).json({
        success: false,
        message: "Pickup not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Pickup marked as completed.",
      data: pickup,
    });
  } catch (error: any) {
    console.error("Error completing pickup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete pickup.",
    });
  }
};