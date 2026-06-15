import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCourseById, getLogoUrl } from '../services/api'
import { courseCache } from './CourseSearch'
import { WarningIcon, BookIcon, SchoolIcon, DollarIcon, ClipboardIcon } from '../components/Icons'

export default function CourseDetails() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const collegeId = searchParams.get('college_id')
  
  const cacheKey = collegeId ? `${id}_col_${collegeId}` : id

  // Use prefetched data immediately if available — no loading flash
  const [course, setCourse] = useState(() => courseCache[cacheKey] ?? null)
  const [loading, setLoading] = useState(!courseCache[cacheKey])
  const [error, setError] = useState('')

  useEffect(() => {
    // If already cached, skip the fetch entirely
    if (courseCache[cacheKey]) {
      setCourse(courseCache[cacheKey])
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchCourseById(id, collegeId)
        courseCache[cacheKey] = data   // cache for back-navigation
        setCourse(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, collegeId, cacheKey])

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
  if (error) return (
    <div className="cd-page">
      <div className="cd-error-state">
        <span className="cd-error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <WarningIcon size={48} strokeWidth={1.5} style={{ color: '#dc2626' }} />
        </span>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <Link to={collegeId ? `/colleges/${collegeId}` : "/courses"} className="efg-btn-primary">
          ← {collegeId ? 'Back to school profile' : 'Back to Courses'}
        </Link>
      </div>
    </div>
  )
  if (!course) return (
    <div className="cd-page">
      <div className="cd-error-state">
        <span className="cd-error-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookIcon size={48} strokeWidth={1.5} style={{ color: '#E67E22' }} />
        </span>
        <h2>Course not found</h2>
        <p>The course you're looking for doesn't exist or has been removed.</p>
        <Link to={collegeId ? `/colleges/${collegeId}` : "/courses"} className="efg-btn-primary">
          ← {collegeId ? 'Back to school profile' : 'Browse All Courses'}
        </Link>
      </div>
    </div>
  )

  const grandTotal = course.expenses
    ? course.expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    : 0

  return (
    <div className="cd-page">
      {/* ── HERO BANNER ── */}
      <section className="cd-hero">
        <div className="cd-hero-particles">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="efg-particle" style={{ '--delay': `${i * 1.2}s`, '--x': `${10 + i * 22}%` }} />
          ))}
        </div>
        <div className="cd-hero-inner">
          {collegeId ? (
            <Link to={`/colleges/${collegeId}`} className="cd-back-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to {course.college?.name || 'school profile'}
            </Link>
          ) : (
            <Link to="/courses" className="cd-back-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to courses
            </Link>
          )}

          <h1 className="cd-hero-title">
            {course.name}
            {course.acronym && <span className="cd-hero-acronym">{course.acronym}</span>}
          </h1>

          {course.college && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', maxWidth: '100%' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {course.college.logo_url ? (
                    <img src={getLogoUrl(course.college.logo_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <SchoolIcon size={14} style={{ color: '#64748b' }} />
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3A9B8E', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  Offered by {course.college.name}
                </span>
              </div>
              <Link 
                to={`/colleges/${course.college.id}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#fff', backgroundColor: '#E67E22', padding: '0.4rem 0.85rem', borderRadius: '10px', textDecoration: 'none', transition: 'background-color 0.2s', boxShadow: '0 2px 8px rgba(230,126,34,0.2)' }}
              >
                View School &amp; Offered Courses
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          )}

          {course.overview && (
            <p className="cd-hero-overview">{course.overview}</p>
          )}
          <div className="cd-hero-meta">
            {course.years_to_complete && (
              <div className="cd-meta-chip">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {course.years_to_complete} Year{course.years_to_complete > 1 ? 's' : ''} Program
              </div>
            )}
            {grandTotal > 0 && (
              <div className="cd-meta-chip cd-meta-cost">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M11 4H6.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Est. Total: ₱{grandTotal.toLocaleString()}
              </div>
            )}
            {course.colleges && course.colleges.length > 0 && (
              <div className="cd-meta-chip">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14h12M3 14V6l5-4 5 4v8M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {course.colleges.length} School{course.colleges.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="cd-body">
        {/* ── EXPENSE BREAKDOWN ── */}
        <section className="cd-section">
          <div className="cd-section-header">
            <div className="cd-section-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarIcon size={20} strokeWidth={2} style={{ color: '#3A9B8E' }} />
            </div>
            <div>
              <h2 className="cd-section-title">
                {course.college ? 'College Course Expenses' : 'Expected Expenses'}
              </h2>
              <p className="cd-section-sub">
                {course.college 
                  ? `Detailed expenses for this program offered by ${course.college.name}` 
                  : 'Estimated cost breakdown per academic year'}
              </p>
            </div>
            {grandTotal > 0 && (
              <div className="cd-grand-total-badge">
                <span className="cd-gt-label">Grand Total</span>
                <span className="cd-gt-value">₱{grandTotal.toLocaleString()}</span>
              </div>
            )}
          </div>

          {course.expenses && course.expenses.length > 0 ? (
            <div className="cd-years-grid">
              {Array.from({ length: course.years_to_complete }, (_, i) => i + 1).map(year => {
                const yearExpenses = course.expenses.filter(e => e.year_number === year)
                const yearTotal = yearExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
                return (
                  <div key={year} className="cd-year-card">
                    <div className="cd-year-header">
                      <span className="cd-year-badge">Year {year}</span>
                      <span className="cd-year-total">₱{yearTotal.toLocaleString()}</span>
                    </div>
                    {yearExpenses.length > 0 ? (
                      <div className="cd-expense-list">
                        {yearExpenses.map(exp => (
                          <div key={exp.id} className="cd-expense-row">
                            <span className="cd-expense-name">{exp.item_name}</span>
                            <span className="cd-expense-amount">₱{Number(exp.amount).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="cd-no-data-small">No expenses recorded for this year.</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="cd-empty-state">
              <span className="cd-empty-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardIcon size={48} strokeWidth={1.5} style={{ color: '#cbd5e1' }} />
              </span>
              <p>No expense details available yet for this course.</p>
            </div>
          )}
        </section>

        {/* ── COLLEGES OFFERING ── */}
        <section className="cd-section">
          <div className="cd-section-header">
            <div className="cd-section-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <SchoolIcon size={20} strokeWidth={2} style={{ color: '#3A9B8E' }} />
            </div>
            <div>
              <h2 className="cd-section-title">Schools Offering This Program</h2>
              <p className="cd-section-sub">
                {course.colleges && course.colleges.length > 0
                  ? `${course.colleges.length} institution${course.colleges.length > 1 ? 's' : ''} currently offer${course.colleges.length === 1 ? 's' : ''} this program`
                  : 'Check back for school availability'}
              </p>
            </div>
          </div>

          {course.colleges && course.colleges.length > 0 ? (
            <div className="cd-colleges-grid">
              {course.colleges.map(col => (
                <Link
                  key={col.id}
                  to={`/courses/${id}?college_id=${col.id}`}
                  className={`cd-college-card ${col.id === Number(collegeId) ? 'cd-college-card-active' : ''}`}
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
                    <h3 className="cd-college-name">{col.name}</h3>
                    {col.id === Number(collegeId) ? (
                      <span className="cd-pricing-badge" style={{ background: 'rgba(58,155,142,0.1)', color: '#3A9B8E', fontWeight: 700, fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13 5L6 12 3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Viewing this school's pricing
                      </span>
                    ) : col.has_specific_pricing ? (
                      <span className="cd-pricing-badge cd-pricing-specific">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13 5L6 12 3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Specific pricing available
                      </span>
                    ) : (
                      <span className="cd-pricing-badge cd-pricing-generic">
                        Uses generic pricing
                      </span>
                    )}
                  </div>
                  <svg className="cd-college-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cd-empty-state">
              <span className="cd-empty-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <SchoolIcon size={48} strokeWidth={1.5} style={{ color: '#cbd5e1' }} />
              </span>
              <p>No schools currently offering this program.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}