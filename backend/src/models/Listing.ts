import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  grade: string;
  location: string;
  category: string;
  timeLeft: string; // Note: This field was in the interface but not the schema. Consider removing or adding to schema if needed.
  sellerId: mongoose.Types.ObjectId; // Reference to the seller in the User collection
  estimatedWeight: number; // Weight of the item
  isScrapItem: boolean; // New field for scrap status
  createdAt: Date; // Automatically added by timestamps
  updatedAt: Date; // Automatically added by timestamps
}

const ListingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    grade: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User collection
    estimatedWeight: { type: Number, required: true }, // Existing field for estimated weight
    isScrapItem: { type: Boolean, default: false, index: true }, // New field, defaults to false, indexed for faster queries
    // timeLeft: { type: String }, // Add this if you actually need the timeLeft field in the database
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export default mongoose.model<IListing>("Listing", ListingSchema);