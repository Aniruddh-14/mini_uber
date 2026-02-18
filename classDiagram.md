# Class Diagram

```mermaid
classDiagram

class User {
    -id
    -name
    -email
    -password
    +login()
    +logout()
}

class Rider {
    +requestRide()
    +cancelRide()
}

class Driver {
    -isAvailable
    -vehicleDetails
    +acceptRide()
    +rejectRide()
}

class Admin {
    +approveDriver()
}

class Ride {
    -id
    -status
    -pickupLocation
    -dropLocation
    -fare
    +startRide()
    +endRide()
}

class Payment {
    -id
    -amount
    -status
    +processPayment()
}

class MatchingStrategy {
    <<interface>>
    +findDriver()
}

class DistanceBasedMatching {
    +findDriver()
}

class FareStrategy {
    <<interface>>
    +calculateFare()
}

class StandardFare
class SurgeFare

User <|-- Rider
User <|-- Driver
User <|-- Admin

Ride --> Rider
Ride --> Driver
Ride --> Payment

MatchingStrategy <|.. DistanceBasedMatching
FareStrategy <|.. StandardFare
FareStrategy <|.. SurgeFare
