export type PaymentStatus = 'pending' | 'completed' | 'failed';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly rideId: string,
    public amount: number,
    public status: PaymentStatus = 'pending'
  ) {}

  processPayment(success: boolean): void {
    this.status = success ? 'completed' : 'failed';
  }
}
