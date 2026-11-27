import React, { useState } from 'react';

export const SkoolaFooter: React.FC = () => {
  const [name, setName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D85FD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <footer className="sk-footer">
      <div className="sk-container">
        {/* Overlapping White Newsletter Card (Elementor 4449f40 with margin-top: -5em & 5px Blue Top Border) */}
        <div className="sk-newsletter-overlap-card">
          <div style={{ flex: '1 1 440px', maxWidth: 560 }}>
            <h3
              style={{
                fontFamily: 'var(--sk-font-heading)',
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                fontWeight: 700,
                color: '#252525',
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Receive school updates, parent workshop invitations, admissions notifications, and student achievement highlights from Astra Novas.
            </h3>
          </div>

          <div style={{ flex: '1 1 320px', maxWidth: 420 }}>
            {subscribed ? (
              <div
                style={{
                  background: '#F5F5F7',
                  borderLeft: '4px solid #0D85FD',
                  padding: '18px 20px',
                  borderRadius: 5,
                  color: '#012951',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                ✓ Thank you{name ? `, ${name}` : ''}! You are now subscribed to Astranovas updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: 5,
                      border: '1px solid #DCDDE8',
                      background: '#F5F5F7',
                      color: '#252525',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: 5,
                      border: '1px solid #DCDDE8',
                      background: '#F5F5F7',
                      color: '#252525',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="sk-btn"
                  style={{ width: '100%', padding: '12px 24px' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Main Columns (40% / 20% / 20% / 20%) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr 1.2fr',
            gap: 36,
            paddingBottom: 36,
          }}
          className="sk-footer-cols"
        >
          {/* Col 1: Brand & Bio */}
          <div style={{ paddingRight: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <img
                src="./assets/astra-novas-logo.jpg"
                alt="Astra Novas International School"
                style={{
                  height: 58,
                  width: 58,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--sk-font-heading)',
                    fontSize: '21px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.15,
                  }}
                >
                  ASTRA NOVAS
                </div>
                <div
                  style={{
                    fontFamily: 'var(--sk-font-heading)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: '#EA6645',
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                  }}
                >
                  International School
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginTop: 2 }}>
                  Potential to Radiance
                </div>
              </div>
            </div>
            <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', marginBottom: 22 }}>
              To nurture a generation of happy, confident and compassionate individuals who believe in themselves, embrace possibilities and have the courage to make a difference in the world.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' },
                { label: 'X-Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' },
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href="https://astranovasschool.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={soc.label}
                  className="sk-anim-pop"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 5,
                    background: 'rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d={soc.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: About Astranovas */}
          <div>
            <h4 className="sk-footer-title">About Astranovas</h4>
            <div className="sk-footer-divider" />
            <ul className="sk-footer-links">
              <li className="sk-footer-link"><a href="./about.html"><ChevronIcon /> About us</a></li>
              <li className="sk-footer-link"><a href="./faculties.html"><ChevronIcon /> Leadership</a></li>
              <li className="sk-footer-link"><a href="./contact.html"><ChevronIcon /> Careers</a></li>
              <li className="sk-footer-link"><a href="./academics.html"><ChevronIcon /> News & Article</a></li>
              <li className="sk-footer-link"><a href="./about.html"><ChevronIcon /> Legal Notice</a></li>
            </ul>
          </div>

          {/* Col 3: Helpful Links */}
          <div>
            <h4 className="sk-footer-title">Helpful Links</h4>
            <div className="sk-footer-divider" />
            <ul className="sk-footer-links">
              <li className="sk-footer-link"><a href="./academics.html"><ChevronIcon /> Academics</a></li>
              <li className="sk-footer-link"><a href="./faculties.html"><ChevronIcon /> Faculties</a></li>
              <li className="sk-footer-link"><a href="./contact.html"><ChevronIcon /> How to Apply</a></li>
              <li className="sk-footer-link"><a href="./about.html"><ChevronIcon /> Campus Life</a></li>
              <li className="sk-footer-link"><a href="./contact.html"><ChevronIcon /> Contact us</a></li>
            </ul>
          </div>

          {/* Col 4: Get in touch */}
          <div>
            <h4 className="sk-footer-title">Get in touch</h4>
            <div className="sk-footer-divider" />
            <ul className="sk-footer-links" style={{ gap: 14 }}>
              <li className="sk-footer-link" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D85FD" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 3 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ fontSize: '14.5px', color: '#FFFFFF', lineHeight: 1.5 }}>
                  Near Toll Gate, Gantyada, Vizianagaram, AP – 535215
                </span>
              </li>
              <li className="sk-footer-link" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D85FD" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:admissions@astranovasschool.com">admissions@astranovasschool.com</a>
              </li>
              <li className="sk-footer-link" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D85FD" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+918188848787">+91 81888 48787 / 58787</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar (Elementor 169814a) */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: '13.5px',
            color: '#FFFFFF',
          }}
        >
          <div>
            Copyright © 2026 Astranovas International School, Vizianagaram. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="./about.html" style={{ color: '#FFFFFF' }}>Term of use</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="./about.html" style={{ color: '#FFFFFF' }}>Privacy Policy</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="./contact.html" style={{ color: '#FFFFFF' }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
