import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!user) return <Navigate to="/admin/login" replace />

  return children
}