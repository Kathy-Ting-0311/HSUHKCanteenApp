import { useApp } from '../context'
import type { Screen } from '../types'

const TABS: { screen: Screen; labelKey: 'home' | 'order' | 'orders' | 'profile' }[] = [
  { screen: 'home', labelKey: 'home' },
  { screen: 'menu', labelKey: 'order' },
  { screen: 'order-history', labelKey: 'orders' },
  { screen: 'profile', labelKey: 'profile' },
]

const PROFILE_SCREENS: Screen[] = [
  'profile',
  'edit-profile',
  'favorites',
  'account',
  'help',
  'settings',
]

function TabIcon({ screen }: { screen: Screen }) {
  if (screen === 'home') {
    return (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
        <path d="M3.5 10.5L12 3.5L20.5 10.5V20H14.8V14H9.2V20H3.5V10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }

  if (screen === 'menu') {
    return (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
        <path d="M4 11.5H20M5.5 11.5C5.8 7.8 8.5 5.2 12 5.2C15.5 5.2 18.2 7.8 18.5 11.5M12 5.2V3.5M3 15.5H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 15.5H19L18 20H6L5 15.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }

  if (screen === 'order-history') {
    return (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
        <path d="M5 5.5H19V20H5V5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8.5 3.5V7.5M15.5 3.5V7.5M8.5 11H15.5M8.5 15H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20C5.5 15.8 8.1 13.5 12 13.5C15.9 13.5 18.5 15.8 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function BottomNav({ className = 'flex-shrink-0' }: { className?: string }) {
  const { state, resetTo, t, cartCount } = useApp()
  const current = state.history[state.history.length - 1]
  const activeIndex = PROFILE_SCREENS.includes(current)
    ? 3
    : Math.max(0, TABS.findIndex(tab => tab.screen === current))

  return (
    <nav
      aria-label="Main"
      className={`flex justify-center bg-transparent pb-3 pt-1.5 ${className}`}
    >
      <div className="relative grid w-[200px] grid-cols-4 rounded-full border border-line bg-surface p-1 shadow-lg">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-1 w-[calc(25%-2px)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          <span className="block h-full rounded-full bg-maroon-100 ring-1 ring-maroon-700/10" />
        </span>

        {TABS.map((tab, i) => {
          const active = i === activeIndex
          return (
            <button
              key={tab.screen}
              type="button"
              aria-label={t(tab.labelKey)}
              aria-current={active ? 'page' : undefined}
              onClick={() => !active && resetTo(tab.screen)}
              className={`group relative z-10 flex h-9 items-center justify-center rounded-full transition-colors ${
                active ? 'text-maroon-700' : 'text-ink-500'
              }`}
            >
              <span
                className={`relative transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-75 ${
                  active ? 'scale-110' : 'scale-100'
                }`}
              >
                <TabIcon screen={tab.screen} />
                {tab.screen === 'menu' && cartCount > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon-700 px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
