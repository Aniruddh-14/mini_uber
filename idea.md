# Mini Uber – Ride Booking System

## Project Overview
Mini Uber is a full-stack ride-booking application that simulates core backend functionalities of a real-world ride-hailing system.

The focus of this project is backend system design using OOP principles, clean architecture, and proper database modeling.

---

## Scope

This project will support:

- Rider registration & login
- Driver registration & approval
- Ride request & driver matching
- Fare calculation
- Ride lifecycle management
- Payment processing (mocked)
- Rating system
- Admin monitoring

---

## Key Features

### 1. User Management
- Register as Rider or Driver
- Secure authentication
- Profile management

### 2. Ride Booking
- Rider requests ride
- System finds nearest available driver
- Driver accepts/rejects ride

### 3. Matching Engine
- Distance-based driver matching
- Driver availability tracking
- Strategy Pattern for matching logic

### 4. Ride Lifecycle Management
Ride States:
REQUESTED → MATCHED → ONGOING → COMPLETED → CANCELLED

State Pattern will be used.

### 5. Fare Calculation
- Base fare
- Distance fare
- Time fare
- Surge pricing (Strategy Pattern)

### 6. Payment System
- Mock payment processing
- Ride payment status tracking

### 7. Rating System
- Rider rates driver
- Driver rates rider

---

## Backend Architecture

Controller Layer  
↓  
Service Layer  
↓  
Repository Layer  
↓  
Database  

---

## Design Patterns Used

- Strategy Pattern (Matching & Fare calculation)
- State Pattern (Ride status)
- Factory Pattern (User creation)
- Repository Pattern (Data access)

---

## Tech Stack

Frontend: React  
Backend: Node.js / Java / Spring Boot (TBD)  
Database: PostgreSQL / MySQL  
