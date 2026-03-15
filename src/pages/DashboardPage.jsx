import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabaseClient'

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState(null)
  const [matches, setMatches] = useState([])
  const [matchCount, setMatchCount] = useState(0)
  const [shortlistCount, setShortlistCount] = useState(0)
  const [assessmentCount, setAssessmentCount] = useState(0)
  const [topMatch, setTopMatch] = useState('')
  const [careers, setCareers] = useState([])
  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [savedCareers, setSavedCareers] = useState(new Set(['UX Researcher']))
  const [qaItems, setQAItems] = useState([])
  const [qaLoading, setQALoading] = useState(true)
  const [qaInput, setQAInput] = useState('')
  const [qaFilter, setQAFilter] = useState('All')

  function calculateCareers(topTraits) {
    const careerDatabase = [
      { title: 'Software Engineer', riasec: ['R','I'], salary: '$90K–$150K' },
      { title: 'UX Researcher', riasec: ['I','A','S'], salary: '$80K–$130K' },
      { title: 'Data Scientist', riasec: ['I','C'], salary: '$100K–$160K' },
      { title: 'Product Manager', riasec: ['E','I','C'], salary: '$110K–$170K' },
      { title: 'Graphic Designer', riasec: ['A'], salary: '$55K–$90K' },
      { title: 'Psychologist', riasec: ['S','I'], salary: '$70K–$110K' },
      { title: 'Business Analyst', riasec: ['E','C','I'], salary: '$75K–$120K' },
      { title: 'Architect', riasec: ['A','R'], salary: '$80K–$130K' },
      { title: 'Doctor', riasec: ['I','S'], salary: '$150K–$300K' },
      { title: 'Lawyer', riasec: ['S','E'], salary: '$90K–$180K' },
      { title: 'Environmental Scientist', riasec: ['R','I'], salary: '$60K–$100K' },
      { title: 'Marketing Manager', riasec: ['E','S'], salary: '$70K–$120K' },
      { title: 'Teacher', riasec: ['S','A'], salary: '$45K–$75K' },
      { title: 'Financial Analyst', riasec: ['C','E','I'], salary: '$80K–$130K' },
      { title: 'Civil Engineer', riasec: ['R','I','C'], salary: '$75K–$120K' },
      { title: 'Journalist', riasec: ['A','S','E'], salary: '$50K–$90K' },
      { title: 'Nurse', riasec: ['S','I'], salary: '$60K–$95K' },
      { title: 'Film Director', riasec: ['A','E'], salary: '$60K–$120K' },
      { title: 'Diplomat', riasec: ['S','E'], salary: '$80K–$140K' },
      { title: 'Agricultural Engineer', riasec: ['R','I'], salary: '$65K–$100K' },
      { title: 'Marine Engineer', riasec: ['R','I'], salary: '$70K–$120K' },
      { title: 'Biomedical Researcher', riasec: ['I','R'], salary: '$75K–$130K' },
      { title: 'Art Director', riasec: ['A','E'], salary: '$70K–$120K' },
      { title: 'Political Scientist', riasec: ['S','I','E'], salary: '$65K–$110K' },
    ]

    const matched = careerDatabase
      .map(career => {
        const overlap = career.riasec.filter(code =>
          topTraits.includes(code)
        ).length
        const pct = Math.round((overlap / career.riasec.length) * 100)
        return { ...career, pct }
      })
      .filter(c => c.pct > 0)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 8)

    setCareers(matched)
    if (matched.length > 0) {
      setTopMatch(matched[0].title)
    }
  }

  useEffect(() => {
    if (!user) return

    async function fetchQuestions() {
      setQALoading(true)
      const { data } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setQAItems(data.map(q => ({
          id: q.id,
          name: q.user_id === user.id ? 'You' : 'Student',
          avatar: q.user_id === user.id ? '👤' : '🧑‍🎓',
          question: q.question,
          answer: q.ai_answer || null,
          upvotes: q.upvotes || 0,
          voted: false,
          tag: q.career_tag || 'General',
          time: new Date(q.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
          }),
          isMine: q.user_id === user.id,
          loadingAI: false,
          dbId: q.id
        })))
      }
      setQALoading(false)
    }

    async function loadData() {
      // Fetch latest assessment
      const { data: assessData } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (assessData) {
        setAssessment(assessData)
        
        // Calculate careers based on real traits
        if (assessData?.top_traits) {
          calculateCareers(assessData.top_traits)
        }
      }

      // Count assessments taken
      const { count: ac } = await supabase
        .from('assessments')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
      setAssessmentCount(ac || 0)

      // Fetch YES university matches
      const { data } = await supabase
        .from('user_university_choices')
        .select('*, universities(*)')
        .eq('user_id', user.id)
        .eq('choice', 'yes')
      if (data) {
        setMatches(data || [])
        setMatchCount(data?.length || 0)
      }

      // Count shortlist (final_decision = 'keep')
      const { count: sc } = await supabase
        .from('user_university_choices')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('final_decision', 'keep')
      setShortlistCount(sc || 0)

      // Fetch recommended skills based on assessment
      if (assessData?.top_traits?.length > 0) {
        const { data: skillsData } = await supabase
          .from('skills')
          .select('id, name, category, description, riasec_tags, skill_universities(university_id)')

        if (skillsData) {
          const matched = skillsData
            .filter(s => s.riasec_tags?.some(tag =>
              assessData.top_traits.includes(tag)
            ))
            .map(s => ({
              ...s,
              universityCount: s.skill_universities?.length || 0,
              matchScore: s.riasec_tags?.filter(tag =>
                assessData.top_traits.includes(tag)
              ).length || 0
            }))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 6)

          setRecommendedSkills(matched)
        }
      }
    }

    loadData()
    fetchQuestions()
  }, [user])

  function toggleSave(title) {
    setSavedCareers(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  const upvote = async (id) => {
    const item = qaItems.find(q => q.id === id)
    if (!item) return

    const newVoted = !item.voted
    const newUpvotes = newVoted ? item.upvotes + 1 : item.upvotes - 1

    // Update local state immediately
    setQAItems(prev => prev.map(q =>
      q.id === id
        ? { ...q, voted: newVoted, upvotes: newUpvotes }
        : q
    ))

    // Save to Supabase
    await supabase
      .from('questions')
      .update({ upvotes: newUpvotes })
      .eq('id', id)
  }

  const postQuestion = async () => {
    if (!qaInput.trim()) return
    if (!user) return

    const { data, error } = await supabase
      .from('questions')
      .insert({
        user_id: user.id,
        question: qaInput.trim(),
        career_tag: 'General',
        upvotes: 0,
        ai_answer: null
      })
      .select()
      .single()

    if (error) {
      console.error('Error posting question:', error)
      return
    }

    if (data) {
      const newItem = {
        id: data.id,
        name: 'You',
        avatar: '👤',
        question: data.question,
        answer: null,
        upvotes: 0,
        voted: false,
        tag: data.career_tag || 'General',
        time: 'Just now',
        isMine: true,
        loadingAI: false,
        dbId: data.id
      }
      setQAItems(prev => [newItem, ...prev])
      setQAInput('')
    }
  }

  const deleteQuestion = async (itemId) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (!error) {
      setQAItems(prev => prev.filter(q => q.id !== itemId))
    }
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
            <h2>Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'} 👋</h2>
            <p>Your top match: <strong>{topMatch || 'Take the assessment'}</strong> · {assessment?.created_at ? `Last assessment: ${new Date(assessment.created_at).toLocaleDateString()}` : 'No assessment yet'}</p>
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
              <div className="prog-num">{assessmentCount}</div>
              <div className="prog-label">Assessments Taken</div>
            </div>
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="88" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">{careers.length}</div>
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
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="110" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">{matchCount}</div>
              <div className="prog-label">Universities Matched</div>
            </div>
            <div className="prog-stat">
              <div className="prog-ring">
                <svg viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="35" cy="35" r="28" fill="none" stroke="var(--teal)" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset="130" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="prog-num">{shortlistCount}</div>
              <div className="prog-label">In Your Shortlist</div>
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
          onClick={() => navigate('/discover')}
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
          {/* Recommended Skills */}
          {recommendedSkills.length > 0 && (
            <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
              <div className="dash-card-title">
                <span>🎯</span> Skills Matched to Your Profile
              </div>
              <p style={{ color:'#6b7280', fontSize:'0.85rem', marginBottom:'1rem' }}>
                Based on your top traits: <strong>{assessment?.top_traits?.join(', ')}</strong>
                — click any skill to explore universities
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '0.9rem'
              }}>
                {recommendedSkills.map(skill => (
                  <div key={skill.id}
                    onClick={() => navigate('/skills')}
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 12, padding: '1.1rem',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#0d9488'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700,
                      background: '#ccfbf1', color: '#0d9488',
                      padding: '0.15rem 0.55rem', borderRadius: 50,
                      display: 'inline-block', marginBottom: '0.5rem'
                    }}>
                      {skill.category}
                    </span>
                    <div style={{
                      fontWeight: 700, fontSize: '0.9rem',
                      marginBottom: '0.3rem', color: '#1a1a2e'
                    }}>
                      {skill.name}
                    </div>
                    <p style={{
                      fontSize: '0.77rem', color: '#6b7280',
                      marginBottom: '0.6rem', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {skill.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '0.74rem', color: '#0d9488', fontWeight: 600
                      }}>
                        🏛️ {skill.universityCount} universities
                      </span>
                      <span style={{
                        fontSize: '0.74rem', color: '#0d9488', fontWeight: 600
                      }}>
                        Explore →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => navigate('/skills')}
                  style={{
                    background: 'none', border: '2px solid #0d9488',
                    color: '#0d9488', padding: '0.5rem 1.4rem',
                    borderRadius: 50, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem'
                  }}
                >
                  Browse All Skills →
                </button>
              </div>
            </div>
          )}
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
              {qaLoading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  Loading questions...
                </div>
              ) : filteredQA.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#9ca3af',
                  fontSize: '0.9rem'
                }}>
                  No questions yet. Be the first to ask! 💬
                </div>
              ) : (
                filteredQA.map(item => (
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
                      {item.isMine && (
                        <button
                          onClick={() => deleteQuestion(item.id)}
                          style={{
                            background: 'none',
                            border: '1px solid #fee2e2',
                            color: '#ef4444',
                            borderRadius: 50,
                            padding: '0.25rem 0.7rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                            transition: 'all 0.2s',
                            marginLeft: 'auto'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#fee2e2'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'none'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage

