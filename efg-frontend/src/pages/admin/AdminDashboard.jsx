import { useState, useEffect } from 'react'
import { fetchAdminCourses } from '../../services/adminApi'
import { fetchAdminColleges } from '../../services/adminApi'
import { ClipboardIcon } from '../../components/Icons'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, colleges: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchAdminCourses().catch(() => []),
      fetchAdminColleges().catch(() => []),
    ]).then(([courses, colleges]) => {
      setStats({ courses: courses.length, colleges: colleges.length })
      setLoading(false)
    })
  }, [])

  const cards = [
    {
      label: 'Total Courses',
      value: stats.courses,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 6l10-4 10 4-10 4-10-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M4 8v7c0 2 3.6 4 8 4s8-2 8-4V8" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      color: '#3A9B8E',
    },
    {
      label: 'Total Schools',
      value: stats.colleges,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#E67E22',
    },
  ]

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Dashboard</h1>
        <p className="adm-page-subtitle">Welcome to the EFG Admin Management Portal</p>
      </div>

      <div className="adm-stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className="adm-stat-info">
              <span className="adm-stat-value">
                {loading ? '—' : card.value}
              </span>
              <span className="adm-stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-welcome-card">
        <div className="adm-welcome-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClipboardIcon size={28} strokeWidth={1.5} style={{ color: '#1A2C4E' }} />
        </div>
        <h2 className="adm-welcome-title">Quick Start</h2>
        <p className="adm-welcome-text">
          Use the sidebar navigation to manage courses and colleges. You can add, edit, or remove programs and schools from the platform.
        </p>
        <div className="adm-welcome-actions">
          <a href="/admin/courses" className="adm-action-btn adm-action-primary">Manage Courses</a>
          <a href="/admin/colleges" className="adm-action-btn adm-action-secondary">Manage Colleges</a>
        </div>
      </div>
    </div>
  )
}