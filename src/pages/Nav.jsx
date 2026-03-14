import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function Nav({ activePage, setActivePage }) {
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const displayName = user?.user_metadata?.full_name || user?.email || ''
  const initials = displayName.charAt(0).toUpperCase()

  async function handleSignOut() {
    await signOut()
    setActivePage('home')
  }

  return (
    <nav className="pf-nav">
      <button className="pf-nav-logo" onClick={() => setActivePage('home')}>
        Path<span>Finder</span>
      </button>
      <ul className="pf-nav-links">
        <li>
          <button className={activePage === 'home' ? 'active' : ''} onClick={() => setActivePage('home')}>
            Home
          </button>
        </li>
        <li>
          <button className={activePage === 'assessment' ? 'active' : ''} onClick={() => setActivePage('assessment')}>
            Career Assessment
          </button>
        </li>
        <li>
          <button className={activePage === 'skills' ? 'active' : ''} onClick={() => setActivePage('skills')}>
            Skills
          </button>
        </li>
        
        {user && (
          <>
            <li>
              <button className={activePage === 'discover' ? 'active' : ''} onClick={() => setActivePage('discover')}>
                Discover
              </button>
            </li>
            <li>
              <button className={activePage === 'my-matches' ? 'active' : ''} onClick={() => setActivePage('my-matches')}>
                My Matches
              </button>
            </li>
            <li>
              <button className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
                Dashboard
              </button>
            </li>
          </>
        )}

        {!user && (
          <>
            <li>
              <button className={`btn-nav-outline ${activePage === 'login' ? 'active' : ''}`} onClick={() => setActivePage('login')}>
                Login
              </button>
            </li>
            <li>
              <button className="btn-nav-solid" onClick={() => setActivePage('assessment')}>
                Start Assessment
              </button>
            </li>
          </>
        )}

        {user && (
          <li style={{ position: 'relative' }}>
            <button 
              className="pf-nav-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--teal), var(--green))',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {initials}
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow)',
                minWidth: '160px',
                zIndex: 1000,
                marginTop: '0.5rem'
              }}>
                <div style={{
                  padding: '0.8rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  color: 'var(--soft)'
                }}>
                  {displayName}
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.7rem 1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: 'var(--mid)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.target.style.background = 'none'}
                >
                  Sign Out
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Nav
