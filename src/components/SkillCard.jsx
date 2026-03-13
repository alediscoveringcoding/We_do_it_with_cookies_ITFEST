export default function SkillCard({ skill, categoryColor, onViewDetails }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
          {skill.category}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{skill.name}</h3>
      
      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{skill.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {skill.career_count} {skill.career_count === 1 ? 'career uses' : 'careers use'} this
        </span>
        
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
