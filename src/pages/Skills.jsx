import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SkillCard from '../components/SkillCard'
import SkillModal from '../components/SkillModal'
import { supabase } from '../api/supabaseClient'

export default function Skills() {
  const [skills, setSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Technical', 'Creative', 'Social', 'Analytical', 'Leadership', 'Trades']

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    filterSkills()
  }, [skills, selectedCategory])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          skills_careers(career_id)
        `)

      if (error) throw error
      
      // Count careers for each skill
      const skillsWithCounts = data.map(skill => ({
        ...skill,
        career_count: skill.skills_careers?.length || 0
      }))
      
      setSkills(skillsWithCounts)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSkills = () => {
    if (selectedCategory === 'All') {
      setFilteredSkills(skills)
    } else {
      setFilteredSkills(skills.filter(skill => skill.category === selectedCategory))
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-800',
      'Creative': 'bg-purple-100 text-purple-800',
      'Social': 'bg-green-100 text-green-800',
      'Analytical': 'bg-orange-100 text-orange-800',
      'Leadership': 'bg-red-100 text-red-800',
      'Trades': 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-slate-100 text-slate-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-slate-600">Loading skills...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Explore Skills</h1>
          <p className="text-lg text-slate-600">
            Discover different skills and see which careers require them
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              categoryColor={getCategoryColor(skill.category)}
              onViewDetails={() => setSelectedSkill(skill)}
            />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-600">
              No skills found in the {selectedCategory.toLowerCase()} category.
            </div>
          </div>
        )}

        {/* Skill Modal */}
        {selectedSkill && (
          <SkillModal
            skill={selectedSkill}
            categoryColor={getCategoryColor(selectedSkill.category)}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </div>
    </div>
  )
}
