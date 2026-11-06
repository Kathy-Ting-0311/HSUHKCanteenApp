import { TIME_SLOTS } from '../data'
import type { TimeSlot } from '../types'

const MAX = 35
const CHART_H = 48

export function waitMinutes(slot: TimeSlot) {
  return Math.round(slot.queueLength * 1.3)
}

export function QueueForecast({ selected, onSelect, heading, note }: {
  heading?: string
  note?: string
  selected?: TimeSlot | null
  onSelect?: (slot: TimeSlot) => void
}) {
  const focus = selected ?? TIME_SLOTS.find(s => s.recommended) ?? null

  return (
    <div className="bg-surface rounded-[14px] p-2.5" style={{ border: '1px solid #EAE1D9' }}>
      {heading && <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">{heading}</div>}
      {note && <p className="mb-3 text-[12px] leading-relaxed text-ink-500">{note}</p>}
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500">Queue forecast today</div>
        <div className="shrink-0 whitespace-nowrap text-[10px] text-ink-500">Orders queued</div>
      </div>

      <div className="flex items-end gap-1" style={{ height: CHART_H + 14 }}>
        {TIME_SLOTS.map(slot => {
          const isSel = selected?.time === slot.time
          const color = isSel ? '#236B45' : slot.recommended ? '#E8A23A' : slot.busy ? '#C0392B66' : '#D9CBBF'
          const interactive = !!onSelect && !slot.busy
          return (
            <button
              key={slot.time}
              type="button"
              disabled={!interactive}
              aria-label={`${slot.time}, ${slot.queueLength} orders queued${slot.busy ? ', busy' : ''}`}
              aria-pressed={isSel}
              onClick={() => onSelect?.(slot)}
              className={`flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1 ${interactive ? 'active:opacity-70' : ''}`}
            >
              <span className={`text-[9px] font-semibold ${isSel ? 'text-maroon-700' : 'text-ink-500'}`}>{slot.queueLength}</span>
              <div
                className="w-full rounded-t-[4px] transition-all"
                style={{ height: Math.max(4, Math.round((slot.queueLength / MAX) * CHART_H)), background: color }}
              />
            </button>
          )
        })}
      </div>
      <div className="mt-1 flex gap-1">
        {TIME_SLOTS.map(slot => (
          <span key={slot.time} className={`min-w-0 flex-1 whitespace-nowrap text-center text-[8px] tracking-tight tabular-nums ${selected?.time === slot.time ? 'font-bold text-maroon-700' : 'text-ink-500'}`}>
            {selected?.time === slot.time || slot.time.endsWith(':00') || slot.time.endsWith(':30') ? slot.time : ''}
          </span>
        ))}
      </div>

      {focus && (
        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-paper px-2.5 py-1.5">
          <span className="shrink-0 whitespace-nowrap text-[12px] font-semibold tabular-nums text-ink-900">{focus.time}</span>
          <span className="min-w-0 flex-1 text-[11px] leading-snug text-ink-700">
            {`~${focus.queueLength} ahead · ~${waitMinutes(focus)} min wait`}
          </span>
          <span className={`shrink-0 whitespace-nowrap text-[11px] font-bold ${focus.busy ? 'text-red-600' : 'text-green-600'}`}>
            {focus.busy ? 'Busy' : focus.queueLength > 10 ? 'Moderate' : 'Quiet'}
          </span>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5"><div className="h-2 w-3 rounded-sm bg-amber-500" /><span className="text-[10px] text-ink-500">Recommended</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-3 rounded-sm bg-red-600/40" /><span className="text-[10px] text-ink-500">Peak</span></div>
        {onSelect && <div className="flex items-center gap-1.5"><div className="h-2 w-3 rounded-sm bg-maroon-700" /><span className="text-[10px] text-ink-500">Selected</span></div>}
      </div>
    </div>
  )
}
