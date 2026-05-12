import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const RULES = [
  {
    sanskrit: 'अहिंसा',
    title: 'Ahimsa',
    meaning: 'Non-violence',
    icon: '🕊️',
    color: 'border-green-500',
    bg: 'bg-green-50',
    shloka: 'अहिंसा परमो धर्मः',
    shlokaEn: 'Non-violence is the highest Dharma',
    rule: 'No hate speech, no personal attacks, and no disrespect towards any Sampradaya, tradition, or community. Treat every being with compassion.'
  },
  {
    sanskrit: 'सत्य',
    title: 'Satya',
    meaning: 'Truth',
    icon: '🕯️',
    color: 'border-saffron-500',
    bg: 'bg-saffron-50',
    shloka: 'सत्यमेव जयते',
    shlokaEn: 'Truth alone triumphs',
    rule: 'Only share verified, authentic scriptural knowledge. Cite sources when sharing teachings. No misinformation or distorted interpretations.'
  },
  {
    sanskrit: 'अस्तेय',
    title: 'Asteya',
    meaning: 'Non-stealing',
    icon: '📜',
    color: 'border-blue-500',
    bg: 'bg-blue-50',
    shloka: 'अस्तेयप्रतिष्ठायां सर्वरत्नोपस्थानम्',
    shlokaEn: 'When non-stealing is established, all jewels present themselves',
    rule: 'Credit original authors, translators, and scholars. No plagiarism. Respect intellectual contributions of others.'
  },
  {
    sanskrit: 'ब्रह्मचर्य',
    title: 'Brahmacharya',
    meaning: 'Self-discipline',
    icon: '🧘',
    color: 'border-purple-500',
    bg: 'bg-purple-50',
    shloka: 'ब्रह्मचर्यप्रतिष्ठायां वीर्यलाभः',
    shlokaEn: 'Through self-discipline, one gains strength',
    rule: 'Keep discussions focused, meaningful, and on-topic. Avoid spam, off-topic rants, or provocative content intended to distract.'
  },
  {
    sanskrit: 'अपरिग्रह',
    title: 'Aparigraha',
    meaning: 'Non-possessiveness',
    icon: '🙏',
    color: 'border-yellow-500',
    bg: 'bg-yellow-50',
    shloka: 'अपरिग्रहस्थैर्ये जन्मकथन्तासम्बोधः',
    shlokaEn: 'When greed is gone, understanding dawns',
    rule: 'Share knowledge freely without gatekeeping. This platform exists for collective growth — wisdom belongs to all seekers.'
  },
  {
    sanskrit: 'शौच',
    title: 'Shaucha',
    meaning: 'Purity',
    icon: '✨',
    color: 'border-teal-500',
    bg: 'bg-teal-50',
    shloka: 'शौचात् स्वाङ्गजुगुप्सा परैरसंसर्गः',
    shlokaEn: 'From purity arises clarity of mind',
    rule: 'Keep the discussion space clean. No profanity, vulgar content, or inappropriate imagery. Maintain the sanctity of this spiritual space.'
  }
]

const CONTENT_TOPICS = [
  { name: 'Vedas & Upanishads', icon: '🕉️' },
  { name: 'Puranas & Itihasas', icon: '📖' },
  { name: 'Hindu Festivals', icon: '🪔' },
  { name: 'Temple Architecture', icon: '🏛️' },
  { name: 'Philosophy (Darshana)', icon: '💭' },
  { name: 'Yoga & Ayurveda', icon: '🧘' },
  { name: 'Hindu Art & Music', icon: '🎵' },
  { name: 'Sanskrit Literature', icon: '📝' },
]

