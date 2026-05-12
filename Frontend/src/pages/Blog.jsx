import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Configuration: Backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  
  // --- API CALLS ---

  // 1. Fetch all posts
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/content`)
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load posts on mount
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-2"
      >
        <div className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-saffron-600 uppercase bg-saffron-50 border border-saffron-200 rounded-full mb-2">
           Spiritual Journal
        </div>
        <h2 className="text-4xl font-serif font-bold text-maroon-700">Sanatan Blog</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Insights, reflections, and teachings from the path of Dharma.
        </p>
      </motion.div>

      {/* Controls Section: Refresh */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Visitor/Refresh Panel */}
        <motion.div className={`p-6 rounded-2xl bg-white border border-saffron-100 shadow-sm flex flex-col items-center justify-center text-center`}>
          <h3 className="text-xl font-serif font-bold text-maroon-700 mb-2">Latest Updates</h3>
          <p className="mb-4 text-sm text-slate-500">Refresh the feed to see newly published articles.</p>
          <button onClick={fetchPosts} className="px-8 py-2 rounded-full bg-white border-2 border-saffron-500 text-saffron-600 font-bold hover:bg-saffron-50 transition shadow-sm">
            {loading ? 'Refreshing...' : '⟳ Refresh Feed'}
          </button>
        </motion.div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, idx) => (
          <motion.div 
            key={post._id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-saffron-500"
          >
            {/* Media Display */}
            {post.mediaUrl && (
              <div className="w-full h-56 bg-gray-100 overflow-hidden relative">
                {post.mediaType === 'video' ? (
                  <video controls className="w-full h-full object-cover">
                    <source src={`${API_URL}${post.mediaUrl}`} type="video/mp4" />
                  </video>
                ) : (
                  <img src={`${API_URL}${post.mediaUrl}`} alt="Post media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-serif font-bold text-maroon-700 leading-tight">{post.title}</h3>
                </div>
                
                <p className="text-xs font-bold text-saffron-600 mb-3 uppercase tracking-wider">
                    {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                
                <p className="text-slate-600 mb-4 italic line-clamp-3 border-l-2 border-saffron-200 pl-3">
                    {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <details className="group/details">
                        <summary className="cursor-pointer text-saffron-700 font-bold hover:text-saffron-900 transition list-none flex items-center gap-2">
                            <span>Read Full Article</span>
                            <span className="group-open/details:rotate-90 transition-transform">▸</span>
                        </summary>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="mt-4 text-slate-800 whitespace-pre-line leading-relaxed bg-sand-50 p-4 rounded-lg text-sm"
                        >
                            {post.content}
                        </motion.div>
                    </details>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {posts.length === 0 && !loading && (
          <div className="text-center py-20 bg-sand-50 rounded-2xl border border-dashed border-saffron-300">
              <p className="text-xl text-maroon-700 font-serif">No articles found.</p>
              <p className="text-slate-500">The wisdom is yet to be written.</p>
          </div>
      )}
    </section>
  )
}