import { supabase } from '../supabaseClient'

const API_BASE = 'http://localhost:8000/api/admin'   // New admin endpoints

async function authFetch(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || `Request failed`)
  }
  return res.json()
}

export const fetchAdminCourses = () => authFetch('/courses')
export const createCourse = (course) => authFetch('/courses', { method: 'POST', body: JSON.stringify(course) })
export const updateCourse = (id, course) => authFetch(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) })
export const deleteCourse = (id) => authFetch(`/courses/${id}`, { method: 'DELETE' })

export const fetchAdminColleges = () => authFetch('/colleges')
export const createCollege = (college) => authFetch('/colleges', { method: 'POST', body: JSON.stringify(college) })
export const updateCollege = (id, college) => authFetch(`/colleges/${id}`, { method: 'PUT', body: JSON.stringify(college) })
export const deleteCollege = (id) => authFetch(`/colleges/${id}`, { method: 'DELETE' })

export const fetchCollegeCourses = (collegeId) => authFetch(`/colleges/${collegeId}/courses`)
export const updateCollegeCoursePricing = (collegeId, courseId, pricing) =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}`, { method: 'PUT', body: JSON.stringify(pricing) })
export const addCourseToCollege = (collegeId, courseId, pricing) =>
  authFetch(`/colleges/${collegeId}/courses`, { method: 'POST', body: JSON.stringify({ course_id: courseId, ...pricing }) })
export const removeCourseFromCollege = (collegeId, courseId) =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}`, { method: 'DELETE' })
export const fetchCourseExpenses = (courseId, year = '') =>
  authFetch(`/courses/${courseId}/expenses${year ? `?year=${year}` : ''}`);

export const addCourseExpense = (courseId, expense) =>
  authFetch(`/courses/${courseId}/expenses`, { method: 'POST', body: JSON.stringify(expense) });

export const updateCourseExpense = (courseId, expenseId, expense) =>
  authFetch(`/courses/${courseId}/expenses/${expenseId}`, { method: 'PUT', body: JSON.stringify(expense) });

export const deleteCourseExpense = (courseId, expenseId) =>
  authFetch(`/courses/${courseId}/expenses/${expenseId}`, { method: 'DELETE' });