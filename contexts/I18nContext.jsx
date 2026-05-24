import { createContext, useContext, useState, useCallback } from 'react'
import en from '../locales/en.json'
import es from '../locales/es.json'
import nl from '../locales/nl.json'

const translations = { en, es, nl }

export const LANGUAGES = [
  { code: 'nl', label: 'Nederlands', flag: '🇧🇪' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
]

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('equi_locale') || 'nl'
    }
    return 'nl'
  })

  const changeLocale = useCallback((code) => {
    setLocale(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('equi_locale', code)
    }
  }, [])

  const t = useCallback((key, vars = {}) => {
    const keys = key.split('.')
    let val = translations[locale]
    for (const k of keys) {
      val = val?.[k]
      if (val === undefined) break
    }
    if (val === undefined) {
      // fallback to English
      let fallback = translations['en']
      for (const k of keys) fallback = fallback?.[k]
      val = fallback ?? key
    }
    if (typeof val === 'string' && Object.keys(vars).length) {
      return val.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '')
    }
    return val ?? key
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
