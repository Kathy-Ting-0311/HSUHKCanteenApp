import { HKClock } from '../hkTime'
import { useApp } from '../context'
import React from 'react'
import type { FoodItem, TimeSlot } from '../types'
import { LanguageToggle } from './Languagetoggle'
import { LocalizedContent } from '../Language/i18n'

// ─── Phone frame ──────────────────────────────────────────────────────────────

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { textSize, theme } = useApp()
  return (
    <div className="flex items-center justify-center min-h-dvh p-4">
      <div
        className="relative bg-paper overflow-hidden shadow-2xl"
        style={{
          width: 375,
          height: 812,
          borderRadius: 44,
          boxShadow: '0 40px 80px #00000060, 0 0 0 1px #ffffff18 inset, 0 0 0 10px #0B1A11, 0 0 0 12px #14281C',
          flexShrink: 0,
        }}
      >
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[160px] w-[3px] h-[36px] bg-maroon-900 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[208px] w-[3px] h-[64px] bg-maroon-900 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[284px] w-[3px] h-[64px] bg-maroon-900 rounded-l-sm" />
        <div className="absolute -right-[3px] top-[220px] w-[3px] h-[80px] bg-maroon-900 rounded-r-sm" />

        {/* Notch / dynamic island */}
        <div
          className="absolute top-[14px] left-1/2 -translate-x-1/2 bg-black z-50"
          style={{ width: 120, height: 34, borderRadius: 17 }}
        />

        {/* Screen content */}
        <div data-theme={theme} data-text={textSize} className="glass-stage absolute inset-0 overflow-hidden rounded-[44px]">
          <LocalizedContent>{children}</LocalizedContent>
        </div>

        <div className="absolute right-4 top-[76px] z-[70]">
          <LanguageToggle />
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-[8px] left-1/2 -translate-x-1/2 bg-ink-900 opacity-30 z-50"
          style={{ width: 134, height: 5, borderRadius: 3 }}
        />
      </div>
    </div>
  )
}

// ─── Status bar ───────────────────────────────────────────────────────────────

export function StatusBar({ light = false }: { light?: boolean }) {
  const cls = light ? 'text-white' : 'text-ink-900'
  return (
    <div className={`flex items-center justify-between px-6 pt-[54px] pb-2 ${cls}`} style={{ fontSize: 12, fontWeight: 600 }}>
      <HKClock />
      <div className="flex items-center gap-1.5">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="4" width="3" height="6" rx="0.5" opacity="0.4" />
          <rect x="4.5" y="2.5" width="3" height="7.5" rx="0.5" opacity="0.6" />
          <rect x="9" y="1" width="3" height="9" rx="0.5" opacity="0.8" />
          <rect x="13.5" y="0" width="2.5" height="10" rx="0.5" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 2.8C9.8 2.8 11.9 3.7 13.4 5.2L14.8 3.8C12.9 1.9 10.3 0.8 7.5 0.8C4.7 0.8 2.1 1.9 0.2 3.8L1.6 5.2C3.1 3.7 5.2 2.8 7.5 2.8Z" />
          <path d="M7.5 5.8C8.9 5.8 10.2 6.4 11.1 7.3L12.5 5.9C11.2 4.6 9.4 3.8 7.5 3.8C5.6 3.8 3.8 4.6 2.5 5.9L3.9 7.3C4.8 6.4 6.1 5.8 7.5 5.8Z" />
          <circle cx="7.5" cy="9.5" r="1.5" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="17" height="8" rx="2" />
          <path d="M23 4.5V7.5C23.8 7.2 24.5 6.4 24.5 6C24.5 5.6 23.8 4.8 23 4.5Z" />
        </svg>
      </div>
    </div>
  )
}

// ─── Top nav bar ──────────────────────────────────────────────────────────────

interface TopBarProps {
  title: string
  subtitle?: string
  onBack?: () => void
  light?: boolean
  right?: React.ReactNode
}

