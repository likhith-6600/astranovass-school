import React, { useState, useEffect, useRef } from 'react';
import { SkoolaNavbar, PageId } from './components/SkoolaNavbar';
import { SkoolaFooter } from './components/SkoolaFooter';
import {
  CONTINUUM_STAGES,
} from '../../alternative-design/src/data/altSchoolData';

declare global {
  interface Window {
    __INITIAL_PAGE__?: PageId;
  }
}

function detectCurrentPage(): PageId {
  if (typeof window !== 'undefined') {
    if (window.__INITIAL_PAGE__) return window.__INITIAL_PAGE__;
    const path = window.location.pathname.toLowerCase();
    if (path.includes('about')) return 'about';
    if (path.includes('academics')) return 'academics';
    if (path.includes('faculties')) return 'faculties';
    if (path.includes('contact')) return 'contact';
  }
  return 'home';
}

/* ==========================================================================
   ELEMENTOR SCROLL-TRIGGERED ENTRANCE ANIMATION WRAPPER
   ========================================================================== */
interface RevealProps {
  anim?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const Reveal: React.FC<RevealProps> = ({
  anim = 'fadeInUp',
  delay = 0,
  className = '',
  style,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sk-reveal ${visible ? `sk-animated ${anim}` : ''} ${className}`}
      style={{
        ...style,
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   ELEMENTOR ANIMATED COUNTER WIDGET (counter.default)
   ========================================================================== */
interface CounterProps {
  toValue: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  title: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({
  toValue,
  decimals = 0,
  suffix = '',
  duration = 2000,
  title,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(eased * toValue);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, toValue, duration]);

  return (
    <div ref={ref} className="sk-sec6-counter-item">
      <div className="sk-counter-label">{title}</div>
      <div className="sk-counter-num">
        {val.toFixed(decimals)}
        {suffix}
      </div>
    </div>
  );
};

/* ==========================================================================
   ELEMENTSKIT ANIMATED PROGRESS BAR WIDGET (elementskit-progressbar.default)
   ========================================================================== */
interface SkillBarProps {
  title: string;
  percentage: number;
}

const AnimatedSkillBar: React.FC<SkillBarProps> = ({ title, percentage }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="sk-skillbar-item">
      <div className="sk-skillbar-header">
        <span className="sk-skillbar-title">{title}</span>
        <span className="sk-skillbar-pct">{active ? percentage : 0}%</span>
      </div>
      <div className="sk-skillbar-track">
        <div
          className="sk-skillbar-fill"
          style={{ width: active ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  );
};

export function SkoolaApp() {
  const currentPage = detectCurrentPage();
  const [modalOpen, setModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedFacultyDetail, setSelectedFacultyDetail] = useState<any | null>(null);
  const [expandedWhyIdx, setExpandedWhyIdx] = useState<number | null>(null);

  // Hero Ken Burns Slideshow State (5 Original Skoola Campus Slides, 5000ms duration)
  const heroSlides = [
    './assets/students-near-a-campus.jpg',
    './assets/three-young-college-students-is-reading-a-book-while-relaxing-sitting-on-grass-in-a-campus-park.jpg',
    './assets/education-graduation-and-people-concept-group-of-happy-international-students-.jpg',
    './assets/education-graduation-and-success-concept.jpg',
    './assets/happy-female-friends-talking-while-walking-in-a-hallway-at-the-university-.jpg',
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    grade: 'Primary Years (Grades 1–5)',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const faculties = [
    {
      id: 'arts',
      category: 'arts',
      title: 'Arts & Humanities Faculty',
      desc: 'Dapibus pellentesque suscipit augue lectus inceptos fames natoque',
      image: './assets/teacher-doing-lesson-of-paint-on-canvas-to-young-students-in-faculty-of-arts-university.jpg',
      badge: 'Visual & Fine Arts',
      details: 'Comprehensive fine arts studio with painting, pottery, theatre arts, and comparative literature seminars.',
    },
    {
      id: 'brain-sciences',
      category: 'science',
      title: 'Brain Sciences Faculty',
      desc: 'Dapibus pellentesque suscipit augue lectus inceptos fames natoque',
      image: './assets/student-engineer-assembling-robotic-arm-with-computer-in-technology-workshop-.jpg',
      badge: 'Cognitive & STEM',
      details: 'Equipped with cognitive research labs, robotics arms, AI prototyping, and neuro-biology workstations.',
    },
    {
      id: 'engineering',
      category: 'robotics',
      title: 'Engineering Sciences Faculty',
      desc: 'Dapibus pellentesque suscipit augue lectus inceptos fames natoque',
      image: './assets/group-of-happy-kids-with-their-african-american-female-science-teacher.jpg',
      badge: 'Applied Engineering',
      details: 'State-of-the-art maker laboratories with 3D additive printing, microcontrollers, and chemistry benches.',
    },
    {
      id: 'legal',
      category: 'legal',
      title: 'Laws Faculty',
      desc: 'Dapibus pellentesque suscipit augue lectus inceptos fames natoque',
      image: './assets/female-lawyer-is-holding-law-book-and-giving-advice-about-laws-a.jpg',
      badge: 'Debate & Jurisprudence',
      details: 'Moot court hall, Model United Nations, parliamentary debate, and constitutional ethics seminars.',
    },
    {
      id: 'math',
      category: 'science',
      title: 'Mathematical & Physical',
      desc: 'Dapibus pellentesque suscipit augue lectus inceptos fames natoque',
      image: './assets/rear-view-of-mature-teacher-talking-to-his-student-during-lecture-at-university-classroom-.jpg',
      badge: 'Pure & Applied Maths',
      details: 'Rigorous Olympiad mentoring in combinatorics, quantum physics demonstrations, and statistical computing.',
    },
    {
      id: 'social',
      category: 'arts',
      title: 'Social & Historical Sciences',
      desc: 'Dapibus pellentesque suscipit augue lectus inceptos fames natoque',
      image: './assets/multi-ethnic-group-of-university-students-in-lecture-hall-looking-at-camera-.jpg',
      badge: 'Global Economics',
      details: 'Macroeconomic simulations, world history archives, and international relations roundtables.',
    },
  ];

  const filteredFaculties =
    facultyFilter === 'all'
      ? faculties
      : faculties.filter((f) => f.category === facultyFilter);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      <SkoolaNavbar currentPage={currentPage} onOpenEnquiry={() => setModalOpen(true)} />

      {/* ADMISSION INQUIRY MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 15, 29, 0.78)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              padding: '40px 36px',
              maxWidth: 520,
              width: '100%',
              boxShadow: '0 25px 60px rgba(0, 15, 29, 0.35)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 20,
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#000F1D',
              }}
            >
              ✕
            </button>

            <span className="sk-eyebrow">ADMISSIONS 2026–2027</span>
            <h2 className="sk-h2" style={{ fontSize: '28px', marginBottom: 10 }}>
              Apply to Astranovas
            </h2>
            <p className="sk-p" style={{ fontSize: '15px', marginBottom: 24 }}>
              Register for the upcoming academic year. Our Admissions Counsellors will schedule your personal campus tour.
            </p>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', background: '#F5F5F7', borderRadius: 8 }}>
                <div style={{ fontSize: '48px', color: '#25D366', marginBottom: 14 }}>✓</div>
                <h3 className="sk-h3" style={{ fontSize: '22px' }}>Application Received</h3>
                <p className="sk-p" style={{ margin: 0 }}>
                  Thank you! Our Admissions Office will reach out at <strong>{formData.phone || '+91 81888 48787'}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setFormSubmitted(false); setModalOpen(false); }}
                  className="sk-btn"
                  style={{ marginTop: 20 }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  required
                  type="text"
                  placeholder="Parent / Guardian Full Name *"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  style={{
                    padding: '13px 16px',
                    borderRadius: 5,
                    border: '1px solid #DCDDE8',
                    fontFamily: 'var(--sk-font-body)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
                <input
                  required
                  type="tel"
                  placeholder="Primary Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    padding: '13px 16px',
                    borderRadius: 5,
                    border: '1px solid #DCDDE8',
                    fontFamily: 'var(--sk-font-body)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    padding: '13px 16px',
                    borderRadius: 5,
                    border: '1px solid #DCDDE8',
                    fontFamily: 'var(--sk-font-body)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="text"
                    placeholder="Child's Name"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    style={{
                      padding: '13px 16px',
                      borderRadius: 5,
                      border: '1px solid #DCDDE8',
                      fontFamily: 'var(--sk-font-body)',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    style={{
                      padding: '13px 16px',
                      borderRadius: 5,
                      border: '1px solid #DCDDE8',
                      fontFamily: 'var(--sk-font-body)',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#FFFFFF',
                    }}
                  >
                    <option>Early Years (Ages 3–6)</option>
                    <option>Primary Years (Grades 1–5)</option>
                    <option>Middle School (Grades 6–8)</option>
                    <option>Senior School (Grades 9–12)</option>
                  </select>
                </div>
                <button type="submit" className="sk-btn" style={{ width: '100%', marginTop: 8 }}>
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE VIDEO MODAL LIGHTBOX */}
      {videoModalOpen && (
        <div className="sk-video-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="sk-video-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="sk-video-close-btn"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close Video"
            >
              ✕
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                title="Astranovas Campus Tour Video"
                src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ padding: '22px 28px', background: '#000F1D', color: '#FFFFFF' }}>
              <span className="sk-eyebrow" style={{ color: '#EA6645', marginBottom: 4 }}>CAMPUS EXPERIENCE</span>
              <h3 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '19px', color: '#FFFFFF', margin: 0 }}>
                Astranovas International School — Transformative Education & Campus Tour
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE FACULTY DETAIL MODAL */}
      {selectedFacultyDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 15, 29, 0.78)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelectedFacultyDetail(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              maxWidth: 600,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedFacultyDetail(null)}
              style={{
                position: 'absolute',
                top: 14,
                right: 16,
                background: 'rgba(0,0,0,0.55)',
                border: 'none',
                color: '#FFFFFF',
                width: 34,
                height: 34,
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <img
              src={selectedFacultyDetail.image}
              alt={selectedFacultyDetail.title}
              style={{ width: '100%', height: 260, objectFit: 'cover' }}
            />
            <div style={{ padding: '28px 32px' }}>
              <span className="sk-eyebrow">{selectedFacultyDetail.badge}</span>
              <h2 className="sk-h2" style={{ fontSize: '26px', marginBottom: 12 }}>
                {selectedFacultyDetail.title}
              </h2>
              <p className="sk-p" style={{ fontSize: '15px', marginBottom: 16 }}>
                {selectedFacultyDetail.desc}
              </p>
              <div style={{ background: '#F5F5F7', padding: '16px 20px', borderRadius: 6, marginBottom: 24 }}>
                <strong style={{ color: '#012951', display: 'block', marginBottom: 6 }}>Curriculum & Facilities:</strong>
                <p style={{ margin: 0, fontSize: '14.5px', color: '#767676' }}>{selectedFacultyDetail.details}</p>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <button
                  type="button"
                  onClick={() => { setSelectedFacultyDetail(null); setModalOpen(true); }}
                  className="sk-btn"
                  style={{ flex: 1 }}
                >
                  Apply for this Stream
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFacultyDetail(null)}
                  className="sk-btn sk-btn-outline-coral"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING QUICK ENQUIRY WIDGET */}
      <a
        href="https://wa.me/918188848787?text=Hello%20Astranovas%20School%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
        target="_blank"
        rel="noreferrer"
        className="sk-floating-whatsapp"
        aria-label="Chat on WhatsApp"
        title="Quick Admissions WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.93.548 3.737 1.503 5.276L2 22l4.846-1.464a9.97 9.97 0 0 0 5.185 1.495h.005c5.536 0 10.031-4.495 10.031-10.031 0-2.679-1.043-5.197-2.937-7.091A9.97 9.97 0 0 0 12.031 2zm5.836 14.18c-.244.686-1.42 1.31-1.956 1.393-.536.083-1.238.118-2.003-.127a13.34 13.34 0 0 1-4.329-2.678 12.518 12.518 0 0 1-2.997-3.731c-.34-.587-.362-1.282-.02-1.84.341-.557.755-.705 1.018-.734.263-.03.528-.01.761.02.233.029.544-.088.851.644.308.732 1.05 2.565 1.144 2.75.093.186.155.405.031.65-.124.244-.186.398-.372.614-.186.216-.39.48-.557.644-.186.186-.38.388-.163.76.217.373.966 1.591 2.073 2.578 1.424 1.268 2.624 1.661 2.997 1.847.372.186.589.155.806-.093.217-.248.93-1.085 1.178-1.457.248-.372.496-.31.837-.186.341.124 2.167 1.022 2.539 1.208.372.186.62.279.713.434.093.155.093.9-.151 1.586z" />
        </svg>
      </a>

      <main style={{ flex: 1 }}>
        {/* ================================================================
            PAGE: HOMEPAGE (index.html) - ALL 15 SKOOLA SECTIONS & EFFECTS
            ================================================================ */}
        {currentPage === 'home' && (
          <div>
            {/* SECTION 2: HERO WITH KEN BURNS SLIDESHOW & HALFTONE OVERLAY (5efa7cc) */}
            <section className="sk-hero-full">
              {/* 5-Slide Ken Burns Background Gallery */}
              <div className="sk-hero-slideshow">
                {heroSlides.map((slideUrl, idx) => (
                  <div
                    key={slideUrl}
                    className={`sk-hero-slide ${idx === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url('${slideUrl}')` }}
                  />
                ))}
              </div>

              <div className="sk-hero-full-content">
                <div className="sk-hero-center-box">
                  <Reveal anim="fadeInUp" delay={0}>
                    <h1 className="sk-hero-h1-full">
                      Transformative<br />Education, Endless<br />Opportunities.
                    </h1>
                  </Reveal>
                  <Reveal anim="fadeInUp" delay={200}>
                    <p className="sk-hero-p-full">
                      Cursus morbi letius lacus sollicitudin blandit inceptos dis. Suscipit proin porta quis natoque aliquam sodales euismod ex convallis porttitor.
                    </p>
                  </Reveal>
                  <Reveal anim="fadeInUp" delay={300}>
                    <div>
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="sk-btn"
                        style={{ padding: '14px 34px', fontSize: '16px' }}
                      >
                        Discover more
                      </button>
                    </div>
                  </Reveal>
                </div>
              </div>

              {/* 3 Bottom Feature Cards Bar (cd691aa) */}
              <div className="sk-hero-features-wrap">
                <div className="sk-container">
                  <Reveal anim="fadeIn" delay={200}>
                    <div className="sk-hero-features-bar">
                      <div className="sk-hero-features-grid">
                        <div className="sk-hero-feature-item">
                          <div className="sk-hero-feature-title">Diverse Learning Community</div>
                          <p className="sk-hero-feature-desc">
                            Nibh purus maecenas vestibulum vulputate felis scelerisque dignissim inceptos taciti sociosqu massa
                          </p>
                        </div>

                        <div className="sk-hero-feature-item">
                          <div className="sk-hero-feature-title">Career Development Support</div>
                          <p className="sk-hero-feature-desc">
                            Nibh purus maecenas vestibulum vulputate felis scelerisque dignissim inceptos taciti sociosqu massa
                          </p>
                        </div>

                        <div className="sk-hero-feature-item">
                          <div className="sk-hero-feature-title">Strong Alumni Network</div>
                          <p className="sk-hero-feature-desc">
                            Nibh purus maecenas vestibulum vulputate felis scelerisque dignissim inceptos taciti sociosqu massa
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* SECTION 3: HANGING OWL RIBBON BADGE (d11ac0c) */}
            <div className="sk-badge-ribbon-row">
              <div className="sk-container">
                <div className="sk-badge-ribbon-inner">
                  <img src="./assets/badge.png" alt="Skoola Owl Crest Badge" />
                </div>
              </div>
            </div>

            {/* SECTION 4: STUDY AT SKOOLA 2x2 MOSAIC (GRAYSCALE->COLOR HOVER) + WHO WE ARE (9987ebc) */}
            <section className="sk-sec4-wrap">
              <div className="sk-container">
                <div className="sk-sec4-split">
                  {/* Left 55%: 2x2 Mosaic Grid */}
                  <div className="sk-sec4-left-grid">
                    {/* Box 1: Coral Card (fadeInLeft) */}
                    <Reveal anim="fadeInLeft" className="sk-mosaic-box sk-mosaic-coral">
                      <div className="sk-mosaic-content">
                        <h3 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '26px', fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
                          Study at Astranovas
                        </h3>
                        <p style={{ fontStyle: 'italic', fontSize: '16px', color: 'rgba(255,255,255,0.92)', marginBottom: 22, lineHeight: 1.45 }}>
                          Integer mi senectus maecenas pede facilisis praesent torquent
                        </p>
                        <button
                          type="button"
                          onClick={() => setModalOpen(true)}
                          className="sk-btn sk-btn-outline-white"
                          style={{ padding: '10px 22px', fontSize: '14px' }}
                        >
                          Discover more
                        </button>
                      </div>
                    </Reveal>

                    {/* Box 2: Grayscale->Color Photo Card (fadeInDown) */}
                    <Reveal anim="fadeInDown" className="sk-mosaic-box sk-mosaic-photo">
                      <div
                        className="sk-mosaic-photo-bg"
                        style={{ backgroundImage: "url('./assets/students-near-a-campus.jpg')" }}
                      />
                      <div className="sk-mosaic-content">
                        <h3 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginBottom: 18 }}>
                          Campus Life & Community
                        </h3>
                        <a
                          href="./about.html"
                          className="sk-btn sk-btn-outline-white"
                          style={{ padding: '10px 22px', fontSize: '14px' }}
                        >
                          Discover more
                        </a>
                      </div>
                    </Reveal>

                    {/* Box 3: Grayscale->Color Light Photo Card (fadeInUp) */}
                    <Reveal anim="fadeInUp" className="sk-mosaic-box sk-mosaic-photo sk-mosaic-light">
                      <div
                        className="sk-mosaic-photo-bg"
                        style={{ backgroundImage: "url('./assets/student-engineer-assembling-robotic-arm-with-computer-in-technology-workshop-.jpg')" }}
                      />
                      <div className="sk-mosaic-content">
                        <h3 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: 18 }}>
                          Academic excellence
                        </h3>
                        <a
                          href="./academics.html"
                          className="sk-btn"
                          style={{ padding: '10px 22px', fontSize: '14px' }}
                        >
                          Discover more
                        </a>
                      </div>
                    </Reveal>

                    {/* Box 4: Grayscale->Color Tint Photo Card (fadeInRight) */}
                    <Reveal anim="fadeInRight" className="sk-mosaic-box sk-mosaic-photo sk-mosaic-tint">
                      <div
                        className="sk-mosaic-photo-bg"
                        style={{ backgroundImage: "url('./assets/happy-female-friends-talking-while-walking-in-a-hallway-at-the-university-.jpg')" }}
                      />
                      <div className="sk-mosaic-content">
                        <h3 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: 18 }}>
                          Faculties & Schools
                        </h3>
                        <a
                          href="./faculties.html"
                          className="sk-btn"
                          style={{ padding: '10px 22px', fontSize: '14px' }}
                        >
                          Discover more
                        </a>
                      </div>
                    </Reveal>
                  </div>

                  {/* Right 45%: Who We Are (fadeInRight) */}
                  <Reveal anim="fadeInRight" className="sk-sec4-right-text">
                    <span className="sk-eyebrow">WHO WE ARE</span>
                    <h2 className="sk-h2">
                      Knowledge will bring you the opportunity to make a difference.
                    </h2>
                    <p className="sk-p" style={{ marginBottom: 28 }}>
                      Mus volutpat ultricies massa nec fusce. Massa ac porttitor nascetur auctor cursus himenaeos velit ligula justo torquent hac. Pede quisque augue iaculis auctor nisi. Tortor ligula mus elit pede risus luctus adipiscing nisl.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="sk-btn"
                      >
                        Apply Now
                      </button>
                      <a href="./about.html" className="sk-btn sk-btn-outline-coral">
                        Discover more
                      </a>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* SECTION 5: OUR VALUE — VISION & MISSION FLOATING CARDS (af672f4) */}
            <section className="sk-sec5-wrap">
              <div className="sk-container">
                <div className="sk-sec5-split">
                  <Reveal anim="fadeInLeft" className="sk-sec5-left">
                    <img
                      src="./assets/astra-novas-logo.jpg"
                      alt="Astra Novas — Potential to Radiance"
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        margin: '0 auto 18px',
                        boxShadow: '0 10px 28px rgba(1, 41, 81, 0.18)',
                      }}
                    />
                    <span className="sk-eyebrow">POTENTIAL TO RADIANCE</span>
                    <h2 className="sk-h2">Clear thinking makes a bright future.</h2>
                    <div style={{ width: 50, height: 2, background: '#DCDDE8', margin: '18px auto 0' }} />
                  </Reveal>

                  <div className="sk-sec5-right">
                    <Reveal anim="fadeInRight" delay={0} className="sk-value-card">
                      <div style={{ color: '#EA6645', marginBottom: 18 }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="6" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                      </div>
                      <h3 className="sk-h3">Our Vision</h3>
                      <p className="sk-p" style={{ margin: 0, fontSize: '15px', lineHeight: 1.65 }}>
                        “To nurture a generation of happy, confident and compassionate individuals who believe in themselves, embrace possibilities and have the courage to make a difference in the world.”
                      </p>
                    </Reveal>

                    <Reveal anim="fadeInRight" delay={200} className="sk-value-card">
                      <div style={{ color: '#EA6645', marginBottom: 18 }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      </div>
                      <h3 className="sk-h3">Our Mission</h3>
                      <p className="sk-p" style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65 }}>
                        “At Astra Novas, every child is welcomed, valued and encouraged to be their own unique self. We strive to create a happy, safe and caring environment where children feel a sense of belonging, are free to ask questions, explore their interests, discover their strengths and learn with joy. Through meaningful experiences, opportunities to explore and constant encouragement, we nurture curious minds, confident learners, independent thinkers and kind individuals who are prepared to embrace life's opportunities.”
                      </p>
                    </Reveal>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: THE STORY THROUGH DATA + ANIMATED COUNTERS (6b438b5) */}
            <section className="sk-sec6-wrap">
              <div className="sk-sec6-content">
                <div className="sk-container" style={{ marginBottom: '6em' }}>
                  <Reveal anim="fadeInLeft" style={{ maxWidth: 620 }}>
                    <h2
                      style={{
                        fontFamily: 'var(--sk-font-heading)',
                        fontSize: 'clamp(36px, 4.8vw, 61px)',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.05,
                        letterSpacing: '-1px',
                        marginBottom: 20,
                      }}
                    >
                      The Astranovas story through data
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: 28 }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="sk-btn"
                    >
                      Discover more
                    </button>
                  </Reveal>
                </div>

                {/* Bottom 3-Column Dark Counter Bar (1bc9b82) */}
                <div className="sk-container">
                  <Reveal anim="fadeIn" delay={200}>
                    <div className="sk-sec6-counter-bar">
                      <AnimatedCounter
                        toValue={91}
                        suffix="%"
                        title="Undergrads from State"
                      />
                      <AnimatedCounter
                        toValue={4.2}
                        decimals={1}
                        suffix="+"
                        title="Average years to degree for freshmen"
                      />
                      <AnimatedCounter
                        toValue={97}
                        suffix="%"
                        title="Freshman graduation rate"
                      />
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* SECTION 7: OVERVIEW & ICON BOXES WITH HOVER COLOR FLIP (7fefd10) */}
            <section style={{ padding: '7em 0', background: '#FFFFFF' }}>
              <div className="sk-container">
                <div className="sk-grid-2" style={{ alignItems: 'center', gap: 60 }}>
                  {/* Left Column (fadeInLeft) */}
                  <Reveal anim="fadeInLeft">
                    <span className="sk-eyebrow">OVERVIEW</span>
                    <h2 className="sk-h2">Navigating the Journey of Intellectual Growth.</h2>
                    <p className="sk-p" style={{ marginBottom: 32 }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>

                    <div>
                      {[
                        {
                          title: 'Personalized Learning Paths',
                          desc: 'Ad curae justo molestie vestibulum netus litora dolor ligula adipiscing.',
                        },
                        {
                          title: 'Critical Thinking Development',
                          desc: 'Ad curae justo molestie vestibulum netus litora dolor ligula adipiscing.',
                        },
                        {
                          title: 'Exploration of Diverse Perspectives',
                          desc: 'Ad curae justo molestie vestibulum netus litora dolor ligula adipiscing.',
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="sk-overview-item">
                          <div className="sk-overview-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <div>
                            <h4 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '19px', fontWeight: 700, color: '#252525', marginBottom: 6 }}>
                              {item.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '15px', color: '#767676' }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Reveal>

                  {/* Right Column Tall Image (fadeInRight) */}
                  <Reveal anim="fadeInRight">
                    <img
                      src="./assets/college-student-friends-in-the-campus-students-ready-to-start-academic-classes-of-their-university.jpg"
                      alt="Navigating the Journey of Intellectual Growth"
                      style={{
                        width: '100%',
                        height: 650,
                        objectFit: 'cover',
                        borderRadius: 5,
                        boxShadow: '0 20px 50px rgba(0, 15, 29, 0.12)',
                      }}
                    />
                  </Reveal>
                </div>
              </div>
            </section>

            {/* SECTION 8: 3 DEGREE CARDS WITH FLOATING BOTTOM ARROW ICON (1af50c4) */}
            <section style={{ padding: '2em 0 8em', background: '#FFFFFF' }}>
              <div className="sk-container">
                <div className="sk-grid-3">
                  {[
                    {
                      title: 'Master’s Degree Programs',
                      desc: 'Habitasse magnis dictum montes curae bibendum sed nunc',
                      image: './assets/students-near-a-campus.jpg',
                      anim: 'fadeInLeft' as const,
                    },
                    {
                      title: 'Bachelor’s Degree Programs',
                      desc: 'Habitasse magnis dictum montes curae bibendum sed nunc',
                      image: './assets/student-engineer-assembling-robotic-arm-with-computer-in-technology-workshop-.jpg',
                      anim: 'fadeInUp' as const,
                    },
                    {
                      title: 'Associate’s Degree Programs',
                      desc: 'Habitasse magnis dictum montes curae bibendum sed nunc',
                      image: './assets/asian-girl-student-online-learning-class-study-online-video-call-zoom-teacher-happy-asian-girl.jpg',
                      anim: 'fadeInRight' as const,
                    },
                  ].map((prog, idx) => (
                    <Reveal key={idx} anim={prog.anim} className="sk-degree-card">
                      <img src={prog.image} alt={prog.title} className="sk-degree-card-img" />
                      <div style={{ padding: '2.2em 2em 1.5em' }}>
                        <h3 className="sk-h3" style={{ fontSize: '21px', marginBottom: 12 }}>
                          {prog.title}
                        </h3>
                        <p className="sk-p" style={{ fontSize: '15px', margin: 0 }}>
                          {prog.desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="sk-degree-floating-btn"
                        aria-label={`Explore ${prog.title}`}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 9: SPLIT VIDEO CARD WITH RADIO-WAVE RIPPLE & QUOTE BANNER (f139454) */}
            <section className="sk-sec9-wrap">
              <div className="sk-container">
                <div className="sk-grid-2" style={{ alignItems: 'center', gap: 56 }}>
                  {/* Left 50%: Princeton Campus Video Card with 100px Multi-Ring Ripple Play Button */}
                  <Reveal anim="fadeInLeft">
                    <div className="sk-sec9-video-card">
                      <button
                        type="button"
                        className="sk-ekit-video-btn-100"
                        onClick={() => setVideoModalOpen(true)}
                        aria-label="Play Campus Video"
                      >
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4 }}>
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </button>
                    </div>
                  </Reveal>

                  {/* Right 50%: Quote & CTAs */}
                  <Reveal anim="fadeInRight">
                    <h2
                      style={{
                        fontFamily: 'var(--sk-font-heading)',
                        fontSize: 'clamp(28px, 3.6vw, 44px)',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.2,
                        marginBottom: 22,
                      }}
                    >
                      Live as if you were to die tomorrow. Learn as if you were to live forever.
                    </h2>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: '17px',
                        fontStyle: 'italic',
                        lineHeight: 1.65,
                        marginBottom: 32,
                      }}
                    >
                      Arcu nullam sollicitudin condimentum justo libero fringilla tellus augue tempus. Velit habitasse commodo habitant laoreet condimentum nisl maximus tellus ex. Luctus viverra montes si hac ligula maximus vitae proin placerat finibus volutpat.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="sk-btn"
                      >
                        Apply Now
                      </button>
                      <a href="./about.html" className="sk-btn sk-btn-outline-white">
                        Discover more
                      </a>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* SECTION 10: WHY CHOOSE US — 2-COL HEADER + 3x2 ICON BOX GRID (91c45c6) */}
            <section style={{ padding: '7em 0', background: 'var(--sk-bg-light)' }}>
              <div className="sk-container">
                {/* 2-Column Header with Bottom Border (adfc193) */}
                <div
                  className="sk-grid-2"
                  style={{
                    alignItems: 'flex-end',
                    paddingBottom: 32,
                    marginBottom: 48,
                    borderBottom: '1px solid #DCDDE8',
                  }}
                >
                  <Reveal anim="fadeInUp">
                    <span className="sk-eyebrow">WHY CHOOSE US</span>
                    <h2 className="sk-h2" style={{ margin: 0 }}>
                      Discover Why Our Campus is Your Gateway to Success.
                    </h2>
                  </Reveal>

                  <Reveal anim="fadeInUp" delay={200}>
                    <p className="sk-p" style={{ marginBottom: 20 }}>
                      Viverra vel rutrum arcu lobortis letius. Magnis a euismod ornare feugiat commodo dictum ultricies ultrices natoque. Vestibulum inceptos cursus sed vel aliquet aenean tellus posuere.
                    </p>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="sk-btn"
                    >
                      Discover more
                    </button>
                  </Reveal>
                </div>

                {/* 3x2 Icon Box Grid (cf48602) */}
                <Reveal anim="fadeIn" delay={200}>
                  <div className="sk-grid-3" style={{ gap: '3em' }}>
                    {[
                      {
                        title: 'Academic Excellence',
                        desc: 'Pellentesque felis eros fames id torquent molestie himenaeos.',
                        more: 'Cambridge international curriculum paired with individualised mentorship and conceptual inquiry.',
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#EA6645" strokeWidth="1.8">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                          </svg>
                        ),
                      },
                      {
                        title: 'Cutting-Edge Facilities',
                        desc: 'Pellentesque felis eros fames id torquent molestie himenaeos.',
                        more: 'Robotics studios, Olympic swimming pool, digital library, and modern science laboratories.',
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#EA6645" strokeWidth="1.8">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        ),
                      },
                      {
                        title: 'Diverse Learning Community',
                        desc: 'Pellentesque felis eros fames id torquent molestie himenaeos.',
                        more: 'Inclusive peer fellowship nurturing cultural appreciation, leadership, and empathy.',
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#EA6645" strokeWidth="1.8">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        ),
                      },
                      {
                        title: 'Career Development Support',
                        desc: 'Pellentesque felis eros fames id torquent molestie himenaeos.',
                        more: 'Dedicated university placement guidance, portfolio building, and global research internships.',
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#EA6645" strokeWidth="1.8">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                          </svg>
                        ),
                      },
                      {
                        title: 'Commitment to Sustainability',
                        desc: 'Pellentesque felis eros fames id torquent molestie himenaeos.',
                        more: '14-acre green estate powered by solar energy, organic orchards, and rainwater harvesting.',
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#EA6645" strokeWidth="1.8">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        ),
                      },
                      {
                        title: 'Student Support Services',
                        desc: 'Pellentesque felis eros fames id torquent molestie himenaeos.',
                        more: 'On-campus medical infirmary, certified student counsellors, and GPS-tracked transport.',
                        icon: (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#EA6645" strokeWidth="1.8">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        ),
                      },
                    ].map((feat, idx) => (
                      <div
                        key={idx}
                        onClick={() => setExpandedWhyIdx(expandedWhyIdx === idx ? null : idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 20,
                          cursor: 'pointer',
                        }}
                      >
                        <div className="sk-anim-pop" style={{ flexShrink: 0 }}>
                          {feat.icon}
                        </div>
                        <div>
                          <h3 className="sk-h3" style={{ fontSize: '20px', marginBottom: 8 }}>
                            {feat.title}
                          </h3>
                          <p className="sk-p" style={{ fontSize: '15px', margin: 0 }}>
                            {feat.desc}
                          </p>
                          {expandedWhyIdx === idx && (
                            <p style={{ marginTop: 10, fontSize: '14px', color: '#012951', fontWeight: 500 }}>
                              {feat.more}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>

            {/* SECTION 11: SKOOLA FACULTIES WITH -90px SLIDE-UP DRAWER ON HOVER (77ffe41) */}
            <section style={{ padding: '6em 0 7em', background: '#FFFFFF' }}>
              <div className="sk-container">
                {/* 2-Column Header with Bottom Border (8bb5cc1) */}
                <div
                  className="sk-grid-2"
                  style={{
                    alignItems: 'flex-end',
                    paddingBottom: 32,
                    marginBottom: 36,
                    borderBottom: '1px solid #DCDDE8',
                  }}
                >
                  <Reveal anim="fadeInUp">
                    <span className="sk-eyebrow">ASTRANOVAS FACULTIES</span>
                    <h2 className="sk-h2" style={{ margin: 0 }}>
                      Transformative Education, Endless Opportunities.
                    </h2>
                  </Reveal>

                  <Reveal anim="fadeInUp" delay={200}>
                    <p className="sk-p" style={{ marginBottom: 20 }}>
                      Viverra vel rutrum arcu lobortis letius. Magnis a euismod ornare feugiat commodo dictum ultricies ultrices natoque. Vestibulum inceptos cursus sed vel aliquet aenean tellus posuere.
                    </p>
                    <a href="./faculties.html" className="sk-btn">
                      Discover more
                    </a>
                  </Reveal>
                </div>

                {/* Interactive Filter Tabs */}
                <div className="sk-filter-tabs">
                  {[
                    { id: 'all', label: 'All Faculties' },
                    { id: 'arts', label: 'Arts & Humanities' },
                    { id: 'science', label: 'Brain & Mathematical Sciences' },
                    { id: 'robotics', label: 'Engineering Sciences' },
                    { id: 'legal', label: 'Laws Faculty' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`sk-filter-tab ${facultyFilter === tab.id ? 'active' : ''}`}
                      onClick={() => setFacultyFilter(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 3x2 Grid of Faculty Cards with -90px Slide-Up Hover Drawer */}
                <div className="sk-grid-3">
                  {filteredFaculties.map((fac) => (
                    <div key={fac.id} className="sk-faculty-slide-card">
                      <div style={{ overflow: 'hidden' }}>
                        <img
                          src={fac.image}
                          alt={fac.title}
                          className="sk-faculty-slide-img"
                        />
                      </div>

                      <div className="sk-faculty-slide-drawer">
                        {/* Floating Circular Chevron Badge (6693165) */}
                        <div className="sk-faculty-chevron-badge">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </div>

                        <h3 className="sk-h3" style={{ fontSize: '21px', marginBottom: 12 }}>
                          {fac.title}
                        </h3>
                        <p className="sk-p" style={{ fontSize: '15px', marginBottom: 24 }}>
                          {fac.desc}
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedFacultyDetail(fac)}
                          className="sk-btn"
                          style={{ padding: '11px 24px', fontSize: '14px' }}
                        >
                          <span>Learn more</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 12: OUR VALUE — ANIMATED PROGRESS BARS + HALF-BLEED CAMPUS IMAGE (6a430f8) */}
            <section className="sk-sec12-wrap">
              <div className="sk-sec12-left">
                <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
                  <span className="sk-eyebrow">OUR VALUE</span>
                  <h2 className="sk-h2" style={{ color: '#FFFFFF', marginBottom: 18 }}>
                    Knowledge will bring you the opportunity to make a difference.
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '16px', lineHeight: 1.65, marginBottom: 24 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                  </p>
                  <div style={{ width: '100%', height: 1, background: 'var(--sk-accent-line)', marginBottom: 28 }} />

                  <AnimatedSkillBar title="Global Perspective" percentage={84} />
                  <AnimatedSkillBar title="Strong Alumni Network" percentage={61} />
                  <AnimatedSkillBar title="Innovative Teaching Methods" percentage={76} />
                </div>
              </div>

              <div className="sk-sec12-right">
                <img
                  src="./assets/harvard-university-campus.jpg"
                  alt="Astranovas Campus Architecture"
                />
              </div>
            </section>

            {/* SECTION 13: MESSAGE FROM FOUNDER WITH SIGNATURE & 60px BLUE RIPPLE VIDEO BUTTON (de2a36f) */}
            <section style={{ paddingTop: '5em', background: '#FFFFFF', overflow: 'hidden' }}>
              <div className="sk-container">
                <div className="sk-grid-2" style={{ alignItems: 'flex-end', gap: 48 }}>
                  {/* Left 50% (fadeInLeft) */}
                  <Reveal anim="fadeInLeft" style={{ paddingBottom: '5em' }}>
                    <span className="sk-eyebrow">MESSAGE FROM FOUNDER</span>
                    <h2 className="sk-h2" style={{ marginBottom: 20 }}>
                      Education’s purpose is to replace an empty mind with an open one.
                    </h2>
                    <p className="sk-p">
                      Nulla augue morbi ac est himenaeos primis diam vulputate. Dictum himenaeos volutpat augue posuere tortor erat sollicitudin morbi. Neque ornare vel arcu nisi ante curae pretium.
                    </p>
                    <p className="sk-p" style={{ marginBottom: 32 }}>
                      Nulla augue morbi ac est himenaeos primis diam vulputate. Dictum himenaeos volutpat augue posuere tortor erat sollicitudin morbi. Neque ornare vel arcu nisi ante curae pretium.
                    </p>

                    {/* Bottom Split: Signature Box (48%) + Video Ripple Button (48%) */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 28,
                        paddingTop: 12,
                      }}
                    >
                      <div
                        style={{
                          paddingRight: 28,
                          borderRight: '1px solid #DCDDE8',
                        }}
                      >
                        <img
                          src="./assets/Signature.png"
                          alt="Founder Signature"
                          style={{ height: 44, width: 'auto', marginBottom: 10 }}
                        />
                        <div style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '17px', fontWeight: 700, color: '#252525' }}>
                          Prof. Dr. Kayla Scott, Ph.D
                        </div>
                        <div style={{ fontSize: '14px', color: '#767676' }}>
                          Founder
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <button
                          type="button"
                          className="sk-ekit-video-btn-60"
                          onClick={() => setVideoModalOpen(true)}
                          aria-label="Play Founder Video"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                        <span
                          onClick={() => setVideoModalOpen(true)}
                          style={{
                            fontFamily: 'var(--sk-font-heading)',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#252525',
                            cursor: 'pointer',
                          }}
                        >
                          Play video
                        </span>
                      </div>
                    </div>
                  </Reveal>

                  {/* Right 50%: Tall Founder Cutout Portrait (fadeInUp) */}
                  <Reveal anim="fadeInUp" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src="./assets/img_1.png"
                      alt="Prof. Dr. Kayla Scott, Ph.D"
                      style={{
                        maxHeight: 620,
                        width: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'bottom center',
                      }}
                    />
                  </Reveal>
                </div>
              </div>
            </section>

            {/* SECTION 14: FINAL CAMPUS CTA BANNER WITH HALFTONE OVERLAY (40f7521) */}
            <section className="sk-sec14-wrap">
              <div className="sk-container" style={{ position: 'relative', zIndex: 1 }}>
                <Reveal anim="fadeInLeft" style={{ maxWidth: 600 }}>
                  <h2
                    style={{
                      fontFamily: 'var(--sk-font-heading)',
                      fontSize: 'clamp(30px, 3.8vw, 48px)',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.18,
                      marginBottom: 20,
                    }}
                  >
                    Live as if you were to die tomorrow. Learn as if you were to live forever.
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: 28 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="sk-btn"
                  >
                    Discover more
                  </button>
                </Reveal>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            PAGE: ABOUT US (about.html)
            ================================================================ */}
        {currentPage === 'about' && (
          <div>
            <section className="sk-sec14-wrap" style={{ padding: '7em 0 8em' }}>
              <div className="sk-container" style={{ position: 'relative', zIndex: 1 }}>
                <Reveal anim="fadeInUp" style={{ maxWidth: 780 }}>
                  <span className="sk-eyebrow" style={{ color: '#EA6645' }}>ABOUT OUR INSTITUTION</span>
                  <h1 className="sk-h1" style={{ color: '#FFFFFF' }}>
                    Nurturing Tomorrow's Leaders with Integrity & Excellence
                  </h1>
                  <p className="sk-p" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                    Founded with the enduring vision of delivering world-class international schooling to Andhra Pradesh, Astranovas International School combines rigorous Cambridge academic standards with deep personal character development.
                  </p>
                </Reveal>
              </div>
            </section>

            <section style={{ padding: '7em 0 5em', background: '#FFFFFF' }}>
              <div className="sk-container">
                <div className="sk-grid-2" style={{ alignItems: 'center', gap: 50 }}>
                  <Reveal anim="fadeInLeft">
                    <span className="sk-eyebrow">POTENTIAL TO RADIANCE</span>
                    <h2 className="sk-h2">A Heritage of Holistic Education</h2>
                    <p className="sk-p">
                      Located near Toll Gate, Gantyada, in the historic district of Vizianagaram, Astra Novas International School provides an oasis of focused study away from urban congestion. Our faculty are chosen not only for academic expertise but for their dedication to mentoring young minds.
                    </p>
                    <p className="sk-p">
                      From interactive robotics laboratories to Olympic athletics grounds, our master plan guarantees that every pupil has access to world-class infrastructure.
                    </p>
                    <button type="button" onClick={() => setModalOpen(true)} className="sk-btn">
                      Connect with Admissions
                    </button>
                  </Reveal>
                  <Reveal anim="fadeInRight">
                    <img
                      src="./assets/college-student-friends-in-the-campus-students-ready-to-start-academic-classes-of-their-university.jpg"
                      alt="Campus Life"
                      style={{ borderRadius: 5, boxShadow: '0 15px 40px rgba(0, 15, 29, 0.1)' }}
                    />
                  </Reveal>
                </div>
              </div>
            </section>

            {/* Vision & Mission Section on About Page */}
            <section className="sk-sec5-wrap" style={{ paddingBottom: '8em' }}>
              <div className="sk-container">
                <div className="sk-sec5-split">
                  <Reveal anim="fadeInLeft" className="sk-sec5-left">
                    <img
                      src="./assets/astra-novas-logo.jpg"
                      alt="Astra Novas — Potential to Radiance"
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        margin: '0 auto 18px',
                        boxShadow: '0 10px 28px rgba(1, 41, 81, 0.18)',
                      }}
                    />
                    <span className="sk-eyebrow">POTENTIAL TO RADIANCE</span>
                    <h2 className="sk-h2">Our Guiding Vision & Mission</h2>
                    <div style={{ width: 50, height: 2, background: '#DCDDE8', margin: '18px auto 0' }} />
                  </Reveal>

                  <div className="sk-sec5-right">
                    <Reveal anim="fadeInRight" delay={0} className="sk-value-card">
                      <div style={{ color: '#EA6645', marginBottom: 18 }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="6" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                      </div>
                      <h3 className="sk-h3">Our Vision</h3>
                      <p className="sk-p" style={{ margin: 0, fontSize: '15px', lineHeight: 1.65 }}>
                        “To nurture a generation of happy, confident and compassionate individuals who believe in themselves, embrace possibilities and have the courage to make a difference in the world.”
                      </p>
                    </Reveal>

                    <Reveal anim="fadeInRight" delay={200} className="sk-value-card">
                      <div style={{ color: '#EA6645', marginBottom: 18 }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      </div>
                      <h3 className="sk-h3">Our Mission</h3>
                      <p className="sk-p" style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.65 }}>
                        “At Astra Novas, every child is welcomed, valued and encouraged to be their own unique self. We strive to create a happy, safe and caring environment where children feel a sense of belonging, are free to ask questions, explore their interests, discover their strengths and learn with joy. Through meaningful experiences, opportunities to explore and constant encouragement, we nurture curious minds, confident learners, independent thinkers and kind individuals who are prepared to embrace life's opportunities.”
                      </p>
                    </Reveal>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            PAGE: ACADEMICS (academics.html)
            ================================================================ */}
        {currentPage === 'academics' && (
          <div>
            <section className="sk-sec14-wrap" style={{ padding: '7em 0 8em' }}>
              <div className="sk-container" style={{ position: 'relative', zIndex: 1 }}>
                <Reveal anim="fadeInUp" style={{ maxWidth: 780 }}>
                  <span className="sk-eyebrow" style={{ color: '#EA6645' }}>ACADEMIC CONTINUUM</span>
                  <h1 className="sk-h1" style={{ color: '#FFFFFF' }}>
                    From Early Discovery to Global University Pathways
                  </h1>
                  <p className="sk-p" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                    A structured educational journey designed to build conceptual depth, analytical precision, and articulate self-expression.
                  </p>
                </Reveal>
              </div>
            </section>

            <section style={{ padding: '7em 0 9em', background: '#F5F5F7' }}>
              <div className="sk-container">
                <div className="sk-grid-2" style={{ gap: 40 }}>
                  {CONTINUUM_STAGES.map((stage, idx) => (
                    <Reveal
                      key={stage.id}
                      anim={idx % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}
                      style={{ background: '#FFFFFF', padding: 36, borderRadius: 5, boxShadow: '0 0 50px rgba(0,0,0,0.08)' }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#EA6645', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {stage.grades} · {stage.ageRange}
                      </div>
                      <h2 className="sk-h2" style={{ fontSize: '28px', margin: '8px 0 12px' }}>
                        {stage.title}
                      </h2>
                      <p className="sk-p" style={{ marginBottom: 16 }}>{stage.summary}</p>
                      <h4 style={{ fontFamily: 'var(--sk-font-heading)', fontSize: '16px', color: '#000F1D', marginBottom: 8 }}>
                        Key Disciplines:
                      </h4>
                      <ul style={{ paddingLeft: 20, color: '#767676', fontSize: '15px', lineHeight: 1.8, marginBottom: 20 }}>
                        {stage.SignatureSubjects.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                      <button type="button" onClick={() => setModalOpen(true)} className="sk-btn">
                        Inquire for {stage.title}
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            PAGE: FACULTIES (faculties.html)
            ================================================================ */}
        {currentPage === 'faculties' && (
          <div>
            <section className="sk-sec14-wrap" style={{ padding: '7em 0 8em' }}>
              <div className="sk-container" style={{ position: 'relative', zIndex: 1 }}>
                <Reveal anim="fadeInUp" style={{ maxWidth: 780 }}>
                  <span className="sk-eyebrow" style={{ color: '#EA6645' }}>OUR SCHOOLS & DISCIPLINES</span>
                  <h1 className="sk-h1" style={{ color: '#FFFFFF' }}>
                    Interdisciplinary Faculties Led by Renowned Educators
                  </h1>
                  <p className="sk-p" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                    Explore our state-of-the-art departments dedicated to science, technology, arts, and leadership.
                  </p>
                </Reveal>
              </div>
            </section>

            <section style={{ padding: '7em 0 10em', background: '#FFFFFF' }}>
              <div className="sk-container">
                <div className="sk-grid-3">
                  {faculties.map((fac) => (
                    <div key={fac.id} className="sk-faculty-slide-card">
                      <div style={{ overflow: 'hidden' }}>
                        <img src={fac.image} alt={fac.title} className="sk-faculty-slide-img" />
                      </div>
                      <div className="sk-faculty-slide-drawer">
                        <div className="sk-faculty-chevron-badge">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </div>
                        <h3 className="sk-h3">{fac.title}</h3>
                        <p className="sk-p" style={{ fontSize: '15px', marginBottom: 24 }}>{fac.desc}</p>
                        <button
                          type="button"
                          onClick={() => setSelectedFacultyDetail(fac)}
                          className="sk-btn"
                        >
                          Learn more →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            PAGE: CONTACT US (contact.html)
            ================================================================ */}
        {currentPage === 'contact' && (
          <div>
            <section className="sk-sec14-wrap" style={{ padding: '7em 0 8em' }}>
              <div className="sk-container" style={{ position: 'relative', zIndex: 1 }}>
                <Reveal anim="fadeInUp" style={{ maxWidth: 780 }}>
                  <span className="sk-eyebrow" style={{ color: '#EA6645' }}>GET IN TOUCH</span>
                  <h1 className="sk-h1" style={{ color: '#FFFFFF' }}>
                    Admissions & Campus Visit Center
                  </h1>
                  <p className="sk-p" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                    We invite prospective families to experience our campus, laboratories, and athletic fields firsthand.
                  </p>
                </Reveal>
              </div>
            </section>

            <section style={{ padding: '7em 0 10em', background: '#F5F5F7' }}>
              <div className="sk-container">
                <div className="sk-grid-2" style={{ gap: 50, alignItems: 'flex-start' }}>
                  <Reveal anim="fadeInLeft" style={{ background: '#FFFFFF', padding: 40, borderRadius: 5, boxShadow: '0 0 50px rgba(0,0,0,0.08)' }}>
                    <h2 className="sk-h2">Admissions Office</h2>
                    <p className="sk-p">
                      Our admissions team is available Monday through Saturday to answer questions regarding stage placement, scholarships, and campus facilities.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
                      <div>
                        <strong>Campus Address:</strong>
                        <p style={{ margin: '4px 0 0', color: '#767676' }}>
                          Near Toll Gate, Gantyada, Vizianagaram, Andhra Pradesh – 535215
                        </p>
                      </div>
                      <div>
                        <strong>Helpline Numbers:</strong>
                        <p style={{ margin: '4px 0 0', color: '#EA6645', fontWeight: 700, fontSize: '18px' }}>
                          +91 81888 48787 / +91 81888 58787
                        </p>
                      </div>
                      <div>
                        <strong>Email Address:</strong>
                        <p style={{ margin: '4px 0 0', color: '#767676' }}>
                          admissions@astranovasschool.com
                        </p>
                      </div>
                      <div>
                        <strong>Office Hours:</strong>
                        <p style={{ margin: '4px 0 0', color: '#767676' }}>
                          Monday – Saturday: 8:30 AM to 4:30 PM
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal anim="fadeInRight" style={{ background: '#FFFFFF', padding: 40, borderRadius: 5, boxShadow: '0 0 50px rgba(0,0,0,0.08)' }}>
                    <h3 className="sk-h3">Book a Campus Tour</h3>
                    <p className="sk-p" style={{ fontSize: '14px', marginBottom: 20 }}>
                      Fill in your details below and our team will confirm your scheduled slot.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <input
                        required
                        type="text"
                        placeholder="Parent / Guardian Name *"
                        style={{ padding: '13px 16px', borderRadius: 5, border: '1px solid #DCDDE8', outline: 'none' }}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Phone Number *"
                        style={{ padding: '13px 16px', borderRadius: 5, border: '1px solid #DCDDE8', outline: 'none' }}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        style={{ padding: '13px 16px', borderRadius: 5, border: '1px solid #DCDDE8', outline: 'none' }}
                      />
                      <input
                        type="text"
                        placeholder="Child's Name & Current Grade"
                        style={{ padding: '13px 16px', borderRadius: 5, border: '1px solid #DCDDE8', outline: 'none' }}
                      />
                      <button type="submit" className="sk-btn" style={{ width: '100%', marginTop: 8 }}>
                        Confirm Tour Request
                      </button>
                    </form>
                  </Reveal>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <SkoolaFooter />
    </div>
  );
}
