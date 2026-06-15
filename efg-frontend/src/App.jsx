import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CourseSearch from './pages/CourseSearch'
import CourseDetails from './pages/CourseDetails'
import CollegeList from './pages/CollegeList'
import CollegeProfile from './pages/CollegeProfile'

// Admin imports
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourses from './pages/admin/AdminCourses'
import AdminColleges from './pages/admin/AdminColleges'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with main Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseSearch />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/colleges" element={<CollegeList />} />
          <Route path="/colleges/:id" element={<CollegeProfile />} />
        </Route>

        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="colleges" element={<AdminColleges />} />
        </Route>

        {/* Catch-all route to redirect back to home if no route matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App