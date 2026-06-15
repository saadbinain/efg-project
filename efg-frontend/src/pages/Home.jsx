import { useState, useEffect, useRef } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { fetchCourses, fetchColleges } from '../services/api'
import { TargetIcon, SearchIcon, DollarIcon, HandshakeIcon, BookIcon, CheckIcon, SchoolIcon } from '../components/Icons'

const POPULAR_DEGREES = [
  'Education (BSEd, BEEd, BECEd)',
  'BS Nursing',
  'BS Social Work',
  'BS Criminology',
]

const STATS = [
  { value: 50, suffix: '+', label: 'Programs Offered' },
  { value: 20, suffix: '+', label: 'Partner Schools' },
  { value: 1000, suffix: '+', label: 'Students Guided' },
  { value: 100, suffix: '%', label: 'Free Access' },
]

const WHY_EFG = [
  {
    icon: 'target',
    title: 'Accurate Information',
    desc: 'Up-to-date tuition fees, program details, and admission requirements sourced directly from institutions.',
  },
  {
    icon: 'search',
    title: 'Easy Comparison',
    desc: 'Compare programs and schools side by side to find the best fit for your academic goals and budget.',
  },
  {
    icon: 'dollar',
    title: 'Financial Clarity',
    desc: 'Transparent cost breakdowns so families can plan ahead — no hidden fees, no surprises.',
  },
  {
    icon: 'handshake',
    title: 'Trusted Platform',
    desc: 'Backed by province-wide partnerships with educational institutions and government support.',
  },
]

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1800
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function Home() {
  const [colleges, setColleges] = useState([])
  const [courses, setCourses] = useState([])
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const { statsData } = useOutletContext()

  useEffect(() => {
    fetchColleges()
      .then(data => setColleges(Array.isArray(data) ? data : []))
      .catch(() => {})
    fetchCourses()
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => {})
    setTimeout(() => setHeroLoaded(true), 150)
  }, [])

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]))
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [colleges, courses])

  const featuredColleges = Array.isArray(colleges) ? colleges.slice(0, 6) : []
  const featuredCourses = Array.isArray(courses) ? courses.slice(0, 8) : []

  const currentStats = [
    { value: Number(statsData?.courses_count) || 0, suffix: '+', label: 'Programs Offered' },
    { value: Number(statsData?.colleges_count) || 0, suffix: '+', label: 'Partner Schools' },
    { value: Number(statsData?.students_guided) || 0, suffix: '+', label: 'Students Guided' },
    { value: 100, suffix: '%', label: 'Free Access' },
  ]

  return (
    <div className="efg-home">

      {/* ── HERO SECTION ── */}
      <section className="efg-hero">
        {/* Animated particles background */}
        <div className="efg-hero-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="efg-particle" style={{ '--delay': `${i * 0.7}s`, '--x': `${15 + i * 14}%` }} />
          ))}
        </div>

        <div className="efg-hero-inner">
          <div className={`efg-hero-content ${heroLoaded ? 'efg-hero-visible' : ''}`}>
            <div className="efg-hero-badge-label">Province-Wide Information Program</div>
            <h1 className="efg-hero-title">
              Educational<br />Financial Guide
            </h1>
            <p className="efg-hero-desc" style={{ maxWidth: '640px', lineHeight: '1.65' }}>
              The Educational Financial Guide (EFG) is a province-wide public information program that provides graduating students and their families with clear, accurate academic and financial guidance for higher education through a centralized website and official publications. Operating as a trusted information platform rather than a regulatory system, it is supported by professionally developed digital infrastructure and widely distributed printed materials, and graduating students must learn the EFG in order to navigate college decisions responsibly and sustainably.
            </p>
            <div className="efg-hero-actions">
              <Link to="/courses" className="efg-btn-primary" id="hero-explore-btn">
                Explore Programs
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/colleges" className="efg-btn-outline" id="hero-schools-btn">
                View Schools
              </Link>
            </div>
          </div>

          <div className={`efg-hero-visual ${heroLoaded ? 'efg-hero-visible' : ''}`}>
            <div className="efg-hero-logo-glow" />
            <img
              src="/efglogo.png"
              alt="Educational Financial Guide Logo"
              className="efg-hero-logo-img"
            />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="efg-stats" data-section="stats">
        <div className="efg-stats-inner">
          {currentStats.map((stat, i) => (
            <div
              key={i}
              className={`efg-stat-item ${visibleSections.has('stats') ? 'efg-animate-up' : ''}`}
              style={{ '--stagger': `${i * 0.1}s` }}
            >
              <span className="efg-stat-value">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="efg-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROGRAMS & POPULAR DEGREES ── */}
      <section className="efg-section efg-section-light" data-section="programs">
        <div className="efg-section-inner efg-home-programs-layout">
          
          {/* Featured Programs Grid */}
          <div style={{ flex: '2', minWidth: '320px' }}>
            <div className="efg-section-header" style={{ marginBottom: '2rem' }}>
              <span className="efg-section-tag">Academic Programs</span>
              <h2 className="efg-section-title">Featured Programs</h2>
              <p className="efg-section-subtitle">Discover programs that match your career aspirations</p>
            </div>

            <div className="efg-programs-grid">
              {featuredCourses.length > 0 ? featuredCourses.map((c, i) => (
                <Link
                  key={c.id}
                  to={`/courses/${c.id}`}
                  className={`efg-program-card ${visibleSections.has('programs') ? 'efg-animate-up' : ''}`}
                  style={{ '--stagger': `${i * 0.06}s` }}
                  id={`program-card-${c.id}`}
                >
                  <div className="efg-program-icon"><BookIcon size={20} strokeWidth={2} style={{ color: '#3A9B8E' }} /></div>
                  <div className="efg-program-info">
                    <h3 className="efg-program-name">{c.name}</h3>
                    {c.acronym && <span className="efg-program-badge">{c.acronym}</span>}
                  </div>
                  <svg className="efg-program-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              )) : (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', gridColumn: '1 / -1' }}>Loading programs…</p>
              )}
            </div>

            <div className="efg-section-footer" style={{ marginTop: '2.5rem', textAlign: 'left' }}>
              <Link to="/courses" className="efg-btn-primary" id="browse-all-programs-btn">
                Browse All Programs
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>

          {/* Popular Degrees Column */}
          <div style={{ flex: '1', minWidth: '280px', display: 'flex' }}>
            <div className="efg-popular-sidebar">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3A9B8E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', display: 'block' }}>Trending Now</span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1A2C4E', marginBottom: '0.5rem', lineHeight: '1.2' }}>Popular Degrees</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Highly sought-after paths by students in the province. Click to see details.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                {POPULAR_DEGREES.map((deg, i) => (
                  <Link
                    key={i}
                    to="/courses"
                    className="efg-popular-item"
                  >
                    <span className="efg-popular-item-check"><CheckIcon size={12} strokeWidth={3} /></span>
                    <span style={{ flex: '1' }}>{deg}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURED SCHOOLS ── */}
      <section className="efg-section efg-section-light" data-section="schools" style={{ background: '#fff' }}>
        <div className="efg-section-inner">
          <div className="efg-section-header">
            <span className="efg-section-tag">Partner Institutions</span>
            <h2 className="efg-section-title">Featured Schools</h2>
            <p className="efg-section-subtitle">Explore top educational institutions in the province</p>
          </div>

          <div className="efg-schools-grid">
            {featuredColleges.length > 0 ? featuredColleges.map((col, i) => (
              <Link
                key={col.id}
                to={`/colleges/${col.id}`}
                className={`efg-school-card ${visibleSections.has('schools') ? 'efg-animate-up' : ''}`}
                style={{ '--stagger': `${i * 0.08}s` }}
                id={`school-card-${col.id}`}
              >
                <div className="efg-school-card-accent" />
                <div className="efg-school-logo">
                  {col.logo_url
                    ? <img src={col.logo_url} alt={col.name} />
                    : <SchoolIcon size={24} style={{ color: '#64748b' }} />
                  }
                </div>
                <h3 className="efg-school-name">{col.name}</h3>
                <span className="efg-school-cta">View Details →</span>
              </Link>
            )) : (
              [...Array(6)].map((_, i) => (
                <div key={i} className="efg-school-card efg-skeleton-card">
                  <div className="efg-school-logo"><SchoolIcon size={24} style={{ color: '#cbd5e1' }} /></div>
                  <div className="efg-skeleton-line" style={{ width: '70%' }} />
                  <div className="efg-skeleton-line" style={{ width: '40%' }} />
                </div>
              ))
            )}
          </div>

          <div className="efg-section-footer">
            <Link to="/colleges" className="efg-btn-secondary" id="view-all-schools-btn">
              View All Schools
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY EFG ── */}
      <section className="efg-section efg-section-dark" data-section="why">
        <div className="efg-section-inner">
          <div className="efg-section-header">
            <span className="efg-section-tag efg-tag-light">Our Promise</span>
            <h2 className="efg-section-title efg-title-light">Why Choose EFG?</h2>
            <p className="efg-section-subtitle efg-subtitle-light">
              We provide the tools and information you need to make the best educational investment
            </p>
          </div>

          <div className="efg-why-grid">
            {WHY_EFG.map((item, i) => (
              <div
                key={i}
                className={`efg-why-card ${visibleSections.has('why') ? 'efg-animate-up' : ''}`}
                style={{ '--stagger': `${i * 0.1}s` }}
              >
                <span className="efg-why-icon">
                  {item.icon === 'target' && <TargetIcon size={24} strokeWidth={1.5} style={{ color: '#E67E22' }} />}
                  {item.icon === 'search' && <SearchIcon size={24} strokeWidth={1.5} style={{ color: '#E67E22' }} />}
                  {item.icon === 'dollar' && <DollarIcon size={24} strokeWidth={1.5} style={{ color: '#E67E22' }} />}
                  {item.icon === 'handshake' && <HandshakeIcon size={24} strokeWidth={1.5} style={{ color: '#E67E22' }} />}
                </span>
                <h3 className="efg-why-title">{item.title}</h3>
                <p className="efg-why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── FOOTER ── */}
      <footer className="efg-home-footer">
        <div className="efg-footer-inner">
          <div className="efg-footer-top">
            <div className="efg-footer-brand">
              <img src="/efglogo.png" alt="EFG Logo" className="efg-footer-logo" />
              <p className="efg-footer-tagline">
                Empowering students with clear financial guidance for higher education in the province.
              </p>
            </div>

            <div className="efg-footer-links-grid">
              <div>
                <h3 className="efg-footer-head">Navigation</h3>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/courses">Programs</Link></li>
                  <li><Link to="/colleges">Schools</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="efg-footer-head">Resources</h3>
                <ul>
                  <li><Link to="/courses">Course Catalog</Link></li>
                  <li><Link to="/colleges">School Directory</Link></li>
                  <li><Link to="/">Career Guide</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="efg-footer-head">Support</h3>
                <ul>
                  <li><Link to="/">About EFG</Link></li>
                  <li><Link to="/">Contact Us</Link></li>
                  <li><Link to="/">FAQs</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="efg-footer-bottom">
            <span>© {new Date().getFullYear()} Educational Financial Guide. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
