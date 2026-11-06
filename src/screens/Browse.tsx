import { useState } from 'react'
import Icon from '../components/Icon'
import { useApp } from '../context'
import { StatusBar, TopBar, Btn, FoodCard, FoodImg, Tag, StatusBanner, SlotChip, SoldOutDialog } from '../components/ui'
import { FOOD_ITEMS, TIME_SLOTS } from '../data'
import { QueueForecast } from '../components/QueueForecast'
import { HKClock, dayDates, liveDayIndex, useHKNow } from '../hkTime'
import { BottomNav } from '../components/BottomNav'
import { CartBar, CartChip, CartSheet, FeeRows, LineBreakdown, consumeCartOpenRequest, requestCartOpen } from '../components/MiniCart'
import type { CartOption, FoodItem, OrderMode } from '../types'

export const WEEK_DAYS = [
  { short: 'Mon', label: 'Monday', itemIds: ['1', '2', '3', '5'] },
  { short: 'Tue', label: 'Tuesday', itemIds: ['2', '4', '5', '6'] },
  { short: 'Wed', label: 'Wednesday', itemIds: ['1', '3', '4', '5'] },
  { short: 'Thu', label: 'Thursday', itemIds: ['1', '2', '5', '6'] },
  { short: 'Fri', label: 'Friday', itemIds: ['2', '3', '4', '6'] },
  { short: 'Sat', label: 'Saturday', itemIds: ['1', '3', '5', '6'] },
]

const REMARK_OPTIONS = [
  'Less salt',
  'No spring onion',
  'No chilli sauce',
  'Sauce on the side',
]

const SET_PRICE = 15

type Temp = 'hot' | 'iced'

const SET_DRINKS: { name: string; nameCn: string; hot: boolean; icedPrice: number }[] = [
  { name: 'Coca-Cola', nameCn: '可樂', hot: false, icedPrice: 3 },
  { name: 'Lemon water', nameCn: '檸檬水', hot: true, icedPrice: 3 },
  { name: 'Lemon tea', nameCn: '檸檬茶', hot: true, icedPrice: 4 },
  { name: 'Green tea', nameCn: '綠茶', hot: true, icedPrice: 2 },
]

const SET_SOUPS = ['Daily soup of the day', 'Winter melon soup', 'Egg drop soup']
const SET_SIDES = ['Blanched kai-lan', 'Braised tofu', 'Marinated cucumber']


