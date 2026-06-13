import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="bg-primary text-white w-full md:w-64 p-6">
        <Link to="/admin" className="text-2xl font-bold no-underline text-white block mb-8">
          Admin<span className="text-accent">.</span>
        </Link>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/courses" className="block py-2 px-3 rounded hover:bg-accent transition">
            Manage Courses
          </Link>
          <Link to="/admin/colleges" className="block py-2 px-3 rounded hover:bg-accent transition">
            Manage Colleges
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <p className="text-xs text-gray-300 mb-2">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="text-sm bg-highlight px-3 py-1 rounded hover:bg-orange-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-bgLight">
        <Outlet />
      </main>
    </div>
  )
}