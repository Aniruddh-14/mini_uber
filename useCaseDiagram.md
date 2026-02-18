# Use Case Diagram

```mermaid
flowchart LR
    Rider((Rider))
    Driver((Driver))
    Admin((Admin))

    Rider -->|Register/Login| UC1[Manage Account]
    Rider -->|Request Ride| UC2[Request Ride]
    Rider -->|Cancel Ride| UC3[Cancel Ride]
    Rider -->|Make Payment| UC4[Make Payment]
    Rider -->|Rate Driver| UC5[Rate Driver]

    Driver -->|Register/Login| UC6[Manage Account]
    Driver -->|Accept/Reject Ride| UC7[Respond to Ride]
    Driver -->|Start Ride| UC8[Start Ride]
    Driver -->|End Ride| UC9[End Ride]
    Driver -->|Rate Rider| UC10[Rate Rider]

    Admin -->|Approve Driver| UC11[Approve Driver]
    Admin -->|View Reports| UC12[Monitor System]
