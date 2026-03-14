import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabaseClient'

const questions = [
  { text: "I enjoy taking apart machines or gadgets to see how they work.", riasec: "R" },
  { text: "I like doing research and analyzing information to solve problems.", riasec: "I" },
  { text: "I express myself through art, music, writing, or design.", riasec: "A" },
  { text: "I enjoy helping others with their personal or emotional problems.", riasec: "S" },
  { text: "I like leading projects and convincing others to follow my ideas.", riasec: "E" },
  { text: "I prefer organized, structured tasks with clear rules and procedures.", riasec: "C" },
  { text: "I enjoy building or fixing things with my hands.", riasec: "R" },
  { text: "I love exploring scientific questions and coming up with theories.", riasec: "I" },
  { text: "I often come up with original or unconventional ideas.", riasec: "A" },
  { text: "I find it rewarding to teach or train others.", riasec: "S" },
  { text: "I'm drawn to sales, negotiation, or entrepreneurship.", riasec: "E" },
  { text: "I like working with data, spreadsheets, or detailed records.", riasec: "C" },
  { text: "I'd enjoy working outdoors or with animals and plants.", riasec: "R" },
  { text: "I enjoy puzzles, logic games, and figuring out how things work.", riasec: "I" },
  { text: "I like to improvise and think outside the box.", riasec: "A" },
  { text: "Community service and volunteer work feel meaningful to me.", riasec: "S" },
  { text: "I like taking charge and making things happen in groups.", riasec: "E" },
  { text: "I feel comfortable following clear instructions and procedures.", riasec: "C" },
  { text: "I would enjoy a job that involves physical activity or technical tools.", riasec: "R" },
  { text: "I like investigating, questioning, and deeply understanding topics.", riasec: "I" },
]

const optionLabels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]

const riasecMeta = {
  R: { name: "Realistic", color: "#0d9488" },
  I: { name: "Investigative", color: "#6366f1" },
  A: { name: "Artistic", color: "#ec4899" },
  S: { name: "Social", color: "#22c55e" },
  E: { name: "Enterprising", color: "#f59e0b" },
  C: { name: "Conventional", color: "#64748b" },
}

function computeScores(answers) {
  const raw = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  questions.forEach((q, i) => {
    if (answers[i] !== null && answers[i] !== undefined) {
      raw[q.riasec] += answers[i] + 1 // 1-5
      counts[q.riasec]++
    }
  })
  const result = {}
  Object.keys(raw).forEach(k => {
    const maxPossible = (counts[k] || 1) * 5
    result[k] = Math.round((raw[k] / maxPossible) * 100)
  })
  return result
}

function AssessmentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState(new Array(20).fill(null))
  const [scores, setScores] = useState({})
  const [saving, setSaving] = useState(false)

  async function saveAssessmentResults(finalScores, topTraits) {
    if (!user) {
      navigate('/login?redirect_to=/my-matches')
      return
    }

    setSaving(true)

    try {
      // Step 1: Get top 3 traits from scores
      const sortedTraits = Object.entries(finalScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => key)

      console.log('Top traits:', sortedTraits)

      // Step 2: Save assessment
      await supabase.from('assessments').insert({
        user_id: user.id,
        riasec_scores: finalScores,
        top_traits: sortedTraits
      })

      // Step 3: Fetch ALL 80 universities with their tags
      const { data: allUnis, error: fetchError } = await supabase
        .from('universities')
        .select('id, riasec_tags')

      if (fetchError || !allUnis) {
        console.error('Fetch failed:', fetchError)
        navigate('/my-matches')
        return
      }

      // Step 4: Use IDENTICAL filter logic as DiscoverPage
      // This guarantees same result as "Matched For You" on Discover
      const matchedIds = allUnis
        .filter(uni =>
          Array.isArray(uni.riasec_tags) &&
          uni.riasec_tags.some(tag => sortedTraits.includes(tag))
        )
        .map(uni => uni.id)

      console.log('Matched IDs count:', matchedIds.length)
      // This number must match what Discover shows (e.g. 68)

      // Step 5: Insert ALL matched IDs via server-side RPC function
      // This runs as a single SQL transaction — no timeouts, no partial inserts
      const { error: rpcError } = await supabase.rpc(
        'insert_university_matches',
        {
          p_user_id: user.id,
          p_university_ids: matchedIds
        }
      )

      if (rpcError) {
        console.error('RPC insert failed:', rpcError)
        // Fallback: try direct upsert if RPC fails
        const rows = matchedIds.map(id => ({
          user_id: user.id,
          university_id: id,
          choice: 'yes',
          source: 'auto_match',
          final_decision: null
        }))
        const { error: upsertError } = await supabase
          .from('user_university_choices')
          .upsert(rows, { onConflict: 'user_id,university_id' })
        if (upsertError) {
          console.error('Upsert also failed:', upsertError)
        } else {
          console.log('Fallback upsert succeeded:', rows.length)
        }
      } else {
        console.log('RPC success - inserted:', matchedIds.length)
      }

      navigate('/my-matches')

    } catch (err) {
      console.error('Unexpected error:', err)
      navigate('/my-matches')
    } finally {
      setSaving(false)
    }
  }

  const siState = (dot) => {
    if (phase === 'intro') return dot === 1 ? 'done active' : ''
    if (phase === 'quiz') {
      if (dot === 1) return 'done'
      if (dot === 2) return 'done active'
      return ''
    }
    return 'done'
  }

  const stepLabel = phase === 'intro' ? 'Step 1 of 3' : phase === 'quiz' ? 'Step 2 of 3' : 'Step 3 of 3'

  function startQuiz() {
    setPhase('quiz')
    setCurrentQ(0)
  }

  function selectOpt(i) {
    const newAnswers = [...answers]
    newAnswers[currentQ] = i
    setAnswers(newAnswers)
  }

  function nextQ() {
    if (answers[currentQ] === null) {
      alert('Please select an answer!')
      return
    }
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      const computed = computeScores(answers)
      setScores(computed)
      setPhase('results')
    }
  }

  function prevQ() {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  }

  function retake() {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers(new Array(20).fill(null))
    setScores({})
  }

  const sortedTraits = Object.entries(scores).sort((a, b) => b[1] - a[1])

  return (
    <div className="pf-page">
      <div className="assessment-wrap">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`si-dot ${siState(1)}`}></div>
          <div className={`si-dot ${siState(2)}`}></div>
          <div className={`si-dot ${siState(3)}`}></div>
          <span className="si-label">{stepLabel}</span>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="assess-intro">
            <div className="section-tag">Career Assessment</div>
            <h2 className="section-title">Discover Your RIASEC Profile</h2>
            <p className="section-sub" style={{ margin: '0 auto 1.5rem', textAlign: 'center' }}>
              We'll map your personality across 6 dimensions to match you with careers where you'll genuinely thrive.
            </p>
            <div className="riasec-tags">
              <span className="riasec-tag">R — Realistic</span>
              <span className="riasec-tag">I — Investigative</span>
              <span className="riasec-tag">A — Artistic</span>
              <span className="riasec-tag">S — Social</span>
              <span className="riasec-tag">E — Enterprising</span>
              <span className="riasec-tag">C — Conventional</span>
            </div>
            <div className="assess-meta">
              <span>⏱ About 3 minutes</span>
              <span>📋 20 questions</span>
              <span>🎯 5-point scale</span>
            </div>
            <button className="btn-primary-teal" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && (
          <div>
            <div className="q-progress-bar">
              <div className="q-progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
            </div>
            <div className="q-counter">Question {currentQ + 1} of {questions.length}</div>
            <div className="q-text">{questions[currentQ].text}</div>
            <div className="q-options">
              {optionLabels.map((label, i) => (
                <button
                  key={i}
                  className={`q-opt ${answers[currentQ] === i ? 'selected' : ''}`}
                  onClick={() => selectOpt(i)}
                >
                  <span className="q-opt-num">{i + 1}</span>
                  {label}
                </button>
              ))}
            </div>
            <div className="q-nav">
              <button className="btn-secondary" onClick={prevQ} style={{ opacity: currentQ === 0 ? 0.4 : 1 }} disabled={currentQ === 0}>
                ← Back
              </button>
              <button className="btn-primary-teal" onClick={nextQ}>
                {currentQ === questions.length - 1 ? 'See Results →' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'results' && (
          <div>
            <div className="results-header">
              <div className="section-tag">Your Results</div>
              <h2 className="section-title">Your RIASEC Profile</h2>
              <p className="section-sub" style={{ margin: '0 auto' }}>
                Based on your answers, here are your top personality dimensions and career matches.
              </p>
            </div>

            {/* Simple trait visualization */}
            <div style={{ marginBottom: '2rem' }}>
              {sortedTraits.map(([key, score]) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 600 }}>{riasecMeta[key].name} ({key})</span>
                    <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{score}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: riasecMeta[key].color, width: `${score}%`, transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trait Cards */}
            <div className="traits-grid">
              {sortedTraits.slice(0, 3).map(([key, score]) => (
                <div key={key} className="trait-card top">
                  <div className="trait-letter">{key}</div>
                  <div className="trait-name">{riasecMeta[key].name}</div>
                  <div className="trait-score">Score: {score}% · Top trait</div>
                </div>
              ))}
            </div>

            <div className="results-cta">
              <button
                className="btn-primary-teal"
                style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
                onClick={() => {
                  const topTraits = Object.entries(scores)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([key]) => key)
                  saveAssessmentResults(scores, topTraits)
                }}
                disabled={saving}
              >
                {saving ? 'Finding your matches...' : 'See My Career Matches →'}
              </button>
              <p style={{ marginTop: '0.8rem', color: 'var(--soft)', fontSize: '0.82rem' }}>
                Sign in to save your results permanently
              </p>
              <button
                className="btn-secondary"
                style={{ marginTop: '0.8rem' }}
                onClick={retake}
              >
                ↺ Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssessmentPage

