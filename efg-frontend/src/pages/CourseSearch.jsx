import { useState } from 'react'
import { Link } from 'react-router-dom'

const dummyCourses = [
    { id: 1, name: 'Bachelor of Science in Computer Science' },
    { id: 2, name: 'Bachelor of Science in Business Administration' },
    { id: 3, name: 'Bachelor of Arts in Communication' },
]

export default function CourseSearch() {
    const [search, setSearch] = useState('')
    const [courses, setCourses] = useState(dummyCourses)

    const handleSearch = (e) => {
        e.preventDefault()
        setCourses(dummyCourses.filter(c => c.name.toLowerCase().includes(search.toLowerCase())))
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-primary mb-6">Find a Course</h1>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                    type="text"
                    placeholder="e.g., Computer Science"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-teal-700 transition-colors"
                >
                    Search
                </button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map(course => (
                    <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-accent transition-all no-underline"
                    >
                        <h2 className="text-xl font-semibold text-primary mb-2">{course.name}</h2>
                        <p className="text-sm text-gray-500">View details & expenses</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}