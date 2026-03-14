import { useState } from 'react'
import Nav from './pages/Nav'
import HomePage from './pages/HomePage'
import AssessmentPage from './pages/AssessmentPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SkillsPage from './pages/SkillsPage'
import DiscoverPage from './pages/DiscoverPage'
import MyMatchesPage from './pages/MyMatchesPage'

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="pf-root">
      <Nav activePage={activePage} setActivePage={setActivePage} />
      
      {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
      {activePage === 'assessment' && <AssessmentPage setActivePage={setActivePage} />}
      {activePage === 'dashboard' && <DashboardPage setActivePage={setActivePage} />}
      {activePage === 'skills' && <SkillsPage setActivePage={setActivePage} />}
      {activePage === 'login' && <LoginPage setActivePage={setActivePage} />}
      {activePage === 'discover' && <DiscoverPage setActivePage={setActivePage} />}
      {activePage === 'my-matches' && <MyMatchesPage setActivePage={setActivePage} />}
    </div>
  )
}

export default App
