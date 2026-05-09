import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../api'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

export default function Settings() {
  const { user, setUser } = useAuth()
  const [avatarFile, setAvatarFile] = useState(null)
  const [preview, setPreview] = useState(user?.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('avatar', avatarFile)
      const { data } = await userAPI.uploadAvatar(form)
      setUser((u) => ({ ...u, avatar: data.avatar }))
      toast.success('Avatar updated!')
      setAvatarFile(null)
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="card mb-5">
          <h2 className="font-semibold mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <Avatar src={preview} name={user?.name} size="xl" />
            <div className="space-y-2">
              <label className="btn-outline text-sm py-2 cursor-pointer inline-block">
                Choose Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              {avatarFile && (
                <button onClick={handleAvatarUpload} disabled={uploading} className="btn-primary text-sm py-2 flex items-center gap-2 ml-2">
                  {uploading ? <Spinner size="sm" /> : 'Upload'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card mb-5">
          <h2 className="font-semibold mb-4">Account Info</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="input bg-gray-50 text-gray-400 cursor-not-allowed" value={user?.email} disabled />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4 text-red-500">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-3">Once you delete your account, there is no going back.</p>
          <button className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition">
            Delete Account
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
