import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context'

const OPTIONS = [
  { value: 'en', short: 'EN', label: 'English' },
  { value: 'zh-Hant', short: '繁', label: '繁體中文' },
  { value: 'zh-Hans', short: '简', label: '简体中文' },
] as const

export function LanguageToggle() {
  const { lang, setLang, state } = useApp()
  const screen = state.history[state.history.length - 1]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  if (screen !== 'home' && screen !== 'login') return null

  const current = OPTIONS.find(o => o.value === lang) ?? OPTIONS[0]

  return (
    <div ref={ref} className="relative">
      {open && (
        <div
          role="menu"
          aria-label={lang === "en" ? "Language" : lang === "zh-Hant" ? "語言" : "语言"}
          className="absolute right-0 top-[calc(100%+8px)] w-36 origin-top-right animate-[lang-pop_220ms_cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden rounded-2xl border border-line bg-surface p-1 shadow-xl"
        >
          {OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              role="menuitemradio"
              aria-checked={lang === o.value}
              onClick={() => {
                setLang(o.value)
                setOpen(false)
              }}
              className={`block w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                lang === o.value ? 'bg-maroon-100 text-maroon-700' : 'text-ink-700 active:bg-maroon-100/60'
              }`}
            >
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label={lang === "en" ? "Change language" : lang === "zh-Hant" ? "更改語言" : "更改语言"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="flex h-6 items-center px-1 text-[12px] font-bold text-white opacity-80 transition-opacity duration-200 active:opacity-50"
      >
      </button>
    </div>
  )
}
