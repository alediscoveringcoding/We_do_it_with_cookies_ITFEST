import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabaseClient'

const badgeClass = {
  Technical: "badge-technical",
  Creative: "badge-creative",
  Social: "badge-social",
  Analytical: "badge-analytical",
  Leadership: "badge-leadership",
  Trades: "badge-trades",
}

const categories = ['All Skills', 'Technical', 'Creative', 'Social', 'Analytical', 'Leadership', 'Trades']
const categoryEmojis = {
  'All Skills': '',
  'Technical': '💻 ',
  'Creative': '🎨 ',
  'Social': '🤝 ',
  'Analytical': '📊 ',
  'Leadership': '👑 ',
  'Trades': '🔧 ',
}

function SkillsPage() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [filter, setFilter] = useState('all')
  const [modalSkill, setModalSkill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedUniversities, setRelatedUniversities] = useState([])
  const [modalLoading, setModalLoading] = useState(false)

  // Fetch skills on mount
  useEffect(() => {
    async function fetchSkills() {
      setLoading(true)
      const { data, error } = await supabase
        .from('skills')
        .select(`
          id,
          name,
          category,
          description,
          riasec_tags,
          skill_universities(university_id)
        `)
        .order('name')

      if (error) {
        console.error('Error fetching skills:', error)
        setLoading(false)
        return
      }

      if (data) {
        const withCount = data.map(s => ({
          ...s,
          universityCount: s.skill_universities?.length || 0
        }))
        setSkills(withCount)
        setFilteredSkills(withCount)
      }
      setLoading(false)
    }
    fetchSkills()
  }, [])

  // Filter when filter or skills change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredSkills(skills)
    } else {
      setFilteredSkills(
        skills.filter(s => s.category === filter)
      )
    }
  }, [filter, skills])

  // Open skill modal and fetch universities
  async function openSkillModal(skill) {
    setModalSkill(skill)
    setModalLoading(true)
    setRelatedUniversities([])

    const { data, error } = await supabase
      .from('skill_universities')
      .select('universities(*)')
      .eq('skill_id', skill.id)

    if (error) {
      console.error('Error fetching universities:', error)
      setModalLoading(false)
      return
    }

    if (data) {
      setRelatedUniversities(
        data.map(d => d.universities).filter(Boolean)
      )
    }
    setModalLoading(false)
  }

  // Show loading spinner
  if (loading) return (
    <div className="pf-page">
      <section className="pf-section">
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{
            width: 36,
            height: 36,
            border: '4px solid #0d9488',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      </section>
    </div>
  )

  const filtered = filteredSkills

  return (
    <div className="pf-page">
      <section className="pf-section">
        <div className="container">
          <div className="section-tag">Skills Explorer</div>
          <h2 className="section-title">Browse Skills by Category</h2>
          <p className="section-sub">Click any skill to see which careers use it and hear from real professionals.</p>

          <div className="skills-layout">
            <div className="skills-sidebar">
              <h4>Categories</h4>
              {categories.map(cat => {
                const catKey = cat === 'All Skills' ? 'all' : cat
                return (
                  <button
                    key={cat}
                    className={`cat-btn ${filter === catKey ? 'active' : ''}`}
                    onClick={() => setFilter(catKey)}
                  >
                    {categoryEmojis[cat]}{cat}
                  </button>
                )
              })}
            </div>

            <div className="skills-grid">
              {filtered.map((skill) => (
                <div className="skill-card" key={skill.id}>
                  <span className={`skill-cat-badge ${badgeClass[skill.category]}`}>{skill.category}</span>
                  <h3>{skill.name}</h3>
                  <p>{skill.description}</p>
                  <div className="skill-card-footer">
                    <span className="careers-count">🏛️ {skill.universityCount} universities offer this</span>
                    <button className="btn-sm" onClick={() => openSkillModal(skill)}>See Careers</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Modal */}
      <div className={`modal-overlay ${modalSkill ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModalSkill(null) }}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModalSkill(null)}>✕</button>
          {modalSkill && (
            <div>
              <span className={`skill-cat-badge ${badgeClass[modalSkill.category]}`} style={{ marginBottom: '0.8rem', display: 'inline-block' }}>
                {modalSkill.category}
              </span>
              <h2>{modalSkill.name}</h2>
              <p className="modal-desc">
                {modalSkill.description}
              </p>

              {/* Loading state */}
              {modalLoading && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  <p>Finding universities... 🏛️</p>
                </div>
              )}

              {/* Universities list */}
              {!modalLoading && relatedUniversities.length > 0 && (
                <div>
                  <h4 style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#9ca3af',
                    marginBottom: '0.5rem'
                  }}>
                    🏛️ Universities Where You Can Study This
                  </h4>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    marginBottom: '1.2rem'
                  }}>
                    These universities have strong programs related to {modalSkill?.name}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.8rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {relatedUniversities.map(uni => (
                      <div key={uni.id} style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: 12,
                        padding: '1rem',
                        transition: 'all 0.2s'
                      }}>
                        {/* Type + City */}
                        <div style={{
                          display: 'flex',
                          gap: '0.4rem',
                          marginBottom: '0.5rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 50
                          }}>
                            {uni.type}
                          </span>
                          <span style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem'
                          }}>
                            📍 {uni.city}
                          </span>
                        </div>

                        {/* Name */}
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          marginBottom: '0.4rem',
                          color: '#1a1a2e',
                          lineHeight: 1.3
                        }}>
                          {uni.name}
                        </div>

                        {/* Description */}
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.8rem',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {uni.description}
                        </p>

                        {/* Visit Website button */}
                        <button
                          onClick={() => {
                            if (uni.website) window.open(uni.website, '_blank')
                          }}
                          disabled={!uni.website}
                          style={{
                            width: '100%',
                            padding: '0.4rem',
                            borderRadius: 50,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: uni.website ? 'pointer' : 'default',
                            background: uni.website ? '#0d9488' : '#e5e7eb',
                            color: uni.website ? '#fff' : '#9ca3af',
                            border: 'none',
                            fontFamily: 'DM Sans, sans-serif',
                            transition: 'all 0.2s'
                          }}
                        >
                          {uni.website ? 'Visit Website →' : 'No Website'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!modalLoading && relatedUniversities.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: '#f9fafb',
                  borderRadius: 12,
                  color: '#9ca3af',
                  fontSize: '0.9rem'
                }}>
                  No universities linked to this skill yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillsPage

