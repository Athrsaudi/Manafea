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

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ar')
  const dir = langs.find(l => l.code === lang)?.dir || 'rtl'
  return (
    <LangContext.Provider value={{ lang, setLang, dir, langs }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
