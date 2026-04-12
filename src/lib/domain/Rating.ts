export class Rating {
  constructor(
    public readonly id: string,
    public readonly rideId: string,
    public readonly reviewerId: string,
    public readonly revieweeId: string,
    public readonly score: number,
    public readonly timestamp: number = Date.now()
  ) {}
}
