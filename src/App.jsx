import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AssessmentPage from './pages/AssessmentPage'
import SkillsPage from './pages/SkillsPage'
import DashboardPage from './pages/DashboardPage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
