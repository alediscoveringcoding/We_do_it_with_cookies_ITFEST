import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div style={{ fontWeight: 600 }}>PathFinder</div>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem' }}>
        <Link to="/">Home</Link>
        <Link to="/assessment">Assessment</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}

export default NavBar

