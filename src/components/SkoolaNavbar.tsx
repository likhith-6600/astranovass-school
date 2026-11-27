import React, { useState } from 'react';

export type PageId = 'home' | 'about' | 'academics' | 'faculties' | 'contact';

interface SkoolaNavbarProps {
  currentPage: PageId;
  onOpenEnquiry?: () => void;
}

export const SkoolaNavbar: React.FC<SkoolaNavbarProps> = ({ currentPage, onOpenEnquiry }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Bar (Skoola Dark Navy Header Top) */}
      <div className="sk-topbar">
        <div className="sk-container">
          <div className="sk-topbar-inner">
            <div className="sk-topbar-info">
              <a href="tel:+918188848787" className="sk-topbar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sk-coral)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+91 81888 48787 / 58787</span>
              </a>
              <a href="mailto:admissions@astranovasschool.com" className="sk-topbar-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sk-coral)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>admissions@astranovasschool.com</span>
              </a>
            </div>

            <div className="sk-topbar-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar (Skoola Dark Navy Bar with Overline Pointer) */}
      <header className="sk-navbar">
        <div className="sk-container">
          <div className="sk-navbar-inner">
            {/* Logo */}
            <a href="./index.html" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src="./assets/astra-novas-logo.jpg"
                alt="Astra Novas International School Crest"
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span
                  style={{
                    fontFamily: 'var(--sk-font-heading)',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '0.5px',
                  }}
                >
                  ASTRA NOVAS
                </span>
                <span
                  style={{
                    fontFamily: 'var(--sk-font-heading)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#EA6645',
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                  }}
                >
                  International School
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="sk-desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
              <ul className="sk-nav-menu">
                <li className={`sk-nav-item ${currentPage === 'home' ? 'active' : ''}`}>
                  <a href="./index.html" className="sk-nav-link">
                    Homepage
                  </a>
                </li>
                <li className={`sk-nav-item ${currentPage === 'about' ? 'active' : ''}`}>
                  <a href="./about.html" className="sk-nav-link">
                    About us
                  </a>
                </li>
                <li className={`sk-nav-item ${currentPage === 'academics' ? 'active' : ''}`}>
                  <a href="./academics.html" className="sk-nav-link">
                    Academics
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <ul className="sk-dropdown">
                    <li className="sk-dropdown-item"><a href="./academics.html#early-years">Early Years (Ages 3–6)</a></li>
                    <li className="sk-dropdown-item"><a href="./academics.html#primary">Primary Years (Grades 1–5)</a></li>
                    <li className="sk-dropdown-item"><a href="./academics.html#middle">Middle School (Grades 6–8)</a></li>
                    <li className="sk-dropdown-item"><a href="./academics.html#senior">Senior Secondary (Grades 9–12)</a></li>
                    <li className="sk-dropdown-item"><a href="./academics.html#cambridge">Cambridge Curriculum</a></li>
                  </ul>
                </li>
                <li className={`sk-nav-item ${currentPage === 'faculties' ? 'active' : ''}`}>
                  <a href="./faculties.html" className="sk-nav-link">
                    Faculties
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <ul className="sk-dropdown">
                    <li className="sk-dropdown-item"><a href="./faculties.html#science">Engineering & Robotics</a></li>
                    <li className="sk-dropdown-item"><a href="./faculties.html#humanities">Arts & Humanities</a></li>
                    <li className="sk-dropdown-item"><a href="./faculties.html#sports">Sports & Physical Culture</a></li>
                    <li className="sk-dropdown-item"><a href="./faculties.html#faculty-members">Faculty Directory</a></li>
                  </ul>
                </li>
                <li className={`sk-nav-item ${currentPage === 'contact' ? 'active' : ''}`}>
                  <a href="./contact.html" className="sk-nav-link">
                    Contact us
                  </a>
                </li>
                <li className="sk-nav-item">
                  <a href="./about.html#pages" className="sk-nav-link">
                    Pages
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <ul className="sk-dropdown">
                    <li className="sk-dropdown-item"><a href="./about.html#admissions">How to Apply</a></li>
                    <li className="sk-dropdown-item"><a href="./faculties.html#leadership">Staff & Faculty</a></li>
                    <li className="sk-dropdown-item"><a href="./about.html#campus-tour">Campus Tour</a></li>
                    <li className="sk-dropdown-item"><a href="./contact.html#faq">Admissions FAQ</a></li>
                  </ul>
                </li>
              </ul>
            </nav>

            {/* Right CTA Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                type="button"
                onClick={onOpenEnquiry}
                className="sk-btn sk-btn-coral"
                style={{ padding: '12px 28px', fontSize: '15px', fontWeight: 600, borderRadius: 50 }}
              >
                Admission
              </button>

              {/* Mobile Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  display: 'none',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
                className="sk-mobile-toggle"
                aria-label="Toggle Navigation"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div style={{ background: '#012951', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href="./index.html" style={{ fontWeight: 700, color: '#FFFFFF' }}>Homepage</a>
              <a href="./about.html" style={{ fontWeight: 700, color: '#FFFFFF' }}>About us</a>
              <a href="./academics.html" style={{ fontWeight: 700, color: '#FFFFFF' }}>Academics</a>
              <a href="./faculties.html" style={{ fontWeight: 700, color: '#FFFFFF' }}>Faculties</a>
              <a href="./contact.html" style={{ fontWeight: 700, color: '#FFFFFF' }}>Contact us</a>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); if (onOpenEnquiry) onOpenEnquiry(); }}
                className="sk-btn sk-btn-coral"
                style={{ width: '100%', marginTop: 8 }}
              >
                Admission
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
