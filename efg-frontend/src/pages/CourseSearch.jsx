import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { fetchCourses, fetchCourseById } from '../services/api'

// Module-level cache shared with CourseDetails — prefetched data lives here
export const courseCache = {}

const INITIAL_VISIBLE = 6

export default function CourseSearch() {
    const [search, setSearch] = useState('')
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
    const prefetchedRef = useRef(new Set())
    const debounceTimeoutRef = useRef(null)
    const isFirstRender = useRef(true)

    const loadCourses = async (query = '') => {
        try {
            setLoading(true)
            setError('')
            const data = await fetchCourses(query)
            setCourses(data)
            setVisibleCount(INITIAL_VISIBLE) // reset on new search
        } catch (err) {
            setError('Failed to load courses. Make sure the backend server is running.')
        } finally {
            setLoading(false)
        }
    }

    // Live search effect
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            loadCourses('')
            return
        }

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
            loadCourses(search)
        }, 200)

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [search])

    const handleSearch = (e) => {
        e.preventDefault()
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        loadCourses(search)
    }

    // Start fetching course detail on hover — by the time user clicks, it's ready
    const handlePrefetch = (courseId) => {
        if (prefetchedRef.current.has(courseId)) return
        prefetchedRef.current.add(courseId)
        fetchCourseById(courseId)
            .then(data => { courseCache[courseId] = data })
            .catch(() => {})
    }

    const visibleCourses = courses.slice(0, visibleCount)
    const hasMore = visibleCount < courses.length

    return (
        <div className="cd-page">
            <section className="cd-hero">
                <div className="cd-hero-particles">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="efg-particle" style={{ '--delay': `${i * 1.2}s`, '--x': `${10 + i * 22}%` }} />
                    ))}
                </div>
                <div className="cd-hero-inner" style={{ padding: '3.5rem 2rem' }}>
                    <h1 className="cd-hero-title">Explore Programs</h1>
                    <p className="cd-hero-overview" style={{ marginBottom: 0 }}>
                        Discover undergraduate programs, estimate tuition, books, uniforms, and other expenses across different institutions.
                    </p>
                    <form onSubmit={handleSearch} className="hero-search-wrap">
                        <input
                            type="text"
                            placeholder="Search for courses (e.g., Computer Science, Nursing, Criminology...)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit">🔍 Search</button>
                    </form>
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
                ) : courses.length === 0 ? (
                    <div className="cd-empty-state">
                        <span className="cd-empty-icon">🔍</span>
                        <p>No courses found matching "{search}". Try another term.</p>
                    </div>
                ) : (
                    <>
                        {/* Result count */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                Showing <strong>{Math.min(visibleCount, courses.length)}</strong> of <strong>{courses.length}</strong> programs
                            </p>
                        </div>

                        <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                            {visibleCourses.map(course => (
                                <Link
                                    key={course.id}
                                    to={`/courses/${course.id}`}
                                    className="efg-course-grid-card"
                                    onMouseEnter={() => handlePrefetch(course.id)}
                                    onFocus={() => handlePrefetch(course.id)}
                                    style={{ minHeight: '180px' }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            {course.acronym ? (
                                                <span className="efg-course-card-acro">{course.acronym}</span>
                                            ) : (
                                                <div />
                                            )}
                                            {course.years_to_complete && (
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3A9B8E', background: 'rgba(58,155,142,0.08)', padding: '0.2rem 0.5rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                                                    {course.years_to_complete} Yrs
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="efg-course-card-title" style={{ marginTop: '0.25rem' }}>{course.name}</h2>
                                        {course.overview && (
                                            <p className="efg-course-card-overview">{course.overview}</p>
                                        )}
                                    </div>
                                    <div className="efg-course-card-footer">
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Undergraduate Program</span>
                                        <span className="efg-course-card-hint">
                                            View Expenses
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </span>
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
                                    View More Programs ↓
                                </button>
                            ) : courses.length > INITIAL_VISIBLE ? (
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