export default function JobModal({ career, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-slate-800">{career.title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Description</h3>
            <p className="text-slate-600">{career.description}</p>
          </div>

          {career.salary_min && career.salary_max && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Salary Range</h3>
              <p className="text-slate-600">
                ${career.salary_min.toLocaleString()} - ${career.salary_max.toLocaleString()}
              </p>
            </div>
          )}

          {career.daily_tasks && career.daily_tasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Daily Tasks</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                {career.daily_tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          )}

          {career.education_path && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Education Path</h3>
              <p className="text-slate-600">{career.education_path}</p>
            </div>
          )}

          {career.testimonials && career.testimonials.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">What People Say</h3>
              <div className="space-y-4">
                {career.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700 italic mb-2">"{testimonial.quote}"</p>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{testimonial.name}</span> · {testimonial.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
