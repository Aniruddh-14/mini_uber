import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { getActiveUser, logoutAction, seedDatabase } from './actions';

export const metadata: Metadata = {
  title: 'Mini Uber | Project Premium',
  description: 'OOP-driven Full-stack Ride Booking System',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await seedDatabase();
  const activeUser = await getActiveUser();

  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav className="navbar">
            <Link href="/" className="logo">
              🚕 <span className="gradient-text">Mini Uber</span>
            </Link>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/rider" className="nav-link">Rider View</Link>
              <Link href="/driver" className="nav-link">Driver View</Link>
              <Link href="/admin" className="nav-link" style={{ color: 'var(--accent-primary)' }}>Admin View</Link>
              
              {activeUser ? (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: '0.875rem' }}>Logged in as: <strong>{activeUser.name}</strong></span>
                    <form action={async () => { 'use server'; await logoutAction(); }}>
                       <button type="submit" style={{ background: 'transparent', border: '1px solid var(--warning)', color: 'var(--warning)', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Logout</button>
                    </form>
                 </div>
              ) : (
                 <Link href="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Login</Link>
              )}
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
