# Sequence Diagram – Ride Booking Flow

```mermaid
sequenceDiagram
    participant Rider
    participant RideController
    participant RideService
    participant MatchingService
    participant Driver
    participant PaymentService

    Rider->>RideController: Request Ride
    RideController->>RideService: createRide()
    RideService->>MatchingService: findNearestDriver()
    MatchingService-->>RideService: Driver Found
    RideService->>Driver: Notify Ride Request
    Driver-->>RideService: Accept Ride
    RideService-->>Rider: Ride Confirmed

    Rider->>RideService: Start Ride
    RideService-->>Driver: Ride Started

    Rider->>RideService: End Ride
    RideService->>PaymentService: Process Payment
    PaymentService-->>RideService: Payment Success
    RideService-->>Rider: Ride Completed
