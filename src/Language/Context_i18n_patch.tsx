// context.tsx — ADD these pieces to your existing provider.
// Everything else in your context (screen, navigate, etc.) stays as-is.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Lang, TranslationKey } from './Translations'

// 1. Add `lang`, `setLang`, and `t` to whatever interface your context value uses
interface AppContextValue {
  // ...your existing fields: screen, navigate, state, etc.
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // ...your existing state (screen, etc.) stays here

  // 2. Language state — reads a saved preference, defaults to English
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('quickbite-lang') as Lang) || 'en'
  )

  // Persist the choice so it survives a refresh
  useEffect(() => {
    localStorage.setItem('quickbite-lang', lang)
  }, [lang])

  const setLang = (next: Lang) => setLangState(next)

  // 3. The translator — looks up a key in the active language
  const t = (key: TranslationKey): string => translations[lang][key]

  const value: AppContextValue = {
    // ...your existing values: screen, navigate, etc.
    lang,
    setLang,
    t,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}