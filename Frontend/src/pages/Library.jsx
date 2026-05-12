import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Optional: Import a background image for the hero if you have one
// import libraryBg from '../assets/library-bg.jpg'

export default function Library() {
  const { t } = useTranslation()

  const categories = [
    { title: "Vedas & Upanishads", desc: "The primary texts of Sanatan Dharma.", icon: "🕉️", color: "border-saffron-500" },
    { title: "Puranas", desc: "Ancient stories and cosmologies.", icon: "📜", color: "border-maroon-500" },
    { title: "Itihasas (Epics)", desc: "Ramayana and Mahabharata.", icon: "🏹", color: "border-yellow-500" },
  ]

  return (
    <section className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <div className="relative bg-maroon-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 md:mx-0 h-[400px] flex items-center justify-center text-center px-4">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-900 via-maroon-900/80 to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <span className="text-saffron-400 text-sm font-bold tracking-[0.3em] uppercase mb-2 block">
            Gyana Ganga
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            The Grand <span className="text-saffron-500">Library</span>
          </h1>
          <p className="text-xl text-sand-100 font-light mb-8 leading-relaxed">
            {t('placeholderParagraph') || "Immerse yourself in the timeless ocean of Vedic wisdom. Access scriptures, commentaries, and rare texts preserved for the modern seeker."}
          </p>
          
          <Link 
            to="/library/books" 
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition transform"
          >
            Enter the Granthalaya &rarr;
          </Link>
        </motion.div>
      </div>

      {/* Categories Preview */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-maroon-700">Sacred Collections</h2>
          <div className="h-1 w-24 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={`p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-t-4 ${cat.color} card-glass`}
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">{cat.title}</h3>
              <p className="text-slate-600 mb-6">{cat.desc}</p>
              <Link to="/library/books" className="text-saffron-600 font-bold hover:text-saffron-800 flex items-center gap-2 group">
                Explore <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}