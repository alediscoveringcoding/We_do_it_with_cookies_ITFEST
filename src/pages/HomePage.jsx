function HomePage({ setActivePage }) {
  return (
    <div className="pf-page">
      {/* HERO */}
      <div className="pf-hero">
        <div className="hero-badge">🎓 For high school students ready to find their path</div>
        <h1>Shape Your Career<br /><em>With Confidence</em></h1>
        <p>Take a personality-based assessment, explore real careers, and get a personalized roadmap built around who you are.</p>
        <div className="hero-btns">
          <button className="btn-teal" onClick={() => setActivePage('assessment')}>Start Assessment</button>
          <button className="btn-ghost" onClick={() => setActivePage('skills')}>Browse Skills</button>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <section className="pf-section" style={{ background: '#fff' }}>
        <div className="container text-center">
          <div className="section-tag">What We Offer</div>
          <h2 className="section-title">Everything You Need to Find Your Career</h2>
          <p className="section-sub">Four powerful tools. One clear direction.</p>
          <div className="features-grid">
            <div className="feat-card" onClick={() => setActivePage('assessment')}>
              <div className="feat-icon">🧭</div>
              <h3>Career Assessment</h3>
              <p>RIASEC personality quiz that maps your traits to real careers in 3 minutes.</p>
            </div>
            <div className="feat-card" onClick={() => setActivePage('skills')}>
              <div className="feat-icon">🎯</div>
              <h3>Skills Explorer</h3>
              <p>Browse 40+ skills by category and discover which careers need them most.</p>
            </div>
            <div className="feat-card" onClick={() => setActivePage('dashboard')}>
              <div className="feat-icon">📊</div>
              <h3>Personal Dashboard</h3>
              <p>Your career HQ: saved matches, progress tracking, and a Q&A board.</p>
            </div>
            <div className="feat-card" onClick={() => setActivePage('dashboard')}>
              <div className="feat-icon">💬</div>
              <h3>Community Q&A</h3>
              <p>Ask questions about any career. Get answers from peers and AI instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pf-section" style={{ background: 'var(--bg)' }}>
        <div className="container text-center">
          <div className="section-tag">How It Works</div>
          <h2 className="section-title">Three Steps to Clarity</h2>
          <p className="section-sub">From not knowing what you want to a clear, personalized career direction.</p>
          <div className="steps-row">
            <div className="step">
              <div className="step-circle">1</div>
              <h3>Take Assessment</h3>
              <p>Answer 20 scenario-based questions. Discover your RIASEC personality profile.</p>
            </div>
            <div className="step">
              <div className="step-circle">2</div>
              <h3>See Your Matches</h3>
              <p>Get a radar chart of your traits and a ranked list of careers that fit you.</p>
            </div>
            <div className="step">
              <div className="step-circle">3</div>
              <h3>Explore & Ask</h3>
              <p>Dive into skills, bookmark careers, and get AI-powered answers to your questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pf-section" style={{ background: '#fff' }}>
        <div className="container text-center">
          <div className="section-tag">Student Stories</div>
          <h2 className="section-title">Real Students, Real Clarity</h2>
          <div className="tgrid">
            <div className="tcard">
              <blockquote>"I always thought I wanted to be a doctor, but after the assessment I discovered I'm actually an Investigative-Artistic type. PathFinder matched me with UX research — and it just clicked."</blockquote>
              <div className="tcard-author">
                <div className="avatar">J</div>
                <div><div className="tcard-name">Jamie L.</div><div className="tcard-school">Lincoln High School, CA</div></div>
              </div>
            </div>
            <div className="tcard">
              <blockquote>"The Q&A board is incredible. I asked a question about graphic design careers and got an AI answer in seconds. My counselor said it was more detailed than what she could give me."</blockquote>
              <div className="tcard-author">
                <div className="avatar">M</div>
                <div><div className="tcard-name">Maya R.</div><div className="tcard-school">Jefferson Academy, TX</div></div>
              </div>
            </div>
            <div className="tcard">
              <blockquote>"The skills page showed me that what I do for fun — building websites — is actually a high-demand skill. I never thought of it as a career before. Now I'm applying to CS programs."</blockquote>
              <div className="tcard-author">
                <div className="avatar">A</div>
                <div><div className="tcard-name">Alex K.</div><div className="tcard-school">Riverside High, NY</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="pf-section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Shape Your Path?</h2>
            <p>Take the 3-minute assessment. Discover your match. Build your future.</p>
            <button className="btn-white" onClick={() => setActivePage('assessment')}>Start Your Assessment</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

