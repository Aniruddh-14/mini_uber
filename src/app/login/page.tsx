import { loginAction } from '../actions';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <h1 style={{ marginBottom: '20px' }}>Simulate <span className="gradient-text">Authentication</span></h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Choose a user profile to interact with the system.
      </p>

      <div className="grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={async () => { 'use server'; await loginAction('r1'); redirect('/rider'); }} className="glass-panel" style={{ cursor: 'pointer' }}>
          <h3>Alice (Rider)</h3>
          <p style={{ margin: '12px 0' }}>Request rides, track status, and rate drivers.</p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login as Rider</button>
        </form>

        <form action={async () => { 'use server'; await loginAction('d1'); redirect('/driver'); }} className="glass-panel" style={{ cursor: 'pointer' }}>
          <h3>Bob (Driver - Sedan)</h3>
          <p style={{ margin: '12px 0' }}>Accept rides, complete trips, update availability.</p>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Login as Driver</button>
        </form>

         <form action={async () => { 'use server'; await loginAction('d2'); redirect('/driver'); }} className="glass-panel" style={{ cursor: 'pointer' }}>
          <h3>Charlie (Driver - SUV)</h3>
          <p style={{ margin: '12px 0' }}>Pending Approval status. Accept rides.</p>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Login as Driver 2</button>
        </form>

        <form action={async () => { 'use server'; await loginAction('a1'); redirect('/admin'); }} className="glass-panel" style={{ cursor: 'pointer' }}>
          <h3>Admin Panel</h3>
          <p style={{ margin: '12px 0' }}>Monitor traffic and approve new drivers.</p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#64748b' }}>Login as Admin</button>
        </form>
      </div>
    </div>
  );
}
