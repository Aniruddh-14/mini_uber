import { getRiderData, requestRideAction, submitRatingAction } from '../actions';
import LiveMap from '../components/LiveMap';
import { redirect } from 'next/navigation';

export default async function RiderPage() {
  const { rider, activeRide } = await getRiderData('r1'); // For demo we hardcode r1, normally fetch from cookie
  if (!rider) redirect('/login');

  const DUMMY_LAT = 40.7128;
  const DUMMY_LNG = -74.0060;
  
  // A newly completed ride with no rating given? 
  // Normally we would mark the rating in the state, but we'll show rating if COMPLETED and we mock the display
  const needsRating = activeRide && activeRide.status === 'COMPLETED';

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Welcome back, <span className="gradient-text">{rider.name}</span></h2>
          <p>Book your next ride today.</p>
        </div>
        <div className="glass-panel" style={{ padding: '12px 24px' }}>
          Rider ID: <strong>{rider.id}</strong>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3>Request a Ride</h3>
          {needsRating ? (
             <div style={{ textAlign: 'center', padding: '20px 0' }}>
               <h4 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Trip Completed!</h4>
               <p>Please rate your driver to continue using Mini Uber.</p>
               <form action={async (formData) => {
                  'use server';
                  const score = Number(formData.get('rating'));
                  await submitRatingAction(activeRide.driver.id, score);
               }} style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
                  {[1,2,3,4,5].map(star => (
                     <button key={star} name="rating" value={star} type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '1.2rem' }}>⭐ {star}</button>
                  ))}
               </form>
             </div>
          ) : (
            <form action={async (formData) => {
               'use server';
               const isSurge = formData.get('rideType') === 'surge';
               await requestRideAction(rider.id, DUMMY_LAT, DUMMY_LNG, DUMMY_LAT + 0.03, DUMMY_LNG + 0.03, isSurge);
            }}>
              <div style={{ marginTop: '20px' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pickup Location</label>
                <input type="text" readOnly value="Central Park, NY" className="input-field" disabled/>
              </div>
               <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Drop Location</label>
                <input type="text" readOnly value="Times Square, NY" className="input-field" disabled/>
              </div>

              <div style={{ margin: '20px 0', padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                 <p style={{ marginBottom: '12px', fontWeight: 600 }}>Select Ride Type</p>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', cursor: 'pointer' }}>
                   <input type="radio" name="rideType" value="standard" defaultChecked />
                   <div>
                     <p style={{ margin: 0 }}>UberX (Standard)</p>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estimated Fare: $5.00 Base + Distance</p>
                   </div>
                 </label>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                   <input type="radio" name="rideType" value="surge" />
                   <div>
                     <p style={{ margin: 0 }}>Uber Premium (Surge x2)</p>
                     <p style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>Heavy traffic expected. High availability.</p>
                   </div>
                 </label>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={!!activeRide}>
                {activeRide ? 'Ride in Progress' : 'Request Mini Uber'}
              </button>
            </form>
          )}
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Live Map Tracking</h3>
          <div style={{ flexGrow: 1, marginTop: '20px' }}>
             <LiveMap activeRide={activeRide} driverLocation={activeRide?.driver?.currentLocation || null} />
          </div>

          {activeRide && !needsRating && (
             <div style={{ marginTop: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ride ID: {activeRide.id}</span>
                 <span className={`badge badge-${activeRide.status.toLowerCase()}`}>{activeRide.status}</span>
               </div>
               
               <div style={{ display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                 <div style={{ flex: 1 }}>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fare</p>
                   <p style={{ margin: 0, fontWeight: 600 }}>${activeRide.fare.toFixed(2)}</p>
                 </div>
                 {activeRide.driver && (
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Driver</p>
                      <p style={{ margin: 0, fontWeight: 600 }}>{activeRide.driver.name} (★{activeRide.driver.totalRatings === 0 ? '5.0' : (activeRide.driver.totalScore/activeRide.driver.totalRatings).toFixed(1)})</p>
                    </div>
                 )}
               </div>

               {/* Simple UI logic based on State Pattern Enum status */}
               <div style={{ marginTop: '16px' }}>
                  {activeRide.status === 'REQUESTED' && <p style={{ color: 'var(--warning)', fontSize: '0.875rem' }}>⏳ Matching strategy is looking for drivers...</p>}
                  {activeRide.status === 'MATCHED' && <p style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>🚗 Driver assigned! Waiting for driver to start.</p>}
                  {activeRide.status === 'ONGOING' && <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>🛣️ Ride is ongoing. You are on your way.</p>}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
