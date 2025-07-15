import cron from 'node-cron';
import Listing from '../models/Listing';
import mongoose from 'mongoose';

async function updateScrapStatus() {
  if (mongoose.connection.readyState !== 1) {
    console.error('[Scheduler] MongoDB is not connected.');
    return;
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const result = await Listing.updateMany(
      {
        createdAt: { $lt: thirtyDaysAgo },
        isScrapItem: false,
      },
      {
        $set: { isScrapItem: true },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[Scheduler] Updated ${result.modifiedCount} listings to scrap items.`);
    }
  } catch (error) {
    console.error('[Scheduler] Error updating scrap status:', error);
  }
}

export function scheduleScrapUpdateJob() {
  const schedule = '* * * * *'; // Runs every minute

  cron.schedule(
    schedule,
    () => {
      updateScrapStatus();
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );
}