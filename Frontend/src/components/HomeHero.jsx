// src/components/HomeHero.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import treeImg from '../assets/rishi.webp'

export default function HomeHero() {
  const { t } = useTranslation()

  // FIX: Access 'home.features' and ensure it returns an array
  const features = t('home.features', { returnObjects: true }) || []

  return (
    <section className="relative bg-gradient-to-b from-sand-50 to-white py-20 md:py-32 overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-200/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon-200/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4">
        <div className="md:flex md:items-center md:justify-between gap-12">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left z-10"
          >
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-saffron-600 uppercase bg-saffron-50 border border-saffron-200 rounded-full">
              {t('home.badge')}
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-maroon-700 leading-tight drop-shadow-sm">
              {t('home.heroTitle')}
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
              {t('home.heroText')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/library" className="px-5 py-4 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition transform">
                {t('home.btnLibrary')}
              </Link>
              <Link to="/blog" className="px-5 py-4 rounded-full border-2 border-saffron-400 text-maroon-700 font-bold hover:bg-maroon-50 transition">
                {t('home.btnBlog')}
              </Link>
            </div>
          </motion.div>

          {/* Right Image - Updated Animation */}
          <motion.div
            // Changed from slide-in (x: 40) to a fade-in and scale-up for an "evolving" effect
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end relative"
          >
            <div className="absolute inset-0 bg-saffron-400/20 rounded-full blur-3xl scale-75"></div>
            <motion.img
              src={treeImg}
              alt="Rishi"
              // Keep the gentle floating animation
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }} // Add a small delay so it starts floating after evolving in
              className="relative w-80 md:w-full max-w-md object-contain z-10"
            style={{
  WebkitMaskImage: "radial-gradient(circle, black 65%, transparent 100%)",
  maskImage: "radial-gradient(circle, black 65%, transparent 100%)",
  mixBlendMode: "multiply",
  opacity: 0.98
}}
            />
          </motion.div>
        </div>

        {/* Features Grid - CRASH PROOF CHECK ADDED */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.isArray(features) && features.length > 0 ? (
            features.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="p-8 rounded-2xl bg-white/80 card-glass shadow-lg hover:shadow-2xl hover:-translate-y-2 transition border-t-4 border-saffron-500"
              >
                <h4 className="font-serif text-xl font-bold text-maroon-700 mb-3">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-400">Loading features...</div>
          )}
        </div>
      </div>
    </section>
  )
}