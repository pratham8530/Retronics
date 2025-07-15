import mongoose, { Schema, Document } from "mongoose";

export interface IPickup extends Document {
  listingId: mongoose.Types.ObjectId; // Reference to the listing
  sellerId: mongoose.Types.ObjectId; // Reference to the seller
  area: string; // Area of the pickup
  colony: string; // Colony of the pickup
  facilityName: string; // Name of the recycling facility
  facilityAddress: string; // Address of the recycling facility
  pickupDate: Date; // Scheduled pickup date
  status: "scheduled" | "completed"; // Status of the pickup
}

const PickupSchema: Schema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    area: { type: String, required: true },
    colony: { type: String, required: true },
    facilityName: { type: String, required: true },
    facilityAddress: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "completed"], default: "scheduled" },
  },
  { timestamps: true }
);

export default mongoose.model<IPickup>("Pickup", PickupSchema);