'use server';

import { UserFactory } from '@/lib/patterns/UserFactory';
import { rideRepository, userRepository } from '@/lib/repositories/Database';
import { rideService } from '@/lib/services/RideService';
import { SurgeFare } from '@/lib/patterns/FareStrategy';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Driver } from '@/lib/domain/User';

// Mock Seed Function
export async function seedDatabase() {
  if (userRepository.findAll().length > 0) return;

  const admin = UserFactory.createAdmin('a1', 'Admin', 'admin@miniuber.com');
  const rider = UserFactory.createRider('r1', 'Alice', 'alice@miniuber.com');
  const driver1 = UserFactory.createDriver('d1', 'Bob', 'bob@miniuber.com', { type: 'Sedan', licensePlate: 'XYZ-123' }, true);
  const driver2 = UserFactory.createDriver('d2', 'Charlie', 'charlie@miniuber.com', { type: 'SUV', licensePlate: 'ABC-789' }, false);

  // Add random locations to drivers
  driver1.updateLocation(40.7130, -74.0070);
  driver2.updateLocation(40.7150, -74.0100);

  userRepository.save(admin);
  userRepository.save(rider);
  userRepository.save(driver1);
  userRepository.save(driver2);
}

export async function loginAction(userId: string) {
  (await cookies()).set('activeUserId', userId, { path: '/' });
  revalidatePath('/');
}

export async function logoutAction() {
  (await cookies()).delete('activeUserId');
  revalidatePath('/');
}

export async function getActiveUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('activeUserId')?.value;
  if (!userId) return null;
  const user = userRepository.findById(userId);
  return user ? serialize(user) : null;
}

// Map class getters since plain objects are pushed to frontend
function serialize(obj: any) {
  if (obj === undefined || obj === null) return null;
  return JSON.parse(JSON.stringify(obj));
}

export async function getRiderData(riderId: string) {
  const rider = userRepository.findById(riderId);
  const activeRide = rideRepository.findActiveRidesByRiderId(riderId);
  return { 
    rider: serialize(rider), 
    activeRide: activeRide ? { ...serialize(activeRide), status: activeRide.getStatus() } : null 
  };
}

export async function requestRideAction(riderId: string, pickupLat: number, pickupLng: number, dropLat: number, dropLng: number, isSurge: boolean = false) {
  try {
    if (isSurge) {
       rideService.setFareStrategy(new SurgeFare(2.0)); // 2x surge
    } else {
       rideService.setFareStrategy(); // resets to default standard fare
    }

    const ride = rideService.requestRide(
      riderId, 
      { lat: pickupLat, lng: pickupLng, address: 'Pickup Location' },
      { lat: dropLat, lng: dropLng, address: 'Drop Location' }
    );
    
    // Simulate finding a matching driver async
    setTimeout(() => {
      try {
         rideService.matchDriver(ride.id);
      } catch (e) {
         console.log('No drivers matched');
      }
    }, 2000);

    revalidatePath('/rider');
    return { success: true, rideId: ride.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getDriverData(driverId: string) {
  const driver = userRepository.findById(driverId);
  const rides = rideRepository.findAll();
  
  // A driver can see REQUESTED rides if they are close, but here we just list all requested rides
  // and the ones assigned to them
  const availableRides = rides.filter(r => r.getStatus() === 'REQUESTED');
  const activeRide = rideRepository.findActiveRidesByDriverId(driverId);

  return {
    driver: serialize(driver),
    availableRides: availableRides.map(r => ({ ...serialize(r), status: r.getStatus() })),
    activeRide: activeRide ? { ...serialize(activeRide), status: activeRide.getStatus() } : null
  };
}

export async function acceptRideAction(driverId: string, rideId: string) {
  try {
    // If it's REQUESTED, simulate assigning it first (if matched by the driver) -> usually handled by matchDriver
    const ride = rideRepository.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    if (ride.getStatus() === 'REQUESTED') {
      const driver = userRepository.findById(driverId);
      ride.assignDriver(driver as any);
      rideRepository.save(ride);
    }
    
    rideService.acceptRide(driverId, rideId);
    revalidatePath('/driver');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function completeRideAction(rideId: string) {
  try {
    rideService.completeRide(rideId);
    revalidatePath('/driver');
    revalidatePath('/rider');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitRatingAction(driverId: string, score: number) {
  try {
    const driver = userRepository.findById(driverId) as Driver;
    if (driver) {
       driver.addRating(score);
       userRepository.save(driver);
    }
    revalidatePath('/rider');
    return { success: true };
  } catch(err: any) {
    return { success: false };
  }
}

// Admin Actions
export async function getAdminData() {
  const users = userRepository.findAll();
  const rides = rideRepository.findAll();
  return {
    users: users.map(serialize),
    rides: rides.map(serialize)
  };
}

export async function approveDriverAction(driverId: string, isApproved: boolean) {
   const driver = userRepository.findById(driverId) as Driver;
   if (driver) {
      driver.isApproved = isApproved;
      userRepository.save(driver);
   }
   revalidatePath('/admin');
}

