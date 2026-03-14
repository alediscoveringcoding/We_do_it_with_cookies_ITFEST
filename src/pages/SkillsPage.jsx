import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const skillsData = [
  { name: "Web Development", cat: "Technical", desc: "Building and maintaining websites and web apps.", careers: 18 },
  { name: "Data Analysis", cat: "Technical", desc: "Interpreting data sets to inform decisions.", careers: 22 },
  { name: "Machine Learning", cat: "Technical", desc: "Building models that learn from data.", careers: 14 },
  { name: "Cloud Computing", cat: "Technical", desc: "Designing and managing cloud infrastructure.", careers: 16 },
  { name: "Cybersecurity", cat: "Technical", desc: "Protecting systems and networks from digital attacks.", careers: 12 },
  { name: "Graphic Design", cat: "Creative", desc: "Creating visual content for communication.", careers: 16 },
  { name: "Creative Writing", cat: "Creative", desc: "Crafting compelling stories and content.", careers: 11 },
  { name: "Video Production", cat: "Creative", desc: "Filming, editing, and producing video content.", careers: 9 },
  { name: "UX/UI Design", cat: "Creative", desc: "Designing user-friendly digital experiences.", careers: 13 },
  { name: "Photography", cat: "Creative", desc: "Capturing and editing professional images.", careers: 7 },
  { name: "Counseling", cat: "Social", desc: "Supporting individuals through emotional challenges.", careers: 13 },
  { name: "Teaching", cat: "Social", desc: "Educating and mentoring others effectively.", careers: 20 },
  { name: "Public Speaking", cat: "Social", desc: "Delivering compelling presentations to audiences.", careers: 25 },
  { name: "Social Work", cat: "Social", desc: "Helping communities and vulnerable populations thrive.", careers: 10 },
  { name: "Critical Thinking", cat: "Analytical", desc: "Evaluating information to solve complex problems.", careers: 30 },
  { name: "Financial Modeling", cat: "Analytical", desc: "Building models to project financial outcomes.", careers: 12 },
  { name: "Research Methods", cat: "Analytical", desc: "Designing and executing scientific research.", careers: 17 },
  { name: "Statistics", cat: "Analytical", desc: "Applying statistical methods to interpret data.", careers: 15 },
  { name: "Project Management", cat: "Leadership", desc: "Planning and executing projects from start to finish.", careers: 28 },
  { name: "Team Leadership", cat: "Leadership", desc: "Motivating and directing teams toward goals.", careers: 24 },
  { name: "Strategic Planning", cat: "Leadership", desc: "Setting long-term goals and action plans.", careers: 19 },
  { name: "Electrical Work", cat: "Trades", desc: "Installing and maintaining electrical systems.", careers: 8 },
  { name: "Welding", cat: "Trades", desc: "Joining metal components using heat and pressure.", careers: 6 },
  { name: "HVAC Systems", cat: "Trades", desc: "Installing heating, ventilation, and cooling systems.", careers: 7 },
]

const badgeClass = {
  Technical: "badge-technical",
  Creative: "badge-creative",
  Social: "badge-social",
  Analytical: "badge-analytical",
  Leadership: "badge-leadership",
  Trades: "badge-trades",
}

const categories = ['All Skills', 'Technical', 'Creative', 'Social', 'Analytical', 'Leadership', 'Trades']
const categoryEmojis = {
  'All Skills': '',
  'Technical': '💻 ',
  'Creative': '🎨 ',
  'Social': '🤝 ',
  'Analytical': '📊 ',
  'Leadership': '👑 ',
  'Trades': '🔧 ',
}

function SkillsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [modalSkill, setModalSkill] = useState(null)

  const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.cat === filter)

  return (
    <div className="pf-page">
      <section className="pf-section">
        <div className="container">
          <div className="section-tag">Skills Explorer</div>
          <h2 className="section-title">Browse Skills by Category</h2>
          <p className="section-sub">Click any skill to see which careers use it and hear from real professionals.</p>

          <div className="skills-layout">
            <div className="skills-sidebar">
              <h4>Categories</h4>
              {categories.map(cat => {
                const catKey = cat === 'All Skills' ? 'all' : cat
                return (
                  <button
                    key={cat}
                    className={`cat-btn ${filter === catKey ? 'active' : ''}`}
                    onClick={() => setFilter(catKey)}
                  >
                    {categoryEmojis[cat]}{cat}
                  </button>
                )
              })}
            </div>

            <div className="skills-grid">
              {filtered.map((skill) => (
                <div className="skill-card" key={skill.name}>
                  <span className={`skill-cat-badge ${badgeClass[skill.cat]}`}>{skill.cat}</span>
                  <h3>{skill.name}</h3>
                  <p>{skill.desc}</p>
                  <div className="skill-card-footer">
                    <span className="careers-count">↗ {skill.careers} careers use this</span>
                    <button className="btn-sm" onClick={() => setModalSkill(skill)}>See Careers</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skill Modal */}
      <div className={`modal-overlay ${modalSkill ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModalSkill(null) }}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModalSkill(null)}>✕</button>
          {modalSkill && (
            <div>
              <span className={`skill-cat-badge ${badgeClass[modalSkill.cat]}`} style={{ marginBottom: '0.8rem', display: 'inline-block' }}>
                {modalSkill.cat}
              </span>
              <h2>{modalSkill.name}</h2>
              <p className="modal-desc">
                {modalSkill.desc} This skill connects to <strong>{modalSkill.careers} careers</strong> in our database.
              </p>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--soft)' }}>
                PEOPLE WHO USE THIS SKILL
              </h4>
              <div className="testimonial-block">
                <p>"This skill opens doors across multiple industries. Learn it well, and opportunities follow."</p>
                <span>— Career Coach</span>
              </div>
              <div className="testimonial-block">
                <p>"Mastering this skill was the best career investment I made in my education."</p>
                <span>— Industry Professional</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillsPage

