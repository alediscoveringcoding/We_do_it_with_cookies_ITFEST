import { supabase } from '../api/supabaseClient'

const careers = [
  {
    title: "Software Engineer",
    riasec_tags: ["I", "C", "R"],
    description: "Design, develop, and test software applications and systems. Work with programming languages to create innovative solutions for businesses and consumers.",
    salary_min: 80000,
    salary_max: 150000,
    daily_tasks: [
      "Write and review code in various programming languages",
      "Debug and troubleshoot software issues",
      "Collaborate with team members on project planning",
      "Design software architecture and system components",
      "Test and deploy software applications"
    ],
    education_path: "Bachelor's degree in Computer Science or related field. Bootcamps and self-study can also lead to entry-level positions.",
    testimonials: [
      { name: "Alex Chen", role: "Senior Software Engineer", quote: "Every day brings new challenges and opportunities to create something that helps people." },
      { name: "Sarah Johnson", role: "Frontend Developer", quote: "I love turning ideas into functional applications that users interact with daily." }
    ]
  },
  {
    title: "Graphic Designer",
    riasec_tags: ["A", "S", "E"],
    description: "Create visual concepts to communicate ideas through digital and print media. Work with clients to develop branding, marketing materials, and user interfaces.",
    salary_min: 45000,
    salary_max: 85000,
    daily_tasks: [
      "Design logos, websites, and marketing materials",
      "Meet with clients to understand project requirements",
      "Use design software to create visual concepts",
      "Revise designs based on client feedback",
      "Collaborate with marketing and development teams"
    ],
    education_path: "Bachelor's degree in Graphic Design or related field. Strong portfolio essential.",
    testimonials: [
      { name: "Maria Rodriguez", role: "Art Director", quote: "Design allows me to blend creativity with problem-solving to make brands memorable." },
      { name: "James Park", role: "UI Designer", quote: "I enjoy creating interfaces that are both beautiful and intuitive to use." }
    ]
  },
  {
    title: "Teacher",
    riasec_tags: ["S", "A", "I"],
    description: "Educate and inspire students in various subjects. Create lesson plans, assess student progress, and foster a positive learning environment.",
    salary_min: 40000,
    salary_max: 70000,
    daily_tasks: [
      "Prepare and deliver engaging lessons",
      "Grade assignments and provide feedback",
      "Communicate with parents about student progress",
      "Manage classroom behavior and dynamics",
      "Participate in staff meetings and professional development"
    ],
    education_path: "Bachelor's degree in Education or subject area with teaching certification. Master's degree often required for advancement.",
    testimonials: [
      { name: "Emily Thompson", role: "High School English Teacher", quote: "Watching students discover their potential is the most rewarding part of my job." },
      { name: "David Kim", role: "Elementary School Teacher", quote: "Every day is different and every child brings unique joy and challenges." }
    ]
  },
  {
    title: "Nurse",
    riasec_tags: ["S", "I", "R"],
    description: "Provide patient care, administer medications, and support doctors in medical procedures. Work in hospitals, clinics, and other healthcare settings.",
    salary_min: 65000,
    salary_max: 95000,
    daily_tasks: [
      "Monitor patient vital signs and condition",
      "Administer medications and treatments",
      "Educate patients about health conditions",
      "Collaborate with healthcare team members",
      "Maintain accurate patient records"
    ],
    education_path: "Associate or Bachelor's degree in Nursing. Must pass NCLEX exam for licensure.",
    testimonials: [
      { name: "Jennifer Lee", role: "Registered Nurse", quote: "Nursing is challenging but incredibly rewarding - I make a difference every day." },
      { name: "Robert Garcia", role: "Emergency Room Nurse", quote: "Fast-paced environment where quick thinking saves lives." }
    ]
  },
  {
    title: "Entrepreneur",
    riasec_tags: ["E", "I", "S"],
    description: "Start and manage business ventures. Identify market opportunities, develop business plans, and lead teams to achieve business goals.",
    salary_min: 50000,
    salary_max: 200000,
    daily_tasks: [
      "Develop business strategies and plans",
      "Manage finances and budget",
      "Lead and motivate team members",
      "Network with potential clients and partners",
      "Make strategic decisions for company growth"
    ],
    education_path: "Varies widely - many entrepreneurs have business degrees, but success depends more on experience and skills.",
    testimonials: [
      { name: "Lisa Wang", role: "Tech Startup Founder", quote: "Building something from nothing is challenging but incredibly fulfilling." },
      { name: "Mark Davis", role: "Restaurant Owner", quote: "Every day presents new opportunities to serve customers and grow my business." }
    ]
  },
  {
    title: "Architect",
    riasec_tags: ["A", "I", "E"],
    description: "Design buildings and structures that are functional, safe, and aesthetically pleasing. Work with clients to create spaces that meet their needs.",
    salary_min: 70000,
    salary_max: 120000,
    daily_tasks: [
      "Create building designs and blueprints",
      "Meet with clients to understand requirements",
      "Ensure designs meet building codes and regulations",
      "Collaborate with engineers and construction teams",
      "Manage project timelines and budgets"
    ],
    education_path: "Bachelor's degree in Architecture, followed by internship and licensure exam.",
    testimonials: [
      { name: "Amanda Foster", role: "Commercial Architect", quote: "I love seeing my designs come to life and shape how people experience spaces." },
      { name: "Tom Martinez", role: "Residential Architect", quote: "Creating homes where families make memories is incredibly meaningful." }
    ]
  },
  {
    title: "Data Scientist",
    riasec_tags: ["I", "C", "E"],
    description: "Analyze complex data to help organizations make better decisions. Use statistical methods and machine learning to uncover insights and patterns.",
    salary_min: 90000,
    salary_max: 160000,
    daily_tasks: [
      "Collect and clean large datasets",
      "Develop statistical models and algorithms",
      "Create data visualizations and reports",
      "Present findings to stakeholders",
      "Collaborate with teams to implement data-driven solutions"
    ],
    education_path: "Bachelor's degree in Statistics, Computer Science, or related field. Master's degree often preferred.",
    testimonials: [
      { name: "Rachel Green", role: "Senior Data Scientist", quote: "I enjoy turning raw data into actionable insights that drive business decisions." },
      { name: "Kevin Liu", role: "Machine Learning Engineer", quote: "Building predictive models that solve real-world problems is fascinating." }
    ]
  },
  {
    title: "Psychologist",
    riasec_tags: ["S", "I", "A"],
    description: "Study human behavior and mental processes. Provide therapy and counseling to help individuals overcome challenges and improve their well-being.",
    salary_min: 60000,
    salary_max: 110000,
    daily_tasks: [
      "Conduct therapy sessions with clients",
      "Administer and interpret psychological tests",
      "Maintain confidential patient records",
      "Collaborate with other healthcare professionals",
      "Stay current with research and treatment methods"
    ],
    education_path: "Doctoral degree (Ph.D. or Psy.D.) in Psychology required for licensure.",
    testimonials: [
      { name: "Dr. Susan Brown", role: "Clinical Psychologist", quote: "Helping people navigate life's challenges and find healing is deeply rewarding." },
      { name: "Dr. Michael Chang", role: "School Psychologist", quote: "Supporting students' mental health helps them succeed academically and personally." }
    ]
  },
  {
    title: "Electrician",
    riasec_tags: ["R", "I", "C"],
    description: "Install, maintain, and repair electrical systems in residential, commercial, and industrial settings. Ensure safety and compliance with electrical codes.",
    salary_min: 45000,
    salary_max: 80000,
    daily_tasks: [
      "Install wiring and electrical components",
      "Troubleshoot electrical problems",
      "Read and interpret blueprints and schematics",
      "Maintain electrical systems and equipment",
      "Ensure compliance with safety codes"
    ],
    education_path: "High school diploma plus apprenticeship program or trade school. Licensure required.",
    testimonials: [
      { name: "John Anderson", role: "Master Electrician", quote: "I enjoy working with my hands and solving practical problems every day." },
      { name: "Sarah Wilson", role: "Industrial Electrician", quote: "Keeping critical systems running safely is a responsibility I take pride in." }
    ]
  },
  {
    title: "Marketing Manager",
    riasec_tags: ["E", "A", "S"],
    description: "Develop and implement marketing strategies to promote products and services. Lead marketing teams and analyze campaign effectiveness.",
    salary_min: 65000,
    salary_max: 120000,
    daily_tasks: [
      "Create marketing plans and campaigns",
      "Manage marketing budgets and timelines",
      "Analyze market research and consumer data",
      "Lead marketing team members",
      "Collaborate with sales and product teams"
    ],
    education_path: "Bachelor's degree in Marketing, Business, or related field. MBA often preferred for senior positions.",
    testimonials: [
      { name: "Jessica Taylor", role: "Digital Marketing Manager", quote: "Connecting brands with customers through creative campaigns is exciting." },
      { name: "Brian Roberts", role: "Product Marketing Manager", quote: "I love telling stories that make products come alive for customers." }
    ]
  },
  {
    title: "Journalist",
    riasec_tags: ["A", "S", "I"],
    description: "Research, write, and report news stories for various media outlets. Investigate topics, conduct interviews, and keep the public informed.",
    salary_min: 35000,
    salary_max: 75000,
    daily_tasks: [
      "Research and investigate news stories",
      "Conduct interviews with sources",
      "Write articles and reports for publication",
      "Fact-check information and verify sources",
      "Meet deadlines for story submission"
    ],
    education_path: "Bachelor's degree in Journalism, Communications, or related field.",
    testimonials: [
      { name: "Anna Martinez", role: "Investigative Reporter", quote: "Journalism gives me a voice to hold power accountable and tell important stories." },
      { name: "David Thompson", role: "Sports Journalist", quote: "Combining my love for sports with storytelling is the perfect career." }
    ]
  },
  {
    title: "Chef",
    riasec_tags: ["A", "R", "E"],
    description: "Create and prepare culinary dishes in restaurants and other food service establishments. Manage kitchen operations and develop menus.",
    salary_min: 40000,
    salary_max: 80000,
    daily_tasks: [
      "Plan and create menus",
      "Prepare and cook food dishes",
      "Manage kitchen staff and operations",
      "Ensure food quality and safety standards",
      "Order supplies and manage inventory"
    ],
    education_path: "Culinary arts degree or certificate from culinary school. Apprenticeship and experience crucial.",
    testimonials: [
      { name: "Marco Romano", role: "Executive Chef", quote: "Cooking is my art - I get to create experiences that bring people joy." },
      { name: "Lisa Chen", role: "Pastry Chef", quote: "Creating beautiful desserts is both science and art." }
    ]
  },
  {
    title: "Financial Analyst",
    riasec_tags: ["C", "I", "E"],
    description: "Analyze financial data and market trends to help businesses and individuals make investment decisions. Prepare reports and recommendations.",
    salary_min: 60000,
    salary_max: 110000,
    daily_tasks: [
      "Analyze financial statements and market data",
      "Create financial models and forecasts",
      "Prepare reports and presentations",
      "Monitor economic trends and market conditions",
      "Make investment recommendations"
    ],
    education_path: "Bachelor's degree in Finance, Economics, or related field. Professional certifications often required.",
    testimonials: [
      { name: "Robert Kim", role: "Investment Analyst", quote: "Analyzing market trends helps clients make informed financial decisions." },
      { name: "Emily Davis", role: "Corporate Financial Analyst", quote: "I enjoy using data to help companies grow and succeed." }
    ]
  },
  {
    title: "Social Worker",
    riasec_tags: ["S", "A", "I"],
    description: "Help individuals and families cope with problems and improve their well-being. Connect people with resources and advocate for social justice.",
    salary_min: 45000,
    salary_max: 70000,
    daily_tasks: [
      "Assess client needs and develop care plans",
      "Connect clients with community resources",
      "Provide counseling and support",
      "Advocate for clients' rights and needs",
      "Maintain detailed case records"
    ],
    education_path: "Bachelor's degree in Social Work for entry positions, Master's required for clinical work.",
    testimonials: [
      { name: "Maria Gonzalez", role: "Clinical Social Worker", quote: "Helping people overcome challenges and rebuild their lives is meaningful work." },
      { name: "James Wilson", role: "School Social Worker", quote: "Supporting students and families creates stronger communities." }
    ]
  },
  {
    title: "Game Developer",
    riasec_tags: ["I", "A", "R"],
    description: "Design and develop video games for various platforms. Work with teams to create engaging gameplay, graphics, and user experiences.",
    salary_min: 55000,
    salary_max: 120000,
    daily_tasks: [
      "Write code for game mechanics and features",
      "Design gameplay systems and user interfaces",
      "Test and debug games for quality assurance",
      "Collaborate with artists and designers",
      "Optimize game performance and user experience"
    ],
    education_path: "Bachelor's degree in Computer Science, Game Design, or related field. Strong portfolio essential.",
    testimonials: [
      { name: "Alex Turner", role: "Senior Game Developer", quote: "Creating immersive worlds that players get lost in is incredibly rewarding." },
      { name: "Sophie Chen", role: "Indie Game Developer", quote: "Game development combines creativity, logic, and storytelling." }
    ]
  }
]

