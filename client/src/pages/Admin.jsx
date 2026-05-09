import { useEffect, useState } from 'react'
import { adminAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { FiUsers, FiHome, FiShield, FiTrash2 } from 'react-icons/fi'

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('users')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') return
    Promise.all([adminAPI.getDashboard(), adminAPI.getUsers(), adminAPI.getListings()])
      .then(([s, u, l]) => { setStats(s.data); setUsers(u.data.users); setListings(l.data) })
      .finally(() => setLoading(false))
  }, [user])

  if (user?.role !== 'admin') return <AppLayout><p className="text-center py-20 text-gray-400">Access denied</p></AppLayout>
  if (loading) return <AppLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AppLayout>

  const handleBlock = async (id) => {
    const { data } = await adminAPI.blockUser(id)
    setUsers((prev) => prev.map((u) => u._id === id ? data : u))
    toast.success(data.isBlocked ? 'User blocked' : 'User unblocked')
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await adminAPI.deleteUser(id)
    setUsers((prev) => prev.filter((u) => u._id !== id))
    toast.success('User deleted')
  }

  const handleToggleListing = async (id) => {
    const { data } = await adminAPI.toggleListing(id)
    setListings((prev) => prev.map((l) => l._id === id ? data : l))
    toast.success(data.isActive ? 'Listing activated' : 'Listing deactivated')
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-6">
        <FiShield className="text-primary" size={24} />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Users', value: stats.users, icon: <FiUsers />, color: 'bg-blue-50 text-blue-600' },
            { label: 'Listings', value: stats.listings, icon: <FiHome />, color: 'bg-green-50 text-green-600' },
            { label: 'Matches', value: stats.matches, icon: '❤️', color: 'bg-pink-50 text-pink-600' },
          ].map((s) => (
            <div key={s.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5 w-fit">
        {['users', 'listings'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${tab === t ? 'bg-white shadow text-primary' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div>
          <input className="input max-w-sm mb-4" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={u.avatar} name={u.name} size="xs" />
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isBlocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleBlock(u._id)}
                          className={`text-xs px-3 py-1 rounded-lg border transition ${u.isBlocked ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-orange-200 text-orange-500 hover:bg-orange-50'}`}>
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Title', 'City', 'Rent', 'Owner', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.map((l) => (
                <tr key={l._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium truncate max-w-[150px]">{l.title}</td>
                  <td className="px-4 py-3 text-gray-500">{l.location?.city}</td>
                  <td className="px-4 py-3">₹{l.rent?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{l.owner?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${l.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {l.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleListing(l._id)}
                      className={`text-xs px-3 py-1 rounded-lg border transition ${l.isActive ? 'border-red-200 text-red-400 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                      {l.isActive ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