export default function CommunityRules() {
  const { t } = useTranslation()

  return (
    <section className="space-y-16 pb-16">

      {/* Hero Section */}
      <div className="relative bg-maroon-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-900 via-maroon-800 to-saffron-900 z-0"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ff8f2b 1.5px, transparent 1.5px)', backgroundSize: '24px 24px'}}></div>
        
        <div className="relative z-10 p-12 md:p-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-saffron-400 text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              {t('rules.badge', { defaultValue: 'धार्मिक आचार संहिता' })}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              {t('rules.heroTitle', { defaultValue: 'Community' })} <span className="text-saffron-400">{t('rules.heroTitleHighlight', { defaultValue: 'Niyam' })}</span>
            </h1>
            <p className="text-xl text-sand-100 font-light max-w-3xl mx-auto leading-relaxed">
              {t('rules.heroText', { defaultValue: 'Our platform is governed by the timeless principles of Yamas & Niyamas from Maharishi Patanjali\'s Yoga Sutras. These are not mere rules — they are the foundation of Dharmic living.' })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Yamas & Niyamas — Rules Cards */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-maroon-700">{t('rules.codeTitle', { defaultValue: 'Dharmic Code of Conduct' })}</h2>
          <p className="text-slate-600 mt-2">{t('rules.codeSubtitle', { defaultValue: 'Based on Patanjali\'s Yoga Sutras — the universal ethics for seekers' })}</p>
          <div className="h-1 w-24 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RULES.map((rule, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 ${rule.color} group`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${rule.bg} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {rule.icon}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-maroon-700">{rule.title}</h3>
                  <p className="text-xs text-saffron-600 font-bold uppercase tracking-wider">{rule.meaning}</p>
                </div>
              </div>

              {/* Sanskrit Shloka */}
              <div className="bg-sand-50 rounded-lg p-3 mb-4 border-l-4 border-saffron-300">
                <p className="font-serif text-maroon-700 text-lg indic-text">{rule.shloka}</p>
                <p className="text-xs text-slate-500 italic mt-1">"{rule.shlokaEn}"</p>
              </div>

              {/* Rule Description */}
              <p className="text-slate-600 text-sm leading-relaxed">{rule.rule}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Topics Section */}
      <div className="bg-sand-50 py-16 rounded-3xl mx-4 md:mx-0">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-maroon-700">{t('rules.topicsTitle', { defaultValue: 'Welcome Topics' })}</h2>
            <p className="text-slate-600 mt-2">{t('rules.topicsSubtitle', { defaultValue: 'Content aligned with these areas of Hindu culture is encouraged' })}</p>
            <div className="h-1 w-20 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONTENT_TOPICS.map((topic, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -4 }}
                className="p-5 bg-white rounded-xl shadow-sm border border-saffron-100 text-center hover:shadow-lg transition-all cursor-default"
              >
                <div className="text-3xl mb-2">{topic.icon}</div>
                <h4 className="font-bold text-maroon-700 text-sm">{topic.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Moderation Policy */}
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-8 bg-white rounded-2xl shadow-lg border border-saffron-100"
        >
          <h3 className="text-2xl font-serif font-bold text-maroon-700 mb-4">{t('rules.moderationTitle', { defaultValue: '⚖️ Moderation Policy' })}</h3>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-saffron-500 mt-1 font-bold">•</span>
              <span>{t('rules.mod1', { defaultValue: 'All content is reviewed by the admin team before final publication.' })}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-saffron-500 mt-1 font-bold">•</span>
              <span>{t('rules.mod2', { defaultValue: 'Violations of the Dharmic Code may result in content removal.' })}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-saffron-500 mt-1 font-bold">•</span>
              <span>{t('rules.mod3', { defaultValue: 'Constructive criticism and respectful debate are always welcome.' })}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-saffron-500 mt-1 font-bold">•</span>
              <span>{t('rules.mod4', { defaultValue: 'Admin reserves the right to edit or decline submissions that don\'t align with our community values.' })}</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* CTA to Contribute */}
      <div className="container mx-auto px-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-saffron-600 to-maroon-700 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-saffron-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 relative z-10">
            {t('rules.ctaTitle', { defaultValue: 'Ready to Contribute?' })}
          </h2>
          <p className="text-lg text-sand-100 mb-8 max-w-2xl mx-auto relative z-10">
            {t('rules.ctaText', { defaultValue: 'Have a topic you\'d like us to cover? Submit an article request and help shape the community\'s knowledge base.' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              to="/request"
              className="inline-block px-8 py-4 rounded-full bg-white text-maroon-700 font-bold hover:bg-sand-100 hover:shadow-lg transition"
            >
              {t('rules.ctaBtn', { defaultValue: '✍️ Submit Article Request' })}
            </Link>
            <Link
              to="/charcha"
              className="inline-block px-8 py-4 rounded-full border-2 border-white/50 text-white font-bold hover:bg-white/10 transition"
            >
              {t('rules.ctaBtn2', { defaultValue: '💬 Join Discussion' })}
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  )
}
