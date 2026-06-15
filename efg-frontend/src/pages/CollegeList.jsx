import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchColleges, getLogoUrl } from '../services/api'
import { SearchIcon, SchoolIcon, MapPinIcon } from '../components/Icons'

const INITIAL_VISIBLE = 6

export default function CollegeList() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchColleges()
      .then(data => {
        setColleges(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load colleges. Make sure the backend server is running.')
        setLoading(false)
      })
  }, [])

  const filteredColleges = Array.isArray(colleges)
    ? colleges.filter(col => {
        const nameMatch = col.name.toLowerCase().includes(search.toLowerCase())
        const locationMatch = Array.isArray(col.locations)
          ? col.locations.some(loc => loc.toLowerCase().includes(search.toLowerCase()))
          : typeof col.locations === 'string'
            ? col.locations.toLowerCase().includes(search.toLowerCase())
            : false
        return nameMatch || locationMatch
      })
    : []

  const visibleColleges = filteredColleges.slice(0, visibleCount)
  const hasMore = visibleCount < filteredColleges.length

  return (
    <div className="cd-page">
      <section className="cd-hero">
        <div className="cd-hero-particles">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="efg-particle" style={{ '--delay': `${i * 1.2}s`, '--x': `${10 + i * 22}%` }} />
          ))}
        </div>
        <div className="cd-hero-inner" style={{ padding: '3.5rem 2rem' }}>
          <h1 className="cd-hero-title">Partner Schools</h1>
          <p className="cd-hero-overview" style={{ marginBottom: 0 }}>
            Browse through accredited colleges and universities in the province to find information about campuses, locations, and course offerings.
          </p>
          <div className="hero-search-wrap">
            <input
              type="text"
              placeholder="Search schools by name or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleCount(INITIAL_VISIBLE)
              }}
            />
            <button type="button" style={{ pointerEvents: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
              <SearchIcon size={16} strokeWidth={2.5} /> Find
            </button>
          </div>
        </div>
      </section>

      <div className="cd-body">
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            color: '#dc2626', borderRadius: 10, padding: '0.75rem 1rem',
            marginBottom: '1.5rem', fontSize: '0.88rem',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: 110, borderRadius: 14,
                background: '#f3f4f6', animation: 'efg-pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="cd-empty-state">
            <span className="cd-empty-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <SchoolIcon size={48} strokeWidth={1.5} style={{ color: '#cbd5e1' }} />
            </span>
            <p>No schools found matching "{search}". Try another search term.</p>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing <strong>{Math.min(visibleCount, filteredColleges.length)}</strong> of <strong>{filteredColleges.length}</strong> schools
              </p>
            </div>

            <div className="cd-colleges-grid">
              {visibleColleges.map(col => (
                <Link
                  key={col.id}
                  to={`/colleges/${col.id}`}
                  className="cd-college-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="cd-college-card-accent" />
                  <div className="cd-college-logo">
                    {col.logo_url ? (
                      <img src={getLogoUrl(col.logo_url)} alt={col.name} />
                    ) : (
                      <SchoolIcon size={24} style={{ color: '#64748b' }} />
                    )}
                  </div>
                  <div className="cd-college-info">
                    <h2 className="cd-college-name">{col.name}</h2>
                    {col.locations && col.locations.length > 0 && (
                      <p style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                        <MapPinIcon size={13} style={{ color: '#64748b' }} /> {Array.isArray(col.locations) ? col.locations.join(', ') : col.locations}
                      </p>
                    )}
                  </div>
                  <div className="cd-college-arrow">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* View More / Show Less */}
            <div className="view-more-wrap">
              {hasMore ? (
                <button
                  className="btn-view-more"
                  onClick={() => setVisibleCount(v => v + 6)}
                >
                  View More Schools ↓
                </button>
              ) : filteredColleges.length > INITIAL_VISIBLE ? (
                <button
                  className="btn-view-more"
                  style={{ background: '#64748b', boxShadow: 'none' }}
                  onClick={() => setVisibleCount(INITIAL_VISIBLE)}
                >
                  Show Less ↑
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}