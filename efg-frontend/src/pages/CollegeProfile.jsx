import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const mockCollege = {
  id: 101,
  name: 'Tech University',
  description: 'A leading institution offering cutting-edge programs in technology and business...',
  branches: ['Main Campus', 'Satellite'],
  locations: ['Manila', 'Cebu'],
  contacts: { email: 'info@techuni.edu.ph', phone: '+63 2 8123 4567' },
  social_media: { facebook: 'https://fb.com/techuni', twitter: 'https://twitter.com/techuni' },
  logo_url: '',
  highlight_pictures_urls: [],
  courses: [
    { id: 1, name: 'BS Computer Science', specific_tuition: 22000, specific_books: 800, specific_uniform: 500, specific_misc: 1200, years_to_complete: 4 },
    { id: 2, name: 'BS Business Administration', specific_tuition: 18000, specific_books: 600, specific_uniform: 500, specific_misc: 900, years_to_complete: 4 },
  ],
}

export default function CollegeProfile() {
  const { id } = useParams()
  const [college, setCollege] = useState(null)

  useEffect(() => {
    setCollege(mockCollege)
  }, [id])

  if (!college) return <div className="text-center py-10">Loading...</div>

  return (
    <div>
      <Link to="/colleges" className="text-accent hover:underline text-sm">&larr; Back to colleges</Link>
      
      <div className="flex flex-col sm:flex-row items-start gap-6 mt-4 mb-8">
        {college.logo_url ? (
          <img src={college.logo_url} alt="" className="w-24 h-24 object-contain rounded-lg border" />
        ) : (
          <div className="w-24 h-24 bg-bgLight rounded-lg flex items-center justify-center text-gray-400 text-xl">Logo</div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-primary">{college.name}</h1>
          <p className="text-gray-600 mt-2">{college.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            <span>📍 {college.locations.join(', ')}</span>
            {college.contacts.phone && <span>📞 {college.contacts.phone}</span>}
            {college.contacts.email && <span>✉️ {college.contacts.email}</span>}
          </div>
          {Object.keys(college.social_media).length > 0 && (
            <div className="flex gap-3 mt-3">
              {Object.entries(college.social_media).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline capitalize text-sm">
                  {platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {college.highlight_pictures_urls.length > 0 && (
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {college.highlight_pictures_urls.map((pic, idx) => (
            <img key={idx} src={pic} alt="" className="h-40 object-cover rounded-lg border" />
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-primary mb-4">Courses Offered</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {college.courses.map(course => {
          const yearlyTotal = course.specific_tuition + course.specific_books + course.specific_uniform + course.specific_misc
          const totalCost = yearlyTotal * course.years_to_complete
          return (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-primary mb-3">{course.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>Tuition</span><span className="font-medium">${course.specific_tuition.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Books</span><span>${course.specific_books.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Uniform</span><span>${course.specific_uniform.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Misc</span><span>${course.specific_misc.toLocaleString()}</span></div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold"><span>Yearly Total</span><span className="text-highlight">${yearlyTotal.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold"><span>Total ({course.years_to_complete} yrs)</span><span className="text-highlight">${totalCost.toLocaleString()}</span></div>
              </div>
              <Link to={`/courses/${course.id}`} className="inline-block mt-4 text-accent text-sm hover:underline font-medium">
                View course details →
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}