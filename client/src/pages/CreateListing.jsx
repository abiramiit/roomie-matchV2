import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingAPI } from '../api'
import AppLayout from '../components/layout/AppLayout'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const AMENITIES = ['WiFi', 'AC', 'Parking', 'Gym', 'Laundry', 'Security', 'Power Backup', 'Water 24/7']

export default function CreateListing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', rent: '', deposit: '',
    location: { address: '', city: '', state: '', pincode: '' },
    roomType: 'single', furnishing: 'unfurnished',
    amenities: [], genderPreference: 'any', availableFrom: '',
  })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const setLoc = (k, v) => setForm((p) => ({ ...p, location: { ...p.location, [k]: v } }))
  const toggleAmenity = (a) => setForm((p) => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a]
  }))

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files)
    setPhotos(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.rent || !form.location.city) return toast.error('Fill required fields')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'object' && !Array.isArray(v)) {
          Object.entries(v).forEach(([sk, sv]) => fd.append(`${k}[${sk}]`, sv))
        } else if (Array.isArray(v)) {
          v.forEach((item) => fd.append(`${k}[]`, item))
        } else {
          fd.append(k, v)
        }
      })
      photos.forEach((p) => fd.append('photos', p))
      await listingAPI.create(fd)
      toast.success('Listing created!')
      navigate('/listings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Post a Room</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Basic Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input className="input" placeholder="Spacious 1BHK in Bandra" value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input resize-none" rows={3} placeholder="Describe the room..." value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹) *</label>
                <input className="input" type="number" placeholder="15000" value={form.rent} onChange={(e) => set('rent', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (₹)</label>
                <input className="input" type="number" placeholder="30000" value={form.deposit} onChange={(e) => set('deposit', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Location</h2>
            <input className="input" placeholder="Address" value={form.location.address} onChange={(e) => setLoc('address', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="City *" value={form.location.city} onChange={(e) => setLoc('city', e.target.value)} required />
              <input className="input" placeholder="State" value={form.location.state} onChange={(e) => setLoc('state', e.target.value)} />
            </div>
            <input className="input" placeholder="Pincode" value={form.location.pincode} onChange={(e) => setLoc('pincode', e.target.value)} />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Room Details</h2>
            <div className="grid grid-cols-3 gap-3">
              {['single', 'shared', 'entire-flat'].map((t) => (
                <button key={t} type="button" onClick={() => set('roomType', t)}
                  className={`py-2 rounded-xl text-sm border transition capitalize ${form.roomType === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['furnished', 'semi-furnished', 'unfurnished'].map((f) => (
                <button key={f} type="button" onClick={() => set('furnishing', f)}
                  className={`py-2 rounded-xl text-sm border transition capitalize ${form.furnishing === f ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                  {f.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${form.amenities.includes(a) ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
                <select className="input" value={form.genderPreference} onChange={(e) => set('genderPreference', e.target.value)}>
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                <input className="input" type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700">Photos</h2>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} className="input py-2" />
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" className="h-24 w-full object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center py-3">
            {loading ? <Spinner size="sm" /> : 'Post Listing'}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
