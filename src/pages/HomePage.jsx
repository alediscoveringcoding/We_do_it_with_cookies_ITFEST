import { Link } from 'react-router-dom'
import NavBar from '../shared/NavBar'
import PageContainer from '../shared/PageContainer'

function HomePage() {
  return (
    <>
      <NavBar />
      <PageContainer>
        <header>
          <h1>Shape Your Career With Confidence</h1>
          <p>
            PathFinder helps high school students explore careers with a simple
            assessment, clear matches, and real stories.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Link to="/assessment" className="button">Start Assessment</Link>
            <Link to="/skills" className="button">Browse Skills</Link>
          </div>
        </header>

        <section>
          <h2>What you can do</h2>
          <ul>
            <li>Take a short career assessment</li>
            <li>See careers that match your strengths</li>
            <li>Browse skills and how people use them</li>
            <li>Collect everything in your own dashboard</li>
          </ul>
        </section>
      </PageContainer>
    </>
  )
}

export default HomePage

