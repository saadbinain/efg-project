import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchStats, incrementStats } from '../services/api'
import { HeartIcon, MenuIcon, XIcon, HomeIcon, BookIcon, SchoolIcon, InfoIcon } from './Icons'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const [statsData, setStatsData] = useState({
    courses_count: 50,
    colleges_count: 20,
    students_guided: 1000
  })
  const [localVoted, setLocalVoted] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Register state setter globally as a fallback
  useEffect(() => {
    window.setShowAd = setShowAd;
    return () => {
      delete window.setShowAd;
    };
  }, [setShowAd])

  // Fetch initial statistics
  useEffect(() => {
    fetchStats()
      .then(data => {
        if (data && typeof data === 'object' && 'courses_count' in data) {
          setStatsData(data);
        }
      })
      .catch(() => {})
  }, [])

  // Close mobile menu and reset ad state immediately on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setShowAd(false)
    setLocalVoted(false)
  }, [location.pathname])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleVote = async () => {
    try {
      const res = await incrementStats()
      if (res.success) {
        setStatsData(prev => ({
          ...prev,
          students_guided: res.students_guided
        }))
        setLocalVoted(true)
        
        // Let user see thank you message for 3.5 seconds, then slide it out
        setTimeout(() => {
          setShowAd(false)
        }, 3500)
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err)
    }
  }

  const handleCloseAd = () => {
    setShowAd(false)
  }

  const navItems = [
    { label: 'Home', to: '/', icon: <HomeIcon size={18} /> },
    { label: 'Programs', to: '/courses', icon: <BookIcon size={18} /> },
    { label: 'Schools', to: '/colleges', icon: <SchoolIcon size={18} /> },
    { label: 'About us', to: '/about', icon: <InfoIcon size={18} /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky Navbar */}
      <header className="efg-header">
        <div className="efg-header-inner">
          {/* Logo & Brand */}
          <Link to="/" className="efg-nav-brand" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/efglogo.png"
              alt="EFG Logo"
              className="efg-nav-logo"
            />
            <span className="efg-nav-title">
              Educational Financial Guidance
            </span>
            <span className="efg-nav-title-mobile">
              EFG Guide
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="efg-nav-desktop">
            {navItems.map(({ label, to }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`efg-nav-link ${active ? 'active' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="efg-mobile-toggle"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div
          className="efg-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div className={`efg-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="efg-mobile-drawer-header">
          <div className="efg-mobile-drawer-brand">
            <img src="/efglogo.png" alt="EFG Logo" style={{ height: 36, width: 'auto' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>EFG Platform</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Educational Financial Guidance</div>
            </div>
          </div>
          <button
            type="button"
            className="efg-mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation drawer"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="efg-mobile-drawer-body">
          <div className="efg-mobile-drawer-label">Navigation</div>
          <nav className="efg-mobile-nav-list">
            {navItems.map(({ label, to, icon }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`efg-mobile-nav-link ${active ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="efg-mobile-nav-icon">{icon}</span>
                  <span className="efg-mobile-nav-text">{label}</span>
                  {active && (
                    <span className="efg-mobile-nav-badge">Current</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="efg-mobile-drawer-footer">
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
            Empowering students with verified college fees and tuition insights.
          </div>
        </div>
      </div>

      {/* Main Content — no wrapper for pages with their own hero */}
      <main style={{ flexGrow: 1 }}>
        {isHome || /^\/(courses|colleges)/.test(location.pathname) ? (
          <Outlet context={{ statsData, handleVote, hasVoted: localVoted, setShowAd }} />
        ) : (
          <div className="efg-main-padded">
            <Outlet context={{ statsData, handleVote, hasVoted: localVoted, setShowAd }} />
          </div>
        )}
      </main>

      {/* Sliding Feedback Popup Ad (Auto-repeating) */}
      {!location.pathname.startsWith('/admin') && (
        <>
          {showAd && <div className="efg-popup-backdrop no-print" onClick={handleCloseAd} />}
          <div className={`efg-feedback-popup ${showAd ? 'efg-show' : ''}`}>
          {!localVoted && (
            <button onClick={handleCloseAd} className="efg-feedback-popup-close" aria-label="Close feedback card">
              &times;
            </button>
          )}
          
          <div className="efg-feedback-popup-header">
            <HeartIcon className="efg-feedback-popup-icon" size={24} fill="#E74C3C" stroke="#E74C3C" style={{ color: '#E74C3C' }} />
            <h3 className="efg-feedback-popup-title">
              Did this website help you to be ready for college?
            </h3>
          </div>
          
          {!localVoted ? (
            <>
              <p className="efg-feedback-popup-desc">
                Your feedback helps us understand our reach and keep EFG free.
              </p>
              <button onClick={handleVote} className="efg-feedback-popup-btn">
                Yes, it helped me!
              </button>
            </>
          ) : (
            <div className="efg-feedback-popup-thanks">
              Thank you! EFG has guided <strong>{statsData.students_guided.toLocaleString()}</strong> students.
            </div>
          )}
        </div>
      </>
    )}

      {/* Footer */}
      {!isHome && (
        <footer style={{
          background: '#1A2C4E',
          color: 'rgba(255,255,255,0.55)',
          padding: '1.25rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          © {new Date().getFullYear()} Educational Financial Guidance. All rights reserved.
        </footer>
      )}
    </div>
  )
}