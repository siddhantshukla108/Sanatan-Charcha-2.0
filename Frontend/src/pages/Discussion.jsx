import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CHANNELS = [
  { slug: 'general', name: 'General', nameHi: 'सामान्य', icon: '💬', desc: 'Open discussion on any Dharmic topic' },
  { slug: 'vedas', name: 'Vedas & Upanishads', nameHi: 'वेद-उपनिषद', icon: '🕉️', desc: 'Discuss the eternal knowledge of Shruti texts' },
  { slug: 'puranas', name: 'Puranas & Epics', nameHi: 'पुराण-इतिहास', icon: '📖', desc: 'Ramayana, Mahabharata, and the 18 Puranas' },
  { slug: 'philosophy', name: 'Philosophy', nameHi: 'दर्शन', icon: '💭', desc: 'Advaita, Dvaita, Vishishtadvaita, Yoga, Sankhya, Nyaya' },
  { slug: 'festivals', name: 'Festivals & Traditions', nameHi: 'पर्व-परम्परा', icon: '🪔', desc: 'Hindu festivals, rituals, and customs' },
  { slug: 'temples', name: 'Temples & Art', nameHi: 'मन्दिर-कला', icon: '🏛️', desc: 'Temple architecture, sculpture, and sacred art' },
  { slug: 'yoga', name: 'Yoga & Wellness', nameHi: 'योग-आयुर्वेद', icon: '🧘', desc: 'Yoga, meditation, Ayurveda, and well-being' },
  { slug: 'sanskrit', name: 'Sanskrit Learning', nameHi: 'संस्कृत शिक्षा', icon: '📝', desc: 'Learn and discuss the divine language' },
]

const USER_COLORS = [
  '#ff8f2b', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6',
  '#1abc9c', '#f39c12', '#e67e22', '#e84393', '#00b894',
  '#6c5ce7', '#fd79a8', '#00cec9', '#fab1a0', '#a29bfe'
]

function getRandomColor() {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
}

