import { supabase } from '../supabaseClient'

const API_BASE = '/api/admin'  // Proxied by Vite → no CORS preflight overhead

async function authFetch(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
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
export const addCourseToCollege = (collegeId, courseId) =>
  authFetch(`/colleges/${collegeId}/courses`, { method: 'POST', body: JSON.stringify({ course_id: courseId }) })
export const removeCourseFromCollege = (collegeId, courseId) =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}`, { method: 'DELETE' })

export const fetchCollegeCourseExpenses = (collegeId, courseId, year = '') =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}/expenses${year ? `?year=${year}` : ''}`)
export const addCollegeCourseExpense = (collegeId, courseId, expense) =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}/expenses`, { method: 'POST', body: JSON.stringify(expense) })
export const updateCollegeCourseExpense = (collegeId, courseId, expenseId, expense) =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}/expenses/${expenseId}`, { method: 'PUT', body: JSON.stringify(expense) })
export const deleteCollegeCourseExpense = (collegeId, courseId, expenseId) =>
  authFetch(`/colleges/${collegeId}/courses/${courseId}/expenses/${expenseId}`, { method: 'DELETE' })
export const fetchCourseExpenses = (courseId, year = '') =>
  authFetch(`/courses/${courseId}/expenses${year ? `?year=${year}` : ''}`);

export const addCourseExpense = (courseId, expense) =>
  authFetch(`/courses/${courseId}/expenses`, { method: 'POST', body: JSON.stringify(expense) });

export const updateCourseExpense = (courseId, expenseId, expense) =>
  authFetch(`/courses/${courseId}/expenses/${expenseId}`, { method: 'PUT', body: JSON.stringify(expense) });

export const deleteCourseExpense = (courseId, expenseId) =>
  authFetch(`/courses/${courseId}/expenses/${expenseId}`, { method: 'DELETE' });

export const uploadLogo = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return authFetch('/upload', {
    method: 'POST',
    body: formData
  })
}