const skills = [
  // Technical Skills
  { name: "Programming", category: "Technical", description: "Writing code in various programming languages to create software applications and systems.", testimonials: [
    { name: "Sarah Johnson", role: "Software Engineer", quote: "Programming is like solving puzzles - every line of code is a piece of the solution." },
    { name: "Mike Chen", role: "Full Stack Developer", quote: "Learning to program opened up endless possibilities for creating things that matter." }
  ]},
  { name: "Data Analysis", category: "Technical", description: "Examining datasets to extract meaningful insights and support decision-making processes.", testimonials: [
    { name: "Lisa Wang", role: "Data Analyst", quote: "Data analysis helps me find patterns that others miss and tell compelling stories with numbers." },
    { name: "Tom Davis", role: "Business Analyst", quote: "Being able to analyze data makes me valuable in any business setting." }
  ]},
  { name: "Web Development", category: "Technical", description: "Building and maintaining websites and web applications using various programming languages and frameworks.", testimonials: [
    { name: "Rachel Green", role: "Web Developer", quote: "Web development lets me create things that millions of people can interact with." },
    { name: "Kevin Liu", role: "Frontend Developer", quote: "I love bringing designs to life through code and creating smooth user experiences." }
  ]},
  { name: "Cybersecurity", category: "Technical", description: "Protecting computer systems, networks, and data from digital attacks and unauthorized access.", testimonials: [
    { name: "John Anderson", role: "Security Analyst", quote: "Cybersecurity is like being a digital guardian - protecting important information from threats." },
    { name: "Maria Rodriguez", role: "IT Security Specialist", quote: "Every day presents new challenges in staying ahead of potential threats." }
  ]},

  // Creative Skills
  { name: "Graphic Design", category: "Creative", description: "Creating visual concepts using computer software or by hand to communicate ideas that inspire, inform, and captivate consumers.", testimonials: [
    { name: "Emily Thompson", role: "Graphic Designer", quote: "Design allows me to combine creativity with problem-solving to make ideas visually compelling." },
    { name: "James Park", role: "Art Director", quote: "Good design is invisible - it just works and feels right to users." }
  ]},
  { name: "Creative Writing", category: "Creative", description: "Crafting original content for books, articles, websites, and other media to engage and inform audiences.", testimonials: [
    { name: "Anna Martinez", role: "Content Writer", quote: "Writing lets me explore ideas and share stories that can change how people see the world." },
    { name: "David Thompson", role: "Copywriter", quote: "The right words can make all the difference in connecting with an audience." }
  ]},
  { name: "Photography", category: "Creative", description: "Capturing and editing images to tell stories, document events, or create artistic expressions.", testimonials: [
    { name: "Lisa Chen", role: "Photographer", quote: "Photography helps me see beauty in ordinary moments and share that perspective with others." },
    { name: "Marco Romano", role: "Wedding Photographer", quote: "Capturing life's most important moments is both an honor and an art." }
  ]},
  { name: "Video Production", category: "Creative", description: "Planning, filming, and editing video content for various platforms including social media, marketing, and entertainment.", testimonials: [
    { name: "Alex Turner", role: "Video Producer", quote: "Video production combines storytelling, technical skills, and creative vision." },
    { name: "Sophie Chen", role: "YouTube Creator", quote: "Creating video content lets me share my passion with a global audience." }
  ]},

  // Social Skills
  { name: "Communication", category: "Social", description: "Effectively conveying information and ideas through speaking, writing, and listening to build understanding and relationships.", testimonials: [
    { name: "Jessica Taylor", role: "HR Manager", quote: "Strong communication skills are essential for building successful teams and resolving conflicts." },
    { name: "Brian Roberts", role: "Sales Manager", quote: "Communication is the foundation of all successful business relationships." }
  ]},
  { name: "Teamwork", category: "Social", description: "Collaborating effectively with others to achieve common goals and contribute to group success.", testimonials: [
    { name: "Susan Brown", role: "Project Manager", quote: "Great teamwork happens when everyone brings their best and supports each other." },
    { name: "Michael Chang", role: "Team Lead", quote: "The best results come from teams that trust and communicate well with each other." }
  ]},
  { name: "Empathy", category: "Social", description: "Understanding and sharing the feelings of others to build stronger relationships and provide better support.", testimonials: [
    { name: "Maria Gonzalez", role: "Counselor", quote: "Empathy allows me to truly understand and help people through their challenges." },
    { name: "James Wilson", role: "Social Worker", quote: "Empathy is the foundation of meaningful human connection and effective helping." }
  ]},
  { name: "Leadership", category: "Social", description: "Guiding and motivating others toward shared goals while making decisions that benefit the group or organization.", testimonials: [
    { name: "Amanda Foster", role: "CEO", quote: "Leadership is about bringing out the best in others and creating vision for the future." },
    { name: "Tom Martinez", role: "Director", quote: "Good leadership balances vision with practical execution and team support." }
  ]},

  // Analytical Skills
  { name: "Critical Thinking", category: "Analytical", description: "Analyzing information objectively and evaluating different perspectives to make reasoned judgments and decisions.", testimonials: [
    { name: "Rachel Green", role: "Consultant", quote: "Critical thinking helps me break down complex problems and find innovative solutions." },
    { name: "Kevin Liu", role: "Research Analyst", quote: "Being able to think critically is essential for making sense of complex data and situations." }
  ]},
  { name: "Problem Solving", category: "Analytical", description: "Identifying problems, analyzing root causes, and developing effective solutions to overcome challenges.", testimonials: [
    { name: "John Anderson", role: "Engineer", quote: "Problem solving is what I do every day - turning challenges into opportunities." },
    { name: "Lisa Wang", role: "Product Manager", quote: "Great problem solving requires both creativity and logical thinking." }
  ]},
  { name: "Research", category: "Analytical", description: "Gathering, analyzing, and interpreting information to answer questions and support decision-making.", testimonials: [
    { name: "Emily Davis", role: "Market Researcher", quote: "Research skills help me uncover insights that drive better business decisions." },
    { name: "Robert Kim", role: "Academic Researcher", quote: "Good research is about asking the right questions and finding reliable answers." }
  ]},
  { name: "Strategic Planning", category: "Analytical", description: "Developing long-term plans and strategies to achieve organizational goals and adapt to changing circumstances.", testimonials: [
    { name: "David Thompson", role: "Strategic Planner", quote: "Strategic planning is about seeing the big picture and mapping out the path to success." },
    { name: "Anna Martinez", role: "Business Strategist", quote: "Good strategy balances ambition with practical execution and market realities." }
  ]},

  // Leadership Skills
  { name: "Decision Making", category: "Leadership", description: "Making timely and effective decisions based on available information and considering potential outcomes.", testimonials: [
    { name: "Amanda Foster", role: "Executive Director", quote: "Good decision making requires both analysis and intuition, especially under pressure." },
    { name: "Tom Martinez", role: "Operations Manager", quote: "Every decision impacts the team and organization, so I take that responsibility seriously." }
  ]},
  { name: "Delegation", category: "Leadership", description: "Assigning tasks and responsibilities to team members appropriately to maximize efficiency and develop others' skills.", testimonials: [
    { name: "Jessica Taylor", role: "Department Head", quote: "Effective delegation builds trust and helps team members grow their capabilities." },
    { name: "Brian Roberts", role: "Team Manager", quote: "Delegation isn't just about offloading work - it's about empowering others." }
  ]},
  { name: "Mentoring", category: "Leadership", description: "Guiding and supporting others' professional development through sharing knowledge, experience, and advice.", testimonials: [
    { name: "Susan Brown", role: "Senior Mentor", quote: "Mentoring allows me to give back and help the next generation succeed." },
    { name: "Michael Chang", role: "Career Coach", quote: "Being a mentor is one of the most rewarding aspects of leadership." }
  ]},
  { name: "Conflict Resolution", category: "Leadership", description: "Addressing and resolving disagreements and conflicts constructively to maintain positive working relationships.", testimonials: [
    { name: "Maria Gonzalez", role: "HR Director", quote: "Conflict resolution skills are essential for maintaining healthy team dynamics." },
    { name: "James Wilson", role: "Mediator", quote: "Helping people find common ground and move forward together is deeply fulfilling." }
  ]},

  // Trade Skills
  { name: "Carpentry", category: "Trades", description: "Constructing, installing, and repairing structures and fixtures made of wood and other materials.", testimonials: [
    { name: "John Anderson", role: "Master Carpenter", quote: "Carpentry lets me create tangible things that will last for generations." },
    { name: "Sarah Wilson", role: "Cabinet Maker", quote: "Working with wood requires both precision and artistic vision." }
  ]},
  { name: "Welding", category: "Trades", description: "Joining metal parts using various welding techniques and equipment to create or repair metal structures.", testimonials: [
    { name: "Mike Chen", role: "Welding Inspector", quote: "Welding is both an art and a science - precision is everything." },
    { name: "Tom Davis", role: "Fabrication Specialist", quote: "Creating strong metal joints that hold up under stress is incredibly satisfying." }
  ]},
  { name: "Plumbing", category: "Trades", description: "Installing and repairing plumbing systems, including pipes, fixtures, and water distribution networks.", testimonials: [
    { name: "Robert Garcia", role: "Master Plumber", quote: "Plumbing is essential infrastructure - I keep homes and businesses running smoothly." },
    { name: "Lisa Chen", role: "Plumbing Contractor", quote: "Problem solving is key in plumbing - every job presents unique challenges." }
  ]},
  { name: "Automotive Repair", category: "Trades", description: "Diagnosing and repairing mechanical issues in vehicles to ensure safe and reliable operation.", testimonials: [
    { name: "David Kim", role: "Auto Mechanic", quote: "Automotive repair combines diagnostic skills with hands-on problem solving." },
    { name: "Marco Romano", role: "Service Manager", quote: "Keeping people safely on the road is a responsibility I take pride in." }
  ]}
]