export default function Discussion() {
  const { t } = useTranslation()
  const { isAuthenticated, user, isAdmin, token } = useAuth()
  
  // User identity (use Auth Context if available, else localStorage)
  const [userName, setUserName] = useState(() => isAuthenticated ? user?.name : (localStorage.getItem('discussionUser') || ''))
  const [userColor, setUserColor] = useState(localStorage.getItem('discussionColor') || getRandomColor())
  const [hasJoined, setHasJoined] = useState(() => isAuthenticated || !!localStorage.getItem('discussionUser'))
  const [joinName, setJoinName] = useState('')

  // Sync auth state changes to discussion identity
  useEffect(() => {
    if (isAuthenticated && user?.name) {
      setUserName(user.name);
      setHasJoined(true);
    } else if (!localStorage.getItem('discussionUser')) {
      setHasJoined(false);
      setUserName('');
    }
  }, [isAuthenticated, user]);
  
  // Channel state
  const [activeChannel, setActiveChannel] = useState('general')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [channelStats, setChannelStats] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Fetch messages for active channel
  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/discussion/${activeChannel}?limit=100`)
      const data = await res.json()
      setMessages(data)
      if (!silent) setTimeout(scrollToBottom, 100)
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }, [activeChannel, scrollToBottom])

  // Fetch channel stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/discussion-stats`)
      const data = await res.json()
      const statsMap = {}
      data.forEach(s => { statsMap[s._id] = s.count })
      setChannelStats(statsMap)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }, [])

  // Load messages when channel changes
  useEffect(() => {
    fetchMessages()
    fetchStats()
  }, [activeChannel, fetchMessages, fetchStats])

  // Polling for new messages (every 5 seconds)
  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(true) // Silent refresh
    }, 5000)
    return () => clearInterval(pollIntervalRef.current)
  }, [fetchMessages])

  // Handle joining
  const handleJoin = (e) => {
    e.preventDefault()
    if (!joinName.trim()) return
    const color = getRandomColor()
    localStorage.setItem('discussionUser', joinName.trim())
    localStorage.setItem('discussionColor', color)
    setUserName(joinName.trim())
    setUserColor(color)
    setHasJoined(true)
  }

  // Handle leaving
  const handleLeave = () => {
    localStorage.removeItem('discussionUser')
    localStorage.removeItem('discussionColor')
    setUserName('')
    setHasJoined(false)
    setJoinName('')
  }

  // Send message
  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch(`${API_URL}/api/discussion/${activeChannel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userColor, message: newMessage.trim() })
      })
      if (res.ok) {
        setNewMessage('')
        await fetchMessages(true)
        setTimeout(scrollToBottom, 200)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await fetch(`${API_URL}/api/discussion/message/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchMessages(true);
    } catch (err) {
      console.error(err);
    }
  }

  const activeChannelData = CHANNELS.find(c => c.slug === activeChannel)

  // Format time
  const formatTime = (date) => {
    const d = new Date(date)
    const today = new Date()
    const isToday = d.toDateString() === today.toDateString()
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return isToday ? time : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`
  }

  // --- RENDER: JOIN SCREEN ---
  if (!hasJoined) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="p-8 bg-white rounded-3xl shadow-2xl border border-saffron-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron-500 via-maroon-600 to-saffron-500"></div>
            
            <div className="text-5xl mb-4">🏛️</div>
            <h2 className="text-3xl font-serif font-bold text-maroon-700 mb-2">
              {t('discussion.joinTitle', { defaultValue: 'Charcha Sabha' })}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {t('discussion.joinSubtitle', { defaultValue: 'Enter a display name to join the discussion. No registration needed — just pure Dharmic discourse.' })}
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                required
                maxLength={30}
                className="w-full p-4 rounded-xl bg-sand-50 border border-gray-200 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 outline-none transition text-center text-lg font-semibold"
                placeholder={t('discussion.namePlaceholder', { defaultValue: 'Your Display Name' })}
                value={joinName}
                onChange={e => setJoinName(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-saffron-500 to-maroon-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
              >
                {t('discussion.joinBtn', { defaultValue: '🙏 Enter Sabha' })}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-slate-400">
                {t('discussion.joinNote', { defaultValue: 'By joining, you agree to follow our Dharmic Code of Conduct.' })}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    )
  }

  // --- RENDER: DISCUSSION INTERFACE ---
  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex h-[calc(100vh-180px)] rounded-2xl overflow-hidden shadow-2xl border border-saffron-100 bg-white">

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-20 left-4 z-50 w-12 h-12 rounded-full bg-saffron-500 text-white shadow-lg flex items-center justify-center text-xl hover:bg-saffron-600 transition"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* LEFT: Channel Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-40 lg:z-auto
          w-72 lg:w-64 h-full
          bg-maroon-900 text-white flex flex-col 
          transition-transform duration-300
          shrink-0
        `}>
          {/* Server Header */}
          <div className="p-4 border-b border-maroon-700">
            <h2 className="font-serif font-bold text-saffron-400 text-lg">{t('discussion.serverName', { defaultValue: 'Charcha Sabha' })}</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{t('discussion.serverTagline', { defaultValue: 'Cultural Discussion Hub' })}</p>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-2 mb-2 mt-2">{t('discussion.channelsLabel', { defaultValue: 'Channels' })}</p>
            {CHANNELS.map(ch => (
              <button
                key={ch.slug}
                onClick={() => { setActiveChannel(ch.slug); setSidebarOpen(false) }}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all group ${
                  activeChannel === ch.slug 
                    ? 'bg-saffron-600/30 text-saffron-300' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{ch.name}</div>
                  <div className="text-[10px] text-white/40 truncate">{ch.desc}</div>
                </div>
                {channelStats[ch.slug] > 0 && (
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full shrink-0">
                    {channelStats[ch.slug]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User Panel */}
          <div className="p-3 border-t border-maroon-700 bg-maroon-950/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: userColor }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-green-400">● {t('discussion.online', { defaultValue: 'Online' })}</p>
                </div>
              </div>
              <button
                onClick={handleLeave}
                className="text-[10px] text-red-400 hover:text-red-300 transition font-bold shrink-0"
                title="Leave"
              >
                🚪
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* RIGHT: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Channel Header */}
          <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex items-center gap-3 shrink-0">
            <span className="text-2xl">{activeChannelData?.icon}</span>
            <div>
              <h3 className="font-bold text-maroon-700">{activeChannelData?.name}</h3>
              <p className="text-xs text-slate-500">{activeChannelData?.desc}</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-sand-50/30" id="discussion-messages">
            {loading && messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 animate-pulse">{t('discussion.loading', { defaultValue: 'Loading messages...' })}</p>
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-5xl mb-4">{activeChannelData?.icon}</div>
                <h4 className="text-lg font-serif font-bold text-maroon-700 mb-2">
                  {t('discussion.emptyTitle', { defaultValue: 'Welcome to' })} #{activeChannelData?.name}
                </h4>
                <p className="text-sm text-slate-500 max-w-sm">
                  {t('discussion.emptyText', { defaultValue: 'This is the beginning of this channel. Start the conversation!' })}
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const prevMsg = messages[idx - 1]
              const sameUser = prevMsg && prevMsg.userName === msg.userName
              const timeDiff = prevMsg ? (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) / 60000 : 999
              const grouped = sameUser && timeDiff < 5

              return (
                <div
                  key={msg._id}
                  className={`flex items-start gap-3 px-2 py-1 rounded-lg hover:bg-white/60 transition group ${grouped ? '' : 'mt-3'}`}
                >
                  {/* Avatar */}
                  {!grouped ? (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5 shadow-sm"
                      style={{ backgroundColor: msg.userColor || '#ff8f2b' }}
                    >
                      {msg.userName.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-10 shrink-0">
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition text-center block">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {!grouped && (
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-bold text-sm" style={{ color: msg.userColor || '#5D2E2E' }}>
                          {msg.userName}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatTime(msg.createdAt)}</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-700 leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeleteMessage(msg._id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition p-1" title="Delete Message">🗑️</button>
                  )}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <input
                type="text"
                maxLength={1000}
                className="flex-1 p-3 rounded-xl bg-sand-50 border border-gray-200 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-200 outline-none transition text-sm"
                placeholder={t('discussion.inputPlaceholder', { defaultValue: `Message #${activeChannel}...` })}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {sending ? '...' : '🙏'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
