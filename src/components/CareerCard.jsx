export default function CareerCard({ career, onViewDetails }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{career.title}</h3>
        {career.matchScore && (
          <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-lg text-sm font-medium">
            {career.matchScore}% fit
          </span>
        )}
      </div>
      
      {career.salary_min && career.salary_max && (
        <div className="text-sm text-slate-600 mb-3">
          ${career.salary_min.toLocaleString()} - ${career.salary_max.toLocaleString()}
        </div>
      )}
      
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{career.description}</p>
      
      <div className="flex justify-between items-center">
        <button className="text-slate-400 hover:text-red-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        <button
          onClick={onViewDetails}
          className="text-teal-600 hover:text-teal-700 font-medium text-sm"
        >
          View Details →
        </button>
      </div>
    </div>
  )
}
