import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabaseClient'

export default function MyMatchesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUniversity, setSelectedUniversity] = useState(null)

  // Fetch user's saved universities
  useEffect(() => {
    if (!user) return
    const fetchMatches = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('user_university_choices')
          .select('university_id, universities(*)')
          .eq('user_id', user.id)
          .eq('choice', 'yes')
        if (fetchError) throw fetchError
        setMatches((data || []).map(item => item.universities))
      } catch (err) {
        console.error('Error fetching matches:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [user])

  const removeMatch = async (universityId) => {
    try {
      await supabase
        .from('user_university_choices')
        .delete()
        .eq('user_id', user.id)
        .eq('university_id', universityId)
      setMatches(prev => prev.filter(u => u.id !== universityId))
    } catch (err) {
      console.error('Error removing match:', err)
    }
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

  const riasecColors = {
    R: { bg: '#dbeafe', text: '#1d4ed8' },
    I: { bg: '#ede9fe', text: '#4c1d95' },
    A: { bg: '#fce7f3', text: '#9d174d' },
    S: { bg: '#d1fae5', text: '#065f46' },
    E: { bg: '#fef3c7', text: '#92400e' },
    C: { bg: '#f3f4f6', text: '#374151' }
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh' }}>
      <div style={{ width:36, height:36, border:'4px solid #0d9488', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
          My Matches ❤️
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Universities you've saved that match your profile
        </p>
      </div>

      {matches.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem', color:'#6b7280' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📚</div>
          <p style={{ fontSize:'1.1rem', fontWeight:600 }}>No saved universities yet</p>
          <p style={{ fontSize:'0.9rem', marginTop:'0.5rem', marginBottom:'1.5rem' }}>
            Start exploring universities that match your personality and goals
          </p>
          <button
            onClick={() => navigate('/discover')}
            style={{
              padding:'0.75rem 1.8rem', borderRadius:50, fontWeight:700,
              fontSize:'0.95rem', cursor:'pointer', border:'none',
              background:'#0d9488', color:'#fff', transition:'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Start Discovering →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {matches.map(uni => {
            const typeColor = typeColors[uni.type] || typeColors.Private
            return (
              <div
                key={uni.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
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
                {/* Type + City row */}
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.8rem', flexWrap:'wrap' }}>
                  <span style={{ background: typeColor.bg, color: typeColor.text, fontSize:'0.72rem', fontWeight:700, padding:'0.2rem 0.7rem', borderRadius:50 }}>
                    {uni.type}
                  </span>
                  <span style={{ color:'#9ca3af', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.2rem' }}>
                    📍 {uni.city}
                  </span>
                </div>

                {/* Name */}
                <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'0.5rem', color:'#1a1a2e', lineHeight:1.3 }}>
                  {uni.name}
                </h3>

                {/* Description */}
                <p style={{ color:'#6b7280', fontSize:'0.85rem', marginBottom:'1rem', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {uni.description}
                </p>

                {/* RIASEC tags */}
                <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                  {uni.riasec_tags?.map(tag => (
                    <span key={tag} style={{ background: riasecColors[tag]?.bg || '#f3f4f6', color: riasecColors[tag]?.text || '#374151', fontSize:'0.72rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:50 }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display:'flex', gap:'0.75rem', borderTop:'1px solid #f3f4f6', paddingTop:'1rem' }}>
                  <button
                    onClick={e => { e.stopPropagation(); removeMatch(uni.id) }}
                    style={{ flex:1, padding:'0.5rem', borderRadius:50, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s', fontFamily:'DM Sans, sans-serif', background:'#fff', color:'#dc2626', border:'1.5px solid #fca5a5' }}
                    onMouseEnter={e => { e.target.style.background = '#fee2e2'; e.target.style.borderColor = '#dc2626' }}
                    onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#fca5a5' }}
                  >
                    ✕ Remove
                  </button>
                  <button
                    onClick={() => setSelectedUniversity(uni)}
                    style={{ flex:1, padding:'0.5rem', borderRadius:50, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', background:'#0d9488', color:'#fff', border:'none', transition:'all 0.2s', fontFamily:'DM Sans, sans-serif' }}
                  >
                    Details →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* University Detail Modal */}
      {selectedUniversity && (
        <div
          onClick={() => setSelectedUniversity(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:'#fff', borderRadius:20, maxWidth:560, width:'100%', padding:'2rem', maxHeight:'80vh', overflowY:'auto', position:'relative' }}>
            <button
              onClick={() => setSelectedUniversity(null)}
              style={{ position:'absolute', top:16, right:16, background:'#f3f4f6', border:'none', width:32, height:32, borderRadius:'50%', cursor:'pointer', fontSize:'1rem' }}>
              ✕
            </button>

            {/* Modal type + city */}
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
              <span style={{ background: typeColors[selectedUniversity.type]?.bg || '#f3f4f6', color: typeColors[selectedUniversity.type]?.text || '#374151', fontSize:'0.75rem', fontWeight:700, padding:'0.25rem 0.8rem', borderRadius:50 }}>
                {selectedUniversity.type}
              </span>
              <span style={{ color:'#6b7280', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                📍 {selectedUniversity.city}
              </span>
            </div>

            {/* Modal name */}
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.6rem', fontWeight:900, marginBottom:'0.75rem', lineHeight:1.2 }}>
              {selectedUniversity.name}
            </h2>

            {/* Modal description */}
            <p style={{ color:'#374151', fontSize:'0.95rem', lineHeight:1.7, marginBottom:'1.5rem' }}>
              {selectedUniversity.description}
            </p>

            {/* RIASEC match section */}
            <h4 style={{ fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#9ca3af', marginBottom:'0.75rem' }}>
              RIASEC Profile
            </h4>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
              {selectedUniversity.riasec_tags?.map(tag => (
                <span key={tag} style={{ background: riasecColors[tag]?.bg, color: riasecColors[tag]?.text, padding:'0.3rem 0.9rem', borderRadius:50, fontSize:'0.82rem', fontWeight:600 }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Remove button in modal */}
            <button
              onClick={() => { removeMatch(selectedUniversity.id); setSelectedUniversity(null) }}
              style={{ width:'100%', padding:'0.85rem', borderRadius:50, fontWeight:700, fontSize:'1rem', cursor:'pointer', border:'1.5px solid #fca5a5', fontFamily:'DM Sans, sans-serif', background:'#fff', color:'#dc2626', transition:'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = '#fee2e2' }}
              onMouseLeave={e => { e.target.style.background = '#fff' }}
            >
              ✕ Remove from My Matches
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
