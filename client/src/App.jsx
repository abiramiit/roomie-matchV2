import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { NotifProvider } from './context/NotifContext'
import Spinner from './components/common/Spinner'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import Matches from './pages/Matches'
import Chat from './pages/Chat'
import Listings from './pages/Listings'
import CreateListing from './pages/CreateListing'
import ListingDetail from './pages/ListingDetail'
import ProfileView from './pages/ProfileView'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import { useAuth as useAuthInner } from './context/AuthContext'

const OwnProfile = () => {
  const { user } = useAuthInner()
  return user ? <Navigate to={`/profile/${user._id}`} replace /> : null
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
      <Route path="/listings/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
      <Route path="/listings/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><OwnProfile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotifProvider>
            <AppRoutes />
            <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }} />
          </NotifProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
