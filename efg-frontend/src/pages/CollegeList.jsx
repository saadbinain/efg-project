import { Link } from 'react-router-dom'

const dummyColleges = [
  { id: 101, name: 'Tech University', logo_url: '', locations: ['Manila', 'Cebu'] },
  { id: 102, name: 'Metro College', logo_url: '', locations: ['Quezon City'] },
]

export default function CollegeList() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Colleges</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dummyColleges.map(col => (
          <Link
            key={col.id}
            to={`/colleges/${col.id}`}
            className="block p-5 bg-white rounded-xl shadow-sm border hover:shadow-md hover:border-accent transition-all no-underline"
          >
            <div className="flex items-center space-x-3 mb-2">
              {col.logo_url ? (
                <img src={col.logo_url} alt="" className="w-12 h-12 object-contain rounded" />
              ) : (
                <div className="w-12 h-12 bg-bgLight rounded flex items-center justify-center text-gray-400">Logo</div>
              )}
              <h2 className="text-xl font-semibold text-primary">{col.name}</h2>
            </div>
            <p className="text-sm text-gray-500">{col.locations.join(', ')}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}