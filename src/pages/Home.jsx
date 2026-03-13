import Navigation from '../components/Navigation'
import Hero from '../components/Hero'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <div className="p-8 bg-red-500 text-white text-center">
        <h2 className="text-2xl font-bold">Test Section - If you see this, Tailwind is working!</h2>
      </div>
    </div>
  )
}