export async function runSeed() {
  console.log('Starting database seeding...')

  try {
    // Check if careers table is empty
    const { data: existingCareers, error: careersError } = await supabase
      .from('careers')
      .select('id')
      .limit(1)

    if (careersError) throw careersError

    if (existingCareers.length === 0) {
      console.log('Seeding careers...')
      const { error: insertCareersError } = await supabase
        .from('careers')
        .insert(careers)

      if (insertCareersError) throw insertCareersError
      console.log('Careers seeded successfully')
    } else {
      console.log('Careers already exist, skipping...')
    }

    // Check if skills table is empty
    const { data: existingSkills, error: skillsError } = await supabase
      .from('skills')
      .select('id')
      .limit(1)

    if (skillsError) throw skillsError

    if (existingSkills.length === 0) {
      console.log('Seeding skills...')
      const { error: insertSkillsError } = await supabase
        .from('skills')
        .insert(skills)

      if (insertSkillsError) throw insertSkillsError
      console.log('Skills seeded successfully')
    } else {
      console.log('Skills already exist, skipping...')
    }

    // Create skills-careers relationships
    console.log('Creating skills-careers relationships...')
    
    // Get all careers and skills
    const { data: allCareers } = await supabase.from('careers').select('id, title')
    const { data: allSkills } = await supabase.from('skills').select('id, name')

    if (allCareers && allSkills) {
      const relationships = []

      // Create some sample relationships
      const skillCareerMap = {
        'Software Engineer': ['Programming', 'Web Development', 'Data Analysis'],
        'Graphic Designer': ['Graphic Design', 'Creative Writing', 'Communication'],
        'Teacher': ['Communication', 'Leadership', 'Empathy'],
        'Nurse': ['Empathy', 'Communication', 'Problem Solving'],
        'Entrepreneur': ['Leadership', 'Strategic Planning', 'Communication'],
        'Architect': ['Graphic Design', 'Critical Thinking', 'Problem Solving'],
        'Data Scientist': ['Data Analysis', 'Programming', 'Critical Thinking'],
        'Psychologist': ['Empathy', 'Communication', 'Research'],
        'Electrician': ['Problem Solving', 'Critical Thinking'],
        'Marketing Manager': ['Communication', 'Strategic Planning', 'Creative Writing'],
        'Journalist': ['Creative Writing', 'Communication', 'Research'],
        'Chef': ['Problem Solving', 'Leadership'],
        'Financial Analyst': ['Data Analysis', 'Critical Thinking', 'Research'],
        'Social Worker': ['Empathy', 'Communication', 'Problem Solving'],
        'Game Developer': ['Programming', 'Creative Writing', 'Problem Solving']
      }

      for (const [careerTitle, skillNames] of Object.entries(skillCareerMap)) {
        const career = allCareers.find(c => c.title === careerTitle)
        if (career) {
          for (const skillName of skillNames) {
            const skill = allSkills.find(s => s.name === skillName)
            if (skill) {
              relationships.push({
                skill_id: skill.id,
                career_id: career.id
              })
            }
          }
        }
      }

      if (relationships.length > 0) {
        const { error: relationshipsError } = await supabase
          .from('skills_careers')
          .insert(relationships)

        if (relationshipsError) throw relationshipsError
        console.log('Skills-careers relationships created successfully')
      }
    }

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Export data for reference
export { careers, skills }
