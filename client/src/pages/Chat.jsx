import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { messageAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import AppLayout from '../components/layout/AppLayout'
import Avatar from '../components/common/Avatar'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { FiSend, FiArrowLeft } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function Chat() {
  const { userId } = useParams()
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [activeUser, setActiveUser] = useState(null)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    messageAPI.getConversations().then(({ data }) => {
      setConversations(data)
      setLoadingConvs(false)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    setLoadingMsgs(true)
    messageAPI.getMessages(userId).then(({ data }) => {
      setMessages(data)
      setLoadingMsgs(false)
    })
    // Find active user from conversations
    const conv = conversations.find((c) => c.user?._id === userId)
    if (conv) setActiveUser(conv.user)
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!socket) return
    socket.on('message:receive', (msg) => {
      if (msg.sender._id === userId || msg.receiver === userId) {
        setMessages((prev) => [...prev, msg])
      }
      setConversations((prev) => {
        const exists = prev.find((c) => c.user?._id === msg.sender._id)
        if (exists) return prev.map((c) => c.user?._id === msg.sender._id ? { ...c, lastMessage: msg } : c)
        return prev
      })
    })
    socket.on('message:sent', (msg) => {
      setMessages((prev) => [...prev, msg])
    })
    socket.on('typing:start', ({ userId: tid }) => { if (tid === userId) setTyping(true) })
    socket.on('typing:stop', ({ userId: tid }) => { if (tid === userId) setTyping(false) })
    return () => {
      socket.off('message:receive')
      socket.off('message:sent')
      socket.off('typing:start')
      socket.off('typing:stop')
    }
  }, [socket, userId])

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim() || !userId || !socket) return
    socket.emit('message:send', { receiverId: userId, content: text.trim() })
    socket.emit('typing:stop', { receiverId: userId })
    setText('')
  }

  const handleTyping = (e) => {
    setText(e.target.value)
    if (!socket || !userId) return
    socket.emit('typing:start', { receiverId: userId })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => socket.emit('typing:stop', { receiverId: userId }), 1500)
  }

  const isOnline = (id) => onlineUsers.includes(id)

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${userId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : conversations.length === 0 ? (
              <EmptyState icon="💬" title="No conversations" subtitle="Match with someone to start chatting" />
            ) : (
              conversations.map((c) => (
                <button key={c.user?._id} onClick={() => navigate(`/chat/${c.user?._id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left ${userId === c.user?._id ? 'bg-primary-light' : ''}`}>
                  <Avatar src={c.user?.avatar} name={c.user?.name} size="md" online={isOnline(c.user?._id)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{c.user?.name}</p>
                      <p className="text-xs text-gray-400 shrink-0 ml-1">
                        {c.lastMessage?.createdAt ? formatDistanceToNow(new Date(c.lastMessage.createdAt), { addSuffix: false }) : ''}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{c.lastMessage?.content}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center shrink-0">{c.unread}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        {!userId ? (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
            <EmptyState icon="💬" title="Select a conversation" subtitle="Choose someone to chat with" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <button onClick={() => navigate('/chat')} className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg">
                <FiArrowLeft size={18} />
              </button>
              {activeUser && (
                <>
                  <Avatar src={activeUser.avatar} name={activeUser.name} size="sm" online={isOnline(activeUser._id)} />
                  <div>
                    <p className="font-semibold text-sm">{activeUser.name}</p>
                    <p className="text-xs text-gray-400">{isOnline(activeUser._id) ? 'Online' : 'Offline'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400 text-sm">Say hello! 👋</div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender._id === user?._id || msg.sender === user?._id
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      {!isMine && <Avatar src={msg.sender?.avatar} name={msg.sender?.name} size="xs" className="mr-2 self-end" />}
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
              <input className="input flex-1" placeholder="Type a message..." value={text} onChange={handleTyping} />
              <button type="submit" disabled={!text.trim()} className="btn-primary px-4 py-2.5 flex items-center gap-1.5">
                <FiSend size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
