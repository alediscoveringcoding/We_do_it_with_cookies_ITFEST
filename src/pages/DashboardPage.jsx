import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabaseClient'

const careers = [
  { pct: '91%', title: 'UX Researcher', salary: '$72k – $115k/yr', saved: true },
  { pct: '87%', title: 'Data Scientist', salary: '$90k – $150k/yr', saved: false },
  { pct: '83%', title: 'Product Manager', salary: '$95k – $160k/yr', saved: false },
  { pct: '79%', title: 'Graphic Designer', salary: '$50k – $90k/yr', saved: false },
  { pct: '74%', title: 'Marketing Strategist', salary: '$60k – $105k/yr', saved: false },
  { pct: '70%', title: 'Software Engineer', salary: '$100k – $180k/yr', saved: false },
]

const initialQA = [
  {
    id: 1, avatar: 'A', name: 'Alex K.', time: '2 days ago', tag: 'UX Research',
    question: 'What degree do I need to become a UX Researcher?',
    answer: "UX Research doesn't require a specific degree — many researchers come from psychology, human-computer interaction, or even English. What matters most is a portfolio of research projects, familiarity with usability testing methods, and tools like Figma or Maze. Many UX researchers enter through bootcamps or self-study.",
    upvotes: 12, voted: false, loadingAI: false, isMine: true,
  },
  {
    id: 2, avatar: 'M', name: 'Maya R.', time: '3 days ago', tag: 'Data Science',
    question: 'Is data science still a good career path in 2026 with AI taking over?',
    answer: null, upvotes: 8, voted: false, loadingAI: false, isMine: false,
  },
  {
    id: 3, avatar: 'J', name: 'Jamie L.', time: '5 days ago', tag: 'Graphic Design',
    question: 'How do I build a portfolio as a graphic design student with no clients?',
    answer: null, upvotes: 21, voted: false, loadingAI: false, isMine: false,
  },
]

