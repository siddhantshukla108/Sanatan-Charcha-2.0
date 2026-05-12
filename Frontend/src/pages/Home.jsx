import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import HomeHero from '../components/HomeHero' 
import treeGif from '../assets/tree-gif.png'
import { Body, EclipticLongitude, SunPosition } from 'astronomy-engine'

// 50+ Shlokas covering Bhagavad Gita, Upanishads, Ramayana, Vedas
const SHLOKAS = [
  { text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", src: "Bhagavad Gita 2.47", meaning: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions." },
  { text: "वसुधैव कुटुम्बकम्", src: "Maha Upanishad 6.72", meaning: "The whole world is one family." },
  { text: "सत्यमेव जयते", src: "Mundaka Upanishad 3.1.6", meaning: "Truth alone triumphs." },
  { text: "योगः कर्मसु कौशलम्", src: "Bhagavad Gita 2.50", meaning: "Yoga is excellence in action." },
  { text: "धर्मो रक्षति रक्षितः", src: "Manusmriti 8.15", meaning: "Dharma protects those who protect it." },
  { text: "अहिंसा परमो धर्मः", src: "Mahabharata", meaning: "Non-violence is the supreme Dharma." },
  { text: "तमसो मा ज्योतिर्गमय", src: "Brihadaranyaka Upanishad 1.3.28", meaning: "Lead me from darkness to light." },
  { text: "असतो मा सद्गमय", src: "Brihadaranyaka Upanishad 1.3.28", meaning: "Lead me from untruth to truth." },
  { text: "मृत्योर्मा अमृतं गमय", src: "Brihadaranyaka Upanishad 1.3.28", meaning: "Lead me from death to immortality." },
  { text: "ॐ पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते", src: "Isha Upanishad", meaning: "That is whole, this is whole; from wholeness emerges wholeness." },
  { text: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत", src: "Bhagavad Gita 4.7", meaning: "Whenever there is a decline of Dharma, I manifest Myself." },
  { text: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः", src: "Ancient Prayer", meaning: "May all be happy, may all be free from disease." },
  { text: "ईश्वरः सर्वभूतानां हृद्देशेऽर्जुन तिष्ठति", src: "Bhagavad Gita 18.61", meaning: "The Lord dwells in the hearts of all beings, O Arjuna." },
  { text: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्", src: "Bhagavad Gita 6.5", meaning: "One must elevate oneself by one's own mind, not degrade oneself." },
  { text: "विद्या ददाति विनयं विनयाद्याति पात्रताम्", src: "Hitopadesa", meaning: "Knowledge gives humility; humility brings worthiness." },
  { text: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते", src: "Bhagavad Gita 4.38", meaning: "There is nothing as purifying as knowledge in this world." },
  { text: "श्रद्धावाँल्लभते ज्ञानं", src: "Bhagavad Gita 4.39", meaning: "One who has faith attains knowledge." },
  { text: "मन एव मनुष्याणां कारणं बन्धमोक्षयोः", src: "Amritabindu Upanishad", meaning: "Mind alone is the cause of bondage and liberation." },
  { text: "अयं निजः परो वेति गणना लघुचेतसाम्", src: "Panchatantra", meaning: "This is mine, that is another's — such thinking is of the small-minded." },
  { text: "परोपकाराय फलन्ति वृक्षाः", src: "Subhashita", meaning: "Trees bear fruit for the welfare of others." },
  { text: "सत्यं ब्रूयात् प्रियं ब्रूयात्", src: "Manusmriti", meaning: "Speak the truth, speak pleasantly." },
  { text: "आत्मनो मोक्षार्थं जगद्धिताय च", src: "Jain-Hindu Tradition", meaning: "For the liberation of self and the welfare of the world." },
  { text: "सहनाववतु सह नौ भुनक्तु", src: "Taittiriya Upanishad", meaning: "May we be protected together, may we be nourished together." },
  { text: "ॐ शान्तिः शान्तिः शान्तिः", src: "Vedic Invocation", meaning: "Om, Peace, Peace, Peace." },
  { text: "नास्ति विद्यासमो बन्धुर्नास्ति विद्यासमः सुहृत्", src: "Chanakya Niti", meaning: "There is no friend like knowledge, no ally like learning." },
  { text: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्", src: "Bhagavad Gita 4.8", meaning: "For the protection of the good and destruction of evil." },
  { text: "यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः", src: "Manusmriti 3.56", meaning: "Where women are honored, there the gods are pleased." },
  { text: "अन्नं ब्रह्मेति व्यजानात्", src: "Taittiriya Upanishad 3.2", meaning: "Know that food is Brahman (the Divine)." },
  { text: "शरीरमाद्यं खलु धर्मसाधनम्", src: "Kumarasambhavam", meaning: "The body is indeed the primary instrument of Dharma." },
  { text: "आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः", src: "Subhashita", meaning: "Laziness is the greatest enemy dwelling within the body." },
  { text: "दूरेण ह्यवरं कर्म बुद्धियोगाद्धनञ्जय", src: "Bhagavad Gita 2.49", meaning: "Action without wisdom is far inferior, O Arjuna." },
  { text: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय", src: "Bhagavad Gita 2.48", meaning: "Perform actions established in Yoga, renouncing attachment." },
  { text: "समत्वं योग उच्यते", src: "Bhagavad Gita 2.48", meaning: "Equanimity is called Yoga." },
  { text: "ज्ञानं परमं बलम्", src: "Vedic Wisdom", meaning: "Knowledge is the supreme power." },
  { text: "विनाशकाले विपरीतबुद्धिः", src: "Subhashita", meaning: "At the time of destruction, intellect works against itself." },
  { text: "मातृदेवो भव पितृदेवो भव", src: "Taittiriya Upanishad 1.11", meaning: "Treat your mother as God, treat your father as God." },
  { text: "आचार्यदेवो भव", src: "Taittiriya Upanishad 1.11", meaning: "Treat your teacher as God." },
  { text: "ॐ भूर्भुवः स्वः", src: "Gayatri Mantra (Rig Veda)", meaning: "Om — the essence of earth, atmosphere and heaven." },
  { text: "एकम् सत् विप्रा बहुधा वदन्ति", src: "Rig Veda 1.164.46", meaning: "Truth is one; the wise call it by many names." },
  { text: "अतिथिदेवो भव", src: "Taittiriya Upanishad 1.11", meaning: "Treat your guest as God." },
  { text: "स विद्या या विमुक्तये", src: "Vishnu Purana 1.19.41", meaning: "True knowledge is that which liberates." },
  { text: "क्षमा वीरस्य भूषणम्", src: "Subhashita", meaning: "Forgiveness is the ornament of the brave." },
  { text: "दानेन तुल्यं न हि सुखम्", src: "Subhashita", meaning: "There is no joy equal to the joy of giving." },
  { text: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः", src: "Guru Stotram", meaning: "Guru is Brahma, Guru is Vishnu, Guru is Lord Maheshwara." },
  { text: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः", src: "Bhagavad Gita 18.78", meaning: "Where there is Krishna and Arjuna, there is victory and prosperity." },
  { text: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज", src: "Bhagavad Gita 18.66", meaning: "Abandon all duties and surrender unto Me alone." },
  { text: "ॐ नमः शिवाय", src: "Yajur Veda", meaning: "Salutations to Lord Shiva — the Auspicious One." },
  { text: "रामो राजमणिः सदा विजयते", src: "Rama Raksha Stotra", meaning: "Rama, the jewel among kings, is ever victorious." },
  { text: "जननी जन्मभूमिश्च स्वर्गादपि गरीयसी", src: "Ramayana", meaning: "Mother and motherland are greater than heaven." },
  { text: "कृण्वन्तो विश्वमार्यम्", src: "Rig Veda 9.63.5", meaning: "Make the whole world noble." },
]

// Accurate Panchang data using astronomy-engine
function getPanchangData() {
  const now = new Date();
  
  // Tithi calculation (Moon Longitude - Sun Longitude) / 12 degrees
  const sunLon = SunPosition(now).elon;
  const moonLon = EclipticLongitude(Body.Moon, now);
  
  let diff = moonLon - sunLon;
  if (diff < 0) diff += 360;
  
  const lunarDay = diff / 12; // 0 to 30
  
  const tithis = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
  ];
  
  const tithiIndex = Math.floor(lunarDay);
  const tithi = tithis[tithiIndex];
  
  const paksha = lunarDay < 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)';
  
  // Realistic moon phase emoji based on lunar day
  let moonPhase = '🌑';
  if (lunarDay > 1 && lunarDay <= 6) moonPhase = '🌒';
  else if (lunarDay > 6 && lunarDay <= 9) moonPhase = '🌓';
  else if (lunarDay > 9 && lunarDay <= 14) moonPhase = '🌔';
  else if (lunarDay > 14 && lunarDay <= 16) moonPhase = '🌕';
  else if (lunarDay > 16 && lunarDay <= 21) moonPhase = '🌖';
  else if (lunarDay > 21 && lunarDay <= 24) moonPhase = '🌗';
  else if (lunarDay > 24 && lunarDay <= 29) moonPhase = '🌘';

  // Nakshatra calculation (Moon Longitude / 13.333 degrees)
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  const nakshatra = nakshatras[nakshatraIndex];
  
  // Hindu Solar Month calculation based on Sun's sign (0 = Aries/Mesha)
  const sunSign = Math.floor(sunLon / 30);
  const solarMonths = ['Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna', 'Chaitra'];
  const month = solarMonths[sunSign];
  
  const varas = ['Ravivaar (Sun)', 'Somvaar (Mon)', 'Mangalvaar (Tue)', 'Budhvaar (Wed)', 'Guruvaar (Thu)', 'Shukravaar (Fri)', 'Shanivaar (Sat)'];
  const vara = varas[now.getDay()];
  
  // Vikram Samvat calculation
  const samvat = now.getFullYear() + 57;

  return {
    tithi,
    nakshatra,
    month,
    vara,
    paksha,
    moonPhase,
    samvat
  };
}

export default function Home() {
  const { t } = useTranslation()
  const [todaysShloka, setTodaysShloka] = useState(SHLOKAS[0])
  const [panchang, setPanchang] = useState(null)

  useEffect(() => {
    // Deterministic shloka based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    setTodaysShloka(SHLOKAS[dayOfYear % SHLOKAS.length])
    setPanchang(getPanchangData())
  }, [])

  const libraryHighlights = t('home.libraryHighlights', { returnObjects: true }) || []

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <div className="relative">
        <HomeHero />
      </div>

      {/* --- PANCHANG WIDGET --- */}
      {panchang && (
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#ff8f2b 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-saffron-400 text-xs font-bold tracking-[0.3em] uppercase">{t('home.panchangBadge', { defaultValue: 'आज का पञ्चाङ्ग' })}</span>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">{t('home.panchangTitle', { defaultValue: "Today's Hindu Panchang" })}</h2>
                </div>
                <div className="text-4xl">{panchang.moonPhase}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('home.panTithi', { defaultValue: 'Tithi' }), value: panchang.tithi, icon: '🌙' },
                  { label: t('home.panNakshatra', { defaultValue: 'Nakshatra' }), value: panchang.nakshatra, icon: '⭐' },
                  { label: t('home.panPaksha', { defaultValue: 'Paksha' }), value: panchang.paksha, icon: '🌗' },
                  { label: t('home.panVara', { defaultValue: 'Vara' }), value: panchang.vara, icon: '📅' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs text-saffron-300 font-bold uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-white font-bold text-sm">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-white/50 gap-3 border-t border-white/10 pt-4">
                <div className="flex gap-4">
                  <span>{t('home.panMonth', { defaultValue: 'Hindu Month' })}: <strong className="text-saffron-300">{panchang.month}</strong></span>
                  <span>{t('home.panSamvat', { defaultValue: 'Vikram Samvat' })}: <strong className="text-saffron-300">{panchang.samvat}</strong></span>
                </div>
                <div className="italic text-white/30 text-[10px]">
                  * {t('home.panDisclaimer', { defaultValue: 'Calculations are approximate and for reference only. Please consult a local temple for exact Muhurat and Vrat timings.' })}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* --- LIBRARY HIGHLIGHTS --- */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 border-b border-saffron-200 pb-4">
          <h2 className="text-3xl font-serif font-bold text-maroon-700">
            {t('home.sectionLibrary') || 'Treasures of the Library'}
          </h2>
          <Link to="/library" className="text-saffron-600 font-semibold hover:text-saffron-800 transition">{t('home.viewAll') || 'View All'} &rarr;</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Array.isArray(libraryHighlights) && libraryHighlights.length > 0 ? (
            libraryHighlights.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white card-glass shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-saffron-400"
              >
                <h4 className="font-serif text-xl font-bold text-maroon-700 mb-2">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.excerpt}</p>
              </motion.div>
            ))
          ) : (
            <p className="col-span-3 text-center text-slate-500">{t('home.loading') || "Library content loading..."}</p>
          )}
        </div>
      </section>

      {/* --- DAILY WISDOM (Parallax Tree) --- */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {treeGif && <img src={treeGif} alt="Tree of Life" className="w-full h-full object-cover opacity-10" />}
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-50/90 to-white/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-saffron-100"
          >
            <div className="text-saffron-500 text-4xl mb-4">❝</div>
            <h3 className="text-3xl md:text-4xl font-bold text-maroon-700 font-serif mb-4">
              {todaysShloka.text}
            </h3>
            <div className="h-1 w-24 bg-saffron-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-xl text-slate-700 italic font-medium">
              "{todaysShloka.meaning}"
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-sm uppercase tracking-widest text-saffron-600 font-bold">
                — {todaysShloka.src || t('home.dailyWisdomTitle') || 'Daily Vedic Wisdom'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- DISCUSSION CTA --- */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-maroon-800 to-maroon-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-saffron-500/10 rounded-full blur-3xl"></div>
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-2xl font-serif font-bold mb-3">{t('home.discussTitle', { defaultValue: 'Charcha Sabha' })}</h2>
            <p className="text-white/70 mb-6 text-sm">{t('home.discussText', { defaultValue: 'Join real-time discussions on Vedas, Philosophy, Festivals, and more. No registration needed.' })}</p>
            <Link to="/charcha" className="inline-block px-6 py-3 rounded-full bg-saffron-500 text-white font-bold hover:bg-saffron-600 transition shadow-lg">
              {t('home.discussBtn', { defaultValue: 'Enter Discussion →' })}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-saffron-600 to-saffron-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="text-4xl mb-4">✍️</div>
            <h2 className="text-2xl font-serif font-bold mb-3">{t('home.requestTitle', { defaultValue: 'Request an Article' })}</h2>
            <p className="text-white/80 mb-6 text-sm">{t('home.requestText', { defaultValue: 'Have a topic you want explored? Submit your idea and shape the community\'s knowledge.' })}</p>
            <Link to="/request" className="inline-block px-6 py-3 rounded-full bg-white text-maroon-700 font-bold hover:bg-sand-100 transition shadow-lg">
              {t('home.requestBtn', { defaultValue: 'Submit Request →' })}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="container mx-auto px-4">
        <motion.div whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-saffron-600 to-maroon-700 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-saffron-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 relative z-10">
            {t('home.ctaTitle') || 'Join the Discussion'}
          </h2>
          <p className="text-lg text-sand-100 mb-8 max-w-2xl mx-auto relative z-10">
            {t('home.ctaText')}
          </p>
          <Link to="/communication" className="inline-block px-8 py-4 rounded-full bg-white text-maroon-700 font-bold hover:bg-sand-100 hover:shadow-lg transition relative z-10">
            {t('home.ctaBtn') || 'Start a Conversation'}
          </Link>
        </motion.div>
      </section>
    </div>
  )
}