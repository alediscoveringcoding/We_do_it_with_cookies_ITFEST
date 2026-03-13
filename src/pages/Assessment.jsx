import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../api/supabaseClient'
import Navbar from '../components/Navbar'
import QuizCard from '../components/QuizCard'
import questionsData from '../data/questions.json'

export default function Assessment() {
  const [step, setStep] = useState('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [scores, setScores] = useState({})
  const [topTraits, setTopTraits] = useState([])
  const [loading, setLoading] = useState(false)
  
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const calculateScores = () => {
    const traits = ['R', 'I', 'A', 'S', 'E', 'C']
    const traitCounts = {}
    const traitSums = {}
    
    // Count questions per trait and sum answers
    traits.forEach(trait => {
      traitCounts[trait] = 0
      traitSums[trait] = 0
    })

    questionsData.forEach(question => {
      const trait = question.trait
      traitCounts[trait]++
      if (answers[question.id]) {
        traitSums[trait] += answers[question.id]
      }
    })

    // Normalize scores to percentages
    const normalizedScores = {}
    traits.forEach(trait => {
      const maxPossible = traitCounts[trait] * 5
      normalizedScores[trait] = Math.round((traitSums[trait] / maxPossible) * 100)
    })

    return normalizedScores
  }

  const handleQuizComplete = () => {
    const calculatedScores = calculateScores()
    setScores(calculatedScores)

    // Get top 3 traits
    const sortedTraits = Object.entries(calculatedScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait)
    
    setTopTraits(sortedTraits)
    setStep('results')
  }

  const handleSaveResults = async () => {
    if (!user) {
      navigate('/login?redirect_to=/assessment')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('assessments').insert({
        user_id: user.id,
        riasec_scores: scores,
        top_traits: topTraits
      })

      if (error) throw error
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRetake = () => {
    setStep('intro')
    setCurrentQuestion(0)
    setAnswers({})
    setScores({})
    setTopTraits([])
  }

  const getTraitDescription = (trait) => {
    const descriptions = {
      R: 'Realistic: You are practical, hands-on, and enjoy working with tools and machinery.',
      I: 'Investigative: You are analytical, curious, and enjoy solving complex problems.',
      A: 'Artistic: You are creative, imaginative, and enjoy expressing yourself through various media.',
      S: 'Social: You are helpful, empathetic, and enjoy working with and helping others.',
      E: 'Enterprising: You are persuasive, ambitious, and love leading people toward goals.',
      C: 'Conventional: You are organized, detail-oriented, and enjoy working with data and systems.'
    }
    return descriptions[trait] || ''
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              {step === 'intro' && 'Step 1/3'}
              {step === 'quiz' && `Question ${currentQuestion + 1} of ${questionsData.length}`}
              {step === 'results' && 'Step 3/3'}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {step === 'intro' && 'Introduction'}
              {step === 'quiz' && 'Assessment Questions'}
              {step === 'results' && 'Your Results'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: step === 'intro' ? '33%' : step === 'quiz' ? '66%' : '100%'
              }}
            ></div>
          </div>
        </div>

        {step === 'intro' && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-6">
              Career Personality Assessment
            </h1>
            
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-lg text-slate-600 mb-8">
                Discover your career personality through the RIASEC framework. This assessment helps identify your interests and strengths across six key areas.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Realistic (R)</h3>
                  <p className="text-sm text-slate-600">Working with tools, machines, and hands-on activities</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Investigative (I)</h3>
                  <p className="text-sm text-slate-600">Research, analysis, and problem-solving</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Artistic (A)</h3>
                  <p className="text-sm text-slate-600">Creative expression and design</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Social (S)</h3>
                  <p className="text-sm text-slate-600">Helping, teaching, and working with people</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Enterprising (E)</h3>
                  <p className="text-sm text-slate-600">Leadership, persuasion, and business</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Conventional (C)</h3>
                  <p className="text-sm text-slate-600">Organization, data, and structured tasks</p>
                </div>
              </div>
              
              <p className="text-teal-600 font-medium mb-8">
                Takes about 3 minutes · {questionsData.length} questions
              </p>
              
              <button
                onClick={() => setStep('quiz')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <QuizCard
            question={questionsData[currentQuestion]}
            answer={answers[questionsData[currentQuestion].id]}
            onAnswer={handleAnswer}
            onNext={() => {
              if (currentQuestion < questionsData.length - 1) {
                setCurrentQuestion(prev => prev + 1)
              } else {
                handleQuizComplete()
              }
            }}
            isLast={currentQuestion === questionsData.length - 1}
          />
        )}

        {step === 'results' && (
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">
              Your Personality Profile
            </h1>
            
            {/* Radar Chart Placeholder - Will be implemented with Recharts */}
            <div className="bg-slate-50 rounded-xl p-8 mb-8">
              <div className="text-center">
                <div className="w-96 h-96 mx-auto bg-white rounded-lg flex items-center justify-center">
                  <div className="text-slate-600">
                    <h3 className="text-lg font-semibold mb-4">RIASEC Scores</h3>
                    <div className="space-y-2">
                      {Object.entries(scores).map(([trait, score]) => (
                        <div key={trait} className="flex justify-between items-center">
                          <span className="font-medium">{trait}:</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-slate-200 rounded-full h-4 mr-2">
                              <div 
                                className="bg-teal-600 h-4 rounded-full"
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Traits */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Your Top Traits</h2>
              <div className="grid grid-cols-3 gap-6">
                {topTraits.map(trait => (
                  <div key={trait} className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-teal-700 mb-3">{trait}</h3>
                    <p className="text-slate-700 text-sm">{getTraitDescription(trait)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSaveResults}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-8 py-3 rounded-lg font-medium transition"
              >
                {loading ? 'Saving...' : 'See My Career Matches'}
              </button>
              <button
                onClick={handleRetake}
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg font-medium transition"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
