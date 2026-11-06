import { useApp, TEXT_SIZES, THEMES } from '../context'
import type { TextSize, ThemeMode } from '../context'
import type { Lang } from '../Language/Translations'
import { StatusBar, TopBar } from '../components/ui'

const LANGUAGES: { value: Lang; name: string; sub: string }[] = [
  { value: 'en', name: 'English', sub: 'English' },
  { value: 'zh-Hant', name: '繁體中文', sub: 'Traditional Chinese' },
  { value: 'zh-Hans', name: '简体中文', sub: 'Simplified Chinese' },
]

const SIZE_META: Record<TextSize, { label: string; sample: number }> = {
  small: { label: 'Small', sample: 12 },
  default: { label: 'Default', sample: 15 },
  large: { label: 'Large', sample: 18 },
  xlarge: { label: 'Extra Large', sample: 22 },
}

const THEME_META: Record<ThemeMode, { label: string; desc: string }> = {
  light: { label: 'Light Mode', desc: 'Warm cream background' },
  dark: { label: 'Dark Mode', desc: 'Easier on the eyes at night' },
  contrast: { label: 'High Contrast Mode', desc: 'Black and white with bold outlines' },
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5L10 17.5L19 7" />
    </svg>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5">
      <div>
        <h2 className="font-serif text-[18px] font-semibold text-ink-900">{title}</h2>
        {hint && <p className="mt-0.5 text-[12px] leading-relaxed text-ink-700">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function Radio({ selected, children, onClick, label }: { selected: boolean; children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      className={`relative flex w-full min-h-[52px] items-center gap-3 rounded-[16px] border-2 p-3 text-left transition-colors ${
        selected ? 'border-maroon-700 bg-maroon-100' : 'border-line bg-surface active:bg-maroon-100'
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-maroon-700 bg-maroon-700 text-white' : 'border-ink-500 text-transparent'
        }`}
      >
        <Check />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {selected && <span className="rounded-full bg-maroon-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Selected</span>}
    </button>
  )
}

export function SettingsScreen() {
  const { goBack, lang, setLang, textSize, setTextSize, theme, setTheme } = useApp()

  return (
    <div className="flex h-full flex-col bg-paper">
      <StatusBar />
      <TopBar title="Accessibility & Language" onBack={goBack} />

      <div className="flex-1 min-h-0 space-y-6 overflow-y-auto px-4 pb-8 pt-2 scrollbar-hide">
        <Section title="Language" hint="Applies to menus, buttons, prices, pickup times, payments and order updates.">
          <div role="radiogroup" aria-label="Language" className="space-y-2">
            {LANGUAGES.map(l => (
              <Radio key={l.value} selected={lang === l.value} onClick={() => setLang(l.value)} label={`${l.name} (${l.sub})`}>
                <span className="block text-[15px] font-semibold text-ink-900">{l.name}</span>
                <span className="block text-[12px] text-ink-700">{l.sub}</span>
              </Radio>
            ))}
          </div>
        </Section>

        <Section title="Text Size" hint="Changes text everywhere in the app and is remembered next time.">
          <div role="radiogroup" aria-label="Text size" className="grid grid-cols-2 gap-2">
            {TEXT_SIZES.map(size => {
              const selected = textSize === size
              return (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTextSize(size)}
                  className={`flex min-h-[64px] flex-col items-center justify-center gap-0.5 rounded-[16px] border-2 px-2 py-2 transition-colors ${
                    selected ? 'border-maroon-700 bg-maroon-100' : 'border-line bg-surface active:bg-maroon-100'
                  }`}
                >
                  <span className="font-serif font-semibold text-ink-900" style={{ fontSize: SIZE_META[size].sample, lineHeight: 1.1 }}>Aa</span>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-ink-900">
                    {selected && <Check />}
                    {SIZE_META[size].label}
                  </span>
                </button>
              )
            })}
          </div>

        </Section>

        <Section title="Theme" hint="Pick the look that is easiest for you to read.">
          <div role="radiogroup" aria-label="Theme" className="space-y-2">
            {THEMES.map(mode => (
              <Radio key={mode} selected={theme === mode} onClick={() => setTheme(mode)} label={THEME_META[mode].label}>
                <span className="block text-[14px] font-semibold text-ink-900">{THEME_META[mode].label}</span>
                <span className="block text-[12px] leading-snug text-ink-700">{THEME_META[mode].desc}</span>
              </Radio>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
