import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchStats, incrementStats } from '../services/api'
import { HeartIcon } from './Icons'

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

  // Timer: Whenever showAd becomes false, start a 20-second timer to show it again
  useEffect(() => {
    if (showAd) return

    const timer = setTimeout(() => {
      setLocalVoted(false) // Reset local vote state so they can vote again on popup re-appearance
      setShowAd(true)
    }, 20000) // 20 seconds delay

    return () => clearTimeout(timer)
  }, [showAd])

  // Reset ad state immediately on route change
  useEffect(() => {
    setShowAd(false)
    setLocalVoted(false)
  }, [location.pathname])

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky Navbar */}
      <header style={{
        background: '#1A2C4E',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img
                src="/efglogo.png"
                alt="EFG Logo"
                style={{ height: 48, width: 'auto', objectFit: 'contain' }}
              />
              <span className="efg-nav-title">
                Educational Financial Guidance
              </span>
            </Link>

            {/* Nav Links */}
            <nav style={{ display: 'flex', gap: '0.25rem' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Explore Programs', to: '/courses' },
                { label: 'Schools', to: '/colleges' },
              ].map(({ label, to }) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#E67E22' : 'rgba(255,255,255,0.85)',
                      textDecoration: 'none',
                      background: active ? 'rgba(230,126,34,0.12)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content — no wrapper for pages with their own hero */}
      <main style={{ flexGrow: 1 }}>
        {isHome || /^\/(courses|colleges)/.test(location.pathname) ? (
          <Outlet context={{ statsData, handleVote, hasVoted: localVoted }} />
        ) : (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <Outlet context={{ statsData, handleVote, hasVoted: localVoted }} />
          </div>
        )}
      </main>

      {/* Sliding Feedback Popup Ad (Auto-repeating) */}
      {!location.pathname.startsWith('/admin') && (
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