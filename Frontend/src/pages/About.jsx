import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  // Fallback content in case translation json is missing keys
  const missionText = t('about.missionText') || "To preserve the ancient wisdom of Sanatan Dharma and make it accessible to the modern world through technology and dialogue."
  const visionText = t('about.visionText') || "A global community united by the pursuit of Truth (Satya), grounded in Dharma, and inspired by the Vedas."

  return (
    <section className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <div className="relative bg-maroon-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ff8f2b 2px, transparent 2px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="relative z-20 p-12 md:p-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-saffron-400 mb-4"
          >
            {t('nav.about') || "About Us"}
          </motion.h1>
          <p className="text-xl text-sand-100 max-w-2xl mx-auto font-light">
            Bridging the gap between ancient tradition and modern inquiry.
          </p>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-2xl shadow-lg border-t-4 border-saffron-500 hover:shadow-xl transition"
          >
            <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center text-2xl mb-4">🎯</div>
            <h2 className="text-2xl font-serif font-bold text-maroon-700 mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">{missionText}</p>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-2xl shadow-lg border-t-4 border-maroon-500 hover:shadow-xl transition"
          >
             <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center text-2xl mb-4">👁️</div>
            <h2 className="text-2xl font-serif font-bold text-maroon-700 mb-3">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">{visionText}</p>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-sand-50 py-16 rounded-3xl mx-4 md:mx-0">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-maroon-700">Core Values</h2>
          <div className="h-1 w-20 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { title: "Satya", subtitle: "Truth", icon: "🕯️" },
            { title: "Dharma", subtitle: "Righteousness", icon: "⚖️" },
            { title: "Shanti", subtitle: "Peace", icon: "🕊️" },
            { title: "Seva", subtitle: "Service", icon: "🤝" }
          ].map((val, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-saffron-100"
            >
              <div className="text-4xl mb-2">{val.icon}</div>
              <h3 className="font-bold text-maroon-700 text-lg">{val.title}</h3>
              <p className="text-xs uppercase tracking-widest text-slate-500">{val.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* History / Story */}
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">Our Journey</h3>
        <p className="text-slate-600 leading-relaxed">
          {t('about.historyText') || "Sanatan Charcha began as a small study group in Prayagraj, dedicated to reading the Upanishads. Today, it has grown into a digital platform connecting seekers from across the globe, offering a library of scriptures and a space for meaningful dialogue."}
        </p>
      </div>

    </section>
  )
}