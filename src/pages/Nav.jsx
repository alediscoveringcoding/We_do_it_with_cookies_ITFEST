function Nav({ activePage, setActivePage }) {
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
        <li>
          <button className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
            Dashboard
          </button>
        </li>
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
      </ul>
    </nav>
  )
}

export default Nav
