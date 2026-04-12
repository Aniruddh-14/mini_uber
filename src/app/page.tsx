import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>
        Next Generation <br/> <span className="gradient-text">Ride Orchestration</span>
      </h1>
      <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 40px' }}>
        Experience the power of advanced backend design, executing complex matching routing and OOP patterns all under a sleek glassmorphic UI.
      </p>
      
      <div className="grid-2" style={{ maxWidth: '800px', margin: '0 auto', gap: '40px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3>👤 For Riders</h3>
          <p style={{ margin: '20px 0' }}>Request rides instantly, see dynamic pricing powered by Strategy pattern, and track your active ride State.</p>
          <Link href="/rider" className="btn btn-primary">Open Rider Panel</Link>
        </div>
        
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3>🚗 For Drivers</h3>
          <p style={{ margin: '20px 0' }}>Accept rides dynamically, simulate ride completion, and experience automatic fare calculation.</p>
          <Link href="/driver" className="btn btn-primary" style={{ background: '#10b981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>Open Driver Panel</Link>
        </div>
      </div>
    </div>
  );
}
