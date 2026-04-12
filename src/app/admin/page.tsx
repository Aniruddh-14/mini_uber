import { getAdminData, approveDriverAction, seedDatabase } from '../actions';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  await seedDatabase();
  const { users, rides } = await getAdminData();
  
  const drivers = users.filter((u: any) => u.role === 'driver');
  const totalFares = rides.reduce((sum: number, r: any) => sum + r.fare, 0);

  return (
    <div>
       <div style={{ marginBottom: '40px' }}>
          <h2>Admin <span className="gradient-text">Operations Center</span></h2>
          <p>Global monitor of rides, revenue, and driver approvals.</p>
       </div>

       <div className="grid-2" style={{ marginBottom: '40px' }}>
         <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '3rem', color: 'var(--success)' }}>${totalFares.toFixed(2)}</h3>
            <p>Total Estimated Revenue</p>
         </div>
         <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '3rem', color: 'var(--accent-primary)' }}>{rides.length}</h3>
            <p>Total Rides Requested</p>
         </div>
       </div>

       <div className="glass-panel" style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>Driver Approvals</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                 <th style={{ padding: '12px' }}>Name</th>
                 <th style={{ padding: '12px' }}>Vehicle</th>
                 <th style={{ padding: '12px' }}>Rating</th>
                 <th style={{ padding: '12px' }}>Action</th>
               </tr>
            </thead>
            <tbody>
              {drivers.map((d: any) => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                   <td style={{ padding: '12px' }}>{d.name}</td>
                   <td style={{ padding: '12px' }}>{d.vehicleDetails.type}</td>
                   <td style={{ padding: '12px' }}>{d.totalRatings === 0 ? 'New' : `${(d.totalScore / d.totalRatings).toFixed(1)} / 5.0`}</td>
                   <td style={{ padding: '12px' }}>
                      <form action={async () => {
                         'use server';
                         await approveDriverAction(d.id, !d.isApproved);
                      }}>
                         <button type="submit" className={`btn ${d.isApproved ? 'btn-secondary' : 'btn-primary'}`} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                           {d.isApproved ? 'Revoke Approval' : 'Approve Driver'}
                         </button>
                      </form>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
}
