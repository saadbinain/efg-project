import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    exact: true,
  },
  {
    label: 'Courses',
    to: '/admin/courses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 4l8-3 8 3-8 3-8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M3 5.5v5.5c0 1.5 2.7 3 6 3s6-1.5 6-3V5.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Colleges',
    to: '/admin/colleges',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 16h14M3 16V7l6-5 6 5v9M7 16v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-top">
          {/* Logo */}
          <Link to="/admin" className="adm-logo-link">
            <img src="/efglogo.png" alt="EFG Logo" className="adm-logo-img" />
          </Link>

          <div className="adm-sidebar-label">MANAGEMENT</div>

          {/* Navigation */}
          <nav className="adm-nav">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`adm-nav-item ${isActive(item) ? 'adm-nav-active' : ''}`}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User section */}
        <div className="adm-sidebar-bottom">
          <div className="adm-user-card">
            <div className="adm-user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="adm-user-info">
              <span className="adm-user-role">Administrator</span>
              <span className="adm-user-email">{user?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="adm-logout-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  )
}