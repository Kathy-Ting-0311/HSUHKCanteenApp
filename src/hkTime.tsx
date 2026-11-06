import { useSyncExternalStore } from 'react'

const TZ = 'Asia/Hong_Kong'
const DAY = 86_400_000
const SIM_DAY_KEY = 'quickbite_sim_day'

let tick = Date.now()
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (!timer) {
    timer = setInterval(() => {
      tick = Date.now()
      listeners.forEach(l => l())
    }, 1000)
  }
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

export function useHKNow(): Date {
  return new Date(useSyncExternalStore(subscribe, () => tick))
}

function parts(d: Date) {
  const f = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', weekday: 'short', hourCycle: 'h23',
  }).formatToParts(d)
  const get = (t: string) => f.find(p => p.type === t)?.value ?? ''
  return {
    y: Number(get('year')), m: Number(get('month')), d: Number(get('day')),
    h: Number(get('hour')), min: Number(get('minute')),
    mon0: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function hkClock(d: Date = new Date(), style: 'status' | 'lock' | '24h' = 'status') {
  const p = parts(d)
  if (style === 'status') return `${p.h % 12 || 12}:${pad(p.min)}`
  return `${style === 'lock' ? p.h : pad(p.h)}:${pad(p.min)}`
}

export function hkGreeting(d: Date = new Date()) {
  const h = parts(d).h
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening'
}

export function liveDayIndex(d: Date = new Date()) {
  const i = parts(d).mon0
  return i === 6 ? 0 : i
}

function weekStartUTC(d: Date) {
  const p = parts(d)
  return Date.UTC(p.y, p.m - 1, p.d) - p.mon0 * DAY + (p.mon0 === 6 ? 7 * DAY : 0)
}

const utc = (ms: number, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...o }).format(new Date(ms))

export function dayDates(index: number, d: Date = new Date()) {
  const ms = weekStartUTC(d) + index * DAY
  return {
    short: utc(ms, { day: 'numeric', month: 'short' }),
    long: utc(ms, { day: 'numeric', month: 'long' }),
    wdShort: utc(ms, { weekday: 'short' }),
    wdLong: utc(ms, { weekday: 'long' }),
  }
}

export function weekRange(d: Date = new Date()) {
  const start = weekStartUTC(d)
  const a = utc(start, { day: 'numeric' })
  const b = utc(start + 5 * DAY, { day: 'numeric' })
  const m1 = utc(start, { month: 'short' })
  const m2 = utc(start + 5 * DAY, { month: 'short' })
  return m1 === m2 ? `${a}–${b} ${m1}` : `${a} ${m1} – ${b} ${m2}`
}

export function getSimDay(): number | null {
  try {
    const raw = localStorage.getItem(SIM_DAY_KEY)
    if (raw === null) return null
    const n = Number(raw)
    return Number.isInteger(n) && n >= 0 && n < 6 ? n : null
  } catch {
    return null
  }
}

export function saveSimDay(n: number | null) {
  try {
    if (n === null) localStorage.removeItem(SIM_DAY_KEY)
    else localStorage.setItem(SIM_DAY_KEY, String(n))
  } catch {
    /* ignore */
  }
}

export function todayIndex() {
  return getSimDay() ?? liveDayIndex()
}

export function todayText() {
  const dd = dayDates(todayIndex())
  return {
    ...dd,
    wdDate: `${dd.wdShort}, ${dd.short}`,
    wdLongDate: `${dd.wdLong} ${dd.short}`,
    full: `${dd.wdLong}, ${dd.long}`,
  }
}

export function HKClock({ style = 'status', className }: { style?: 'status' | 'lock'; className?: string }) {
  const now = useHKNow()
  return <span className={className}>{hkClock(now, style)}</span>
}
