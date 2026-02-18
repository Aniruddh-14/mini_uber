# ER Diagram

```mermaid
erDiagram

USER {
    int id PK
    string name
    string email
    string password
    string role
}

DRIVER {
    int id PK
    int user_id FK
    string vehicle_number
    string vehicle_type
    boolean is_available
}

RIDE {
    int id PK
    int rider_id FK
    int driver_id FK
    string status
    string pickup_location
    string drop_location
    float fare
}

PAYMENT {
    int id PK
    int ride_id FK
    float amount
    string status
}

RATING {
    int id PK
    int ride_id FK
    int reviewer_id FK
    int reviewee_id FK
    int rating_value
    string comments
}

USER ||--o{ RIDE : books
USER ||--o{ RATING : gives
DRIVER ||--o{ RIDE : accepts
RIDE ||--|| PAYMENT : has
