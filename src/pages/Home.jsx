export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">PathFinder U</h1>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
              Take Quiz
            </button>
          </div>
        </div>
      </nav>

      {/* Simple Hero */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Discover Your <span className="text-purple-600">Path</span>. Find Your <span className="text-purple-600">University</span>.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Answer 20 thoughtful questions. Get a personalized college match report.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold">
            Start Your Free Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