export function MenuScreen() {
  const { navigate, setSelectedFood, cartCount } = useApp()
  const [query, setQuery] = useState('')
  const now = useHKNow()
  const todayIndex = liveDayIndex(now)
  const [selectedDay, setSelectedDay] = useState(() => liveDayIndex())
  const [cartOpen, setCartOpen] = useState(consumeCartOpenRequest)
  const [notice, setNotice] = useState(false)
  const [soldOutItem, setSoldOutItem] = useState<FoodItem | null>(null)

  const day = WEEK_DAYS[selectedDay]
  const canOrder = selectedDay === todayIndex
  const filtered = FOOD_ITEMS.filter(f => day.itemIds.includes(f.id))
    .filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.nameCn.includes(query)
    )

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-4">
        <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2 mb-1">
          <button
            type="button"
            aria-label="Back to Home"
            onClick={() => navigate('home')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-maroon-700 active:opacity-70"
          >
            <svg width="12" height="20" viewBox="0 0 10 17" fill="none" aria-hidden="true">
              <path d="M9 1L1 8.5L9 16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="font-serif text-[26px] font-semibold leading-tight text-ink-900">Weekly Menu</h1>
            <p className="text-[13px] text-ink-500">{`${day.label}, ${dayDates(selectedDay, now).short}`}</p>
          </div>
          <button
            type="button"
            aria-label="Your Cart"
            onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full active:opacity-70"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 2.5H4.5L6.5 13.5H15.5L17.5 6.5H5.5" stroke="#236B45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8" cy="16.5" r="1.5" fill="#236B45" />
              <circle cx="14" cy="16.5" r="1.5" fill="#236B45" />
            </svg>
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-maroon-700 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{cartCount}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-1">
        <div className="bg-surface rounded-[14px] flex items-center gap-2 px-3 py-2.5" style={{ border: '1px solid #EAE1D9' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#8A7D78" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="#8A7D78" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search dishes..."
            className="flex-1 bg-transparent text-[13px] text-ink-900 outline-none placeholder-ink-500"
          />
        </div>
      </div>

      {/* Week selector — Sunday is omitted because the canteen is closed */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-6 gap-1">
          {WEEK_DAYS.map((weekDay, index) => {
            const selected = index === selectedDay
            return (
              <button
                key={weekDay.short}
                type="button"
                aria-label={weekDay.label}
                aria-pressed={selected}
                onClick={() => {
                  setSelectedDay(index)
                  setNotice(index !== todayIndex)
                }}
                className={`border-b-2 py-2 text-[12px] font-bold transition-colors ${
                  selected
                    ? 'border-maroon-700 text-maroon-700'
                    : 'border-transparent text-ink-500 active:text-maroon-700'
                }`}
              >
                {weekDay.short}
                {index === todayIndex && (
                  <span className={`mx-auto mt-0.5 block h-1 w-1 rounded-full ${selected ? 'bg-amber-500' : 'bg-maroon-700'}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Food list */}
      <div className="px-4 space-y-3 pb-44 -mt-2">
        {filtered.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            disabled={!canOrder}
            onPress={() => {
              if (!canOrder) setNotice(true)
              else if (item.soldOut) setSoldOutItem(item)
              else {
                setSelectedFood(item)
                navigate('food-detail')
              }
            }}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-ink-500 text-[14px]">No dishes found</div>
        )}
      </div>
      {cartCount === 0 && <BottomNav className="absolute inset-x-0 bottom-0 z-40" />}
      <CartBar onOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
      <SoldOutDialog item={soldOutItem} onClose={() => setSoldOutItem(null)} />
      {notice && !canOrder && (
        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/45 px-8" onClick={() => setNotice(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="order-notice-title"
            onClick={e => e.stopPropagation()}
            className="w-full rounded-[24px] bg-white p-5 shadow-2xl"
            style={{ animation: 'lang-pop 180ms ease-out' }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B4300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3L2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" />
              </svg>
              <div className="min-w-0 flex-1">
                <h2 id="order-notice-title" className="text-[16px] font-bold text-ink-900">Ordering unavailable</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-700">Ordering is only available for today's menu.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNotice(false)}
                className="min-h-[44px] rounded-full border-2 border-maroon-700 text-[13px] font-bold text-maroon-700 active:opacity-70"
              >
                Got it
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDay(todayIndex)
                  setNotice(false)
                }}
                className="min-h-[44px] rounded-full bg-maroon-700 text-[13px] font-bold text-white active:opacity-70"
              >
                Switch to today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function FoodDetailScreen() {
  const { state, navigate, goBack, toggleFavorite } = useApp()
  const [cartOpen, setCartOpen] = useState(false)
  const { addToCart } = useApp()
  const item = state.selectedFood
  const [qty, setQty] = useState(1)
  const [remarks, setRemarks] = useState<string[]>([])
  const [mode, setMode] = useState<OrderMode>('alacarte')
  const [setDrinkName, setSetDrinkName] = useState(SET_DRINKS[1].name)
  const [temp, setTemp] = useState<Temp>('hot')
  const [soup, setSoup] = useState(SET_SOUPS[0])
  const [side, setSide] = useState(SET_SIDES[0])

  const isSet = mode === 'set'
  const chosenDrink = SET_DRINKS.find(d => d.name === setDrinkName)!
  const chosenTemp = chosenDrink.hot ? temp : 'iced'
  const drinkExtra = isSet && chosenTemp === 'iced' ? chosenDrink.icedPrice : 0
  const unitExtra = (isSet ? SET_PRICE : 0) + drinkExtra

  function handleAdd() {
    if (!item) return
    const options: CartOption[] = isSet
      ? [
          { label: 'Set menu (drink, soup & side)', fee: SET_PRICE },
          { label: `Drink: ${chosenDrink.name} (${chosenTemp === 'iced' ? 'Iced' : 'Hot'})`, fee: drinkExtra },
          { label: `Soup: ${soup}`, fee: 0 },
          { label: `Side: ${side}`, fee: 0 },
        ]
      : []
    remarks.forEach(r => options.push({ label: `Remark: ${r}`, fee: 0 }))
    addToCart(item!, qty, options.map(o => o.label).join(', '), unitExtra, mode, options)
    requestCartOpen()
    navigate('menu')
  }

  function toggleRemark(remark: string) {
    setRemarks(current =>
      current.includes(remark)
        ? current.filter(option => option !== remark)
        : [...current, remark]
    )
  }

  if (!item) return null

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      {/* Hero image */}
      <div className="relative h-[260px] bg-amber-100 flex-shrink-0">
        <FoodImg src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)' }} />

        {/* Status overlay */}
        <div className="absolute top-[54px] left-0 right-0 px-3 pt-1 flex items-center justify-between">
          <div className="flex justify-between items-center w-full text-white" style={{ fontSize: 12, fontWeight: 600 }}>
            <HKClock />
            <svg width="25" height="12" viewBox="0 0 25 12" fill="white" opacity="0.9">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5" fill="none" />
              <rect x="2" y="2" width="17" height="8" rx="2" />
              <path d="M23 4.5V7.5C23.8 7.2 24.5 6.4 24.5 6C24.5 5.6 23.8 4.8 23 4.5Z" opacity="0.5" />
            </svg>
          </div>
        </div>

        <button
          onClick={goBack}
          className="absolute top-[80px] left-4 w-9 h-9 flex items-center justify-center rounded-full active:opacity-70"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5L9 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="absolute top-[80px] right-4">
          <CartChip onClick={() => setCartOpen(true)} />
        </div>

        <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap">
          {item.tags.map(t => <Tag key={t} label={t} />)}
          {item.isVeg && <Tag label="Veg" />}
          {item.isSpicy && <Tag label="Spicy" />}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 px-5 pt-5 pb-32">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="font-serif text-[26px] font-semibold text-ink-900 leading-tight">{item.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            aria-pressed={state.favorites.includes(item.id)}
            aria-label={state.favorites.includes(item.id) ? 'Remove from Favourites' : 'Add to Favourites'}
            className={`ml-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border active:opacity-70 ${state.favorites.includes(item.id) ? 'border-maroon-700 bg-maroon-100 text-maroon-700' : 'border-line bg-surface text-ink-500'}`}
          >
            <Icon name="heart" size={20} fill={state.favorites.includes(item.id)} />
          </button>
          <span className="font-serif text-[28px] font-semibold text-maroon-700 ml-3">HK${item.price}</span>
        </div>

        <p className="text-ink-700 text-[13px] leading-relaxed mb-5">{item.desc}</p>

        <div className="bg-surface rounded-[12px] px-3 py-2 mb-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-ink-500">Nutrition per serving</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Calories', value: `${item.calories} kcal` },
              { label: 'Carbs', value: `${item.nutrition.carbs}g` },
              { label: 'Protein', value: `${item.nutrition.protein}g` },
            ].map(n => (
              <div key={n.label} className="flex flex-col items-center leading-tight">
                <span className="text-[13px] font-semibold text-maroon-700">{n.value}</span>
                <span className="text-[10px] text-ink-500">{n.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
        {/* Upgrade to set */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isSet}
          onClick={() => setMode(isSet ? 'alacarte' : 'set')}
          className={`flex w-full items-center gap-3 rounded-[16px] p-3 text-left transition-colors ${
            isSet ? 'border-2 border-maroon-700 bg-maroon-100' : 'border-2 border-line bg-surface'
          }`}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-ink-900">Upgrade to set menu</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-ink-500">Add a drink, soup & side dish</span>
          </span>
          <span className="font-serif text-[15px] font-semibold text-maroon-700">{`+HK$${SET_PRICE}`}</span>
          {isSet && (
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-maroon-700 text-white">
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
                <path d="M1 4L4 7L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </button>

        {/* Quantity */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full bg-maroon-100 flex items-center justify-center text-maroon-700 text-xl font-bold active:bg-white/60"
            >−</button>
            <span className="font-serif text-[28px] font-semibold text-ink-900 w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(5, q + 1))}
              className="w-10 h-10 rounded-full bg-maroon-700 flex items-center justify-center text-white text-xl font-bold active:bg-maroon-900"
            >+</button>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Remarks</div>
          <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
            {REMARK_OPTIONS.map((remark, index) => {
              const checked = remarks.includes(remark)
              return (
                <button
                  key={remark}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleRemark(remark)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left active:bg-maroon-100 ${
                    index > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[6px] border-2 ${
                      checked
                        ? 'border-maroon-700 bg-maroon-700 text-white'
                        : 'border-line bg-paper text-transparent'
                    }`}
                  >
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
                      <path d="M1 4L4 7L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[13px] font-medium text-ink-900">{remark}</span>
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[11px] text-ink-500">Select all that apply</p>
        </div>

        {isSet ? (
          <>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Set drink</div>
              <div role="radiogroup" aria-label="Set drink" className="overflow-hidden rounded-[14px] border border-line bg-surface">
                {SET_DRINKS.map((d, index) => {
                  const checked = d.name === setDrinkName
                  return (
                    <button
                      key={d.name}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      onClick={() => {
                        setSetDrinkName(d.name)
                        if (!d.hot) setTemp('iced')
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left active:bg-maroon-100 ${index > 0 ? 'border-t border-line' : ''}`}
                    >
                      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-maroon-700' : 'border-line'}`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${checked ? 'bg-maroon-700' : 'bg-transparent'}`} />
                      </span>
                      <span className="flex-1 text-[13px] font-medium text-ink-900">
                        {d.name}
                      </span>
                      <span className="text-[11px] text-ink-500">{d.hot ? 'Hot / Iced' : 'Iced only'}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Temperature">
                {([
                  { id: 'hot', label: 'Hot', price: 'Included', disabled: !chosenDrink.hot },
                  { id: 'iced', label: 'Iced', price: `+HK$${chosenDrink.icedPrice}`, disabled: false },
                ] as const).map(o => {
                  const active = chosenTemp === o.id
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={o.disabled}
                      onClick={() => setTemp(o.id)}
                      className={`rounded-[14px] px-3 py-2.5 text-left transition-colors disabled:opacity-40 ${
                        active ? 'border-2 border-maroon-700 bg-maroon-100' : 'border-2 border-line bg-surface'
                      }`}
                    >
                      <div className="text-[13px] font-semibold text-ink-900">{o.label}</div>
                      <div className={`text-[11px] font-semibold ${o.price === 'Included' ? 'text-green-600' : 'text-amber-500'}`}>
                        {o.disabled ? 'Not available' : o.price}
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-[11px] text-ink-500">Choose any drink; iced drinks have their own surcharge</p>
            </div>
            <RadioGroup
              title="Set soup"
              hint="Choose one soup"
              options={SET_SOUPS.map(label => ({ label, note: 'Included' }))}
              value={soup}
              onChange={setSoup}
            />
            <RadioGroup
              title="Side dish"
              hint="Choose one side dish"
              options={SET_SIDES.map(label => ({ label, note: 'Included' }))}
              value={side}
              onChange={setSide}
            />
          </>
        ) : null}

        {/* Allergens */}
        <div className="bg-amber-100 rounded-[14px] px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-500 mb-1">Allergens</p>
          <p className="text-[12px] text-ink-700">Contains gluten, soy, sesame. Made in a shared kitchen.</p>
        </div>
        </div>
      </div>

      {/* CTA */}
      <div className="order-panel absolute bottom-0 left-0 right-0 px-5 pb-8 pt-5">
        <Btn variant="primary" onClick={handleAdd}>
          {`Add ${qty} to Cart · HK$${(item.price + unitExtra) * qty}`}
        </Btn>
      </div>
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

function RadioGroup({ title, hint, options, value, onChange }: {
  title: string
  hint: string
  options: { label: string; note: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">{title}</div>
      <div role="radiogroup" aria-label={title} className="overflow-hidden rounded-[14px] border border-line bg-surface">
        {options.map((option, index) => {
          const checked = value === option.label
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(option.label)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left active:bg-maroon-100 ${index > 0 ? 'border-t border-line' : ''}`}
            >
              <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-maroon-700' : 'border-line'}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${checked ? 'bg-maroon-700' : 'bg-transparent'}`} />
              </span>
              <span className="flex-1 text-[13px] font-medium text-ink-900">{option.label}</span>
              <span className={`text-[12px] font-semibold ${option.note === 'Included' ? 'text-green-600' : 'text-amber-500'}`}>{option.note}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] text-ink-500">{hint}</p>
    </div>
  )
}

export function CartScreen() {
  const { state, navigate, goBack, removeFromCart, updateCartQty, cartTotal, setSelectedSlot } = useApp()
  const selectedSlot = state.selectedSlot

  if (state.cart.length === 0) {
    return (
      <div className="h-full flex flex-col bg-paper">
        <StatusBar />
        <TopBar title="Your Cart" onBack={goBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <Icon name="cart" size={56} className="mb-4 text-ink-500" />
          <h2 className="font-serif text-[22px] font-semibold text-ink-900 mb-2">Cart is Empty</h2>
          <p className="text-ink-500 text-[14px]">Add something from the menu to get started.</p>
          <div className="w-full mt-8">
            <Btn variant="primary" onClick={() => navigate('menu')}>Browse Menu</Btn>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Your Cart" onBack={goBack} subtitle={`${state.cart.reduce((s, c) => s + c.quantity, 0)} item${state.cart.reduce((s, c) => s + c.quantity, 0) > 1 ? 's' : ''}`} />

      <div className="px-4 pt-2 pb-40 space-y-3">
        {/* Simulate sold-out hotspot */}
        <button
          onClick={() => navigate('cart-soldout')}
          className="w-full py-2 rounded-[10px] bg-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wide active:opacity-70"
        >
          Simulate Item Sold Out
        </button>

        {/* Cart items */}
        {state.cart.map(cartItem => (
          <div key={cartItem.lineId} className="bg-surface rounded-[16px] p-3" style={{ border: '1px solid #EAE1D9' }}>
            <div className="flex items-center gap-3">
              <FoodImg src={cartItem.food.image} alt={cartItem.food.name} className="w-11 h-11 flex-shrink-0 object-cover food-plate rounded-full bg-amber-100" />
              <div className="flex-1">
                <div className="text-[13px] font-semibold leading-snug text-ink-900">{cartItem.food.name}</div>
                {cartItem.mode === 'set' && (
                  <span className="mt-1 inline-block rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">Set menu</span>
                )}
              </div>
              <button onClick={() => removeFromCart(cartItem.lineId)} className="text-ink-500 text-[18px] active:text-red-600">×</button>
            </div>
            {cartItem.options.length > 0 && <LineBreakdown item={cartItem} />}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCartQty(cartItem.lineId, cartItem.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-maroon-100 flex items-center justify-center text-maroon-700 font-bold active:bg-white/60"
                >−</button>
                <span className="text-[14px] font-semibold text-ink-900">{cartItem.quantity}</span>
                <button
                  onClick={() => updateCartQty(cartItem.lineId, cartItem.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-maroon-700 flex items-center justify-center text-white font-bold active:bg-maroon-900"
                >+</button>
              </div>
              <span className="font-serif text-[16px] font-semibold text-maroon-700">HK${(cartItem.food.price + (cartItem.extraPrice || 0)) * cartItem.quantity}</span>
            </div>
          </div>
        ))}

        {/* Pickup time */}
        <div className="space-y-0 pt-1">
          <div className="mb-3">
            <QueueForecast heading="Pickup time" note="Lunch window 11:30 – 14:00. Full slots cannot be selected." selected={selectedSlot} onSelect={setSelectedSlot} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map(slot => (
              <SlotChip key={slot.time} slot={slot} selected={selectedSlot?.time === slot.time} onSelect={() => setSelectedSlot(slot)} />
            ))}
          </div>
          <button type="button" onClick={() => navigate('smart-pickup')} className="mt-3 w-full text-center text-[12px] font-semibold text-maroon-700 active:opacity-60">
            Smart Pickup Recommendation →
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <FeeRows />
          <div className="h-px bg-line mb-3" />
          <div className="flex justify-between">
            <span className="text-[15px] font-semibold text-ink-900">Total</span>
            <span className="font-serif text-[20px] font-semibold text-maroon-700">HK${cartTotal}</span>
          </div>
        </div>
      </div>

      <div className="order-panel absolute bottom-0 left-0 right-0 px-5 pb-8 pt-5">
        <div className="flex gap-3">
          <Btn variant="outline" className="btn-ghost !px-2 !text-[14px] whitespace-nowrap leading-none" onClick={() => navigate('menu')}>
            Continue
          </Btn>
          <Btn variant="primary" className="!px-2 !text-[14px] whitespace-nowrap leading-none" disabled={!selectedSlot} onClick={() => navigate('checkout')}>
            Confirm
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function CartSoldOutScreen() {
  const { navigate, goBack } = useApp()

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Your Cart" onBack={goBack} />

      <div className="px-4 pt-2 pb-40">
        <StatusBanner
          variant="error"
          title="Item sold out"
          body="BBQ Pork Rice Box just sold out while you were shopping. Please choose an alternative."
        />

        {/* Sold out item */}
        <div className="mt-4 bg-surface rounded-[20px] p-4 opacity-50" style={{ border: '1px solid #EAE1D9' }}>
          <div className="flex gap-3">
            <div className="relative w-16 h-16">
              <FoodImg src={FOOD_ITEMS[0].image} alt="BBQ Pork" className="w-full h-full object-cover food-plate rounded-full bg-amber-100" />
              <div className="absolute inset-0 bg-black/40 rounded-[12px] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold uppercase">Sold out</span>
              </div>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-ink-900 line-through">BBQ Pork Rice Box</div>
              <div className="font-serif text-[16px] text-ink-500 line-through">HK$42</div>
            </div>
          </div>
        </div>

        {/* Other cart items remain */}
        <div className="mt-4 bg-surface rounded-[20px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="flex gap-3">
            <FoodImg src={FOOD_ITEMS[1].image} alt="Chicken Rice" className="w-16 h-16 object-cover food-plate rounded-full bg-amber-100" />
            <div>
              <div className="text-[14px] font-semibold text-ink-900">Steamed Chicken Rice</div>
              <div className="font-serif text-[16px] font-semibold text-maroon-700 mt-1">HK$40</div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Btn variant="primary" onClick={() => navigate('alternatives')}>
            See Alternatives
          </Btn>
          <Btn variant="outline" onClick={() => navigate('pickup-time')}>
            Continue Without It
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function AlternativesScreen() {
  const { navigate, goBack } = useApp()
  const alts = FOOD_ITEMS.filter(f => !f.soldOut && f.id !== '1').slice(0, 3)

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Alternatives" subtitle="Replacing BBQ Pork Rice Box" onBack={goBack} />

      <div className="px-4 pt-3 pb-8 space-y-3">
        <StatusBanner
          variant="info"
          title="Similar dishes for you"
          body="Based on your past orders and ratings, here are our picks."
        />
        <div className="h-2" />
        {alts.map(item => (
          <button
            key={item.id}
            onClick={() => navigate('pickup-time')}
            className="w-full flex gap-3 p-3 bg-surface rounded-[20px] text-left active:opacity-70"
            style={{ border: '2px solid transparent' }}
            onMouseDown={e => (e.currentTarget.style.borderColor = '#236B45')}
            onMouseUp={e => (e.currentTarget.style.borderColor = 'transparent')}
          >
            <FoodImg src={item.image} alt={item.name} className="w-20 h-20 object-cover food-plate rounded-full bg-amber-100" />
            <div className="flex-1 py-1">
              <div className="text-[14px] font-semibold text-ink-900">{item.name}</div>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {item.tags.map(t => <Tag key={t} label={t} />)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-serif text-[18px] font-semibold text-maroon-700">HK${item.price}</span>
                <span className="text-[11px] text-green-600 font-semibold">Swap →</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
