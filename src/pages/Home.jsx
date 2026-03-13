import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CTABanner from '../components/CTABanner'

console.log('Home component is loading')

export default function Home() {
  console.log('Home component is rendering')
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Shape Your Career With Confidence
            </h1>
            <p className="text-xl mb-8 text-teal-100">
              Discover your strengths, explore real careers, and find your path — built for high school students.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/assessment"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition"
              >
                Start Assessment
              </Link>
              <Link
                to="/skills"
                className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-lg font-medium transition"
              >
                Browse Skills
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Career Assessment</h3>
              <p className="text-slate-600">Discover your strengths with a personality quiz</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Skills Explorer</h3>
              <p className="text-slate-600">Browse skills and see which careers need them</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Dashboard</h3>
              <p className="text-slate-600">Track your matches, ask questions, get AI answers</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Community Q&A</h3>
              <p className="text-slate-600">Post questions and get answers from AI and peers</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">How It Works</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Take the RIASEC assessment</h3>
              <p className="text-slate-600">3 minutes</p>
            </div>
            
            <div className="flex-1 h-px bg-slate-300 mx-8"></div>
            
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">See your matched careers</h3>
              <p className="text-slate-600">Ranked by personality fit</p>
            </div>
            
            <div className="flex-1 h-px bg-slate-300 mx-8"></div>
            
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Explore skills, ask questions</h3>
              <p className="text-slate-600">Save your favorites</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">What Students Say</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-800">Jane Doe</h4>
                  <p className="text-sm text-slate-600">Lincoln High School</p>
                </div>
              </div>
              <p className="text-slate-700">"PathFinder helped me discover that I'm suited for careers I never considered. The assessment was eye-opening!"</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                  MS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-800">Mike Smith</h4>
                  <p className="text-sm text-slate-600">Roosevelt High</p>
                </div>
              </div>
              <p className="text-slate-700">"The skills explorer showed me exactly what I need to learn for my dream career. Super helpful!"</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                  SJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-800">Sarah Johnson</h4>
                  <p className="text-sm text-slate-600">Washington Academy</p>
                </div>
              </div>
              <p className="text-slate-700">"I was so confused about my future, but PathFinder gave me clarity and direction. Thank you!"</p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  )
}
