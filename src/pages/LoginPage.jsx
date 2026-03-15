import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(window.location.search)
      navigate(params.get('redirect_to') || '/dashboard')
    }
  }, [user, navigate])

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      await signIn(email, password)
      const params = new URLSearchParams(window.location.search)
      navigate(params.get('redirect_to') || '/dashboard')
    } catch (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Wrong email or password. Please try again.')
      } else if (err.message.includes('Email not confirmed')) {
        setError('Email not confirmed. Contact support.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Register
  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!fullName || fullName.trim().length < 2) {
      setError('Please enter your full name')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password, fullName)
      // Auto login right after register (works because email confirm is OFF)
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      if (err.message.includes('already registered')) {
        setError('This email is already registered. Try logging in.')
      } else if (err.message.includes('Database error')) {
        setError('Something went wrong. Please try again.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pf-page">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">PathFinder</div>
          <div className="login-tagline">Shape your choice with confidence</div>

          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setMessage(''); }}
            >
              Login
            </button>
            <button
              className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setMessage(''); }}
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
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <a href="#" className="forgot-link" onClick={e => e.preventDefault()}>Forgot password?</a>
              </div>
              <button className="btn-full" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
              <div className="divider"><span>or</span></div>
              <button className="btn-google" type="button" disabled={loading}>
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
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Alex Johnson"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <button className="btn-full" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Create Account'}</button>
              <div className="divider"><span>or</span></div>
              <button className="btn-google" type="button" disabled={loading}>
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
