import RecyclingCenter, { IRecyclingCenter } from '../models/RecyclingCenter';

// Get all recycling centers
export const getAllRecyclingCenters = async (): Promise<IRecyclingCenter[]> => {
  const recyclingCenters = await RecyclingCenter.find().sort({ createdAt: -1 });
  return recyclingCenters.map(center => ({
    _id: center._id,
    name: center.name,
    address: center.address,
    phone: center.phone,
    hours: center.hours,
    location: center.location,
    createdAt: center.createdAt,
    updatedAt: center.updatedAt,
    acceptedItems: center.acceptedItems,
  } as IRecyclingCenter));
};

// Get nearby recycling centers
export const getNearbyRecyclingCenters = async (lat: number, lng: number): Promise<IRecyclingCenter[]> => {
  const recyclingCenters = await RecyclingCenter.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: 10000, // 10 km radius
      },
    },
  });
  return recyclingCenters;
};

// Get recycling center by ID
export const getRecyclingCenterById = async (id: string): Promise<IRecyclingCenter | null> => {
  const recyclingCenter = await RecyclingCenter.findById(id);
  return recyclingCenter;
};