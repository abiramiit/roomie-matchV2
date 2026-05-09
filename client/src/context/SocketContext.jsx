import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('token')
    socketRef.current = io('/', { auth: { token }, transports: ['websocket'] })

    socketRef.current.on('user:online', ({ userId, online }) => {
      setOnlineUsers((prev) =>
        online ? [...new Set([...prev, userId])] : prev.filter((id) => id !== userId)
      )
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
