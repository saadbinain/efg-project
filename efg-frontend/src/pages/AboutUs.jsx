import React from 'react'
import { Link } from 'react-router-dom'
import aminHatamanImg from '../assets/about-us/2d7a10a8-6027-426e-ab94-a82ed498116d.jpg'
import educationAdvocacyImg from '../assets/about-us/a1aa4d91-29b3-4c37-8b37-47c6d59eec46.jpg'
import youthTeamImg from '../assets/about-us/FullSizeRender.JPG'
import efgCollabImg from '../assets/about-us/8ef3cb39-8ac8-4998-b065-4c6b7c783693.jpg'
import studentStudyImg from '../assets/about-us/pexels-ivan-s-8117476.jpg'

export default function AboutUs() {
  const fourFocusAreas = [
    {
      title: 'Education',
      desc: 'Promoting accessibility, preparedness, and financial clarity for students.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      color: '#3a9b8e',
      bg: 'rgba(58, 155, 142, 0.1)',
    },
    {
      title: 'Youth',
      desc: 'Empowering future leaders with skills, platforms, and growth opportunities.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      ),
      color: '#e67e22',
      bg: 'rgba(230, 126, 34, 0.1)',
    },
    {
      title: 'Science',
      desc: 'Advancing technological solutions, innovation, and practical discoveries.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31M14 2v7.31" />
          <path d="M8.5 2h7" />
          <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
          <path d="M5.52 16h12.96" />
        </svg>
      ),
      color: '#2563eb',
      bg: 'rgba(37, 99, 235, 0.1)',
    },
    {
      title: 'Economics',
      desc: 'Fostering sustainable livelihoods, financial wellness, and community growth.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.1)',
    },
  ]

  const approachPillars = [
    {
      title: 'People-Centered',
      description: 'We begin with the needs and experiences of students, families, and communities.',
      badge: '01',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Data-Driven',
      description: 'We promote the use of reliable and institution-submitted information in developing educational solutions.',
      badge: '02',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      ),
    },
    {
      title: 'Solution-Oriented',
      description: 'We transform identified concerns into practical, innovative, and responsive initiatives.',
      badge: '03',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
  ]

  const advocacyPillars = [
    { label: 'Accessibility', desc: 'Removing barriers so every student can pursue higher education' },
    { label: 'Affordability', desc: 'Providing clear tuition details and financial aid awareness' },
    { label: 'Preparedness', desc: 'Guiding career readiness and course expectations upfront' },
    { label: 'Opportunity', desc: 'Connecting young minds with pathways to future success' },
  ]

  return (
    <div className="efg-about-page">
      {/* ── SECTION 1: HERO / BMA OFFICE ── */}
      <section className="efg-about-hero">
        <div className="efg-about-container">
          <div className="efg-about-hero-grid">
            <div className="efg-about-hero-text">
              <div className="efg-about-badge">
                <span className="efg-about-badge-dot"></span>
                <span>PUBLIC SERVICE &amp; LEGISLATION • BASILAN</span>
              </div>
              
              <h1 className="efg-about-title">
                Office of Board Member <span className="efg-highlight-text">Amin T. Hataman</span>
              </h1>
              
              <p className="efg-about-lead">
                The Office of Board Member Amin T. Hataman (BMA Office) is a public service and legislative office committed to developing responsive, practical, and innovative solutions to community needs in Basilan.
              </p>

              <div className="efg-about-quote-box">
                <div className="efg-about-quote-bar"></div>
                <p className="efg-about-quote-text">
                  Guided by the principle of <span className="efg-quote-accent">“People-centered, data-driven, and solution-oriented public service,”</span> the office advances initiatives focused on four key areas:
                </p>
              </div>

              {/* 4 Key Focus Areas Grid */}
              <div className="efg-about-focus-grid">
                {fourFocusAreas.map((item, idx) => (
                  <div key={idx} className="efg-about-focus-card">
                    <div className="efg-about-focus-icon" style={{ color: item.color, backgroundColor: item.bg }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="efg-about-focus-title">{item.title}</h4>
                      <p className="efg-about-focus-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image Side */}
            <div className="efg-about-hero-visual">
              <div className="efg-about-image-card">
                <div className="efg-about-image-decor"></div>
                <div className="efg-about-image-wrapper">
                  <img 
                    src={aminHatamanImg} 
                    alt="Board Member Amin T. Hataman" 
                    className="efg-about-lead-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const p = e.target.parentNode
                      p.style.backgroundColor = '#0f1b33'
                      p.style.display = 'flex'
                      p.style.alignItems = 'center'
                      p.style.justifyContent = 'center'
                      p.style.padding = '2rem'
                      p.innerHTML = '<span style="color:#ffffff;font-weight:700;font-size:1.1rem;text-align:center;">Office of Board Member Amin T. Hataman</span>'
                    }}
                  />
                </div>
                <div className="efg-about-floating-tag">
                  <div className="efg-about-floating-icon">📍</div>
                  <div>
                    <div className="efg-about-floating-sub">Province of Basilan</div>
                    <div className="efg-about-floating-main">Public Service &amp; Governance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: EDUCATION ADVOCACY ("Madaling Mag-aral.") ── */}
      <section className="efg-about-section efg-bg-warm">
        <div className="efg-about-container">
          <div className="efg-advocacy-grid">
            <div className="efg-advocacy-visual">
              <div className="efg-advocacy-dual-grid">
                {/* Photo 1: Tuloy ang Pangarap */}
                <div className="efg-advocacy-img-wrapper efg-advocacy-card-main">
                  <img 
                    src={educationAdvocacyImg} 
                    alt="Education Advocacy in Action" 
                    className="efg-advocacy-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="efg-advocacy-quote-overlay">
                    <span className="efg-advocacy-quote-pill">OUR MOTTO</span>
                    <h3 className="efg-advocacy-big-quote">“Madaling Mag-aral.”</h3>
                  </div>
                </div>

                {/* Photo 2: Basilan Youth Legislation Day (FullSizeRender.JPG) */}
                <div className="efg-advocacy-img-wrapper efg-advocacy-card-secondary">
                  <img 
                    src={youthTeamImg} 
                    alt="Basilan Youth Legislation Day Team" 
                    className="efg-advocacy-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="efg-advocacy-quote-overlay efg-advocacy-caption-compact">
                    <span className="efg-advocacy-quote-pill efg-pill-teal">BASILAN YOUTH &amp; EDUCATION</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="efg-advocacy-content">
              <span className="efg-section-eyebrow">OUR EDUCATION ADVOCACY</span>
              <h2 className="efg-section-heading">
                Breaking Barriers to <span className="efg-highlight-text">Education</span>
              </h2>

              <p className="efg-section-text">
                Through its Education Division, the BMA Office works to address barriers to education by exploring practical and innovative solutions that promote accessibility, affordability, preparedness, and opportunity for students and families.
              </p>
              
              <p className="efg-section-text">
                From educational assistance to information-based initiatives, the division seeks to make the journey toward education more manageable and informed.
              </p>

              {/* 4 Pillars of Advocacy */}
              <div className="efg-advocacy-pillars-grid">
                {advocacyPillars.map((pillar, i) => (
                  <div key={i} className="efg-advocacy-pillar-item">
                    <div className="efg-advocacy-check">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <strong className="efg-pillar-label">{pillar.label}</strong>
                      <p className="efg-pillar-desc">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE EDUCATIONAL FINANCIAL GUIDE (EFG) ── */}
      <section className="efg-about-section">
        <div className="efg-about-container">
          <div className="efg-efg-grid">
            <div className="efg-efg-content">
              <span className="efg-section-eyebrow">FLAGSHIP INITIATIVE</span>
              <h2 className="efg-section-heading">
                The Educational <span className="efg-highlight-text">Financial Guide</span>
              </h2>

              <p className="efg-section-text">
                The Educational Financial Guide (EFG) is one of the office’s initiatives under its commitment to making education more accessible and informed.
              </p>
              
              <p className="efg-section-text">
                EFG provides students and families with academic, financial, and career-related information to help them understand the realities of higher education and make better-informed decisions before entering college.
              </p>

              <p className="efg-section-text">
                Through its digital platform and official publications, EFG brings together information from participating educational institutions into one accessible public resource.
              </p>

              <div className="efg-about-cta-row">
                <Link to="/courses" className="efg-btn-primary">
                  Explore Courses &amp; Programs
                </Link>
                <Link to="/colleges" className="efg-btn-secondary">
                  Browse Institutions
                </Link>
              </div>
            </div>

            <div className="efg-efg-visual">
              <div className="efg-efg-card-stack">
                <div className="efg-efg-main-img-wrap">
                  <img 
                    src={efgCollabImg} 
                    alt="Educational Financial Guide Initiative" 
                    className="efg-efg-main-img" 
                  />
                </div>
                <div className="efg-efg-sub-img-wrap">
                  <img 
                    src={studentStudyImg} 
                    alt="Students using EFG" 
                    className="efg-efg-sub-img" 
                  />
                </div>
                <div className="efg-efg-stat-badge">
                  <div className="efg-efg-stat-num">100% Free</div>
                  <div className="efg-efg-stat-label">Public Educational Resource</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: OUR APPROACH (3 Pillars) ── */}
      <section className="efg-about-section efg-bg-gradient-subtle">
        <div className="efg-about-container">
          <div className="efg-about-center-header">
            <span className="efg-section-eyebrow">OUR METHODOLOGY</span>
            <h2 className="efg-section-heading">Our Approach</h2>
            <p className="efg-section-subtitle">
              How the Office of Board Member Amin T. Hataman develops responsive and sustainable educational solutions.
            </p>
          </div>

          <div className="efg-approach-cards-grid">
            {approachPillars.map((pillar, idx) => (
              <div key={idx} className="efg-approach-card">
                <div className="efg-approach-card-header">
                  <div className="efg-approach-icon-box">{pillar.icon}</div>
                  <span className="efg-approach-step">{pillar.badge}</span>
                </div>
                <h3 className="efg-approach-title">{pillar.title}</h3>
                <p className="efg-approach-desc">{pillar.description}</p>
                <div className="efg-approach-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WORKING TOGETHER & CLOSING BANNER ── */}
      <section className="efg-about-section efg-collaborate-section">
        <div className="efg-about-container">
          <div className="efg-collab-banner">
            <div className="efg-collab-glow"></div>
            <div className="efg-collab-content">
              <span className="efg-collab-tag">COMMUNITY &amp; PARTNERSHIP</span>
              <h2 className="efg-collab-heading">Working Together</h2>
              
              <p className="efg-collab-desc">
                The EFG is built through collaboration among Higher Education Institutions, government offices, students, parents, and other education stakeholders.
              </p>

              <p className="efg-collab-desc" style={{ marginTop: '0.5rem', opacity: 0.95 }}>
                Together, we aim to make educational information more accessible, transparent, and useful for every student planning their future.
              </p>

              <div className="efg-collab-motto-wrap">
                <div className="efg-collab-motto-pill">
                  <span>✨</span>
                  <span>From Information to Informed Decisions.</span>
                </div>
              </div>

              <div className="efg-collab-actions">
                <Link to="/courses" className="efg-collab-btn-action">
                  Find Your Degree &amp; Calculate Costs
                </Link>
                <Link to="/colleges" className="efg-collab-btn-outline">
                  View Partner Colleges
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
