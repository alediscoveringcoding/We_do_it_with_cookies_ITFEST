import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 bg-white border-b border-slate-200 z-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-teal-600">
            PathFinder
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-slate-700 hover:text-teal-600 transition ${
                isActive('/') ? 'border-b-2 border-teal-600' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/assessment"
              className={`text-slate-700 hover:text-teal-600 transition ${
                isActive('/assessment') ? 'border-b-2 border-teal-600' : ''
              }`}
            >
              Assessment
            </Link>
            <Link
              to="/skills"
              className={`text-slate-700 hover:text-teal-600 transition ${
                isActive('/skills') ? 'border-b-2 border-teal-600' : ''
              }`}
            >
              Skills
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-slate-700 hover:text-teal-600 transition ${
                  isActive('/dashboard') ? 'border-b-2 border-teal-600' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-slate-700 hover:text-teal-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-slate-700 hover:text-teal-600 transition ${
                  isActive('/login') ? 'border-b-2 border-teal-600' : ''
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
