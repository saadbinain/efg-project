import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCourseById } from '../services/api'

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCourseById(id)
        setCourse(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>
  if (!course) return <div className="text-center py-10">Course not found.</div>

  return (
    <div>
      <Link to="/courses" className="text-accent hover:underline text-sm">&larr; Back to courses</Link>
      <h1 className="text-3xl font-bold text-primary mt-4 mb-2">
        {course.name} {course.acronym && <span className="text-gray-500">({course.acronym})</span>}
      </h1>
      <p className="text-gray-600 mb-8">{course.overview}</p>

      {/* ===== PER-YEAR EXPENSES ===== */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          <span className="inline-block px-3 py-1 bg-highlight text-white text-sm rounded-full mr-2">
            ESTIMATED BREAKDOWN
          </span>
          Expected Expenses
        </h2>

        {course.expenses && course.expenses.length > 0 ? (
          <>
            {Array.from({ length: course.years_to_complete }, (_, i) => i + 1).map(year => {
              const yearExpenses = course.expenses.filter(e => e.year_number === year)
              const yearTotal = yearExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
              return (
                <div key={year} className="mb-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">Year {year}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-sm border">
                      <thead className="bg-bgLight">
                        <tr>
                          <th className="py-2 px-4 text-left">Item</th>
                          <th className="py-2 px-4 text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearExpenses.map(exp => (
                          <tr key={exp.id} className="border-t">
                            <td className="py-2 px-4">{exp.item_name}</td>
                            <td className="py-2 px-4 text-right">
                              ${Number(exp.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold bg-bgLight">
                          <td className="py-2 px-4">Total Year {year}</td>
                          <td className="py-2 px-4 text-right text-highlight">
                            ${yearTotal.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
            {/* Grand Total */}
            {(() => {
              const grandTotal = course.expenses.reduce((sum, e) => sum + Number(e.amount), 0)
              return (
                <p className="text-right text-lg font-bold text-highlight mt-2">
                  Grand Total: ${grandTotal.toLocaleString()}
                </p>
              )
            })()}
          </>
        ) : (
          <p className="text-gray-500 italic">No expense details available yet for this course.</p>
        )}
      </div>

      {/* Colleges list – now uses has_specific_pricing flag */}
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-4">Colleges Offering This Course</h2>
        {course.colleges && course.colleges.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.colleges.map(col => (
              <Link
                key={col.id}
                to={`/colleges/${col.id}`}
                className="block p-5 bg-white rounded-xl shadow-sm border hover:shadow-md hover:border-accent transition-all no-underline"
              >
                <div className="flex items-center space-x-3 mb-2">
                  {col.logo_url ? (
                    <img src={col.logo_url} alt="" className="w-10 h-10 object-contain rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-bgLight rounded flex items-center justify-center text-gray-400 text-xs">
                      Logo
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-primary">{col.name}</h3>
                </div>
                {col.has_specific_pricing ? (
                  <div className="text-sm text-gray-600">
                    <span className="text-highlight font-medium">Specific pricing available</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Uses generic pricing</div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No colleges currently offering this course.</p>
        )}
      </div>
    </div>
  )
}