import mongoose, { Document, Schema } from 'mongoose';

export interface IRecyclingCenter extends Document {
  name: string;
  address: string;
  phone: string;
  hours: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  acceptedItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

const recyclingCenterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    acceptedItems: { type: [String], required: true },
  },
  { timestamps: true }
);

recyclingCenterSchema.index({ location: '2dsphere' });

const RecyclingCenter = mongoose.model<IRecyclingCenter>('RecyclingCenter', recyclingCenterSchema);

export default RecyclingCenter;