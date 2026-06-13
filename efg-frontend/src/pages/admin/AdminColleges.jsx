import { useState, useEffect } from 'react'
import { fetchAdminColleges, createCollege, updateCollege, deleteCollege } from '../../services/adminApi'

export default function AdminColleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    locations: '',
    branches: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: ''
  })

  const loadColleges = async () => {
    setLoading(true)
    try {
      const data = await fetchAdminColleges()
      setColleges(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadColleges()
  }, [])

  const openAdd = () => {
    setEditing('new')
    setForm({
      name: '',
      description: '',
      logo_url: '',
      locations: '',
      branches: '',
      email: '',
      phone: '',
      facebook: '',
      twitter: ''
    })
  }

  const openEdit = async (college) => {
    setEditing(college.id)
    // Map backend structure to flat form fields
    setForm({
      name: college.name || '',
      description: college.description || '',
      logo_url: college.logo_url || '',
      locations: Array.isArray(college.locations) ? college.locations.join(', ') : '',
      branches: Array.isArray(college.branches) ? college.branches.join(', ') : '',
      email: college.contacts?.email || '',
      phone: college.contacts?.phone || '',
      facebook: college.social_media?.facebook || '',
      twitter: college.social_media?.twitter || ''
    })
  }

  const closeForm = () => setEditing(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prepare payload matching backend expectations
    const payload = {
      name: form.name,
      description: form.description,
      logo_url: form.logo_url,
      locations: form.locations.split(',').map(s => s.trim()).filter(Boolean),
      branches: form.branches.split(',').map(s => s.trim()).filter(Boolean),
      contacts: {
        email: form.email,
        phone: form.phone
      },
      social_media: {
        facebook: form.facebook,
        twitter: form.twitter
      },
      highlight_pictures_urls: [] // initialized empty
    }

    try {
      if (editing === 'new') {
        await createCollege(payload)
      } else {
        await updateCollege(editing, payload)
      }
      closeForm()
      loadColleges()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this college?')) return
    try {
      await deleteCollege(id)
      loadColleges()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Colleges</h1>
        <button 
          onClick={openAdd} 
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-teal-700 transition cursor-pointer"
        >
          Add New College
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading colleges...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <table className="min-w-full text-sm">
            <thead className="bg-bgLight text-primary">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Logo</th>
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {colleges.map(college => (
                <tr key={college.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {college.logo_url ? (
                      <img src={college.logo_url} alt="" className="w-8 h-8 object-contain rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-bgLight rounded flex items-center justify-center text-gray-400 text-xs">Logo</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{college.name}</td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button 
                      onClick={() => openEdit(college)} 
                      className="text-accent hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(college.id)} 
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {colleges.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">No colleges found. Add one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold text-primary mb-4">
              {editing === 'new' ? 'Add College' : 'Edit College'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">COLLEGE NAME</label>
                <input 
                  placeholder="e.g., Tech University" 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">DESCRIPTION</label>
                <textarea 
                  placeholder="Brief overview of the college..." 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent h-24" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">LOGO URL</label>
                <input 
                  placeholder="https://example.com/logo.png" 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                  value={form.logo_url} 
                  onChange={e => setForm({...form, logo_url: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">LOCATIONS (comma-separated)</label>
                  <input 
                    placeholder="Manila, Cebu" 
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                    value={form.locations} 
                    onChange={e => setForm({...form, locations: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">BRANCHES (comma-separated)</label>
                  <input 
                    placeholder="Main Campus, Annex" 
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                    value={form.branches} 
                    onChange={e => setForm({...form, branches: e.target.value})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                  <input 
                    type="email"
                    placeholder="info@college.edu" 
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">PHONE</label>
                  <input 
                    placeholder="+63 2 8123 4567" 
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                    value={form.phone} 
                    onChange={e => setForm({...form, phone: e.target.value})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">FACEBOOK URL</label>
                  <input 
                    placeholder="https://facebook.com/..." 
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                    value={form.facebook} 
                    onChange={e => setForm({...form, facebook: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">TWITTER URL</label>
                  <input 
                    placeholder="https://twitter.com/..." 
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" 
                    value={form.twitter} 
                    onChange={e => setForm({...form, twitter: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t mt-4">
                <button 
                  type="button" 
                  onClick={closeForm} 
                  className="px-4 py-2 border rounded hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-teal-700 transition cursor-pointer"
                >
                  Save College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
