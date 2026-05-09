import { createContext, useContext, useState, useEffect } from 'react'
import { matchAPI } from '../api'
import { useAuth } from './AuthContext'

const NotifContext = createContext(null)

export const NotifProvider = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (user) fetchNotifs()
  }, [user])

  const fetchNotifs = async () => {
    try {
      const { data } = await matchAPI.getNotifications()
      setNotifications(data)
    } catch {}
  }

  const markRead = async () => {
    await matchAPI.markRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <NotifContext.Provider value={{ notifications, unread, fetchNotifs, markRead }}>
      {children}
    </NotifContext.Provider>
  )
}

export const useNotif = () => useContext(NotifContext)
