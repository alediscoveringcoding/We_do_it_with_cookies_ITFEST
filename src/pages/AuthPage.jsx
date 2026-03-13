import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../shared/NavBar'
import PageContainer from '../shared/PageContainer'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // For MVP: simple localStorage-based auth
    if (isLogin) {
      const stored = localStorage.getItem('user')
      if (!stored) {
        setError('No account found. Please register first.')
        return
      }
      const user = JSON.parse(stored)
      if (user.email !== email || user.password !== password) {
        setError('Invalid email or password')
        return
      }
    } else {
      // Register
      const existing = localStorage.getItem('user')
      if (existing) {
        setError('An account already exists. Please login.')
        return
      }
      localStorage.setItem('user', JSON.stringify({ email, password }))
    }

    localStorage.setItem('isLoggedIn', 'true')
    navigate('/dashboard')
  }

  return (
    <>
      <NavBar />
      <PageContainer>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          <p>
            {isLogin
              ? 'Enter your credentials to access your dashboard'
              : 'Create a new account'}
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    textAlign: 'left',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#0f766e',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '14px' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0f766e',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  padding: 0,
                  fontSize: '14px',
                }}
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default AuthPage

