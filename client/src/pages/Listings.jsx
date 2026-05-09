import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listingAPI } from '../api'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { FiFilter, FiPlus, FiMapPin, FiHome } from 'react-icons/fi'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', roomType: '', gender: '' })
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  const fetchListings = async () => {
    setLoading(true)
    try {
      const { data } = await listingAPI.getListings(filters)
      setListings(data.listings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchListings()
    setShowFilters(false)
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Room Listings</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2 text-sm py-2">
            <FiFilter size={15} /> Filters
          </button>
          <Link to="/listings/create" className="btn-primary flex items-center gap-2 text-sm py-2">
            <FiPlus size={15} /> Post Room
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <form onSubmit={handleFilter} className="card mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          <input className="input" placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <input className="input" type="number" placeholder="Min Rent" value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} />
          <input className="input" type="number" placeholder="Max Rent" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} />
          <select className="input" value={filters.roomType} onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}>
            <option value="">Room Type</option>
            <option value="single">Single</option>
            <option value="shared">Shared</option>
            <option value="entire-flat">Entire Flat</option>
          </select>
          <button type="submit" className="btn-primary text-sm">Apply</button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : listings.length === 0 ? (
        <EmptyState icon="🏠" title="No listings found" subtitle="Try adjusting your filters"
          action={<Link to="/listings/create" className="btn-primary">Post a Room</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((l) => (
            <Link key={l._id} to={`/listings/${l._id}`} className="card hover:shadow-md transition overflow-hidden p-0">
              <div className="h-44 bg-gradient-to-br from-primary-light to-gray-100 relative overflow-hidden">
                {l.photos?.[0] ? (
                  <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
                )}
                <span className="absolute top-3 left-3 badge bg-white text-gray-700 shadow capitalize">{l.roomType}</span>
                <span className="absolute top-3 right-3 badge bg-primary text-white font-bold">₹{l.rent?.toLocaleString()}/mo</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate mb-1">{l.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <FiMapPin size={13} /> {l.location?.city}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="badge bg-gray-100 text-gray-600 capitalize">{l.furnishing}</span>
                  <span className="badge bg-gray-100 text-gray-600 capitalize">{l.genderPreference} preferred</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <Avatar src={l.owner?.avatar} name={l.owner?.name} size="xs" />
                  <span className="text-xs text-gray-500">{l.owner?.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
