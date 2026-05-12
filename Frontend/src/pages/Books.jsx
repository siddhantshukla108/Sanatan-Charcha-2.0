import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Backend Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Books() {
  // Data State
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  
  // --- 1. Fetch Books ---
  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/books`)
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      console.error("Error fetching books:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-maroon-700">Digital Shelf</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          "A room without books is like a body without a soul." <br/>
          <span className="text-sm text-saffron-600 font-bold">— Cicero (Adapted for Digital Age)</span>
        </p>
      </div>

      {/* --- BOOKS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book, idx) => (
          <motion.div 
            key={book._id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative bg-white rounded-r-xl rounded-l-sm shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            {/* Book Cover (Vertical Aspect) */}
            <div className="aspect-[2/3] w-full overflow-hidden relative rounded-t-sm">
               {book.coverUrl ? (
                 <img src={`${API_URL}${book.coverUrl}`} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full bg-maroon-800 flex items-center justify-center text-saffron-200 font-serif p-4 text-center text-sm">
                    {book.title}
                 </div>
               )}
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-maroon-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                  <a 
                    href={`${API_URL}${book.pdfUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-saffron-500 text-white text-sm font-bold rounded-full shadow hover:scale-105 transition"
                  >
                    Read Now
                  </a>
               </div>
            </div>

            {/* Book Info */}
            <div className="p-3 flex flex-col flex-grow bg-white border-t border-gray-100">
              <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1 group-hover:text-maroon-700 transition-colors">{book.title}</h3>
              <p className="text-xs text-slate-500 mb-2">{book.author}</p>
              <span className="mt-auto self-start text-[10px] uppercase tracking-wide px-2 py-0.5 bg-sand-100 text-maroon-800 rounded-sm font-bold border border-sand-200">
                {book.language}
              </span>
            </div>
            
            {/* Spine Effect (Left Border) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-gray-300 to-gray-100 rounded-l-sm"></div>
          </motion.div>
        ))}

        {books.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="text-4xl mb-2">📚</div>
                <p>The library shelf is currently empty.</p>
            </div>
        )}
      </div>
    </section>
  )
}