
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ottawa Home Hub — Real Estate Data, AI Guide & Concierge',
  description: 'Ottawa real estate market data, buyer/seller AI guide for Ontario, and a vetted concierge marketplace for staging, cleaning, photos, inspectors, and more.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="inner">
            <div className="brand">
              <div className="logo" aria-hidden="true"></div>
              <div>
                <h1 className="title">Ottawa Home Hub</h1>
                <p className="subtitle">Real Estate • Data • Concierge</p>
              </div>
            </div>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="inner">
            <p>© {new Date().getFullYear()} Ottawa Home Hub • Realtor-Developer</p>
            <p className="muted" style={{fontSize:12}}>Information is for general guidance. Verify with official sources (OREB/CREA, school boards, City of Ottawa). Not legal or tax advice.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
