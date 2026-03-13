import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'

export default function SkillModal({ skill, categoryColor, onClose }) {
  const [relatedCareers, setRelatedCareers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedCareers()
  }, [skill.id])

  const fetchRelatedCareers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('skills_careers')
        .select(`
          careers(id, title)
        `)
        .eq('skill_id', skill.id)

      if (error) throw error
      
      const careers = data.map(item => item.careers).filter(Boolean)
      setRelatedCareers(careers)
    } catch (error) {
      console.error('Error fetching related careers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColor} mb-3`}>
                {skill.category}
              </span>
              <h2 className="text-3xl font-bold text-slate-800">{skill.name}</h2>
            </div>
            
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Description</h3>
            <p className="text-slate-600">{skill.description}</p>
          </div>

          {/* Testimonials */}
          {skill.testimonials && skill.testimonials.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">People who use this skill</h3>
              <div className="space-y-4">
                {skill.testimonials.map((testimonial, index) => (
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

          {/* Related Careers */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Related Careers</h3>
            {loading ? (
              <div className="text-slate-600">Loading related careers...</div>
            ) : relatedCareers.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {relatedCareers.map(career => (
                  <div key={career.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="text-slate-800 font-medium">{career.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-600">No related careers found.</div>
            )}
          </div>

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
