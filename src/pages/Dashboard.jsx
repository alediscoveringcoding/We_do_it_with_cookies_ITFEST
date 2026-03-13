import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../api/supabaseClient'
import Navbar from '../components/Navbar'
import CareerCard from '../components/CareerCard'
import JobModal from '../components/JobModal'
import QABoard from '../components/QABoard'

export default function Dashboard() {
  const { user } = useAuth()
  const [assessment, setAssessment] = useState(null)
  const [careers, setCareers] = useState([])
  const [matchedCareers, setMatchedCareers] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [stats, setStats] = useState({})
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  useEffect(() => {
    if (assessment && careers.length > 0) {
      calculateCareerMatches()
    }
  }, [assessment, careers])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch latest assessment
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setAssessment(assessmentData)

      // Fetch careers
      const { data: careersData } = await supabase
        .from('careers')
        .select('*')

      setCareers(careersData || [])

      // Fetch bookmarks
      const { data: bookmarksData } = await supabase
        .from('bookmarks')
        .select(`
          *,
          careers(id, title),
          skills(id, name, category)
        `)
        .eq('user_id', user.id)

      setBookmarks(bookmarksData || [])

      // Fetch stats
      const [assessmentsCount, questionsCount, skillsCount] = await Promise.all([
        supabase.from('assessments').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('questions').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('bookmarks').select('id', { count: 'exact' }).eq('user_id', user.id)
      ])

      setStats({
        assessmentsTaken: assessmentsCount.count || 0,
        careersExplored: careersData?.length || 0,
        questionsAsked: questionsCount.count || 0,
        skillsSaved: bookmarksData?.filter(b => b.item_type === 'skill').length || 0
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCareerMatches = () => {
    if (!assessment || !assessment.top_traits) return

    const matches = careers.map(career => {
      const overlap = career.riasec_tags.filter(tag => 
        assessment.top_traits.includes(tag)
      ).length
      
      const matchScore = career.riasec_tags.length > 0 
        ? Math.round((overlap / career.riasec_tags.length) * 100)
        : 0

      return { ...career, matchScore }
    })

    const sortedMatches = matches
      .filter(career => career.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6)

    setMatchedCareers(sortedMatches)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-slate-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </h1>
          {matchedCareers.length > 0 && (
            <p className="text-lg text-slate-600">
              Your top career match: {matchedCareers[0].title} · {matchedCareers[0].matchScore}% fit
            </p>
          )}
          {assessment && (
            <p className="text-sm text-slate-500 mb-4">
              Last assessment: {new Date(assessment.created_at).toLocaleDateString()}
            </p>
          )}
          <Link
            to="/assessment"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Retake Assessment →
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{stats.assessmentsTaken}</div>
            <div className="text-sm text-slate-600">Assessments Taken</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{stats.careersExplored}</div>
            <div className="text-sm text-slate-600">Careers Explored</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{stats.questionsAsked}</div>
            <div className="text-sm text-slate-600">Questions Asked</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{stats.skillsSaved}</div>
            <div className="text-sm text-slate-600">Skills Saved</div>
          </div>
        </div>

        {/* Career Matches */}
        {matchedCareers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Career Matches</h2>
            <div className="grid grid-cols-2 gap-6">
              {matchedCareers.map(career => (
                <CareerCard
                  key={career.id}
                  career={career}
                  onViewDetails={() => setSelectedCareer(career)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Q&A Board */}
        <QABoard />

        {/* Bookmarks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Saved Items</h2>
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {bookmark.careers?.title || bookmark.skills?.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        bookmark.item_type === 'career' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {bookmark.item_type === 'career' ? 'Career' : 'Skill'}
                      </span>
                    </div>
                    <button className="text-slate-400 hover:text-red-600">×</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <p className="text-slate-600">
                No saved items yet. Explore careers and skills to save them.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Job Modal */}
      {selectedCareer && (
        <JobModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
        />
      )}
    </div>
  )
}
