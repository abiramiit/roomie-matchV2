import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { matchAPI, userAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import MatchScore from '../components/common/MatchScore'
import Spinner from '../components/common/Spinner'
import { FiArrowRight, FiHeart, FiHome, FiMessageCircle } from 'react-icons/fi'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [matches, setMatches] = useState([])
  const [saved, setSaved] = useState([])
  const [myMatches, setMyMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([matchAPI.getMatches(), userAPI.getSaved(), matchAPI.getMyMatches()])
      .then(([m, s, mm]) => {
        setMatches(m.data.slice(0, 6))
        setSaved(s.data.slice(0, 4))
        setMyMatches(mm.data.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppLayout>

  return (
    <AppLayout>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your roommate search.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Potential Matches', value: matches.length, icon: '🎯', color: 'bg-purple-50 text-purple-600' },
          { label: 'Mutual Matches', value: myMatches.length, icon: '❤️', color: 'bg-pink-50 text-pink-600' },
          { label: 'Saved Profiles', value: saved.length, icon: '🔖', color: 'bg-blue-50 text-blue-600' },
          { label: 'Profile Score', value: profile?.age ? '100%' : '60%', icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile incomplete banner */}
      {!user?.isProfileComplete && (
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold">Complete your profile to get better matches!</p>
            <p className="text-sm opacity-80 mt-0.5">Add your lifestyle preferences and budget.</p>
          </div>
          <Link to="/profile-setup" className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition whitespace-nowrap">
            Complete Now
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recommended Matches */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recommended Matches</h2>
            <Link to="/matches" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          {matches.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No matches yet. Complete your profile!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {matches.map(({ profile: p, score }) => (
                <Link key={p._id} to={`/profile/${p.user?._id}`} className="card hover:shadow-md transition flex items-center gap-3">
                  <Avatar src={p.user?.avatar} name={p.user?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{p.location?.city} · {p.occupation}</p>
                    <div className="mt-1"><MatchScore score={score} /></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mutual Matches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2"><FiHeart className="text-accent" /> Matches</h2>
              <Link to="/matches" className="text-primary text-sm hover:underline">View all</Link>
            </div>
            {myMatches.length === 0 ? (
              <div className="card text-center py-6 text-gray-400 text-sm">No mutual matches yet</div>
            ) : (
              <div className="space-y-2">
                {myMatches.map((m) => {
                  const other = m.users.find((u) => u._id !== user?._id)
                  return (
                    <Link key={m._id} to={`/chat/${other?._id}`} className="card flex items-center gap-3 hover:shadow-md transition py-3">
                      <Avatar src={other?.avatar} name={other?.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{other?.name}</p>
                        <p className="text-xs text-gray-400">Matched!</p>
                      </div>
                      <FiMessageCircle className="text-primary" size={16} />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/listings/create" className="card flex items-center gap-3 hover:shadow-md transition py-3">
                <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><FiHome size={16} /></div>
                <span className="text-sm font-medium">Post a Room Listing</span>
              </Link>
              <Link to="/listings" className="card flex items-center gap-3 hover:shadow-md transition py-3">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><FiHome size={16} /></div>
                <span className="text-sm font-medium">Browse Listings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
