import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabaseClient'

export default function MyMatchesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [savedUniversities, setSavedUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0)
  const [swipeAnimation, setSwipeAnimation] = useState(null)
  // swipeAnimation = 'left' | 'right' | null

  // Fetch all saved universities (choice = 'yes')
  useEffect(() => {
    if (!user) return
    fetchSaved()
  }, [user])

  async function fetchSaved() {
    setLoading(true)
    const { data } = await supabase
      .from('user_university_choices')
      .select('*, universities(*)')
      .eq('user_id', user.id)
      .eq('choice', 'yes')
      .order('created_at', { ascending: true })
    setSavedUniversities(data || [])
    setLoading(false)
  }

  // Split into pending (not yet swiped) and final shortlist
  const pendingSwipe = savedUniversities.filter(
    s => s.final_decision === null || s.final_decision === undefined
  )
  const finalShortlist = savedUniversities.filter(
    s => s.final_decision === 'keep'
  )

  // Current card being shown
  const currentCard = pendingSwipe[currentSwipeIndex]

  // Handle swipe decision
  async function handleSwipe(decision) {
    if (!currentCard) return

    // Animate card out
    setSwipeAnimation(decision === 'keep' ? 'right' : 'left')

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 350))

    // Save decision to Supabase
    await supabase
      .from('user_university_choices')
      .update({ final_decision: decision })
      .eq('user_id', user.id)
      .eq('university_id', currentCard.university_id)

    // Update local state
    setSavedUniversities(prev =>
      prev.map(s =>
        s.university_id === currentCard.university_id
          ? { ...s, final_decision: decision }
          : s
      )
    )

    setSwipeAnimation(null)
    setCurrentSwipeIndex(prev => prev + 1)
  }

  // Keyboard support
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowLeft') handleSwipe('remove')
      if (e.key === 'ArrowRight') handleSwipe('keep')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentCard])

  // Remove from final shortlist
  async function removeFromShortlist(universityId) {
    await supabase
      .from('user_university_choices')
      .update({ final_decision: null })
      .eq('user_id', user.id)
      .eq('university_id', universityId)
    setSavedUniversities(prev =>
      prev.map(s =>
        s.university_id === universityId
          ? { ...s, final_decision: null }
          : s
      )
    )
    // Put back at start of swipe queue
    setCurrentSwipeIndex(0)
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
    <div style={{ display:'flex', justifyContent:'center',
      alignItems:'center', minHeight:'60vh' }}>
      <div style={{ width:36, height:36, border:'4px solid #0d9488',
        borderTopColor:'transparent', borderRadius:'50%',
        animation:'spin 0.8s linear infinite' }} />
    </div>
  )

  // Empty state — nothing saved yet
  if (savedUniversities.length === 0) return (
    <div style={{ maxWidth:600, margin:'0 auto',
      padding:'5rem 2rem', textAlign:'center' }}>
      <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>📋</div>
      <h2 style={{ fontFamily:'Playfair Display, serif',
        fontSize:'1.8rem', fontWeight:900, marginBottom:'0.75rem' }}>
        No matches yet
      </h2>
      <p style={{ color:'#6b7280', marginBottom:'0.5rem' }}>
        Take the RIASEC assessment first to get your
        personalized university matches.
      </p>
      <p style={{ color:'#9ca3af', fontSize:'0.85rem',
        marginBottom:'2rem' }}>
        Or browse universities manually on the Discover page.
      </p>
      <div style={{ display:'flex', gap:'1rem',
        justifyContent:'center', flexWrap:'wrap' }}>
        <button
          onClick={() => navigate('/assessment')}
          style={{ background:'#0d9488', color:'#fff', border:'none',
            padding:'0.85rem 1.8rem', borderRadius:50, fontWeight:700,
            fontSize:'0.95rem', cursor:'pointer',
            fontFamily:'DM Sans, sans-serif' }}>
          Take Assessment →
        </button>
        <button
          onClick={() => navigate('/discover')}
          style={{ background:'#fff', color:'#0d9488',
            border:'2px solid #0d9488',
            padding:'0.85rem 1.8rem', borderRadius:50, fontWeight:700,
            fontSize:'0.95rem', cursor:'pointer',
            fontFamily:'DM Sans, sans-serif' }}>
          Browse Manually
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem' }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
        <div style={{
          display:'inline-block', background:'#ccfbf1',
          color:'#0d9488', fontSize:'0.78rem', fontWeight:700,
          padding:'0.3rem 0.9rem', borderRadius:50,
          textTransform:'uppercase', letterSpacing:'0.08em',
          marginBottom:'0.75rem'
        }}>
          Your Matches
        </div>
        <h1 style={{
          fontFamily:'Playfair Display, serif',
          fontSize:'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight:900, marginBottom:'0.5rem'
        }}>
          Your Matched Universities 🎓
        </h1>
        <p style={{ color:'#6b7280', fontSize:'0.95rem', maxWidth:500,
          margin:'0 auto' }}>
          Based on your RIASEC profile, we found{' '}
          <strong style={{ color:'#0d9488' }}>
            {savedUniversities.length} universities
          </strong>
          {' '}that match your personality. Swipe through them to build
          your final shortlist.
        </p>
      </div>

      {/* Stats bar */}
      {savedUniversities.length > 0 && (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(3, 1fr)',
          gap:'1rem', maxWidth:500,
          margin:'0 auto 3rem',
          background:'#fff', borderRadius:16,
          border:'1px solid #e5e7eb',
          padding:'1.25rem'
        }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Playfair Display, serif',
              fontSize:'1.8rem', fontWeight:900,
              color:'#0d9488' }}>
              {savedUniversities.length}
            </div>
            <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>
              Total Matched
            </div>
          </div>
          <div style={{ textAlign:'center',
            borderLeft:'1px solid #e5e7eb',
            borderRight:'1px solid #e5e7eb' }}>
            <div style={{ fontFamily:'Playfair Display, serif',
              fontSize:'1.8rem', fontWeight:900,
              color:'#374151' }}>
              {pendingSwipe.length}
            </div>
            <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>
              Left to Review
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Playfair Display, serif',
              fontSize:'1.8rem', fontWeight:900,
              color:'#2d6a4f' }}>
              {finalShortlist.length}
            </div>
            <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>
              In Shortlist
            </div>
          </div>
        </div>
      )}

      {/* ===== SECTION 1: SWIPE QUEUE ===== */}
      {pendingSwipe.length > 0 && (
        <div style={{ marginBottom:'4rem' }}>

          {/* Section header */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ display:'inline-block', background:'#ccfbf1',
              color:'#0d9488', fontSize:'0.78rem', fontWeight:700,
              padding:'0.3rem 0.9rem', borderRadius:50,
              textTransform:'uppercase', letterSpacing:'0.08em',
              marginBottom:'0.75rem' }}>
              Step 2 of 2
            </div>
            <h2 style={{ fontFamily:'Playfair Display, serif',
              fontSize:'clamp(1.6rem, 3vw, 2.2rem)', fontWeight:900,
              marginBottom:'0.5rem' }}>
              Rate Your Saved Universities
            </h2>
            <p style={{ color:'#6b7280', fontSize:'0.95rem' }}>
              Swipe through your saved universities and pick your favorites
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ maxWidth:500, margin:'0 auto 2rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between',
              fontSize:'0.82rem', color:'#6b7280', marginBottom:'0.4rem' }}>
              <span>
                {currentSwipeIndex} of {pendingSwipe.length} reviewed
              </span>
              <span>
                {Math.round((currentSwipeIndex / pendingSwipe.length) * 100)}% complete
              </span>
            </div>
            <div style={{ height:6, background:'#e5e7eb',
              borderRadius:3, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:3,
                background:'linear-gradient(90deg, #0d9488, #2d6a4f)',
                width: `${(currentSwipeIndex / pendingSwipe.length) * 100}%`,
                transition:'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Card */}
          {currentCard ? (
            <div style={{ display:'flex', flexDirection:'column',
              alignItems:'center', gap:'1.5rem' }}>

              {/* University card */}
              <div style={{
                background:'#fff',
                borderRadius:20,
                border:'1px solid #e5e7eb',
                padding:'2.5rem',
                maxWidth:480,
                width:'100%',
                boxShadow:'0 8px 32px rgba(0,0,0,0.08)',
                transform: swipeAnimation === 'right'
                  ? 'translateX(120%) rotate(8deg)'
                  : swipeAnimation === 'left'
                  ? 'translateX(-120%) rotate(-8deg)'
                  : 'translateX(0) rotate(0deg)',
                opacity: swipeAnimation ? 0 : 1,
                transition:'transform 0.35s ease, opacity 0.35s ease',
                position:'relative'
              }}>

                {/* Type + city */}
                <div style={{ display:'flex', alignItems:'center',
                  gap:'0.75rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                  <span style={{ background:'#f3f4f6', color:'#374151',
                    fontSize:'0.75rem', fontWeight:700,
                    padding:'0.25rem 0.8rem', borderRadius:50 }}>
                    {currentCard.universities?.type}
                  </span>
                  <span style={{ color:'#9ca3af', fontSize:'0.85rem' }}>
                    📍 {currentCard.universities?.city}
                  </span>
                </div>

                {/* Name */}
                <h3 style={{ fontFamily:'Playfair Display, serif',
                  fontSize:'1.6rem', fontWeight:900,
                  marginBottom:'0.75rem', lineHeight:1.2 }}>
                  {currentCard.universities?.name}
                </h3>

                {/* RIASEC tags */}
                <div style={{ display:'flex', gap:'0.4rem',
                  flexWrap:'wrap', marginBottom:'1rem' }}>
                  <span style={{ fontSize:'0.75rem', fontWeight:600,
                    color:'#9ca3af', marginRight:'0.25rem' }}>
                    MATCHES YOUR TRAITS
                  </span>
                  {currentCard.universities?.riasec_tags?.map(tag => (
                    <span key={tag} style={{
                      background: riasecColors[tag]?.bg,
                      color: riasecColors[tag]?.text,
                      fontSize:'0.75rem', fontWeight:700,
                      padding:'0.2rem 0.6rem', borderRadius:50
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p style={{ color:'#6b7280', fontSize:'0.95rem',
                  lineHeight:1.6 }}>
                  {currentCard.universities?.description}
                </p>
              </div>

              {/* YES / NO buttons */}
              <div style={{ display:'flex', gap:'1rem',
                alignItems:'center' }}>
                <button
                  onClick={() => handleSwipe('remove')}
                  style={{
                    padding:'0.85rem 2.2rem', borderRadius:50,
                    fontWeight:700, fontSize:'1rem', cursor:'pointer',
                    background:'#fff', color:'#374151',
                    border:'2px solid #e5e7eb',
                    fontFamily:'DM Sans, sans-serif',
                    transition:'all 0.2s',
                    display:'flex', alignItems:'center', gap:'0.5rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ef4444'
                    e.currentTarget.style.color = '#ef4444'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.color = '#374151'
                  }}>
                  ✕ Not My Pick
                </button>

                <button
                  onClick={() => handleSwipe('keep')}
                  style={{
                    padding:'0.85rem 2.2rem', borderRadius:50,
                    fontWeight:700, fontSize:'1rem', cursor:'pointer',
                    background:'#0d9488', color:'#fff', border:'none',
                    fontFamily:'DM Sans, sans-serif',
                    transition:'all 0.2s',
                    boxShadow:'0 4px 16px rgba(13,148,136,0.35)',
                    display:'flex', alignItems:'center', gap:'0.5rem'
                  }}
                  onMouseEnter={e =>
                    e.currentTarget.style.background = '#0f766e'
                  }
                  onMouseLeave={e =>
                    e.currentTarget.style.background = '#0d9488'
                  }>
                  ✓ Add to Shortlist
                </button>
              </div>

              {/* Keyboard tip */}
              <p style={{ color:'#9ca3af', fontSize:'0.78rem' }}>
                💡 Tip: Use ← and → arrow keys for quick swiping
              </p>
            </div>
          ) : (
            // All pending cards reviewed
            <div style={{ textAlign:'center', padding:'2rem' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎉</div>
              <h3 style={{ fontFamily:'Playfair Display, serif',
                fontSize:'1.4rem', fontWeight:900, marginBottom:'0.5rem' }}>
                All reviewed!
              </h3>
              <p style={{ color:'#6b7280', marginBottom:'1.5rem' }}>
                Scroll down to see your final shortlist
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== DIVIDER ===== */}
      {pendingSwipe.length === 0 && finalShortlist.length > 0 && (
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>🎉</div>
          <p style={{ color:'#6b7280' }}>
            You've reviewed all your saved universities!
          </p>
          <button
            onClick={() => navigate('/discover')}
            style={{ marginTop:'1rem', background:'none',
              border:'2px solid #0d9488', color:'#0d9488',
              padding:'0.5rem 1.4rem', borderRadius:50,
              fontWeight:600, cursor:'pointer',
              fontFamily:'DM Sans, sans-serif', fontSize:'0.88rem' }}>
            + Save More Universities
          </button>
        </div>
      )}

      {/* ===== SECTION 2: FINAL SHORTLIST ===== */}
      {finalShortlist.length > 0 && (
        <div>
          <div style={{ marginBottom:'1.5rem' }}>
            <h2 style={{ fontFamily:'Playfair Display, serif',
              fontSize:'clamp(1.6rem, 3vw, 2.2rem)', fontWeight:900,
              marginBottom:'0.4rem' }}>
              Your Final Shortlist 🏆
            </h2>
            <p style={{ color:'#6b7280' }}>
              {finalShortlist.length} {finalShortlist.length === 1
                ? 'university' : 'universities'} you want most
            </p>
          </div>

          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
            gap:'1.5rem'
          }}>
            {finalShortlist.map((item, index) => (
              <div key={item.university_id} style={{
                background:'#fff', borderRadius:16,
                border:'1px solid #e5e7eb',
                borderLeft:'4px solid #0d9488',
                padding:'1.5rem',
                boxShadow:'0 4px 16px rgba(0,0,0,0.05)',
                transition:'all 0.2s',
                position:'relative'
              }}>
                {/* Rank badge */}
                <div style={{
                  position:'absolute', top:16, right:16,
                  background:'#0d9488', color:'#fff',
                  width:28, height:28, borderRadius:'50%',
                  display:'flex', alignItems:'center',
                  justifyContent:'center',
                  fontSize:'0.78rem', fontWeight:700
                }}>
                  #{index + 1}
                </div>

                {/* Type + city */}
                <div style={{ display:'flex', gap:'0.5rem',
                  marginBottom:'0.75rem', flexWrap:'wrap' }}>
                  <span style={{ background:'#f3f4f6', color:'#374151',
                    fontSize:'0.72rem', fontWeight:700,
                    padding:'0.2rem 0.6rem', borderRadius:50 }}>
                    {item.universities?.type}
                  </span>
                  <span style={{ color:'#9ca3af', fontSize:'0.8rem' }}>
                    📍 {item.universities?.city}
                  </span>
                </div>

                {/* Name */}
                <h3 style={{ fontSize:'1rem', fontWeight:700,
                  marginBottom:'0.5rem', lineHeight:1.3 }}>
                  {item.universities?.name}
                </h3>

                {/* Description */}
                <p style={{ color:'#6b7280', fontSize:'0.83rem',
                  marginBottom:'1rem', lineHeight:1.5 }}>
                  {item.universities?.description}
                </p>

                {/* RIASEC tags */}
                <div style={{ display:'flex', gap:'0.4rem',
                  flexWrap:'wrap', marginBottom:'1rem' }}>
                  {item.universities?.riasec_tags?.map(tag => (
                    <span key={tag} style={{
                      background: riasecColors[tag]?.bg,
                      color: riasecColors[tag]?.text,
                      fontSize:'0.7rem', fontWeight:700,
                      padding:'0.15rem 0.5rem', borderRadius:50
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromShortlist(item.university_id)}
                  style={{
                    width:'100%', padding:'0.5rem',
                    borderRadius:50, fontSize:'0.82rem',
                    fontWeight:600, cursor:'pointer',
                    background:'#fff', color:'#6b7280',
                    border:'1.5px solid #e5e7eb',
                    fontFamily:'DM Sans, sans-serif',
                    transition:'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ef4444'
                    e.currentTarget.style.color = '#ef4444'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.color = '#6b7280'
                  }}>
                  ↩ Move Back to Queue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty shortlist message (has pending but no keeps yet) */}
      {finalShortlist.length === 0 && pendingSwipe.length > 0 && (
        <div style={{ textAlign:'center', padding:'2rem',
          background:'#f9fafb', borderRadius:16,
          border:'1px dashed #e5e7eb', marginTop:'1rem' }}>
          <p style={{ color:'#9ca3af', fontSize:'0.9rem' }}>
            Your final shortlist will appear here as you swipe ✓
          </p>
        </div>
      )}

    </div>
  )
}
