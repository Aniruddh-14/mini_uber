import { User, Rider, Driver } from '../domain/User';
import { Ride } from '../domain/Ride';

// Generic Repository Interface
export interface Repository<T> {
  findById(id: string): T | undefined;
  save(item: T): void;
  findAll(): T[];
}

export class InMemoryUserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  save(user: User): void {
    this.users.set(user.id, user);
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  getDrivers(): Driver[] {
    return this.findAll().filter((u): u is Driver => u.role === 'driver');
  }

  getRiders(): Rider[] {
    return this.findAll().filter((u): u is Rider => u.role === 'rider');
  }
}

export class InMemoryRideRepository implements Repository<Ride> {
  private rides: Map<string, Ride> = new Map();

  findById(id: string): Ride | undefined {
    return this.rides.get(id);
  }

  save(ride: Ride): void {
    this.rides.set(ride.id, ride);
  }

  findAll(): Ride[] {
    return Array.from(this.rides.values());
  }

  findActiveRidesByRiderId(riderId: string): Ride | undefined {
    return this.findAll().find(
      r => r.rider.id === riderId && ['REQUESTED', 'MATCHED', 'ONGOING'].includes(r.getStatus())
    );
  }

   findActiveRidesByDriverId(driverId: string): Ride | undefined {
    return this.findAll().find(
      r => r.driver?.id === driverId && ['MATCHED', 'ONGOING'].includes(r.getStatus())
    );
  }
}

// Global Singletons for simulation
export const userRepository = new InMemoryUserRepository();
export const rideRepository = new InMemoryRideRepository();
