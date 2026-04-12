import { User, Rider, Driver, Admin } from '../domain/User';

export class UserFactory {
  static createRider(id: string, name: string, email: string): Rider {
    return new Rider(id, name, email);
  }

  static createDriver(
    id: string,
    name: string,
    email: string,
    vehicleDetails: { type: string; licensePlate: string },
    isApproved: boolean = true
  ): Driver {
    return new Driver(id, name, email, vehicleDetails, true, { lat: 0, lng: 0 }, isApproved);
  }

  static createAdmin(id: string, name: string, email: string): Admin {
    return new Admin(id, name, email);
  }
}
