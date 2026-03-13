import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../api/supabaseClient'
import QAQuestion from './QAQuestion'

export default function QABoard() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [careers, setCareers] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [selectedCareer, setSelectedCareer] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuestions()
    fetchCareers()
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('questions')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'questions' },
        (payload) => {
          setQuestions(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          careers(id, title),
          profiles:auth.users(id, user_metadata->full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('id, title')

      if (error) throw error
      setCareers(data || [])
    } catch (error) {
      console.error('Error fetching careers:', error)
    }
  }

  const handleSubmitQuestion = async (e) => {
    e.preventDefault()
    if (!newQuestion.trim() || !user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('questions')
        .insert({
          user_id: user.id,
          career_id: selectedCareer || null,
          question: newQuestion.trim()
        })

      if (error) throw error

      setNewQuestion('')
      setSelectedCareer('')
    } catch (error) {
      console.error('Error posting question:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions.filter(question => {
    if (filter === 'all') return true
    if (filter === 'my') return question.user_id === user?.id
    if (filter === 'unanswered') return !question.ai_answer
    return true
  })

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Ask a Question</h2>
      
      {/* Question Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <div>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask anything about a career..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a career (optional)</option>
              {careers.map(career => (
                <option key={career.id} value={career.id}>
                  {career.title}
                </option>
              ))}
            </select>
            
            <button
              type="submit"
              disabled={loading || !newQuestion.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['all', 'my', 'unanswered'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
              filter === tab
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'all' ? 'All Questions' : tab === 'my' ? 'My Questions' : 'Unanswered'}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map(question => (
            <QAQuestion
              key={question.id}
              question={question}
              onUpdate={(updatedQuestion) => {
                setQuestions(prev => prev.map(q => 
                  q.id === updatedQuestion.id ? updatedQuestion : q
                ))
              }}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-600">
              {filter === 'my' ? "You haven't asked any questions yet." : 
               filter === 'unanswered' ? "No unanswered questions." : 
               "No questions yet. Be the first to ask!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
