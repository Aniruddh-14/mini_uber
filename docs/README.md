# 🚗 Mini Uber – Ride Booking System

Mini Uber is a full-stack ride-booking application that simulates the core backend functionality of a real-world ride-hailing platform.

This project focuses heavily on backend system design, object-oriented programming principles, clean architecture, and scalable service structure.

---

## 🚀 Project Overview

Mini Uber allows riders to request rides and get matched with nearby available drivers.  
The system manages ride lifecycle states, fare calculation, payment simulation, and ratings.

Admins can monitor and manage system activity.

The primary goal of this project is to demonstrate strong backend engineering and software design practices.

---

## 🎯 Key Features

### 👤 Authentication & Role Management
- Rider registration & login
- Driver registration & approval
- Admin login
- Role-based access control

### 📍 Ride Booking
- Rider requests ride (pickup & drop)
- System matches nearest available driver
- Driver accepts or rejects ride

### 🧠 Driver Matching Engine
- Distance-based driver allocation
- Availability tracking
- Strategy Pattern for flexible matching logic

### 💰 Fare Calculation Engine
Fare is calculated based on:
- Base fare
- Distance traveled
- Time taken
- Surge multiplier (optional)

Implemented using **Strategy Pattern**.

### 🔄 Ride Lifecycle Management (State Pattern)

