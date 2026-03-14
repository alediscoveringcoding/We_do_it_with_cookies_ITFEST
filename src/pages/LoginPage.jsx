import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

function LoginPage({ setActivePage }) {
  const { user, signIn, signUp, signInWithGoogle } = useAuth()
  const [tab, setTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setActivePage('dashboard')
    }
  }, [user, setActivePage])

  async function handleLogin(e) {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signIn(loginEmail, loginPassword)
      setMessage('✅ Logged in successfully!')
      setActivePage('dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      setError('Please fill in all fields.')
      return
    }
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signUp(regEmail, regPassword, regName)
      setMessage('✅ Account created! Check your email to confirm.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="pf-page">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">PathFinder</div>
          <div className="login-tagline">Shape your career with confidence</div>

          <div className="login-tabs">
            <button
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setMessage(''); }}
            >
              Login
            </button>
            <button
              className={`login-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setMessage(''); }}
            >
              Register
            </button>
          </div>

          {message && (
            <div style={{
              background: message.startsWith('✅') ? 'var(--teal-pale)' : '#fee2e2',
              color: message.startsWith('✅') ? 'var(--teal)' : '#991b1b',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              fontSize: '0.88rem',
              marginBottom: '1rem',
              fontWeight: 500,
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              fontSize: '0.88rem',
              marginBottom: '1rem',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@school.edu"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
                <a href="#" className="forgot-link" onClick={e => e.preventDefault()}>Forgot password?</a>
              </div>
              <button className="btn-full" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
              <div className="divider"><span>or</span></div>
              <button className="btn-google" type="button" onClick={handleGoogleLogin} disabled={loading}>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Alex Johnson"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@school.edu"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                />
              </div>
              <button className="btn-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
              <div className="divider"><span>or</span></div>
              <button className="btn-google" type="button" onClick={handleGoogleLogin} disabled={loading}>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
