import { useState, useEffect } from 'react'
import {
  fetchAdminColleges, createCollege, updateCollege, deleteCollege, uploadLogo,
  fetchAdminCourses, fetchCollegeCourses, addCourseToCollege, removeCourseFromCollege,
  fetchCollegeCourseExpenses, addCollegeCourseExpense, updateCollegeCourseExpense, deleteCollegeCourseExpense
} from '../../services/adminApi'

export default function AdminColleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadError, setUploadError] = useState('')
  
  const [form, setForm] = useState({
    name: '',
    abbreviation: '',
    description: '',
    logo_url: '',
    locations: '',
    branches: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: ''
  })

  // Drill-down states
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  const [collegeCourses, setCollegeCourses] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [linkingCourse, setLinkingCourse] = useState(false)
  const [courseToLink, setCourseToLink] = useState('')
  
  const [courseExpenses, setCourseExpenses] = useState([])
  const [selectedYear, setSelectedYear] = useState(1)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState({ item_name: '', amount: 0 })

  const loadColleges = async () => {
    setLoading(true)
    try {
      const data = await fetchAdminColleges()
      setColleges(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadColleges()
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingLogo(true)
    setUploadError('')
    try {
      const result = await uploadLogo(file)
      if (result.success && result.url) {
        setForm(prev => ({ ...prev, logo_url: result.url }))
      } else {
        throw new Error('No URL returned from upload server')
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image')
    } finally {
      setUploadingLogo(false)
    }
  }

  const openAdd = () => {
    setEditing('new')
    setUploadError('')
    setForm({
      name: '', abbreviation: '', description: '', logo_url: '', locations: '', branches: '',
      email: '', phone: '', facebook: '', twitter: ''
    })
  }

  const openEdit = async (college) => {
    setEditing(college.id)
    setUploadError('')
    setForm({
      name: college.name || '',
      abbreviation: college.abbreviation || '',
      description: college.description || '',
      logo_url: college.logo_url || '',
      locations: Array.isArray(college.locations) ? college.locations.join(', ') : '',
      branches: Array.isArray(college.branches) ? college.branches.join(', ') : '',
      email: college.contacts?.email || '',
      phone: college.contacts?.phone || '',
      facebook: college.social_media?.facebook || '',
      twitter: college.social_media?.twitter || ''
    })
  }

  const closeForm = () => setEditing(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      abbreviation: form.abbreviation,
      description: form.description,
      logo_url: form.logo_url,
      locations: form.locations.split(',').map(s => s.trim()).filter(Boolean),
      branches: form.branches.split(',').map(s => s.trim()).filter(Boolean),
      contacts: { email: form.email, phone: form.phone },
      social_media: { facebook: form.facebook, twitter: form.twitter },
      highlight_pictures_urls: []
    }
    try {
      if (editing === 'new') await createCollege(payload)
      else await updateCollege(editing, payload)
      closeForm()
      loadColleges()
    } catch (err) { setError(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this college?')) return
    try {
      await deleteCollege(id)
      loadColleges()
    } catch (err) { setError(err.message) }
  }

  // Offered Courses View
  const handleViewCollegeCourses = async (college) => {
    setSelectedCollege(college)
    setSelectedCourse(null)
    setLoading(true)
    try {
      const data = await fetchCollegeCourses(college.id)
      setCollegeCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openLinkCourse = async () => {
    setLinkingCourse(true)
    setCourseToLink('')
    try {
      const all = await fetchAdminCourses()
      // Filter out courses already linked to this college
      const linkedIds = collegeCourses.map(c => c.id)
      const available = all.filter(c => !linkedIds.includes(c.id))
      setAllCourses(available)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLinkCourseSubmit = async (e) => {
    e.preventDefault()
    if (!courseToLink) return
    try {
      await addCourseToCollege(selectedCollege.id, courseToLink)
      setLinkingCourse(false)
      // Refresh list
      const data = await fetchCollegeCourses(selectedCollege.id)
      setCollegeCourses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUnlinkCourse = async (courseId) => {
    if (!confirm('Are you sure you want to unlink this course from this school? All school-specific expenses for this course will be deleted.')) return
    try {
      await removeCourseFromCollege(selectedCollege.id, courseId)
      // Refresh list
      const data = await fetchCollegeCourses(selectedCollege.id)
      setCollegeCourses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  // School Course Expenses View
  const handleViewCourseExpenses = async (course) => {
    setSelectedCourse(course)
    setSelectedYear(1)
    setEditingExpense(null)
    setLoading(true)
    try {
      const data = await fetchCollegeCourseExpenses(selectedCollege.id, course.id, 1)
      setCourseExpenses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleYearChange = async (year) => {
    setSelectedYear(year)
    setEditingExpense(null)
    setLoading(true)
    try {
      const data = await fetchCollegeCourseExpenses(selectedCollege.id, selectedCourse.id, year)
      setCourseExpenses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openAddExpense = () => {
    setEditingExpense('new')
    setExpenseForm({ item_name: '', amount: 0 })
  }

  const openEditExpense = (exp) => {
    setEditingExpense(exp.id)
    setExpenseForm({ item_name: exp.item_name, amount: exp.amount })
  }

  const closeExpenseForm = () => setEditingExpense(null)

  const handleExpenseSubmit = async (e) => {
    e.preventDefault()
    const payload = { year_number: selectedYear, ...expenseForm }
    try {
      if (editingExpense === 'new') {
        await addCollegeCourseExpense(selectedCollege.id, selectedCourse.id, payload)
      } else {
        await updateCollegeCourseExpense(selectedCollege.id, selectedCourse.id, editingExpense, payload)
      }
      closeExpenseForm()
      // Refresh
      const data = await fetchCollegeCourseExpenses(selectedCollege.id, selectedCourse.id, selectedYear)
      setCourseExpenses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense item?')) return
    try {
      await deleteCollegeCourseExpense(selectedCollege.id, selectedCourse.id, id)
      // Refresh
      const data = await fetchCollegeCourseExpenses(selectedCollege.id, selectedCourse.id, selectedYear)
      setCourseExpenses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading && colleges.length === 0) return (
    <div className="adm-loading">
      <span className="adm-spinner" />
      Loading...
    </div>
  )

  return (
    <div>
      {error && (
        <div className="adm-error-banner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {error}
          <button onClick={() => setError('')} className="adm-error-dismiss">✕</button>
        </div>
      )}

      {/* VIEW 3: SCHOOL COURSE EXPENSES VIEW */}
      {selectedCourse ? (
        <div>
          <button onClick={() => handleViewCollegeCourses(selectedCollege)} className="adm-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to {selectedCollege.name} Programs
          </button>

          <div className="adm-page-header">
            <div>
              <h1 className="adm-page-title">
                {selectedCourse.name}
                {selectedCourse.acronym && <span className="adm-badge" style={{ marginLeft: '0.5rem' }}>{selectedCourse.acronym}</span>}
              </h1>
              <p className="adm-page-subtitle">School-specific expenses — {selectedCollege.name}</p>
            </div>
          </div>

          {/* Year tabs */}
          <div className="adm-year-tabs">
            {Array.from({ length: selectedCourse.years_to_complete || 4 }, (_, i) => i + 1).map(year => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`adm-year-tab ${selectedYear === year ? 'adm-year-tab-active' : ''}`}
              >
                Year {year}
              </button>
            ))}
          </div>

          <div className="adm-page-header" style={{ marginTop: '1.25rem' }}>
            <h2 className="adm-page-title" style={{ fontSize: '1.1rem' }}>Year {selectedYear} Expense Items</h2>
            <button onClick={openAddExpense} className="adm-btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Add Item
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td className="adm-course-name">{exp.item_name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      ₱{Number(exp.amount).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="adm-action-group">
                        <button onClick={() => openEditExpense(exp)} className="adm-action-link adm-action-blue">Edit</button>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="adm-action-link adm-action-red">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courseExpenses.length === 0 && (
                  <tr><td colSpan="3" className="adm-empty-row">No school-specific expenses for Year {selectedYear}. Click "Add Item" to add some!</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Expense modal */}
          {editingExpense !== null && (
            <div className="adm-modal-overlay" onClick={closeExpenseForm}>
              <div className="adm-modal" onClick={e => e.stopPropagation()}>
                <h3 className="adm-modal-title">
                  {editingExpense === 'new' ? 'Add Expense Item' : 'Edit Expense Item'}
                </h3>
                <form onSubmit={handleExpenseSubmit} className="adm-form">
                  <div className="adm-input-group">
                    <label className="adm-input-label">Item Name</label>
                    <input
                      placeholder="e.g., Tuition Fee, Book Fee"
                      className="adm-input"
                      value={expenseForm.item_name}
                      onChange={e => setExpenseForm({...expenseForm, item_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="adm-input-group">
                    <label className="adm-input-label">Amount (₱)</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="adm-input"
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm({...expenseForm, amount: +e.target.value})}
                      required
                    />
                  </div>
                  <div className="adm-modal-actions">
                    <button type="button" onClick={closeExpenseForm} className="adm-btn-cancel">Cancel</button>
                    <button type="submit" className="adm-btn-primary">Save Item</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : selectedCollege ? (
        /* VIEW 2: SCHOOL COURSES VIEW */
        <div>
          <button onClick={() => { setSelectedCollege(null); loadColleges(); }} className="adm-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Colleges
          </button>

          <div className="adm-page-header">
            <div>
              <h1 className="adm-page-title">Manage Programs offered by {selectedCollege.name}</h1>
              <p className="adm-page-subtitle">{collegeCourses.length} program{collegeCourses.length !== 1 ? 's' : ''} assigned</p>
            </div>
            <button onClick={openLinkCourse} className="adm-btn-primary" id="link-course-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Link a Course
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Program Name</th>
                  <th>Years</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collegeCourses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <button 
                        onClick={() => handleViewCourseExpenses(course)}
                        className="adm-action-link adm-action-blue"
                        style={{ fontSize: '0.98rem', fontWeight: 800, border: 'none', background: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        {course.name}
                        {course.acronym && <span className="adm-badge" style={{ marginLeft: '0.5rem' }}>{course.acronym}</span>}
                      </button>
                    </td>
                    <td>
                      <span className="adm-year-pill">{course.years_to_complete} yr{course.years_to_complete > 1 ? 's' : ''}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="adm-action-group">
                        <button onClick={() => handleViewCourseExpenses(course)} className="adm-action-link adm-action-teal">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M11 4H6.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          Expenses
                        </button>
                        <button onClick={() => handleUnlinkCourse(course.id)} className="adm-action-link adm-action-red">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          Remove link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {collegeCourses.length === 0 && (
                  <tr><td colSpan="3" className="adm-empty-row">No courses offered yet. Click "Link a Course" to assign one!</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Link Course Modal */}
          {linkingCourse && (
            <div className="adm-modal-overlay" onClick={() => setLinkingCourse(false)}>
              <div className="adm-modal" onClick={e => e.stopPropagation()}>
                <h3 className="adm-modal-title">Link Course to School</h3>
                <form onSubmit={handleLinkCourseSubmit} className="adm-form">
                  <div className="adm-input-group">
                    <label className="adm-input-label">Select Course</label>
                    <select
                      className="adm-input"
                      style={{ padding: '0.65rem', borderRadius: '10px' }}
                      value={courseToLink}
                      onChange={e => setCourseToLink(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a Course --</option>
                      {allCourses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.acronym ? `(${c.acronym})` : ''}
                        </option>
                      ))}
                    </select>
                    {allCourses.length === 0 && (
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                        All available courses are already linked to this school.
                      </p>
                    )}
                  </div>
                  <div className="adm-modal-actions">
                    <button type="button" onClick={() => setLinkingCourse(false)} className="adm-btn-cancel">Cancel</button>
                    <button type="submit" className="adm-btn-primary" disabled={!courseToLink}>Link Course</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 1: COLLEGES LIST VIEW */
        <div>
          <div className="adm-page-header">
            <div>
              <h1 className="adm-page-title">Manage Colleges</h1>
              <p className="adm-page-subtitle">{colleges.length} school{colleges.length !== 1 ? 's' : ''} registered</p>
            </div>
            <button onClick={openAdd} className="adm-btn-primary" id="add-college-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Add College
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: '56px' }}>Logo</th>
                  <th>College Name</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map(college => (
                  <tr key={college.id}>
                    <td>
                      <div className="adm-college-logo">
                        {college.logo_url ? (
                          <img src={college.logo_url} alt="" />
                        ) : (
                          <span>🏫</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleViewCollegeCourses(college)}
                        className="adm-action-link adm-action-blue"
                        style={{ fontSize: '0.98rem', fontWeight: 800, border: 'none', background: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        {college.name}
                        {college.abbreviation && <span className="adm-badge" style={{ marginLeft: '0.5rem' }}>{college.abbreviation}</span>}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="adm-action-group">
                        <button onClick={() => handleViewCollegeCourses(college)} className="adm-action-link adm-action-teal">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 14h12M3 14V6l5-4 5 4v8M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Courses
                        </button>
                        <button onClick={() => openEdit(college)} className="adm-action-link adm-action-blue">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(college.id)} className="adm-action-link adm-action-red">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {colleges.length === 0 && (
                  <tr><td colSpan="3" className="adm-empty-row">No colleges found. Click "Add College" to get started!</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* College Add/Edit Modal */}
          {editing !== null && (
            <div className="adm-modal-overlay" onClick={closeForm}>
              <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
                <h2 className="adm-modal-title">
                  {editing === 'new' ? 'Add New College' : 'Edit College'}
                </h2>
                <form onSubmit={handleSubmit} className="adm-form">
                  <div className="adm-form-row">
                    <div className="adm-input-group">
                      <label className="adm-input-label">College Name</label>
                      <input 
                        placeholder="e.g., Tech University" 
                        className="adm-input" 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="adm-input-group">
                      <label className="adm-input-label">Abbreviation / Acronym</label>
                      <input 
                        placeholder="e.g., TU" 
                        className="adm-input" 
                        value={form.abbreviation} 
                        onChange={e => setForm({...form, abbreviation: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="adm-input-group">
                    <label className="adm-input-label">Description</label>
                    <textarea 
                      placeholder="Brief overview of the college..." 
                      className="adm-textarea" 
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})} 
                    />
                  </div>
                  <div className="adm-input-group">
                    <label className="adm-input-label">College Logo</label>
                    <div className="adm-logo-upload-zone">
                      {form.logo_url ? (
                        <div className="adm-logo-upload-preview">
                          <img src={form.logo_url} alt="Uploaded logo preview" />
                          <button 
                            type="button" 
                            className="adm-logo-remove-btn"
                            onClick={() => setForm(prev => ({ ...prev, logo_url: '' }))}
                            title="Remove Logo"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="adm-logo-upload-label">
                          {uploadingLogo ? (
                            <div className="adm-logo-upload-spinner">
                              <span className="adm-spinner-sm" />
                              <span>Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                              <span>Click to upload image</span>
                              <span className="adm-logo-upload-subtext">JPG, PNG, WEBP, or SVG (max 5MB)</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                            disabled={uploadingLogo}
                          />
                        </label>
                      )}
                    </div>
                    {uploadError && <p className="adm-input-error-text">{uploadError}</p>}
                    
                    <details className="adm-logo-manual-details">
                      <summary className="adm-logo-manual-summary">Or enter URL manually</summary>
                      <input 
                        placeholder="https://example.com/logo.png" 
                        className="adm-input adm-logo-manual-input" 
                        value={form.logo_url} 
                        onChange={e => setForm({...form, logo_url: e.target.value})} 
                      />
                    </details>
                  </div>
                  <div className="adm-form-row">
                    <div className="adm-input-group">
                      <label className="adm-input-label">Locations (comma-separated)</label>
                      <input 
                        placeholder="Manila, Cebu" 
                        className="adm-input" 
                        value={form.locations} 
                        onChange={e => setForm({...form, locations: e.target.value})} 
                      />
                    </div>
                    <div className="adm-input-group">
                      <label className="adm-input-label">Branches (comma-separated)</label>
                      <input 
                        placeholder="Main Campus, Annex" 
                        className="adm-input" 
                        value={form.branches} 
                        onChange={e => setForm({...form, branches: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="adm-form-row">
                    <div className="adm-input-group">
                      <label className="adm-input-label">Email</label>
                      <input 
                        type="email"
                        placeholder="info@college.edu" 
                        className="adm-input" 
                        value={form.email} 
                        onChange={e => setForm({...form, email: e.target.value})} 
                      />
                    </div>
                    <div className="adm-input-group">
                      <label className="adm-input-label">Phone</label>
                      <input 
                        placeholder="+63 2 8123 4567" 
                        className="adm-input" 
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="adm-form-row">
                    <div className="adm-input-group">
                      <label className="adm-input-label">Facebook URL</label>
                      <input 
                        placeholder="https://facebook.com/..." 
                        className="adm-input" 
                        value={form.facebook} 
                        onChange={e => setForm({...form, facebook: e.target.value})} 
                      />
                    </div>
                    <div className="adm-input-group">
                      <label className="adm-input-label">Twitter URL</label>
                      <input 
                        placeholder="https://twitter.com/..." 
                        className="adm-input" 
                        value={form.twitter} 
                        onChange={e => setForm({...form, twitter: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="adm-modal-actions">
                    <button type="button" onClick={closeForm} className="adm-btn-cancel">Cancel</button>
                    <button type="submit" className="adm-btn-primary">Save College</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
