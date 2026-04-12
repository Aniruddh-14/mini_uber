import { Ride } from '../domain/Ride';
import { userRepository, rideRepository } from '../repositories/Database';
import { DistanceBasedMatching, MatchingStrategy } from '../patterns/MatchingStrategy';
import { FareStrategy, StandardFare } from '../patterns/FareStrategy';
import { Driver, Rider } from '../domain/User';

export class RideService {
  constructor(
    private matchingStrategy: MatchingStrategy = new DistanceBasedMatching(),
    private fareStrategy: FareStrategy = new StandardFare()
  ) {}

  setFareStrategy(strategy?: FareStrategy) {
    this.fareStrategy = strategy || new StandardFare();
  }

  requestRide(
    riderId: string,
    pickupLocation: { lat: number; lng: number; address: string },
    dropLocation: { lat: number; lng: number; address: string }
  ): Ride {
    const rider = userRepository.findById(riderId);
    if (!rider || !(rider instanceof Rider)) {
      throw new Error("Rider not found");
    }

    // Check if rider already has an active ride
    const existingRide = rideRepository.findActiveRidesByRiderId(riderId);
    if (existingRide) {
      throw new Error(`Rider already has an active ride in state: ${existingRide.getStatus()}`);
    }

    const rideId = `ride-${Date.now()}`;
    const ride = new Ride(rideId, rider, pickupLocation, dropLocation);
    rideRepository.save(ride);

    // Initial Fare calculation
    const estimatedFare = this.fareStrategy.calculateFare(ride);
    ride.setFare(estimatedFare);

    return ride;
  }

  matchDriver(rideId: string): Driver | null {
    const ride = rideRepository.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    if (ride.getStatus() !== 'REQUESTED') {
      throw new Error(`Cannot match driver for ride in state: ${ride.getStatus()}`);
    }

    const availableDrivers = userRepository.getDrivers().filter(d => d.isAvailable);
    const matchedDriver = this.matchingStrategy.findDriver(ride, availableDrivers);

    if (matchedDriver) {
      ride.assignDriver(matchedDriver);
      rideRepository.save(ride);
    }
    return matchedDriver;
  }

  acceptRide(driverId: string, rideId: string): void {
     // In an async flow, driver gets notified and accepts. Since we forcefully match in `matchDriver`, 
     // `acceptRide` simulates starting the ride for simplicity in this synchronous model.
     const ride = rideRepository.findById(rideId);
     if (!ride) throw new Error("Ride not found");
     
     if (ride.driver?.id !== driverId) throw new Error("Driver not assigned to this ride");

     ride.startRide();
     rideRepository.save(ride);
  }

  completeRide(rideId: string): void {
    const ride = rideRepository.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    ride.endRide();
    ride.payment?.processPayment(true);
    rideRepository.save(ride);
  }
}

// Global Service Instance
export const rideService = new RideService();
