import { HKClock, hkClock, todayText } from '../hkTime'
import Icon, { type IconName } from '../components/Icon'
import { useState } from 'react'
import { useApp } from '../context'
import { StatusBar, TopBar, Btn, SlotChip, StatusBanner } from '../components/ui'
import { TIME_SLOTS, NEW_SLOTS } from '../data'
import { QueueForecast } from '../components/QueueForecast'
import type { TimeSlot } from '../types'

export function PickupTimeScreen() {
  const { navigate, goBack, state, setSelectedSlot } = useApp()
  const [selected, setSelected] = useState<TimeSlot | null>(state.selectedSlot)

  function handleSelect(slot: TimeSlot) {
    setSelected(slot)
    setSelectedSlot(slot)
  }

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Pickup Time" onBack={goBack} />

      <div className="px-4 pt-2 pb-32">
        <div className="bg-maroon-100 rounded-[16px] p-4 mb-5">
          <p className="text-[12px] text-maroon-700 leading-relaxed">
            <strong>Lunch window:</strong> 11:30 AM – 2:00 PM. Slots marked Full (striped, with a ⊘ icon) have more than 20 orders queued and cannot be selected. Pick an open slot for faster pickup.
          </p>
        </div>

        <div className="mb-5">
          <QueueForecast selected={selected} onSelect={handleSelect} />
        </div>

        {/* Smart pickup button */}
        <button
          onClick={() => navigate('smart-pickup')}
          className="w-full mb-5 p-4 rounded-[16px] active:opacity-80"
          style={{ background: 'linear-gradient(135deg, #E8A23A 0%, #C98825 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><Icon name="bolt" size={20} /></div>
            <div className="text-left">
              <div className="text-white font-semibold text-[14px]">Smart Pickup Recommendation</div>
              <div className="text-white/70 text-[12px]">We'll find the quietest slot for you</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="ml-auto">
              <path d="M1 1l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">Or pick manually</div>

        {/* Slot grid */}
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map(slot => (
            <SlotChip
              key={slot.time}
              slot={slot}
              selected={selected?.time === slot.time}
              onSelect={() => handleSelect(slot)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-maroon-700" />
            <span className="text-[11px] text-ink-700">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm badge-stripes border border-dotted border-ink-500" />
            <span className="text-[11px] text-ink-700">Full (unavailable)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-surface border border-line" />
            <span className="text-[11px] text-ink-700">Available</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-paper" style={{ borderTop: '1px solid #EAE1D9' }}>
        <Btn
          variant="primary"
          disabled={!selected}
          onClick={() => navigate('checkout')}
        >
          {selected ? `Confirm ${selected.time} Pickup` : 'Select a Time Slot'}
        </Btn>
      </div>
    </div>
  )
}

export function SmartPickupScreen() {
  const { navigate, goBack, setSelectedSlot } = useApp()
  const recommended = TIME_SLOTS.find(s => s.recommended)!
  const [showFull, setShowFull] = useState(false)

  if (showFull) return <SmartPickupFullScreen onBack={() => setShowFull(false)} />

  function handleConfirm() {
    setSelectedSlot(recommended)
    navigate('checkout')
  }

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Smart Pickup" onBack={goBack} />

      <div className="px-4 pt-3 pb-32 space-y-4">
        {/* AI badge */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
            <Icon name="bolt" size={13} className="text-white" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500">AI-Recommended</span>
        </div>

        {/* Recommendation card */}
        <div
          className="rounded-[20px] p-5"
          style={{ background: 'linear-gradient(135deg, #123D27 0%, #236B45 100%)' }}
        >
          <p className="text-white/60 text-[12px] uppercase tracking-widest font-bold mb-1">Best pickup time</p>
          <p className="font-serif text-white text-[42px] font-semibold leading-none">13:00</p>
          <p className="text-white/70 text-[13px] mt-2">{`Today, ${todayText().wdLongDate}`}</p>

          <div className="mt-4 flex gap-3">
            <div className="bg-white/10 rounded-[12px] px-3 py-2 flex-1 text-center">
              <div className="font-serif text-white text-[22px] font-semibold">~6</div>
              <div className="text-white/60 text-[10px] uppercase tracking-wide">Orders ahead</div>
            </div>
            <div className="bg-white/10 rounded-[12px] px-3 py-2 flex-1 text-center">
              <div className="font-serif text-white text-[22px] font-semibold">~8</div>
              <div className="text-white/60 text-[10px] uppercase tracking-wide">Min wait</div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">Why 13:00?</div>
          {[
            { icon: 'trend', text: 'Queue drops by 78% after 12:45' },
            { icon: 'flame', text: 'Your dish is quick — ~6 min to prepare' },
            { icon: 'calendar', text: 'Most students have 12–1 pm lectures on Mondays' },
            { icon: 'clock', text: '38 minutes from now — fits between your 12:20 lecture' },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0">
              <Icon name={r.icon as IconName} size={16} className="mt-0.5 text-amber-500" />
              <span className="text-[12px] text-ink-700 leading-relaxed">{r.text}</span>
            </div>
          ))}
        </div>

        <QueueForecast />

        {/* Simulate slot full */}
        <button
          onClick={() => setShowFull(true)}
          className="w-full py-2 rounded-[10px] bg-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wide active:opacity-70"
        >
          Simulate Slot Full
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-paper" style={{ borderTop: '1px solid #EAE1D9' }}>
        <Btn variant="amber" onClick={handleConfirm}>
          Book 13:00 Pickup →
        </Btn>
        <button onClick={goBack} className="w-full text-center text-[13px] text-ink-500 mt-3 active:opacity-60">
          Pick a different time manually
        </button>
      </div>
    </div>
  )
}

function SmartPickupFullScreen({ onBack }: { onBack: () => void }) {
  const { navigate } = useApp()
  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Slot Unavailable" onBack={onBack} />

      <div className="px-4 pt-3 pb-32 space-y-4">
        <StatusBanner
          variant="error"
          title="13:00 slot just filled up"
          body="Someone else booked this slot while you were reviewing. Don't worry — we've found alternatives below."
        />

        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mt-2 mb-1">Next available times</div>

        <div className="grid grid-cols-2 gap-3">
          {NEW_SLOTS.map(slot => (
            <button
              key={slot.time}
              onClick={() => {
                navigate('new-slot-options')
              }}
              className="p-4 bg-surface rounded-[16px] text-left active:bg-maroon-100"
              style={{ border: '1.5px solid #EAE1D9' }}
            >
              <div className="font-serif text-[24px] font-semibold text-ink-900">{slot.time}</div>
              <div className="text-[11px] text-ink-500 mt-1">{`~${slot.queueLength} ahead`}</div>
              <div className="text-[11px] text-green-600 font-semibold mt-0.5">Available →</div>
            </button>
          ))}
        </div>

        <div className="bg-amber-100 rounded-[14px] px-4 py-3">
          <p className="text-[12px] text-ink-700">
            <strong className="text-amber-500">Tip:</strong> 13:15 has only 3 orders ahead — nearly as good as 13:00.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-paper" style={{ borderTop: '1px solid #EAE1D9' }}>
        <Btn variant="primary" onClick={() => navigate('new-slot-options')}>
          See All Available Slots
        </Btn>
      </div>
    </div>
  )
}

export function NewSlotOptionsScreen() {
  const { navigate, goBack, setSelectedSlot } = useApp()
  const [selected, setSelected] = useState<TimeSlot | null>(null)

  function handleConfirm() {
    if (selected) {
      setSelectedSlot(selected)
      navigate('checkout')
    }
  }

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="New Slot Options" onBack={goBack} subtitle="13:00 is full — pick an alternative" />

      <div className="px-4 pt-3 pb-32 space-y-3">
        {NEW_SLOTS.map(slot => (
          <button
            key={slot.time}
            onClick={() => setSelected(slot)}
            className={`w-full flex items-center justify-between p-4 rounded-[16px] transition-all active:opacity-80
              ${selected?.time === slot.time ? 'bg-maroon-100 border-2 border-maroon-700' : 'bg-surface border-2 border-line'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${selected?.time === slot.time ? 'border-maroon-700 bg-maroon-700' : 'border-line'}`}>
                {selected?.time === slot.time && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="text-left">
                <div className="font-serif text-[22px] font-semibold text-ink-900">{slot.time}</div>
                <div className="text-[11px] text-ink-500">{`Today, ${todayText().wdDate}`}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-ink-700">{`${slot.queueLength} ahead`}</div>
              <div className="text-[11px] text-green-600 font-semibold mt-0.5">{`~${slot.queueLength * 2 + 5} min wait`}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-paper" style={{ borderTop: '1px solid #EAE1D9' }}>
        <Btn variant="primary" disabled={!selected} onClick={handleConfirm}>
          {selected ? `Confirm ${selected.time} Pickup` : 'Select a Time Slot'}
        </Btn>
      </div>
    </div>
  )
}
