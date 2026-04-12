export abstract class User {
  protected constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public role: 'rider' | 'driver' | 'admin'
  ) {}
}

export class Rider extends User {
  constructor(id: string, name: string, email: string) {
    super(id, name, email, 'rider');
  }
}

export class Driver extends User {
  public totalRatings: number = 0;
  public totalScore: number = 0;

  constructor(
    id: string,
    name: string,
    email: string,
    public vehicleDetails: { type: string; licensePlate: string },
    public isAvailable: boolean = true,
    public currentLocation: { lat: number; lng: number } = { lat: 0, lng: 0 },
    public isApproved: boolean = true // Admin approval flag
  ) {
    super(id, name, email, 'driver');
  }

  updateLocation(lat: number, lng: number) {
    this.currentLocation = { lat, lng };
  }

  setAvailability(available: boolean) {
    this.isAvailable = available;
  }

  addRating(score: number) {
    this.totalRatings += 1;
    this.totalScore += score;
  }

  getAverageRating(): number {
    if (this.totalRatings === 0) return 5.0; // Default rating
    return parseFloat((this.totalScore / this.totalRatings).toFixed(1));
  }
}

export class Admin extends User {
  constructor(id: string, name: string, email: string) {
    super(id, name, email, 'admin');
  }
}
