import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabaseClient'

export default function DiscoverPage() {
  const { user } = useAuth()
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('matched')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [userTraits, setUserTraits] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [selectedUniversity, setSelectedUniversity] = useState(null)

  // Fetch user's RIASEC top traits from latest assessment
  useEffect(() => {
    if (!user) return
    supabase
      .from('assessments')
      .select('top_traits')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.top_traits) setUserTraits(data.top_traits)
      })
  }, [user])

  // Fetch all universities
  useEffect(() => {
    supabase
      .from('universities')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setUniversities(data || [])
        setLoading(false)
      })
  }, [])

  // Fetch user's saved universities
  useEffect(() => {
    if (!user) return
    supabase
      .from('user_university_choices')
      .select('university_id')
      .eq('user_id', user.id)
      .eq('choice', 'yes')
      .then(({ data }) => {
        setSavedIds((data || []).map(d => d.university_id))
      })
  }, [user])

  // Filter logic
  useEffect(() => {
    let result = [...universities]

    if (viewMode === 'matched' && userTraits.length > 0) {
      result = result.filter(uni =>
        uni.riasec_tags?.some(tag => userTraits.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(uni =>
        uni.name.toLowerCase().includes(q) ||
        uni.city?.toLowerCase().includes(q)
      )
    }

    if (selectedType !== 'all') {
      result = result.filter(uni =>
        uni.type?.toLowerCase() === selectedType.toLowerCase()
      )
    }

    setFilteredUniversities(result)
  }, [universities, viewMode, searchQuery, selectedType, userTraits])

  // Save / unsave university
  async function toggleSave(universityId) {
    if (!user) return
    const isSaved = savedIds.includes(universityId)
    if (isSaved) {
      await supabase
        .from('user_university_choices')
        .delete()
        .eq('user_id', user.id)
        .eq('university_id', universityId)
      setSavedIds(prev => prev.filter(id => id !== universityId))
    } else {
      await supabase
        .from('user_university_choices')
        .upsert({
          user_id: user.id,
          university_id: universityId,
          choice: 'yes'
        }, { onConflict: 'user_id,university_id' })
      setSavedIds(prev => [...prev, universityId])
    }
  }

  const matchedCount = universities.filter(uni =>
    uni.riasec_tags?.some(tag => userTraits.includes(tag))
  ).length

  const typeOptions = [
    'all', 'Public', 'Technical', 'Medicine', 'Arts',
    'Private', 'Military', 'Economics', 'Agriculture', 'Research'
  ]

  const riasecColors = {
    R: { bg: '#dbeafe', text: '#1d4ed8' },
    I: { bg: '#ede9fe', text: '#4c1d95' },
    A: { bg: '#fce7f3', text: '#9d174d' },
    S: { bg: '#d1fae5', text: '#065f46' },
    E: { bg: '#fef3c7', text: '#92400e' },
    C: { bg: '#f3f4f6', text: '#374151' }
  }

  const typeColors = {
    Public: { bg: '#dbeafe', text: '#1e40af' },
    Technical: { bg: '#fef3c7', text: '#92400e' },
    Medicine: { bg: '#fee2e2', text: '#991b1b' },
    Arts: { bg: '#fce7f3', text: '#9d174d' },
    Private: { bg: '#f3f4f6', text: '#374151' },
    Military: { bg: '#1f2937', text: '#ffffff' },
    Economics: { bg: '#d1fae5', text: '#065f46' },
    Agriculture: { bg: '#ecfccb', text: '#3f6212' },
    Research: { bg: '#ede9fe', text: '#4c1d95' },
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center',
      alignItems:'center', minHeight:'60vh' }}>
      <div style={{ width:36, height:36, border:'4px solid #0d9488',
        borderTopColor:'transparent', borderRadius:'50%',
        animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900,
          marginBottom: '0.5rem' }}>
          Discover Universities 🎓
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Find the right university for your personality and goals
        </p>
      </div>

      {/* Toggle buttons */}
      <div style={{ display:'flex', gap:'0.75rem',
        marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <button
          onClick={() => setViewMode('matched')}
          style={{
            padding: '0.6rem 1.4rem', borderRadius: 50, fontWeight: 600,
            fontSize: '0.9rem', cursor: 'pointer', border: 'none',
            background: viewMode === 'matched' ? '#0d9488' : '#fff',
            color: viewMode === 'matched' ? '#fff' : '#374151',
            border: viewMode === 'matched' ? 'none' : '2px solid #e5e7eb',
            transition: 'all 0.2s'
          }}>
          ⭐ Matched For You
          {userTraits.length > 0 && (
            <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.25)',
              padding: '0.1rem 0.5rem', borderRadius: 50, fontSize: '0.75rem' }}>
              {matchedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setViewMode('all')}
          style={{
            padding: '0.6rem 1.4rem', borderRadius: 50, fontWeight: 600,
            fontSize: '0.9rem', cursor: 'pointer',
            background: viewMode === 'all' ? '#0d9488' : '#fff',
            color: viewMode === 'all' ? '#fff' : '#374151',
            border: viewMode === 'all' ? 'none' : '2px solid #e5e7eb',
            transition: 'all 0.2s'
          }}>
          🏛️ All Universities
        </button>
        {viewMode === 'matched' && userTraits.length > 0 && (
          <span style={{ color: '#0d9488', fontSize: '0.85rem', fontWeight: 500 }}>
            Showing universities matching your profile: {userTraits.join(', ')}
          </span>
        )}
      </div>

      {/* Search */}
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search by university name or city..."
        style={{
          width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem',
          border: '2px solid #e5e7eb', borderRadius: 12, outline: 'none',
          marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif',
          transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = '#0d9488'}
        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
      />

      {/* Type filters */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap',
        marginBottom:'2rem' }}>
        {typeOptions.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '0.3rem 0.9rem', borderRadius: 50,
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              border: 'none', transition: 'all 0.2s',
              background: selectedType === type ? '#0d9488' : '#f3f4f6',
              color: selectedType === type ? '#fff' : '#374151',
              fontFamily: 'DM Sans, sans-serif'
            }}>
            {type === 'all' ? 'All Types' : type}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color:'#6b7280', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
        Showing {filteredUniversities.length} universities
      </p>

      {/* Empty state */}
      {filteredUniversities.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem 2rem',
          color:'#6b7280' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
          <p style={{ fontSize:'1.1rem', fontWeight:600 }}>
            No universities found
          </p>
          <p style={{ fontSize:'0.9rem', marginTop:'0.5rem' }}>
            Try adjusting your filters or search term
          </p>
        </div>
      )}

      {/* University grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredUniversities.map(uni => {
          const isSaved = savedIds.includes(uni.id)
          const isMatch = userTraits.length > 0 &&
            uni.riasec_tags?.some(tag => userTraits.includes(tag))
          const typeColor = typeColors[uni.type] || typeColors.Private

          return (
            <div
              key={uni.id}
              onClick={() => setSelectedUniversity(uni)}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: isMatch && viewMode === 'matched'
                  ? '1px solid #0d9488'
                  : '1px solid #e5e7eb',
                borderLeft: isMatch ? '4px solid #0d9488' : undefined,
                padding: '1.5rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Match badge */}
              {isMatch && viewMode === 'matched' && (
                <div style={{
                  position:'absolute', top:12, right:12,
                  background:'#d1fae5', color:'#065f46',
                  fontSize:'0.7rem', fontWeight:700,
                  padding:'0.15rem 0.6rem', borderRadius:50
                }}>
                  ✓ Matches you
                </div>
              )}

              {/* Type + City row */}
              <div style={{ display:'flex', alignItems:'center',
                gap:'0.5rem', marginBottom:'0.8rem', flexWrap:'wrap' }}>
                <span style={{
                  background: typeColor.bg, color: typeColor.text,
                  fontSize:'0.72rem', fontWeight:700,
                  padding:'0.2rem 0.7rem', borderRadius:50
                }}>
                  {uni.type}
                </span>
                <span style={{ color:'#9ca3af', fontSize:'0.8rem',
                  display:'flex', alignItems:'center', gap:'0.2rem' }}>
                  📍 {uni.city}
                </span>
              </div>

              {/* Name */}
              <h3 style={{
                fontSize:'1rem', fontWeight:700, marginBottom:'0.5rem',
                color:'#1a1a2e', lineHeight:1.3
              }}>
                {uni.name}
              </h3>

              {/* Description */}
              <p style={{
                color:'#6b7280', fontSize:'0.85rem', marginBottom:'1rem',
                lineHeight:1.5,
                display:'-webkit-box', WebkitLineClamp:2,
                WebkitBoxOrient:'vertical', overflow:'hidden'
              }}>
                {uni.description}
              </p>

              {/* RIASEC tags */}
              <div style={{ display:'flex', gap:'0.4rem',
                flexWrap:'wrap', marginBottom:'1rem' }}>
                {uni.riasec_tags?.map(tag => (
                  <span key={tag} style={{
                    background: riasecColors[tag]?.bg || '#f3f4f6',
                    color: riasecColors[tag]?.text || '#374151',
                    fontSize:'0.72rem', fontWeight:700,
                    padding:'0.2rem 0.6rem', borderRadius:50
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display:'flex', gap:'0.75rem',
                borderTop:'1px solid #f3f4f6', paddingTop:'1rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave(uni.id)
                  }}
                  style={{
                    flex:1, padding:'0.5rem', borderRadius:50,
                    fontSize:'0.82rem', fontWeight:600, cursor:'pointer',
                    transition:'all 0.2s', fontFamily:'DM Sans, sans-serif',
                    background: isSaved ? '#d1fae5' : '#fff',
                    color: isSaved ? '#065f46' : '#6b7280',
                    border: isSaved ? '1.5px solid #065f46' : '1.5px solid #e5e7eb'
                  }}>
                  {isSaved ? '❤️ Saved' : '🤍 Save'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (uni.website) {
                      window.open(uni.website, '_blank')
                    }
                  }}
                  style={{
                    flex:1, padding:'0.5rem', borderRadius:50,
                    fontSize:'0.82rem', fontWeight:600, cursor:'pointer',
                    background:'#0d9488', color:'#fff', border:'none',
                    transition:'all 0.2s', fontFamily:'DM Sans, sans-serif'
                  }}>
                  Learn More →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* University Detail Modal */}
      {selectedUniversity && (
        <div
          onClick={() => setSelectedUniversity(null)}
          style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,0.5)', zIndex:200,
            display:'flex', alignItems:'center',
            justifyContent:'center', padding:'2rem'
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background:'#fff', borderRadius:20,
              maxWidth:560, width:'100%',
              padding:'2rem', maxHeight:'80vh',
              overflowY:'auto', position:'relative'
            }}>
            <button
              onClick={() => setSelectedUniversity(null)}
              style={{
                position:'absolute', top:16, right:16,
                background:'#f3f4f6', border:'none',
                width:32, height:32, borderRadius:'50%',
                cursor:'pointer', fontSize:'1rem'
              }}>
              ✕
            </button>

            {/* Modal type + city */}
            <div style={{ display:'flex', gap:'0.5rem',
              marginBottom:'1rem', flexWrap:'wrap' }}>
              <span style={{
                background: typeColors[selectedUniversity.type]?.bg || '#f3f4f6',
                color: typeColors[selectedUniversity.type]?.text || '#374151',
                fontSize:'0.75rem', fontWeight:700,
                padding:'0.25rem 0.8rem', borderRadius:50
              }}>
                {selectedUniversity.type}
              </span>
              <span style={{ color:'#6b7280', fontSize:'0.85rem',
                display:'flex', alignItems:'center', gap:'0.3rem' }}>
                📍 {selectedUniversity.city}
              </span>
            </div>

            {/* Modal name */}
            <h2 style={{
              fontFamily:'Playfair Display, serif',
              fontSize:'1.6rem', fontWeight:900,
              marginBottom:'0.75rem', lineHeight:1.2
            }}>
              {selectedUniversity.name}
            </h2>

            {/* Modal description */}
            <p style={{ color:'#374151', fontSize:'0.95rem',
              lineHeight:1.7, marginBottom:'1.5rem' }}>
              {selectedUniversity.description}
            </p>

            {/* RIASEC match section */}
            <h4 style={{ fontSize:'0.8rem', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'0.06em',
              color:'#9ca3af', marginBottom:'0.75rem' }}>
              RIASEC Profile Match
            </h4>
            <div style={{ display:'flex', gap:'0.5rem',
              flexWrap:'wrap', marginBottom:'1.5rem' }}>
              {selectedUniversity.riasec_tags?.map(tag => (
                <span key={tag} style={{
                  background: riasecColors[tag]?.bg,
                  color: riasecColors[tag]?.text,
                  padding:'0.3rem 0.9rem', borderRadius:50,
                  fontSize:'0.82rem', fontWeight:600
                }}>
                  {tag}
                  {userTraits.includes(tag) && ' ✓'}
                </span>
              ))}
            </div>

            {/* Visit Website button */}
            {selectedUniversity.website && (
              <button
                onClick={() => window.open(selectedUniversity.website, '_blank')}
                style={{
                  width:'100%', padding:'0.85rem', borderRadius:50,
                  fontWeight:700, fontSize:'1rem', cursor:'pointer',
                  border:'none', fontFamily:'DM Sans, sans-serif',
                  background:'#0d9488', color:'#fff',
                  transition:'all 0.2s', marginBottom:'0.75rem'
                }}>
                Visit Website →
              </button>
            )}

            {/* Save button in modal */}
            <button
              onClick={() => toggleSave(selectedUniversity.id)}
              style={{
                width:'100%', padding:'0.85rem', borderRadius:50,
                fontWeight:700, fontSize:'1rem', cursor:'pointer',
                border:'none', fontFamily:'DM Sans, sans-serif',
                background: savedIds.includes(selectedUniversity.id)
                  ? '#d1fae5' : '#0d9488',
                color: savedIds.includes(selectedUniversity.id)
                  ? '#065f46' : '#fff',
                transition:'all 0.2s'
              }}>
              {savedIds.includes(selectedUniversity.id)
                ? '❤️ Saved to My Matches'
                : '🤍 Save to My Matches'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
