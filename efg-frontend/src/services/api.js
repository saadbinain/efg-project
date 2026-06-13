const API_BASE = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// Public API functions
export const fetchCourses = (search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/courses${query}`);
};

export const fetchCourseById = (id) => request(`/courses/${id}`);

export const fetchColleges = () => request('/colleges');

export const fetchCollegeById = (id) => request(`/colleges/${id}`);

export const fetchSpecificPricing = (collegeId, courseId) =>
  request(`/college-courses?college_id=${collegeId}&course_id=${courseId}`);