export function TopBar({ title, subtitle, onBack, light = false, right }: TopBarProps) {
  const fg = light ? 'text-white' : 'text-ink-900'
  const sub = light ? 'text-white/70' : 'text-ink-500'
  return (
    <div className={`flex items-center px-4 py-3 ${fg}`}>
      {onBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full mr-1 active:opacity-60"
          style={{ background: light ? 'rgba(255,255,255,0.15)' : 'color-mix(in srgb, var(--color-ink-900) 10%, transparent)' }}
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5L9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div className="flex-1 text-center">
        <div className="text-[17px] font-semibold leading-tight">{title}</div>
        {subtitle && <div className={`text-[11px] ${sub}`}>{subtitle}</div>}
      </div>
      {right ? (
        <div className="w-9 h-9 flex items-center justify-center">{right}</div>
      ) : (
        <div className="w-9" />
      )}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'outline' | 'ghost' | 'amber' | 'green' | 'red'

interface BtnProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: BtnVariant
  disabled?: boolean
  className?: string
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

const btnStyles: Record<BtnVariant, string> = {
  primary: 'bg-maroon-700 text-white active:bg-maroon-900',
  outline: 'border-2 border-maroon-700 text-maroon-700 bg-transparent active:bg-maroon-100',
  ghost: 'text-maroon-700 bg-transparent active:bg-maroon-100',
  amber: 'bg-amber-500 text-white active:opacity-80',
  green: 'bg-green-600 text-white active:opacity-80',
  red: 'bg-red-600 text-white active:opacity-80',
}

export function Btn({ children, onClick, variant = 'primary', disabled, className = '', fullWidth = true, type = 'button' }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 min-h-[48px] py-[13px] px-6
        text-[14.5px] text-center font-semibold rounded-[14px]
        transition-opacity duration-100
        disabled:cursor-not-allowed disabled:border-2 disabled:border-dashed disabled:border-ink-500 disabled:bg-line disabled:text-ink-700
        ${fullWidth ? 'w-full' : ''}
        ${btnStyles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

// ─── Tag / chip ───────────────────────────────────────────────────────────────

const tagStyles: Record<string, { bg: string; text: string }> = {
  Veg: { bg: 'bg-green-100', text: 'text-green-600' },
  Spicy: { bg: 'bg-red-100', text: 'text-red-600' },
  Popular: { bg: 'bg-amber-100', text: 'text-amber-500' },
  'Sold out': { bg: 'bg-line', text: 'text-ink-500' },
  'View only': { bg: 'bg-amber-100', text: 'text-amber-500' },
}

export function Tag({ label }: { label: string }) {
  const s = tagStyles[label] || { bg: 'bg-maroon-100', text: 'text-maroon-700' }
  return (
    <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {label}
    </span>
  )
}

// ─── Food card ────────────────────────────────────────────────────────────────

interface FoodCardProps {
  item: FoodItem
  onPress: () => void
  disabled?: boolean
}

export function FoodCard({ item, onPress, disabled = false }: FoodCardProps) {
  const unavailable = item.soldOut || disabled
  const showSoldOut = item.soldOut && !disabled

  const nutrition = [
    { label: 'kcal', value: item.calories },
    { label: 'Carbs', value: `${item.nutrition.carbs}g` },
    { label: 'Protein', value: `${item.nutrition.protein}g` },
    { label: 'Fat', value: `${item.nutrition.fat}g` },
  ]

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={unavailable}
      onClick={!disabled ? onPress : undefined}
      onKeyDown={e => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onPress()
        }
      }}
      className={`relative w-full overflow-hidden p-3 bg-surface rounded-[20px] text-left transition-opacity ${
        showSoldOut
          ? 'cursor-not-allowed opacity-50 grayscale !border-2 !border-dashed !border-ink-500'
          : unavailable
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer active:opacity-80'
      }`}
      style={{ border: '1px solid #EAE1D9' }}
    >
      <FoodImg
        src={item.image}
        alt={item.name}
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-[38%] object-cover"
      />
      <div className="relative ml-[calc(38%+16px)] min-w-0 flex flex-col py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-ink-900 leading-snug">{item.name}</div>
            <div className={`font-serif text-[15px] font-semibold ${showSoldOut ? 'text-ink-500 line-through' : 'text-maroon-700'}`}>HK${item.price}</div>
          </div>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-ink-500 line-clamp-2">{item.desc}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {item.tags.map(t => <Tag key={t} label={t} />)}
          {showSoldOut && <Tag label="Sold out" />}
          {disabled && <Tag label="View only" />}
        </div>

        <div className="mt-2">
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink-500 mb-1">Nutrition per serving</div>
          <div className="grid grid-cols-4 gap-1">
            {nutrition.map(n => (
              <div key={n.label} className="rounded-[8px] bg-white/50 px-1 py-1 text-center">
                <div className="font-serif text-[11px] font-semibold leading-none text-maroon-700">{n.value}</div>
                <div className="mt-0.5 text-[8px] text-ink-500">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Status banner ────────────────────────────────────────────────────────────

type BannerVariant = 'error' | 'warning' | 'success' | 'info'

const bannerStyles: Record<BannerVariant, { bg: string; title: string; border: string; label: string; icon: React.ReactNode }> = {
  error: {
    bg: 'bg-red-100', title: 'text-red-600', border: 'border-l-[6px] border-double border-red-600', label: 'Error',
    icon: <path d="M7 7L17 17M17 7L7 17" strokeWidth="2.6" />,
  },
  warning: {
    bg: 'bg-amber-100', title: 'text-amber-500', border: 'border-l-[6px] border-dashed border-amber-500', label: 'Warning',
    icon: <path d="M12 7V13M12 16.5V17" strokeWidth="2.6" />,
  },
  success: {
    bg: 'bg-green-100', title: 'text-green-600', border: 'border-l-[6px] border-solid border-green-600', label: 'Success',
    icon: <path d="M6.5 12.5L10.5 16.5L17.5 8" strokeWidth="2.6" />,
  },
  info: {
    bg: 'bg-maroon-100', title: 'text-maroon-700', border: 'border-l-[6px] border-dotted border-maroon-700', label: 'Info',
    icon: <path d="M12 11V17M12 7.5V8" strokeWidth="2.6" />,
  },
}

export function StatusBanner({ variant, title, body }: { variant: BannerVariant; title: string; body?: string }) {
  const s = bannerStyles[variant]
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={`${s.bg} ${s.border} rounded-[16px] p-4 flex gap-3`}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`mt-0.5 flex-shrink-0 ${s.title}`}>
        {variant === 'warning' ? <path d="M12 3L22 20H2L12 3Z" strokeWidth="1.8" /> : variant === 'error' ? <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.8" /> : <circle cx="12" cy="12" r="9.5" strokeWidth="1.8" />}
        {variant === 'warning' ? <path d="M12 10V14.5M12 17.5V17.6" strokeWidth="2.4" /> : s.icon}
      </svg>
      <div className="min-w-0">
        <div className={`text-[13px] font-semibold ${s.title}`}><span className="sr-only">{s.label}: </span>{title}</div>
        {body && <div className="text-[12px] text-ink-700 mt-0.5 leading-relaxed">{body}</div>}
      </div>
    </div>
  )
}

// ─── Status badge (icon + label + shape/pattern, never colour alone) ──────────

export type BadgeKind = 'success' | 'warning' | 'error' | 'unavailable' | 'completed'

const badgeStyles: Record<BadgeKind, { cls: string; label: string; shape: React.ReactNode }> = {
  success: { cls: 'bg-green-100 text-green-600 border-2 border-solid border-green-600', label: 'Available', shape: <><circle cx="12" cy="12" r="9" /><path d="M7.5 12.5L10.5 15.5L16.5 9" /></> },
  warning: { cls: 'bg-amber-100 text-ink-900 border-2 border-dashed border-amber-500', label: 'Busy', shape: <><path d="M12 3L22 20H2L12 3Z" /><path d="M12 10V14M12 17V17.1" /></> },
  error: { cls: 'bg-red-100 text-red-600 border-2 border-double border-red-600', label: 'Failed', shape: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 8L16 16M16 8L8 16" /></> },
  unavailable: { cls: 'badge-stripes text-ink-700 border-2 border-dotted border-ink-500', label: 'Full', shape: <><circle cx="12" cy="12" r="9" /><path d="M5.6 18.4L18.4 5.6" /></> },
  completed: { cls: 'bg-maroon-700 text-white border-2 border-solid border-maroon-700', label: 'Completed', shape: <><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M7.5 12.5L10.5 15.5L16.5 9" /></> },
}

export function StatusBadge({ kind, label }: { kind: BadgeKind; label?: string }) {
  const b = badgeStyles[kind]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-tight ${b.cls}`}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">{b.shape}</svg>
      <span>{label ?? b.label}</span>
    </span>
  )
}

// ─── Time slot chip ───────────────────────────────────────────────────────────

interface SlotChipProps {
  slot: TimeSlot
  selected: boolean
  onSelect: () => void
}

export function SlotChip({ slot, selected, onSelect }: SlotChipProps) {
  const busy = slot.busy
  return (
    <button
      type="button"
      onClick={!busy ? onSelect : undefined}
      disabled={busy}
      aria-pressed={selected}
      aria-label={busy ? `${slot.label}, Full, unavailable` : `${slot.label}${selected ? ', selected' : ''}${slot.recommended ? ', recommended' : ''}`}
      className={`
        relative flex h-8 items-center justify-center rounded-[10px] px-1
        transition-all duration-150
        ${busy ? 'badge-stripes border-2 border-dotted border-ink-500 cursor-not-allowed' : selected ? 'bg-maroon-700 border-2 border-maroon-700' : slot.recommended ? 'bg-surface border-2 border-amber-500 active:bg-maroon-100' : 'bg-surface border-2 border-line active:bg-maroon-100'}
      `}
    >
      <span className={`text-[12px] font-semibold tabular-nums ${selected && !busy ? 'text-white' : busy ? 'text-ink-700 line-through' : 'text-ink-900'}`}>
        {slot.label}
      </span>
      {selected && !busy && (
        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="absolute right-1 top-0.5"><path d="M5 12.5L10 17.5L19 7" /></svg>
      )}
    </button>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500 px-4 mb-2 mt-5">
      {children}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="h-px bg-line mx-4" />
}

// ─── Order stepper ────────────────────────────────────────────────────────────

export const ORDER_STEPS = ['Order Received', 'Preparing', 'Ready for Pickup', 'Collected']
const STEP_TIMES = ['12:14', '12:18', '12:48', '12:55']
const STEP_DESCS = [
  'Your order has been received by the kitchen.',
  'Chef started cooking your meal.',
  'Your order is ready! Proceed to Stall 3.',
  'You have collected your meal. Enjoy!',
]

function StepIcon({ index, size = 18 }: { index: number; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (index === 0) return <svg {...common}><path d="M6 3.5H18V20.5L15 18.5L12 20.5L9 18.5L6 20.5V3.5Z" /><path d="M9 8H15M9 12H15" /></svg>
  if (index === 1) return <svg {...common}><path d="M4 11H20V13C20 16.9 16.9 20 13 20H11C7.1 20 4 16.9 4 13V11Z" /><path d="M9 3.5C8 5 10 6 9 7.5M13 3.5C12 5 14 6 13 7.5" /></svg>
  if (index === 2) return <svg {...common}><path d="M5 8H19L18 20H6L5 8Z" /><path d="M9 11V6.5C9 4.8 10.3 3.5 12 3.5C13.7 3.5 15 4.8 15 6.5V11" /></svg>
  return <svg {...common}><path d="M3.5 12.5L8 17L14.5 9.5" /><path d="M13 16.5L14 17.5L20.5 9.5" /></svg>
}

export function OrderStatusCard({ currentStep }: { currentStep: number }) {
  const step = Math.min(currentStep, ORDER_STEPS.length - 1)
  const finished = step === ORDER_STEPS.length - 1
  return (
    <section aria-label="Current order status" className="rounded-[20px] border-4 border-maroon-700 bg-surface p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center ${finished ? 'rounded-[14px]' : 'rounded-full'} bg-maroon-700 text-white`}>
          <StepIcon index={step} size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500">Current status</p>
          <p className="font-serif text-[24px] font-semibold leading-tight text-ink-900">{ORDER_STEPS[step]}</p>
        </div>
      </div>
      <div className="mt-4" role="progressbar" aria-valuemin={1} aria-valuemax={ORDER_STEPS.length} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of ${ORDER_STEPS.length}: ${ORDER_STEPS[step]}`}>
        <div className="flex gap-1.5">
          {ORDER_STEPS.map((_, i) => (
            <div key={i} className={`h-3 flex-1 rounded-full border-2 border-maroon-700 ${i < step ? 'bg-maroon-700' : i === step ? 'badge-stripes-strong' : 'bg-transparent'}`} />
          ))}
        </div>
        <p className="mt-2 text-[12px] font-semibold text-ink-700">{`Step ${step + 1} of ${ORDER_STEPS.length}`}</p>
      </div>
    </section>
  )
}

export function OrderStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="px-4">
      {ORDER_STEPS.map((step, i) => {
        const done = i < currentStep
        const active = i === currentStep
        const future = i > currentStep
        return (
          <li key={i} className="flex gap-4" aria-current={active ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <div className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                ${done ? 'border-maroon-700 bg-maroon-700 text-white' : active ? 'border-maroon-700 bg-surface text-maroon-700 ring-4 ring-maroon-700/25' : 'border-dashed border-ink-500 bg-transparent text-ink-500'}`}>
                <StepIcon index={i} />
                {done && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-surface text-maroon-700 ring-2 ring-maroon-700">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5L10 17.5L19 7" /></svg>
                  </span>
                )}
              </div>
              {i < ORDER_STEPS.length - 1 && (
                <div className={`my-1 min-h-[28px] w-0 flex-1 border-l-[3px] ${done ? 'border-solid border-maroon-700' : 'border-dashed border-ink-500'}`} />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`${active ? 'text-[16px] font-bold text-ink-900' : 'text-[14px] font-semibold'} ${future ? 'text-ink-500' : 'text-ink-900'}`}>
                  {step}
                </span>
                {active && (
                  <span className="rounded-full bg-maroon-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Now</span>
                )}
                {done && <span className="text-[11px] font-semibold text-ink-700">Done</span>}
                {future && <span className="text-[11px] font-semibold text-ink-500">Upcoming</span>}
                {!future && <span className="text-[11px] text-ink-500">{STEP_TIMES[i]}</span>}
              </div>
              {!future && (
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-700">{STEP_DESCS[i]}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ─── Payment method row ───────────────────────────────────────────────────────

interface PayRowProps {
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  label: string
  sublabel: string
}

export function PayRow({ selected, onSelect, icon, label, sublabel }: PayRowProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-4 rounded-[16px] text-left transition-all
        ${selected ? 'bg-maroon-100 border-2 border-maroon-700' : 'bg-surface border-2 border-line'}`}
    >
      <div className="w-10 h-10 rounded-[10px] bg-amber-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold text-ink-900">{label}</div>
        <div className="text-[11px] text-ink-500">{sublabel}</div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
        ${selected ? 'border-maroon-700 bg-maroon-700' : 'border-line'}`}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  )
}

// ─── QR Code (SVG mock) ───────────────────────────────────────────────────────

export function QRCode({ size = 200 }: { size?: number }) {
  const pattern = [
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,1,0],
    [0,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,0,0,1,1,1,0,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1],
  ]
  const cell = size / 21
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, r) =>
        row.map((v, c) =>
          v ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#231C1B" /> : null
        )
      )}
    </svg>
  )
}

// ─── Food image with fallback ─────────────────────────────────────────────────

const FOOD_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='#F7E8ED'/><text x='100' y='122' font-size='84' text-anchor='middle'>🍱</text></svg>"
  )

export function FoodImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      loading="lazy"
      {...props}
      onError={e => {
        const el = e.currentTarget
        if (el.src !== FOOD_FALLBACK) el.src = FOOD_FALLBACK
      }}
    />
  )
}


// ─── Sold-out reminder ────────────────────────────────────────────────────────

export function SoldOutDialog({ item, onClose }: { item: FoodItem | null; onClose: () => void }) {
  if (!item) return null
  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/45 px-8" onClick={onClose}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sold-out-title"
        onClick={e => e.stopPropagation()}
        className="w-full rounded-[24px] bg-white p-5 shadow-2xl"
        style={{ animation: 'lang-pop 180ms ease-out' }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B4300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" />
          </svg>
          <h2 id="sold-out-title" className="text-[16px] font-bold text-ink-900">Sold out</h2>
          <p className="text-[13px] font-semibold text-ink-900">{item.name}</p>
          <p className="text-[13px] leading-relaxed text-ink-700">Sorry, this dish is sold out and cannot be ordered right now. Please choose another dish.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-[44px] w-full rounded-full bg-maroon-700 text-[13px] font-bold text-white active:opacity-70"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
