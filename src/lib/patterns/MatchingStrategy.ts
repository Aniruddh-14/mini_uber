import { Driver } from '../domain/User';
import { Ride } from '../domain/Ride';

// Utility for calculating distance
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  // Simple Euclidean distance for simulation purposes
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
};

export interface MatchingStrategy {
  findDriver(ride: Ride, availableDrivers: Driver[]): Driver | null;
}

export class DistanceBasedMatching implements MatchingStrategy {
  findDriver(ride: Ride, availableDrivers: Driver[]): Driver | null {
    if (availableDrivers.length === 0) return null;

    let nearestDriver: Driver | null = null;
    let minDistance = Infinity;

    for (const driver of availableDrivers) {
      if (!driver.isAvailable) continue;

      const distance = calculateDistance(
        ride.pickupLocation.lat,
        ride.pickupLocation.lng,
        driver.currentLocation.lat,
        driver.currentLocation.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    }

    return nearestDriver;
  }
}
