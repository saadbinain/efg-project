import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adm-login-page">
      {/* Floating particles */}
      <div className="adm-login-particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="efg-particle" style={{ '--delay': `${i * 1.4}s`, '--x': `${10 + i * 18}%` }} />
        ))}
      </div>

      <div className="adm-login-card">
        <div className="adm-login-header">
          <img src="/efglogo.png" alt="EFG Logo" className="adm-login-logo" />
          <h1 className="adm-login-title">Admin Portal</h1>
          <p className="adm-login-subtitle">Sign in to manage your platform</p>
        </div>

        {error && (
          <div className="adm-login-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="adm-login-form">
          <div className="adm-input-group">
            <label className="adm-input-label">Email Address</label>
            <div className="adm-input-wrap">
              <svg className="adm-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 5l7 4 7-4" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input
                type="email"
                placeholder="admin@efg.edu"
                className="adm-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                id="admin-email-input"
              />
            </div>
          </div>

          <div className="adm-input-group">
            <label className="adm-input-label">Password</label>
            <div className="adm-input-wrap">
              <svg className="adm-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input
                type="password"
                placeholder="••••••••"
                className="adm-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                id="admin-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="adm-login-btn"
            id="admin-login-submit"
          >
            {loading ? (
              <>
                <span className="adm-spinner" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="adm-login-footer-text">
          Educational Financial Guide — Admin Management
        </p>
      </div>
    </div>
  )
}