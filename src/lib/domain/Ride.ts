import { Driver, Rider } from './User';
import { Payment } from './Payment';

// State Pattern Interface
export interface RideState {
  getStatus(): string;
  startRide(ride: Ride): void;
  endRide(ride: Ride): void;
  cancelRide(ride: Ride): void;
}

export class RequestedState implements RideState {
  getStatus() { return 'REQUESTED'; }
  startRide(ride: Ride): void { throw new Error("Cannot start an unassigned ride."); }
  endRide(ride: Ride): void { throw new Error("Cannot end an unassigned ride."); }
  cancelRide(ride: Ride): void {
    ride.setState(new CancelledState());
  }
}

export class MatchedState implements RideState {
  getStatus() { return 'MATCHED'; }
  startRide(ride: Ride): void {
    ride.setState(new OngoingState());
  }
  endRide(ride: Ride): void { throw new Error("Cannot end a not-started ride."); }
  cancelRide(ride: Ride): void {
    ride.setState(new CancelledState());
    // In a real system, we'd also free the driver here
    if (ride.driver) ride.driver.setAvailability(true);
  }
}

export class OngoingState implements RideState {
  getStatus() { return 'ONGOING'; }
  startRide(ride: Ride): void { throw new Error("Ride already started."); }
  endRide(ride: Ride): void {
    ride.setState(new CompletedState());
    if (ride.driver) ride.driver.setAvailability(true);
  }
  cancelRide(ride: Ride): void { throw new Error("Cannot cancel an ongoing ride."); }
}

export class CompletedState implements RideState {
  getStatus() { return 'COMPLETED'; }
  startRide(ride: Ride): void { throw new Error("Ride already completed."); }
  endRide(ride: Ride): void { throw new Error("Ride already completed."); }
  cancelRide(ride: Ride): void { throw new Error("Cannot cancel a completed ride."); }
}

export class CancelledState implements RideState {
  getStatus() { return 'CANCELLED'; }
  startRide(ride: Ride): void { throw new Error("Ride cancelled."); }
  endRide(ride: Ride): void { throw new Error("Ride cancelled."); }
  cancelRide(ride: Ride): void { throw new Error("Ride already cancelled."); }
}

// Ride Domain Entity
export class Ride {
  private state: RideState;
  public driver: Driver | null = null;
  public payment: Payment | null = null;
  public fare: number = 0;

  constructor(
    public readonly id: string,
    public rider: Rider,
    public pickupLocation: { lat: number; lng: number, address: string },
    public dropLocation: { lat: number; lng: number, address: string }
  ) {
    this.state = new RequestedState();
  }

  setState(state: RideState) {
    this.state = state;
  }

  getState(): RideState {
    return this.state;
  }

  getStatus(): string {
    return this.state.getStatus();
  }

  assignDriver(driver: Driver) {
    if (this.state instanceof RequestedState) {
      this.driver = driver;
      this.setState(new MatchedState());
      driver.setAvailability(false);
    } else {
      throw new Error(`Cannot assign driver to a ride in state ${this.state.getStatus()}`);
    }
  }

  startRide() {
    this.state.startRide(this);
  }

  endRide() {
    this.state.endRide(this);
  }

  cancelRide() {
    this.state.cancelRide(this);
  }

  setFare(amount: number) {
    this.fare = amount;
    this.payment = new Payment(`${this.id}-pay`, this.id, amount);
  }
}
