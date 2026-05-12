import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Communication() {
  const { t } = useTranslation()
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('') // 'loading', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h2 className="text-3xl font-serif font-bold text-maroon-700">
          {t('nav.communication') || 'Samvad (Communication)'}
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Have a question about the scriptures? Want to contribute? 
          Send us a message and join the discussion.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-white rounded-3xl shadow-xl border border-saffron-100 relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-2 h-full bg-saffron-500"></div>
           <h3 className="text-xl font-bold text-maroon-700 mb-6">{t('communication.formTitle', { defaultValue: 'Send us a Message' })}</h3>
           
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">{t('communication.labels.name', { defaultValue: 'Name' })}</label>
               <input 
                 required
                 type="text" 
                 className="w-full p-3 rounded-lg bg-sand-50 border border-gray-200 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 outline-none transition"
                 placeholder={t('communication.placeholders.name', { defaultValue: 'Your Name' })}
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">{t('communication.labels.email', { defaultValue: 'Email' })}</label>
               <input 
                 required
                 type="email" 
                 className="w-full p-3 rounded-lg bg-sand-50 border border-gray-200 focus:border-saffron-500 outline-none transition"
                 placeholder={t('communication.placeholders.email', { defaultValue: 'you@example.com' })}
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">{t('communication.labels.message', { defaultValue: 'Message' })}</label>
               <textarea 
                 required
                 rows="4"
                 className="w-full p-3 rounded-lg bg-sand-50 border border-gray-200 focus:border-saffron-500 outline-none transition"
                 placeholder={t('communication.placeholders.message', { defaultValue: 'Your thoughts...' })}
                 value={formData.message}
                 onChange={e => setFormData({...formData, message: e.target.value})}
               />
             </div>

             <button 
               disabled={status === 'loading'}
               className="w-full py-3 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
             >
               {status === 'loading' ? t('communication.sending', { defaultValue: 'Sending...' }) : t('communication.sendBtn', { defaultValue: 'Send Message' })}
             </button>

             {status === 'success' && <p className="text-green-600 text-center mt-2">{t('communication.success', { defaultValue: 'Message sent successfully! Pranam.' })}</p>}
             {status === 'error' && <p className="text-red-600 text-center mt-2">{t('communication.error', { defaultValue: 'Failed to send message. Try again.' })}</p>}
           </form>
        </motion.div>

         {/* Info / Community Note */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col justify-center space-y-6"
        >
           <div className="p-6 card-glass rounded-2xl shadow-md">
             <h4 className="font-bold text-lg text-maroon-700 mb-2">{t('communication.guidelinesTitle', { defaultValue: 'Community Guidelines' })}</h4>
             <p className="text-sm text-slate-600">
               {t('communication.guidelinesText', { defaultValue: 'We believe in Satyam (Truth) and Priyam (Kindness). Please ensure your messages are respectful.' })}
             </p>
           </div>

           <div className="p-6 bg-maroon-900 text-white rounded-2xl shadow-md">
             <h4 className="font-bold text-lg text-saffron-400 mb-2">{t('communication.joinTitle', { defaultValue: 'Join the Discussion' })}</h4>
             <p className="text-sm text-white/80">
               {t('communication.joinText', { defaultValue: 'Our admins review every message. Selected questions will be answered in our Weekly Blog.' })}
             </p>
           </div>
        </motion.div>

      </div>
    </section>
  )
}