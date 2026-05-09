import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { listingAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { FiMapPin, FiCalendar, FiTrash2, FiMessageCircle } from 'react-icons/fi'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    listingAPI.getById(id).then(({ data }) => { setListing(data); setLoading(false) })
      .catch(() => { toast.error('Listing not found'); navigate('/listings') })
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return
    await listingAPI.delete(id)
    toast.success('Listing deleted')
    navigate('/listings')
  }

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppLayout>
  if (!listing) return null

  const isOwner = user?._id === listing.owner?._id

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Photos */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-gray-100 h-72 relative">
          {listing.photos?.length > 0 ? (
            <>
              <img src={listing.photos[activePhoto]} alt="" className="w-full h-full object-cover" />
              {listing.photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {listing.photos.map((_, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)}
                      className={`h-2 rounded-full transition-all ${i === activePhoto ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🏠</div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                {isOwner && (
                  <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition">
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <FiMapPin size={14} />
                <span className="text-sm">{listing.location?.address && `${listing.location.address}, `}{listing.location?.city}, {listing.location?.state}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="badge bg-primary-light text-primary font-semibold text-base px-4 py-2">₹{listing.rent?.toLocaleString()}/month</span>
              {listing.deposit > 0 && <span className="badge bg-gray-100 text-gray-600">Deposit: ₹{listing.deposit?.toLocaleString()}</span>}
              <span className="badge bg-gray-100 text-gray-600 capitalize">{listing.roomType?.replace('-', ' ')}</span>
              <span className="badge bg-gray-100 text-gray-600 capitalize">{listing.furnishing?.replace('-', ' ')}</span>
            </div>

            {listing.description && (
              <div>
                <h3 className="font-semibold mb-2">About this room</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            {listing.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((a) => (
                    <span key={a} className="badge bg-green-50 text-green-700">✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5"><span>👤</span> {listing.genderPreference === 'any' ? 'Any gender' : `${listing.genderPreference} preferred`}</span>
              {listing.availableFrom && (
                <span className="flex items-center gap-1.5"><FiCalendar size={14} /> Available from {new Date(listing.availableFrom).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          {/* Owner card */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-3">Posted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={listing.owner?.avatar} name={listing.owner?.name} size="md" />
                <div>
                  <p className="font-medium">{listing.owner?.name}</p>
                  <p className="text-xs text-gray-400">Member</p>
                </div>
              </div>
              {!isOwner && (
                <Link to={`/chat/${listing.owner?._id}`} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  <FiMessageCircle size={15} /> Message Owner
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
