import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiBell, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNotif } from '../../context/NotifContext'
import Avatar from '../common/Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { unread, markRead } = useNotif()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/matches', label: 'Matches' },
    { to: '/listings', label: 'Listings' },
    { to: '/chat', label: 'Chat' },
  ]

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-primary">
          Roomie<span className="text-accent">Connect</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${location.pathname.startsWith(l.to) ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button onClick={markRead} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <FiBell size={20} className="text-gray-600" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
            </button>
            {dropOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50">
                  <Avatar src={user?.avatar} name={user?.name} size="xs" />
                  <span className="font-medium truncate">{user?.name}</span>
                </Link>
                <hr className="my-1" />
                <Link to="/settings" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-600">
                  <FiSettings size={15} /> Settings
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-red-500 w-full">
                  <FiLogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium ${location.pathname.startsWith(l.to) ? 'bg-primary-light text-primary' : 'text-gray-600'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
