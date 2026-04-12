import { getDriverData, acceptRideAction, completeRideAction } from '../actions';
import LiveMap from '../components/LiveMap';
import { redirect } from 'next/navigation';

export default async function DriverPage() {
  const driverId = 'd1'; // Mocked. Should come from auth.
  const { driver, availableRides, activeRide } = await getDriverData(driverId);
  if (!driver) redirect('/login');

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Driver Hub, <span className="gradient-text">{driver.name}</span></h2>
          {driver.isApproved ? <p>Accept rides and earn.</p> : <p style={{ color: 'var(--warning)' }}>Pending Admin Approval.</p>}
        </div>
        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', gap: '20px' }}>
          <span>Rating: <strong>★{driver.totalRatings === 0 ? '5.0' : (driver.totalScore/driver.totalRatings).toFixed(1)}</strong></span>
          <span>Status: <strong style={{ color: driver.isAvailable ? 'var(--success)' : 'var(--warning)'}}>{driver.isAvailable ? 'Available' : 'Busy'}</strong></span>
        </div>
      </div>

       <div className="grid-2">
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Live Map Monitor</h3>
          <div style={{ flexGrow: 1, marginTop: '20px' }}>
             <LiveMap activeRide={activeRide} driverLocation={driver.currentLocation} />
          </div>
        </div>

        <div className="glass-panel">
          <h3>Rides Configuration</h3>
          
          {!activeRide ? (
            <div style={{ marginTop: '20px' }}>
              {!driver.isApproved ? (
                 <p style={{ color: 'var(--warning)' }}>You cannot accept rides until an Admin approves your profile.</p>
              ) : availableRides.length === 0 ? (
                 <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
                    <p>No new ride requests right now.</p>
                 </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {availableRides.map((ride: any) => (
                     <div key={ride.id} style={{ border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong>Request: {ride.id}</strong>
                          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>${ride.fare.toFixed(2)}</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                          Distance matching assigns rides. This ride is matched if you are closest.
                        </p>
                        {/* We hide manual acceptance here since the MatchingEngine pushes it directly to MATCHED and assigns.
                            We actually check assigned ride in the logic below.
                         */}
                     </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assigned Ride ID: {activeRide.id}</span>
                  <span className={`badge badge-${activeRide.status.toLowerCase()}`}>{activeRide.status}</span>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ margin: 0, color: 'var(--text-primary)' }}><strong>Expected Fare:</strong> ${activeRide.fare.toFixed(2)}</p>
                </div>

                {activeRide.status === 'MATCHED' && (
                  <form action={async () => {
                     'use server';
                     await acceptRideAction(driver.id, activeRide.id);
                  }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Acknowledge & Start Ride</button>
                    <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '12px' }}>This will trigger the ongoing state transition.</p>
                  </form>
                )}

                {activeRide.status === 'ONGOING' && (
                  <form action={async () => {
                     'use server';
                     await completeRideAction(activeRide.id);
                  }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--success)' }}>Complete Ride & Receive Payment</button>
                  </form>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
