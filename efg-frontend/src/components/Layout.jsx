import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <span className="text-2xl font-bold tracking-tight">
                EFG<span className="text-accent">.</span>
              </span>
            </Link>
            <nav className="flex space-x-4 text-sm font-medium">
              <Link to="/courses" className="hover:text-accent transition-colors px-3 py-2 rounded-md">
                Courses
              </Link>
              <Link to="/colleges" className="hover:text-accent transition-colors px-3 py-2 rounded-md">
                Colleges
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-bgLight border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Education Financial Guidance. All rights reserved.
        </div>
      </footer>
    </div>
  )
}