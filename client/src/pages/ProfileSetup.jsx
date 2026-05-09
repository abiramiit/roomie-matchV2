import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const steps = ['Basic Info', 'Location & Budget', 'Lifestyle', 'Preferences']

const STEP_FIELDS = [
  ['age', 'gender', 'occupation', 'bio'],
  ['location', 'budget'],
  ['lifestyle'],
  ['genderPreference', 'lookingFor', 'moveInDate'],
]

export default function ProfileSetup() {
  const { setProfile, setUser, user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [data, setData] = useState({
    age: '', gender: '', occupation: '', bio: '',
    location: { city: '', state: '', country: 'India' },
    budget: { min: 5000, max: 20000 },
    lifestyle: { smoking: 'no', drinking: 'no', pets: 'no', sleepSchedule: 'flexible', cleanliness: 3, workFromHome: false, cooking: 'sometimes' },
    genderPreference: 'any', lookingFor: 'both', moveInDate: '',
  })

  const set = (key, val) => setData((p) => ({ ...p, [key]: val }))
  const setNested = (parent, key, val) => setData((p) => ({ ...p, [parent]: { ...p[parent], [key]: val } }))

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (avatarFile) {
        const form = new FormData()
        form.append('avatar', avatarFile)
        const { data: avatarData } = await userAPI.uploadAvatar(form)
        setUser((u) => ({ ...u, avatar: avatarData.avatar }))
      }
      const profile = await userAPI.updateProfile(data)
      setProfile(profile.data)
      setUser((u) => ({ ...u, isProfileComplete: true }))
      toast.success('Profile complete! Start matching 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const next = () => step < steps.length - 1 ? setStep(step + 1) : handleSubmit()
  const back = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="card shadow-md space-y-5">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.name}&background=6C63FF&color=fff&size=96`}
                    alt="avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20" />
                  <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-primary-dark transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-400">Upload profile photo</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input className="input" type="number" min="18" max="80" placeholder="25" value={data.age}
                    onChange={(e) => set('age', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="input" value={data.gender} onChange={(e) => set('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <select className="input" value={data.occupation} onChange={(e) => set('occupation', e.target.value)}>
                  <option value="">Select</option>
                  <option value="student">Student</option>
                  <option value="working">Working Professional</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea className="input resize-none" rows={3} placeholder="Tell potential roommates about yourself..."
                  value={data.bio} onChange={(e) => set('bio', e.target.value)} maxLength={500} />
                <p className="text-xs text-gray-400 text-right mt-1">{data.bio.length}/500</p>
              </div>
            </>
          )}

          {/* Step 1: Location & Budget */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input className="input" placeholder="Mumbai" value={data.location.city}
                    onChange={(e) => setNested('location', 'city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input className="input" placeholder="Maharashtra" value={data.location.state}
                    onChange={(e) => setNested('location', 'state', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget: <span className="text-primary font-semibold">₹{data.budget.min.toLocaleString()} – ₹{data.budget.max.toLocaleString()}</span>
                </label>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Minimum: ₹{data.budget.min.toLocaleString()}</p>
                    <input type="range" min="1000" max="100000" step="1000" value={data.budget.min}
                      onChange={(e) => setNested('budget', 'min', Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Maximum: ₹{data.budget.max.toLocaleString()}</p>
                    <input type="range" min="1000" max="100000" step="1000" value={data.budget.max}
                      onChange={(e) => setNested('budget', 'max', Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Lifestyle */}
          {step === 2 && (
            <>
              {[
                { key: 'smoking', label: '🚬 Smoking', opts: ['no', 'occasionally', 'yes'] },
                { key: 'drinking', label: '🍺 Drinking', opts: ['no', 'occasionally', 'yes'] },
                { key: 'pets', label: '🐾 Pets', opts: ['no', 'yes', 'allergic'] },
                { key: 'sleepSchedule', label: '😴 Sleep Schedule', opts: ['early-bird', 'night-owl', 'flexible'] },
                { key: 'cooking', label: '🍳 Cooking', opts: ['always', 'sometimes', 'never'] },
              ].map(({ key, label, opts }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <div className="flex gap-2 flex-wrap">
                    {opts.map((o) => (
                      <button key={o} type="button"
                        onClick={() => setNested('lifestyle', key, o)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition capitalize ${data.lifestyle[key] === o ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                        {o.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🧹 Cleanliness Level: <span className="text-primary">{data.lifestyle.cleanliness}/5</span>
                </label>
                <input type="range" min="1" max="5" value={data.lifestyle.cleanliness}
                  onChange={(e) => setNested('lifestyle', 'cleanliness', Number(e.target.value))}
                  className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Relaxed</span><span>Very Clean</span>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={data.lifestyle.workFromHome}
                  onChange={(e) => setNested('lifestyle', 'workFromHome', e.target.checked)}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium text-gray-700">💻 Work from home</span>
              </label>
            </>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Roommate Gender</label>
                <div className="flex gap-2">
                  {['any', 'male', 'female'].map((g) => (
                    <button key={g} type="button" onClick={() => set('genderPreference', g)}
                      className={`flex-1 py-2 rounded-xl text-sm border transition capitalize ${data.genderPreference === g ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
                <div className="flex gap-2">
                  {['room', 'roommate', 'both'].map((l) => (
                    <button key={l} type="button" onClick={() => set('lookingFor', l)}
                      className={`flex-1 py-2 rounded-xl text-sm border transition capitalize ${data.lookingFor === l ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                <input className="input" type="date" value={data.moveInDate}
                  onChange={(e) => set('moveInDate', e.target.value)} />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button type="button" onClick={back} className="btn-outline flex-1">Back</button>
            )}
            <button type="button" onClick={next} disabled={loading} className="btn-primary flex-1 flex justify-center">
              {loading ? <Spinner size="sm" /> : step === steps.length - 1 ? 'Complete Profile 🎉' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
