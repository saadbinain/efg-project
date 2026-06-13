import { useState, useEffect } from 'react'
import {
  fetchAdminCourses, createCourse, updateCourse, deleteCourse,
  fetchCourseExpenses, addCourseExpense, updateCourseExpense, deleteCourseExpense
} from '../../services/adminApi'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)  // course id or 'new'
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

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!selectedCourse ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary">Manage Courses</h1>
            <button onClick={openAddCourse} className="bg-accent text-white px-4 py-2 rounded-md">
              Add New Course
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-bgLight">
                <tr>
                  <th className="py-2 px-4 text-left">Name (Acronym)</th>
                  <th className="py-2 px-4 text-left">Years</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-t">
                    <td className="py-2 px-4">{course.name} {course.acronym && `(${course.acronym})`}</td>
                    <td className="py-2 px-4">{course.years_to_complete}</td>
                    <td className="py-2 px-4 text-right space-x-2">
                      <button onClick={() => manageExpenses(course)} className="text-accent hover:underline">Expenses</button>
                      <button onClick={() => openEditCourse(course)} className="text-primary hover:underline">Edit</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => setSelectedCourse(null)} className="text-accent hover:underline mb-4 inline-block">
            &larr; Back to Courses
          </button>
          <h2 className="text-xl font-bold text-primary mb-4">
            Expenses for {selectedCourse.name} ({selectedCourse.acronym})
          </h2>

          {/* Year selector */}
          <div className="flex gap-2 mb-4">
            {Array.from({ length: selectedCourse.years_to_complete }, (_, i) => i + 1).map(year => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`px-4 py-2 rounded ${selectedYear === year ? 'bg-primary text-white' : 'bg-white border'}`}
              >
                Year {year}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Year {selectedYear} Items</h3>
            <button onClick={openAddExpense} className="bg-accent text-white px-3 py-1 rounded text-sm">
              Add Item
            </button>
          </div>

          <table className="min-w-full bg-white rounded-lg shadow text-sm">
            <thead className="bg-bgLight">
              <tr>
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} className="border-t">
                  <td className="py-2 px-4">{exp.item_name}</td>
                  <td className="py-2 px-4 text-right">${Number(exp.amount).toLocaleString()}</td>
                  <td className="py-2 px-4 text-right space-x-2">
                    <button onClick={() => openEditExpense(exp)} className="text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expense form modal */}
          {editingExpense !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">
                  {editingExpense === 'new' ? 'Add Expense' : 'Edit Expense'}
                </h3>
                <form onSubmit={handleExpenseSubmit} className="space-y-3">
                  <input
                    placeholder="Item name (e.g., Tuition)"
                    className="w-full border rounded px-3 py-2"
                    value={expenseForm.item_name}
                    onChange={e => setExpenseForm({...expenseForm, item_name: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-full border rounded px-3 py-2"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({...expenseForm, amount: +e.target.value})}
                    required
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={closeExpenseForm} className="px-3 py-1 border rounded">Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-accent text-white rounded">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Course add/edit modal (same as before but with acronym) */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-primary mb-4">
              {editing === 'new' ? 'Add Course' : 'Edit Course'}
            </h2>
            <form onSubmit={handleCourseSubmit} className="space-y-3">
              <input placeholder="Course Name" className="w-full border rounded px-3 py-2" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
              <input placeholder="Acronym (e.g., BSCS)" className="w-full border rounded px-3 py-2" value={form.acronym}
                onChange={e => setForm({...form, acronym: e.target.value})} />
              <textarea placeholder="Description" className="w-full border rounded px-3 py-2" value={form.overview}
                onChange={e => setForm({...form, overview: e.target.value})} />
              <input type="number" placeholder="Years to Complete" className="w-full border rounded px-3 py-2"
                value={form.years_to_complete} onChange={e => setForm({...form, years_to_complete: +e.target.value})} min="1" />
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={closeForm} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}