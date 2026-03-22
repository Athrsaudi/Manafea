import { createContext, useContext, useState } from 'react'

export const langs = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "ms", name: "Melayu", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "bn", name: "বাংলা", dir: "ltr" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
]

const VALID = langs.map(l => l.code)

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const saved = localStorage.getItem('manafea_lang')
  const initial = VALID.includes(saved) ? saved : 'ar'
  const [lang, setLang] = useState(initial)

  const handleSetLang = (code) => {
    if (VALID.includes(code)) {
      localStorage.setItem('manafea_lang', code)
      setLang(code)
    }
  }

  const dir = langs.find(l => l.code === lang)?.dir || 'rtl'
  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, dir, langs }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
