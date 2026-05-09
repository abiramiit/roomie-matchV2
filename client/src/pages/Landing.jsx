import { Link } from 'react-router-dom'
import { FiSearch, FiMessageCircle, FiHome, FiStar } from 'react-icons/fi'

const features = [
  { icon: <FiSearch size={24} />, title: 'Smart Matching', desc: 'Algorithm matches you based on lifestyle, budget & location.' },
  { icon: <FiMessageCircle size={24} />, title: 'Real-Time Chat', desc: 'Message your matches instantly with live chat.' },
  { icon: <FiHome size={24} />, title: 'Room Listings', desc: 'Browse and post available rooms with photos.' },
  { icon: <FiStar size={24} />, title: 'Compatibility Score', desc: 'See how well you match before reaching out.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-2xl font-bold text-primary">Roomie<span className="text-accent">Connect</span></span>
        <div className="flex gap-3">
          <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up Free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <span className="badge bg-primary-light text-primary mb-4">🏠 #1 Roommate Finder</span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Find Your Perfect <span className="text-primary">Roommate</span> Match
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-lg">
            Connect with compatible roommates based on lifestyle, budget, and location. No more awkward living situations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link to="/register" className="btn-primary text-base py-3 px-8">Get Started Free</Link>
            <Link to="/listings" className="btn-outline text-base py-3 px-8">Browse Listings</Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Join 10,000+ people finding roommates</p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl opacity-10 animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <span className="text-8xl">🏠</span>
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 card shadow-lg p-3 text-sm font-medium text-green-600 bg-green-50 border-green-100">
              ✅ 95% Match Found!
            </div>
            <div className="absolute -bottom-4 -left-4 card shadow-lg p-3 text-sm font-medium text-primary bg-primary-light border-primary/10">
              💬 New message!
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why RoomieConnect?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition text-center">
                <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center mx-auto mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to find your roommate?</h2>
        <p className="text-gray-500 mb-8">Create your profile in 2 minutes and start matching today.</p>
        <Link to="/register" className="btn-primary text-base py-3 px-10">Create Free Account</Link>
      </section>

      <footer className="border-t py-6 text-center text-sm text-gray-400">
        © 2024 RoomieConnect. All rights reserved.
      </footer>
    </div>
  )
}
