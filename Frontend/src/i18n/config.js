import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import hi from './locales/hi.json'
import sa from './locales/sa.json'
import ta from './locales/ta.json'
import te from './locales/te.json'

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  sa: { translation: sa },
  ta: { translation: ta },
  te: { translation: te },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // Check localStorage first, then navigator (browser language)
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], 
    },
    interpolation: { escapeValue: false },
  })

export default i18n