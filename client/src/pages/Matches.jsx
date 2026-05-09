import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { matchAPI } from '../api'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import MatchScore from '../components/common/MatchScore'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'
import { FiX, FiHeart, FiMessageCircle, FiInfo } from 'react-icons/fi'

export default function Matches() {
  const [candidates, setCandidates] = useState([])
  const [myMatches, setMyMatches] = useState([])
  const [tab, setTab] = useState('discover')
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    Promise.all([matchAPI.getMatches(), matchAPI.getMyMatches()])
      .then(([c, m]) => { setCandidates(c.data); setMyMatches(m.data) })
      .finally(() => setLoading(false))
  }, [])

  const current = candidates[0]

  const handleLike = async () => {
    if (!current || acting) return
    setActing(true)
    try {
      const { data } = await matchAPI.like(current.profile.user._id)
      if (data.isMatch) toast.success(`🎉 It's a match with ${current.profile.user.name}!`)
      else toast.success('Liked!')
      setCandidates((prev) => prev.slice(1))
    } catch { toast.error('Failed') }
    finally { setActing(false) }
  }

  const handleDislike = async () => {
    if (!current || acting) return
    setActing(true)
    try {
      await matchAPI.dislike(current.profile.user._id)
      setCandidates((prev) => prev.slice(1))
    } catch { toast.error('Failed') }
    finally { setActing(false) }
  }

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppLayout>

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Roommate Matches</h1>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {['discover', 'matched'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${tab === t ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>
              {t} {t === 'matched' && myMatches.length > 0 && <span className="ml-1 bg-accent text-white text-xs rounded-full px-1.5">{myMatches.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {tab === 'discover' && (
        <div className="flex flex-col items-center">
          {candidates.length === 0 ? (
            <EmptyState icon="🎯" title="No more candidates" subtitle="Check back later for new matches!" />
          ) : (
            <div className="w-full max-w-sm">
              {/* Card */}
              <div className="card shadow-lg overflow-hidden">
                <div className="relative h-72 bg-gradient-to-br from-primary-light to-white">
                  {current.profile.user?.avatar ? (
                    <img src={current.profile.user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Avatar src={null} name={current.profile.user?.name} size="xl" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3"><MatchScore score={current.score} /></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h2 className="text-white text-xl font-bold">{current.profile.user?.name}</h2>
                    <p className="text-white/80 text-sm">{current.profile.age} · {current.profile.gender} · {current.profile.occupation}</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📍</span>
                    <span>{current.profile.location?.city || 'Location not set'}</span>
                    <span className="mx-1">·</span>
                    <span>💰 ₹{current.profile.budget?.min?.toLocaleString()}–₹{current.profile.budget?.max?.toLocaleString()}</span>
                  </div>
                  {current.profile.bio && <p className="text-sm text-gray-600 line-clamp-2">{current.profile.bio}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      `🚬 ${current.profile.lifestyle?.smoking}`,
                      `🍺 ${current.profile.lifestyle?.drinking}`,
                      `🐾 ${current.profile.lifestyle?.pets}`,
                      `😴 ${current.profile.lifestyle?.sleepSchedule?.replace('-', ' ')}`,
                    ].map((tag) => (
                      <span key={tag} className="badge bg-gray-100 text-gray-600 capitalize">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button onClick={handleDislike} disabled={acting}
                  className="w-14 h-14 bg-white border-2 border-red-200 text-red-400 rounded-full flex items-center justify-center shadow hover:border-red-400 hover:text-red-500 transition hover:scale-110">
                  <FiX size={24} />
                </button>
                <Link to={`/profile/${current.profile.user?._id}`}
                  className="w-10 h-10 bg-white border-2 border-gray-200 text-gray-400 rounded-full flex items-center justify-center shadow hover:border-gray-400 transition">
                  <FiInfo size={18} />
                </Link>
                <button onClick={handleLike} disabled={acting}
                  className="w-14 h-14 bg-white border-2 border-green-200 text-green-400 rounded-full flex items-center justify-center shadow hover:border-green-400 hover:text-green-500 transition hover:scale-110">
                  <FiHeart size={24} />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">{candidates.length} candidates remaining</p>
            </div>
          )}
        </div>
      )}

      {tab === 'matched' && (
        <div>
          {myMatches.length === 0 ? (
            <EmptyState icon="❤️" title="No mutual matches yet" subtitle="Like profiles to get matched!" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myMatches.map((m) => {
                const other = m.users.find((u) => u._id !== m.initiator?.toString())
                return (
                  <div key={m._id} className="card hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar src={other?.avatar} name={other?.name} size="md" />
                      <div>
                        <p className="font-semibold">{other?.name}</p>
                        <MatchScore score={m.score} />
                      </div>
                    </div>
                    <Link to={`/chat/${other?._id}`} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                      <FiMessageCircle size={15} /> Message
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  )
}
