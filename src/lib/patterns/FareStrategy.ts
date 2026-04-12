import { Ride } from '../domain/Ride';
import { calculateDistance } from './MatchingStrategy';

export interface FareStrategy {
  calculateFare(ride: Ride): number;
}

export class StandardFare implements FareStrategy {
  protected readonly BASE_FARE = 5.0;
  protected readonly PER_KM_RATE = 1.5;

  calculateFare(ride: Ride): number {
    const distanceKm = calculateDistance(
      ride.pickupLocation.lat,
      ride.pickupLocation.lng,
      ride.dropLocation.lat,
      ride.dropLocation.lng
    ) * 111; // 1 degree ≈ 111km approximation

    const fare = this.BASE_FARE + distanceKm * this.PER_KM_RATE;
    return parseFloat(fare.toFixed(2));
  }
}

export class SurgeFare extends StandardFare {
  constructor(private surgeMultiplier: number = 1.5) {
    super();
  }

  calculateFare(ride: Ride): number {
    const standard = super.calculateFare(ride);
    return parseFloat((standard * this.surgeMultiplier).toFixed(2));
  }
}