const aiAnswers = {
  2: "Great question! This is a nuanced topic. The short answer is: skilled data scientists who understand how to work with AI are in higher demand than ever. Focus on developing domain expertise alongside AI literacy — understanding business problems and knowing when to apply which model matters far more than just coding. Data science roles are evolving, not disappearing.",
  3: "Start with spec work — redesign an existing brand, create a concept for a local business, or reimagine a well-known app. Platforms like Dribbble, Behance, and even Instagram are great for showcasing your work. Consider entering student design competitions or contributing to open-source projects that need visual assets. Quality over quantity — 4 strong pieces beat 20 average ones.",
}

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState(null)
  const [matches, setMatches] = useState([])
  const [matchCount, setMatchCount] = useState(0)
  const [savedCareers, setSavedCareers] = useState(new Set(['UX Researcher']))
  const [qaItems, setQAItems] = useState(initialQA)
  const [qaInput, setQAInput] = useState('')
  const [qaFilter, setQAFilter] = useState('All')
  const [nextId, setNextId] = useState(100)

  useEffect(() => {
    if (!user) return

    // Fetch latest assessment
    const fetchAssessment = async () => {
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (data) setAssessment(data)
    }

    // Fetch YES university matches
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('user_university_choices')
        .select('*, universities(*)')
        .eq('user_id', user.id)
        .eq('choice', 'yes')
      if (data) {
        setMatches(data || [])
        setMatchCount(data?.length || 0)
      }
    }

    fetchAssessment()
    fetchMatches()
  }, [user])

  function toggleSave(title) {
    setSavedCareers(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  function upvote(id) {
    setQAItems(prev => prev.map(q =>
      q.id === id ? { ...q, upvotes: q.voted ? q.upvotes - 1 : q.upvotes + 1, voted: !q.voted } : q
    ))
  }

  function postQuestion() {
    if (!qaInput.trim()) return
    const newItem = {
      id: nextId,
      avatar: 'A',
      name: 'Alex K.',
      time: 'Just now',
      tag: 'Career',
      question: qaInput,
      answer: null,
      upvotes: 0,
      voted: false,
      loadingAI: false,
      isMine: true,
    }
    setQAItems(prev => [newItem, ...prev])
    setQAInput('')
    setNextId(n => n + 1)
  }

  function getAIAnswer(id) {
    setQAItems(prev => prev.map(q => q.id === id ? { ...q, loadingAI: true } : q))
    setTimeout(() => {
      setQAItems(prev => prev.map(q => {
        if (q.id !== id) return q
        const answer = aiAnswers[id] || "Great question! This is a nuanced topic. The key is to build relevant skills, gain hands-on experience through internships or projects, and connect with professionals in your target field. Networking and continuous learning are the most consistent drivers of career success regardless of the specific path you choose."
        return { ...q, loadingAI: false, answer }
      }))
    }, 1800)
  }

  const filteredQA = qaFilter === 'My Questions' ? qaItems.filter(q => q.isMine)
    : qaFilter === 'Unanswered' ? qaItems.filter(q => !q.answer)
    : qaItems

  const bookmarks = Array.from(savedCareers).slice(0, 4)

  return (
    <div className="pf-page">
      <div className="dashboard-layout">

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div>
            <h2>Welcome back, Alex 👋</h2>
            <p>Your top match: <strong>UX Researcher</strong> · Last assessment: March 10, 2026</p>
          </div>
          <button className="btn-retake" onClick={() => navigate('/assessment')}>↺ Retake Assessment</button>
        </div>

        {/* Stats */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.6rem', boxShadow: 'var(--shadow)' }}>
          <div className="progress-row">
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="140" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">2</div>
              <div className="prog-label">Assessments Taken</div>
            </div>
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="88" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">12</div>
              <div className="prog-label">Careers Explored</div>
            </div>
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="120" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">{qaItems.filter(q => q.isMine).length}</div>
              <div className="prog-label">Questions Asked</div>
            </div>
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="105" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">{savedCareers.size}</div>
              <div className="prog-label">Careers Saved</div>
            </div>
          </div>
        </div>

        {/* Discover Universities CTA */}
        <div
          className="dash-card"
          style={{
            background: 'linear-gradient(135deg, var(--teal) 0%, var(--green) 100%)',
            color: 'white',
            gridColumn: '1 / -1',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: 'none',
          }}
          onClick={() => setActivePage('discover')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(13, 148, 136, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Discover Universities</h3>
          <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
            Swipe through {savedCareers.size > 0 ? 'universities tailored to your profile' : 'hundreds of universities'} and build your shortlist
          </p>
          <button
            style={{
              background: 'white',
              color: 'var(--teal)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Start Discovering →
          </button>
        </div>

        {/* Grid: Matches + Bookmarks */}
        <div className="dashboard-grid">
          {/* Career Matches */}
          <div className="dash-card">
            <div className="dash-card-title"><span>🎯</span> Career Matches</div>
            <div className="career-match-list">
              {careers.map(c => (
                <div className="career-match-item" key={c.title}>
                  <div className="match-pct">{c.pct}</div>
                  <div className="match-info">
                    <div className="match-title">{c.title}</div>
                    <div className="match-salary">{c.salary}</div>
                  </div>
                  <button
                    className={`heart-btn ${savedCareers.has(c.title) ? 'saved' : ''}`}
                    title={savedCareers.has(c.title) ? 'Remove bookmark' : 'Save career'}
                    onClick={() => toggleSave(c.title)}
                  >
                    {savedCareers.has(c.title) ? '❤️' : '🤍'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="dash-card">
            <div className="dash-card-title"><span>🔖</span> Bookmarks</div>
            <div className="career-match-list">
              {bookmarks.length === 0 && (
                <p style={{ color: 'var(--soft)', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  No saved careers yet. Hit ❤️ to bookmark a match!
                </p>
              )}
              {bookmarks.map(title => (
                <div className="career-match-item" key={title}>
                  <div className="match-pct" style={{ fontSize: '1.4rem', minWidth: '42px' }}>🎯</div>
                  <div className="match-info">
                    <div className="match-title">{title}</div>
                    <div className="match-salary">Career · {careers.find(c => c.title === title)?.pct ?? '—'} fit</div>
                  </div>
                  <button className="heart-btn saved" onClick={() => toggleSave(title)}>❤️</button>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A Board */}
          <div className="dash-card qa-card">
            <div className="dash-card-title"><span>💬</span> Community Q&A Board</div>
            <div className="qa-input-row">
              <input
                className="qa-input"
                placeholder="Ask anything about a career…"
                value={qaInput}
                onChange={e => setQAInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && postQuestion()}
              />
              <button className="btn-primary-teal" onClick={postQuestion}>Post Question</button>
            </div>
            <div className="qa-filter">
              {['All', 'My Questions', 'Unanswered'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${qaFilter === f ? 'active' : ''}`}
                  onClick={() => setQAFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="qa-feed">
              {filteredQA.map(item => (
                <div className="qa-item" key={item.id}>
                  <div className="qa-header">
                    <div className="qa-avatar">{item.avatar}</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</div>
                      <div className="qa-meta">{item.time}</div>
                    </div>
                    <span className="qa-career-tag">{item.tag}</span>
                  </div>
                  <div className="qa-question">{item.question}</div>
                  {item.answer && (
                    <div className="qa-answer">
                      <div className="qa-answer-label">🤖 AI Answer</div>
                      {item.answer}
                    </div>
                  )}
                  <div className="qa-actions">
                    <button
                      className={`upvote-btn ${item.voted ? 'voted' : ''}`}
                      onClick={() => upvote(item.id)}
                    >
                      ▲ {item.upvotes}
                    </button>
                    {!item.answer && (
                      <button
                        className="ai-btn"
                        disabled={item.loadingAI}
                        onClick={() => getAIAnswer(item.id)}
                      >
                        {item.loadingAI ? '⏳ Thinking…' : '✨ Get AI Answer'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredQA.length === 0 && (
                <p style={{ color: 'var(--soft)', fontSize: '0.88rem', textAlign: 'center', padding: '1rem 0' }}>
                  No questions in this category yet.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage

