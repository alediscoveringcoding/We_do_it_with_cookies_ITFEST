import { useState } from 'react'

export default function QAQuestion({ question, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [aiAnswer, setAiAnswer] = useState(question.ai_answer)

  const handleGetAIAnswer = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          careerContext: question.careers?.description || ''
        })
      })

      if (!response.ok) throw new Error('Failed to get AI answer')

      const data = await response.json()
      setAiAnswer(data.answer)
      
      // Update the question in database
      const { supabase } = await import('../api/supabaseClient')
      await supabase
        .from('questions')
        .update({ ai_answer: data.answer })
        .eq('id', question.id)

      onUpdate({ ...question, ai_answer: data.answer })
    } catch (error) {
      console.error('Error getting AI answer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    try {
      const { supabase } = await import('../api/supabaseClient')
      const { error } = await supabase
        .from('questions')
        .update({ upvotes: (question.upvotes || 0) + 1 })
        .eq('id', question.id)

      if (!error) {
        onUpdate({ ...question, upvotes: (question.upvotes || 0) + 1 })
      }
    } catch (error) {
      console.error('Error upvoting question:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-medium text-slate-800">
              {question.profiles?.user_metadata?.full_name || 'Anonymous'}
            </span>
            <span className="text-slate-400 mx-2">·</span>
            <span className="text-sm text-slate-500">
              {new Date(question.created_at).toLocaleDateString()}
            </span>
            {question.careers && (
              <>
                <span className="text-slate-400 mx-2">·</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {question.careers.title}
                </span>
              </>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-slate-800 mb-3">
            {question.question}
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleUpvote}
          className="flex items-center space-x-1 text-slate-600 hover:text-teal-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span className="text-sm">{question.upvotes || 0}</span>
        </button>

        {!aiAnswer && (
          <button
            onClick={handleGetAIAnswer}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {loading ? 'Getting Answer...' : 'Get AI Answer'}
          </button>
        )}
      </div>

      {aiAnswer && (
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-medium">
              AI Answer
            </span>
          </div>
          <p className="text-slate-700">{aiAnswer}</p>
        </div>
      )}
    </div>
  )
}
