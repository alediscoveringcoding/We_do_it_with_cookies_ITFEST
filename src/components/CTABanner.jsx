import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="bg-teal-600 text-white py-16">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to discover your dream career?
        </h2>
        <Link
          to="/login"
          className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg font-medium transition inline-block"
        >
          Join Now
        </Link>
      </div>
    </section>
  )
}
