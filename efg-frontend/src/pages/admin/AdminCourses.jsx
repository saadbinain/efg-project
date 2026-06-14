import { useState, useEffect } from 'react'
import {
  fetchAdminCourses, createCourse, updateCourse, deleteCourse,
  fetchCourseExpenses, addCourseExpense, updateCourseExpense, deleteCourseExpense
} from '../../services/adminApi'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', acronym: '', overview: '', years_to_complete: 4 })

  // Expense management state
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [selectedYear, setSelectedYear] = useState(1)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState({ item_name: '', amount: 0 })

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminCourses()
      setCourses(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadCourses() }, [])

  const loadExpenses = async (courseId, year) => {
    try {
      const data = await fetchCourseExpenses(courseId, year)
      setExpenses(data)
    } catch (err) { setError(err.message) }
  }

  const openAddCourse = () => {
    setEditing('new')
    setForm({ name: '', acronym: '', overview: '', years_to_complete: 4 })
  }

  const openEditCourse = (course) => {
    setEditing(course.id)
    setForm({ ...course })
  }

  const closeForm = () => setEditing(null)

  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing === 'new') await createCourse(form)
      else await updateCourse(editing, form)
      closeForm()
      loadCourses()
    } catch (err) { setError(err.message) }
  }

  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course?')) return
    try {
      await deleteCourse(id)
      loadCourses()
      if (selectedCourse?.id === id) setSelectedCourse(null)
    } catch (err) { setError(err.message) }
  }

  const manageExpenses = (course) => {
    setSelectedCourse(course)
    setSelectedYear(1)
    setEditingExpense(null)
    loadExpenses(course.id, 1)
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    loadExpenses(selectedCourse.id, year)
    setEditingExpense(null)
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
      if (editingExpense === 'new')
        await addCourseExpense(selectedCourse.id, payload)
      else
        await updateCourseExpense(selectedCourse.id, editingExpense, payload)
      closeExpenseForm()
      loadExpenses(selectedCourse.id, selectedYear)
    } catch (err) { setError(err.message) }
  }

  const handleDeleteExpense = async (id) => {
    if (!confirm('Delete this expense?')) return
    try {
      await deleteCourseExpense(selectedCourse.id, id)
      loadExpenses(selectedCourse.id, selectedYear)
    } catch (err) { setError(err.message) }
  }

  if (loading) return (
    <div className="adm-loading">
      <span className="adm-spinner" />
      Loading courses...
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

      {!selectedCourse ? (
        <>
          {/* Course List View */}
          <div className="adm-page-header">
            <div>
              <h1 className="adm-page-title">Manage Courses</h1>
              <p className="adm-page-subtitle">{courses.length} program{courses.length !== 1 ? 's' : ''} registered</p>
            </div>
            <button onClick={openAddCourse} className="adm-btn-primary" id="add-course-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Add Course
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
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <div className="adm-course-name-cell">
                        <span className="adm-course-name">{course.name}</span>
                        {course.acronym && <span className="adm-badge">{course.acronym}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="adm-year-pill">{course.years_to_complete} yr{course.years_to_complete > 1 ? 's' : ''}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="adm-action-group">
                        <button onClick={() => manageExpenses(course)} className="adm-action-link adm-action-teal">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M11 4H6.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          Expenses
                        </button>
                        <button onClick={() => openEditCourse(course)} className="adm-action-link adm-action-blue">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="adm-action-link adm-action-red">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr><td colSpan="3" className="adm-empty-row">No courses found. Click "Add Course" to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Expense Management View */
        <div>
          <button onClick={() => setSelectedCourse(null)} className="adm-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Courses
          </button>

          <div className="adm-page-header">
            <div>
              <h1 className="adm-page-title">
                {selectedCourse.name}
                {selectedCourse.acronym && <span className="adm-badge" style={{ marginLeft: '0.5rem' }}>{selectedCourse.acronym}</span>}
              </h1>
              <p className="adm-page-subtitle">Expense management — {selectedCourse.years_to_complete} year program</p>
            </div>
          </div>

          {/* Year tabs */}
          <div className="adm-year-tabs">
            {Array.from({ length: selectedCourse.years_to_complete }, (_, i) => i + 1).map(year => (
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
            <h2 className="adm-page-title" style={{ fontSize: '1.1rem' }}>Year {selectedYear} Items</h2>
            <button onClick={openAddExpense} className="adm-btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Add Item
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
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
                {expenses.length === 0 && (
                  <tr><td colSpan="3" className="adm-empty-row">No expenses for Year {selectedYear}. Click "Add Item" to create one.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Expense form modal */}
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
                      placeholder="e.g., Tuition Fee"
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
      )}

      {/* Course add/edit modal */}
      {editing !== null && (
        <div className="adm-modal-overlay" onClick={closeForm}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <h2 className="adm-modal-title">
              {editing === 'new' ? 'Add New Course' : 'Edit Course'}
            </h2>
            <form onSubmit={handleCourseSubmit} className="adm-form">
              <div className="adm-input-group">
                <label className="adm-input-label">Course Name</label>
                <input placeholder="e.g., Bachelor of Science in Computer Science" className="adm-input" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="adm-form-row">
                <div className="adm-input-group">
                  <label className="adm-input-label">Acronym</label>
                  <input placeholder="e.g., BSCS" className="adm-input" value={form.acronym}
                    onChange={e => setForm({...form, acronym: e.target.value})} />
                </div>
                <div className="adm-input-group">
                  <label className="adm-input-label">Years to Complete</label>
                  <input type="number" className="adm-input" value={form.years_to_complete}
                    onChange={e => setForm({...form, years_to_complete: +e.target.value})} min="1" />
                </div>
              </div>
              <div className="adm-input-group">
                <label className="adm-input-label">Description</label>
                <textarea placeholder="Brief overview of the program..." className="adm-textarea" value={form.overview}
                  onChange={e => setForm({...form, overview: e.target.value})} />
              </div>
              <div className="adm-modal-actions">
                <button type="button" onClick={closeForm} className="adm-btn-cancel">Cancel</button>
                <button type="submit" className="adm-btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}