import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AssessmentPage from './pages/AssessmentPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SkillsPage from './pages/SkillsPage'
import DiscoverPage from './pages/DiscoverPage'
import MyMatchesPage from './pages/MyMatchesPage'
import ProtectedRoute from './components/ProtectedRoute'
import Nav from './pages/Nav'

function App() {
  return (
    <div className="pf-root">
      <Nav />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/skills" element={<SkillsPage />} />

        {/* Protected routes - require login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/my-matches" element={<MyMatchesPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
