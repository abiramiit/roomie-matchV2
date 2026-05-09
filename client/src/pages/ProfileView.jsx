import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userAPI, matchAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import MatchScore from '../components/common/MatchScore'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { FiMessageCircle, FiHeart, FiBookmark, FiMapPin } from 'react-icons/fi'

export default function ProfileView() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [score, setScore] = useState(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([userAPI.getUserById(id), matchAPI.getMatches()])
      .then(([p, m]) => {
        setProfile(p.data)
        const match = m.data.find((x) => x.profile?.user?._id === id)
        if (match) setScore(match.score)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleLike = async () => {
    try {
      const { data } = await matchAPI.like(id)
      if (data.isMatch) toast.success('🎉 It\'s a match!')
      else toast.success('Liked!')
    } catch { toast.error('Failed') }
  }

  const handleSave = async () => {
    try {
      const { data } = await userAPI.saveProfile(id)
      setSaved(data.saved)
      toast.success(data.saved ? 'Profile saved!' : 'Removed from saved')
    } catch { toast.error('Failed') }
  }

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppLayout>
  if (!profile) return <AppLayout><p className="text-center py-20 text-gray-400">Profile not found</p></AppLayout>

  const isOwn = user?._id === id
  const ls = profile.lifestyle || {}

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="card mb-5">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary to-accent rounded-xl mb-4 -mx-5 -mt-5 relative">
            <div className="absolute -bottom-8 left-5">
              <Avatar src={profile.user?.avatar} name={profile.user?.name} size="xl" />
            </div>
          </div>
          <div className="mt-10 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{profile.user?.name}</h1>
              <p className="text-gray-500 text-sm">{profile.age && `${profile.age} yrs`} {profile.gender && `· ${profile.gender}`} {profile.occupation && `· ${profile.occupation}`}</p>
              {profile.location?.city && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FiMapPin size={13} /> {profile.location.city}{profile.location.state && `, ${profile.location.state}`}</p>
              )}
            </div>
            {score !== null && <MatchScore score={score} />}
          </div>

          {profile.bio && <p className="text-gray-600 text-sm mt-4 leading-relaxed">{profile.bio}</p>}

          {!isOwn && (
            <div className="flex gap-3 mt-5">
              <button onClick={handleLike} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FiHeart size={16} /> Like
              </button>
              <Link to={`/chat/${id}`} className="btn-outline flex-1 flex items-center justify-center gap-2">
                <FiMessageCircle size={16} /> Message
              </Link>
              <button onClick={handleSave} className={`p-2.5 rounded-xl border-2 transition ${saved ? 'border-primary bg-primary-light text-primary' : 'border-gray-200 text-gray-500 hover:border-primary'}`}>
                <FiBookmark size={18} />
              </button>
            </div>
          )}
          {isOwn && (
            <Link to="/profile-setup" className="btn-outline w-full flex justify-center mt-5">Edit Profile</Link>
          )}
        </div>

        {/* Budget */}
        {profile.budget && (
          <div className="card mb-5">
            <h3 className="font-semibold mb-3">💰 Budget</h3>
            <p className="text-gray-700">₹{profile.budget.min?.toLocaleString()} – ₹{profile.budget.max?.toLocaleString()} / month</p>
          </div>
        )}

        {/* Lifestyle */}
        <div className="card mb-5">
          <h3 className="font-semibold mb-4">🌿 Lifestyle</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Smoking', value: ls.smoking, icon: '🚬' },
              { label: 'Drinking', value: ls.drinking, icon: '🍺' },
              { label: 'Pets', value: ls.pets, icon: '🐾' },
              { label: 'Sleep', value: ls.sleepSchedule?.replace('-', ' '), icon: '😴' },
              { label: 'Cooking', value: ls.cooking, icon: '🍳' },
              { label: 'WFH', value: ls.workFromHome ? 'Yes' : 'No', icon: '💻' },
            ].map(({ label, value, icon }) => value && (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span>{icon}</span>
                <span className="text-gray-500">{label}:</span>
                <span className="font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>
          {ls.cleanliness && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">🧹 Cleanliness: {ls.cleanliness}/5</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(ls.cleanliness / 5) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Photos */}
        {profile.photos?.length > 0 && (
          <div className="card">
            <h3 className="font-semibold mb-3">📸 Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos.map((p, i) => (
                <img key={i} src={p} alt="" className="h-28 w-full object-cover rounded-xl" />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
