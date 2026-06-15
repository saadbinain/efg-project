import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCollegeById, getLogoUrl } from '../services/api'
import { WarningIcon, SchoolIcon, MapPinIcon, PhoneIcon, MailIcon, BookIcon, SearchIcon } from '../components/Icons'

export default function CollegeProfile() {
  const { id } = useParams()
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchCollegeById(id)
        setCollege(data)
      } catch (err) {
        setError(err.message || 'Failed to load college profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="cd-page">
      <div className="cd-hero cd-hero-skeleton">
        <div className="cd-hero-inner">
          <div className="cd-skeleton-line" style={{ width: '120px', height: '14px' }} />
          <div className="cd-skeleton-line" style={{ width: '60%', height: '32px', marginTop: '1rem' }} />
          <div className="cd-skeleton-line" style={{ width: '80%', height: '14px', marginTop: '0.75rem' }} />
        </div>
      </div>
    </div>
  )

  if (error || !college) return (
    <div className="cd-page">
      <div className="cd-error-state">
        <span className="cd-error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <WarningIcon size={48} strokeWidth={1.5} style={{ color: '#dc2626' }} />
        </span>
        <h2>Something went wrong</h2>
        <p>{error || 'College not found'}</p>
        <Link to="/colleges" className="efg-btn-primary">← Back to colleges</Link>
      </div>
    </div>
  )

  return (
    <div className="cd-page">
      {/* ── HERO BANNER ── */}
      <section className="cd-hero">
        <div className="cd-hero-particles">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="efg-particle" style={{ '--delay': `${i * 1.2}s`, '--x': `${10 + i * 22}%` }} />
          ))}
        </div>
        <div className="cd-hero-inner" style={{ padding: '2.5rem 2rem 3rem' }}>
          <Link to="/colleges" className="cd-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to colleges
          </Link>
          
          <div style={{ display: 'block', marginTop: '1rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h1 className="cd-hero-title" style={{ margin: 0, fontSize: '2rem' }}>
                {college.name}
                {college.abbreviation && <span className="cd-hero-acronym">{college.abbreviation}</span>}
              </h1>
            </div>
            
            <div style={{ display: 'block' }}>
              <div className="cd-college-logo" style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '16px', 
                background: '#fff', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden',
                float: 'left',
                marginRight: '1.5rem',
                marginBottom: '1rem'
              }}>
                {college.logo_url ? (
                  <img src={getLogoUrl(college.logo_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <SchoolIcon size={48} style={{ color: '#64748b' }} />
                )}
              </div>
              
              {college.description && (
                <p className="cd-hero-overview" style={{ marginTop: '0.25rem', marginBottom: '1.25rem', fontSize: '0.98rem', lineHeight: '1.75' }}>
                  {college.description}
                </p>
              )}
            </div>
            
            <div className="cd-hero-meta" style={{ marginTop: '1rem', clear: 'both', paddingTop: '0.5rem' }}>
              {college.locations && college.locations.length > 0 && (
                <div className="cd-meta-chip">
                  <MapPinIcon size={14} style={{ color: '#fff', opacity: 0.85 }} /> {Array.isArray(college.locations) ? college.locations.join(', ') : college.locations}
                </div>
              )}
              {college.contacts?.phone && (
                <div className="cd-meta-chip">
                  <PhoneIcon size={14} style={{ color: '#fff', opacity: 0.85 }} /> {college.contacts.phone}
                </div>
              )}
              {college.contacts?.email && (
                <div className="cd-meta-chip">
                  <MailIcon size={14} style={{ color: '#fff', opacity: 0.85 }} /> {college.contacts.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="cd-body">
        {/* ── COURSES OFFERED ── */}
        <section className="cd-section">
          <div className="cd-section-header" style={{ marginBottom: '2rem' }}>
            <div className="cd-section-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookIcon size={20} strokeWidth={2} style={{ color: '#3A9B8E' }} />
            </div>
            <div>
              <h2 className="cd-section-title">Programs Offered</h2>
              <p className="cd-section-sub">Explore tuition fees, textbook costs, uniforms, and miscellaneous expense breakdowns</p>
            </div>
          </div>

          {college.courses && college.courses.length > 0 ? (
            <>
              {/* Search Bar */}
              <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '1.5rem' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <SearchIcon size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search programs offered by this school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1rem 0.6rem 2.25rem',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    background: '#f8fafc',
                    color: '#1e293b',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3A9B8E';
                    e.target.style.background = '#fff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(58, 155, 142, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {(() => {
                const filteredCourses = college.courses.filter(course => {
                  const nameMatch = course.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  const acronymMatch = course.acronym?.toLowerCase().includes(searchQuery.toLowerCase())
                  return nameMatch || acronymMatch
                })

                if (filteredCourses.length > 0) {
                  return (
                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredCourses.map(course => {
                        const grandTotal = course.expenses
                          ? course.expenses.reduce((sum, e) => sum + Number(e.amount), 0)
                          : 0

                        return (
                          <Link 
                            key={course.id}
                            to={`/courses/${course.id}?college_id=${id}`} 
                            className="efg-course-grid-card"
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                {course.acronym ? (
                                  <span className="efg-course-card-acro">{course.acronym}</span>
                                ) : (
                                  <div />
                                )}
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3A9B8E', background: 'rgba(58,155,142,0.08)', padding: '0.2rem 0.5rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                                  {course.years_to_complete} Yrs
                                </span>
                              </div>
                              <h3 className="efg-course-card-title" style={{ marginTop: '0.25rem' }}>{course.name}</h3>
                              {course.overview && (
                                <p className="efg-course-card-overview">{course.overview}</p>
                              )}
                            </div>

                            <div className="efg-course-card-footer">
                              <div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>Estimated Tuition</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#E67E22' }}>₱{grandTotal.toLocaleString()}</span>
                              </div>
                              <span className="efg-course-card-hint">
                                View Expenses
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )
                } else {
                  return (
                    <div className="cd-empty-state">
                      <span className="cd-empty-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SearchIcon size={48} strokeWidth={1.5} style={{ color: '#cbd5e1' }} />
                      </span>
                      <p>No programs found matching "{searchQuery}".</p>
                    </div>
                  )
                }
              })()}
            </>
          ) : (
            <div className="cd-empty-state">
              <span className="cd-empty-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookIcon size={48} strokeWidth={1.5} style={{ color: '#cbd5e1' }} />
              </span>
              <p>No programs are currently linked to this school.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}