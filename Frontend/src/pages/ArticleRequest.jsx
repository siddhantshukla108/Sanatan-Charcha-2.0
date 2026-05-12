import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORIES = [
  { value: 'Vedas', label: 'Vedas & Upanishads', icon: '🕉️', color: 'bg-orange-100 text-orange-700' },
  { value: 'Puranas', label: 'Puranas & Itihasas', icon: '📖', color: 'bg-red-100 text-red-700' },
  { value: 'Festivals', label: 'Hindu Festivals', icon: '🪔', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Temples', label: 'Temple History', icon: '🏛️', color: 'bg-purple-100 text-purple-700' },
  { value: 'Philosophy', label: 'Philosophy (Darshana)', icon: '💭', color: 'bg-blue-100 text-blue-700' },
  { value: 'Yoga', label: 'Yoga & Ayurveda', icon: '🧘', color: 'bg-green-100 text-green-700' },
  { value: 'Art', label: 'Hindu Art & Music', icon: '🎵', color: 'bg-pink-100 text-pink-700' },
  { value: 'General', label: 'Other / General', icon: '📝', color: 'bg-slate-100 text-slate-700' },
]

export default function ArticleRequest() {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    requesterName: isAuthenticated && user?.name ? user.name : '',
    requesterEmail: isAuthenticated && user?.email ? user.email : '',
    topic: '',
    description: '',
    category: 'General'
  })

  // Sync auth state
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        requesterName: user.name || prev.requesterName,
        requesterEmail: user.email || prev.requesterEmail,
      }))
    }
  }, [isAuthenticated, user])
  const [submitStatus, setSubmitStatus] = useState('')
  
  // Community wishlist
  const [approvedRequests, setApprovedRequests] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch approved requests on mount
  useEffect(() => {
    fetchApproved()
  }, [])

  const fetchApproved = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/requests`)
      const data = await res.json()
      setApprovedRequests(data)
    } catch (err) {
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitStatus('success')
        setFormData({ requesterName: '', requesterEmail: '', topic: '', description: '', category: 'General' })
        setTimeout(() => setSubmitStatus(''), 5000)
      } else {
        const errData = await res.json()
        setSubmitStatus('error')
        console.error(errData.message)
      }
    } catch (err) {
      console.error(err)
      setSubmitStatus('error')
    }
  }

  const getCategoryMeta = (cat) => {
    return CATEGORIES.find(c => c.value === cat) || CATEGORIES[CATEGORIES.length - 1]
  }

  const statusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      published: 'bg-blue-100 text-blue-700 border-blue-200',
    }
    return styles[status] || 'bg-gray-100 text-gray-600'
  }

  return (
    <section className="space-y-16 pb-16">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-saffron-600 via-saffron-700 to-maroon-800 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 md:mx-0">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        <div className="relative z-10 p-12 md:p-16 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 text-xs font-bold tracking-widest uppercase bg-white/20 rounded-full mb-4">
              {t('request.badge', { defaultValue: 'सुझाव दें' })}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {t('request.heroTitle', { defaultValue: 'Request an Article' })}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t('request.heroText', { defaultValue: 'Have a topic you want us to explore? Submit your idea and help shape the knowledge shared on Sanatan Charcha. Our admin team reviews every request.' })}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* LEFT: Submit Form (3 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="p-8 bg-white rounded-3xl shadow-xl border border-saffron-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-saffron-500 to-maroon-600"></div>
              
              <h2 className="text-2xl font-serif font-bold text-maroon-700 mb-6 pl-4">
                {t('request.formTitle', { defaultValue: '✍️ Submit Your Request' })}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 pl-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t('request.labelName', { defaultValue: 'Your Name' })}</label>
                    <input 
                      required type="text"
                      className={`w-full p-3 rounded-lg border focus:ring-1 outline-none transition ${isAuthenticated ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-sand-50 border-gray-200 focus:border-saffron-500 focus:ring-saffron-500'}`}
                      placeholder={t('request.phName', { defaultValue: 'e.g., Arjun Sharma' })}
                      value={formData.requesterName}
                      onChange={e => setFormData({...formData, requesterName: e.target.value})}
                      readOnly={isAuthenticated}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t('request.labelEmail', { defaultValue: 'Your Email' })}</label>
                    <input 
                      required type="email"
                      className={`w-full p-3 rounded-lg border focus:ring-1 outline-none transition ${isAuthenticated ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-sand-50 border-gray-200 focus:border-saffron-500 focus:ring-saffron-500'}`}
                      placeholder={t('request.phEmail', { defaultValue: 'you@example.com' })}
                      value={formData.requesterEmail}
                      onChange={e => setFormData({...formData, requesterEmail: e.target.value})}
                      readOnly={isAuthenticated}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('request.labelTopic', { defaultValue: 'Article Topic' })}</label>
                  <input 
                    required type="text"
                    className="w-full p-3 rounded-lg bg-sand-50 border border-gray-200 focus:border-saffron-500 outline-none transition"
                    placeholder={t('request.phTopic', { defaultValue: 'e.g., The significance of Navratri in different regions' })}
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('request.labelCategory', { defaultValue: 'Category' })}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.value})}
                        className={`p-2 rounded-lg text-xs font-bold border-2 transition-all ${
                          formData.category === cat.value 
                            ? 'border-saffron-500 bg-saffron-50 text-saffron-700 shadow-sm scale-[1.02]' 
                            : 'border-gray-200 bg-white text-slate-600 hover:border-saffron-200'
                        }`}
                      >
                        <span className="block text-lg mb-1">{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('request.labelDesc', { defaultValue: 'Why This Topic? (Optional)' })}</label>
                  <textarea 
                    rows="3"
                    className="w-full p-3 rounded-lg bg-sand-50 border border-gray-200 focus:border-saffron-500 outline-none transition"
                    placeholder={t('request.phDesc', { defaultValue: 'Tell us why this topic is important to you or the community...' })}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
                >
                  {submitStatus === 'loading' 
                    ? (t('request.submitting', { defaultValue: 'Submitting...' })) 
                    : (t('request.submitBtn', { defaultValue: '🙏 Submit Request' }))}
                </button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="text-green-600 text-center font-bold bg-green-50 p-3 rounded-lg">
                      {t('request.success', { defaultValue: '✅ Request submitted successfully! Our team will review it.' })}
                    </motion.p>
                  )}
                  {submitStatus === 'error' && (
                    <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="text-red-600 text-center font-bold bg-red-50 p-3 rounded-lg">
                      {t('request.error', { defaultValue: '❌ Failed to submit. Please try again.' })}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* RIGHT: Community Wishlist (2 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-maroon-700">
                  {t('request.wishlistTitle', { defaultValue: '📋 Community Wishlist' })}
                </h2>
                <button onClick={fetchApproved} className="text-xs text-saffron-600 font-bold hover:text-saffron-800 transition">
                  ⟳ {t('request.refresh', { defaultValue: 'Refresh' })}
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {t('request.wishlistDesc', { defaultValue: 'Topics approved by the community — articles on these are coming soon!' })}
              </p>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {loading && <p className="text-sm text-slate-400">Loading...</p>}
                
                {!loading && approvedRequests.length === 0 && (
                  <div className="text-center py-12 bg-sand-50 rounded-2xl border border-dashed border-saffron-300">
                    <div className="text-3xl mb-2">🌱</div>
                    <p className="text-sm text-slate-500">{t('request.emptyWishlist', { defaultValue: 'No approved requests yet. Be the first to suggest!' })}</p>
                  </div>
                )}

                {approvedRequests.map((req, idx) => {
                  const catMeta = getCategoryMeta(req.category)
                  return (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-white rounded-xl shadow-sm border border-saffron-50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-maroon-700 leading-tight flex-1">{req.topic}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusBadge(req.status)} shrink-0`}>
                          {req.status === 'published' ? '📄 Published' : '✅ Approved'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${catMeta.color}`}>
                          {catMeta.icon} {catMeta.label}
                        </span>
                      </div>
                      {req.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{req.description}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-2">
                        Suggested by <span className="font-bold text-slate-600">{req.requesterName}</span> • {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
