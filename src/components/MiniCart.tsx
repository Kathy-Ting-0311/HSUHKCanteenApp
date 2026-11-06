import { useApp, PICKUP_FEE, TABLEWARE_FEE } from '../context'
import Icon from './Icon'
import type { CartItem } from '../types'
import { FoodImg } from './ui'

let openCartOnNextMenu = false

export function requestCartOpen() {
  openCartOnNextMenu = true
}

export function consumeCartOpenRequest() {
  const v = openCartOnNextMenu
  openCartOnNextMenu = false
  return v
}

export function LineBreakdown({ item }: { item: CartItem }) {
  const rows = [
    { label: item.mode === 'set' ? `${item.food.name} (set menu base)` : item.food.name, fee: item.food.price },
    ...item.options,
  ]
  return (
    <div className="mt-2 space-y-1 rounded-[10px] bg-paper px-3 py-2">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between gap-3 text-[11px]">
          <span className={i === 0 ? 'font-semibold text-ink-900' : 'text-ink-700'}>
            {i === 0 ? '' : '+ '}{r.label}
          </span>
          <span className={`flex-shrink-0 font-semibold ${r.fee > 0 || i === 0 ? 'text-ink-900' : 'text-green-600'}`}>
            {r.fee > 0 || i === 0 ? `HK$${r.fee}` : 'Free'}
          </span>
        </div>
      ))}
      <div className="flex justify-between border-t border-line pt-1 text-[11px]">
        <span className="text-ink-500">{`Per item × ${item.quantity}`}</span>
        <span className="font-semibold text-maroon-700">HK${(item.food.price + item.extraPrice) * item.quantity}</span>
      </div>
    </div>
  )
}

export function ExtrasPicker() {
  const { state, setTableware } = useApp()
  const active = !state.tableware
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => setTableware(active)}
      className={`flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-left transition-colors ${active ? 'border-2 border-maroon-700 bg-maroon-100' : 'border-2 border-line bg-paper'}`}
    >
      <span className="text-[12px] font-semibold text-ink-900"><span className="inline-flex items-center gap-1.5"><Icon name="leaf" size={14} />No tableware</span></span>
      <span className="text-[11px] font-semibold text-green-600">{`Save HK$${TABLEWARE_FEE} / item`}</span>
    </button>
  )
}

export function FeeRows() {
  const { state, itemsTotal, cartCount, tablewareFee } = useApp()
  return (
    <>
      <div className="mb-2 flex justify-between text-[13px] text-ink-700">
        <span>Items</span><span>HK${itemsTotal}</span>
      </div>
      <div className="mb-3 flex justify-between text-[13px] text-ink-700">
        <span>Pickup fee</span><span>{PICKUP_FEE > 0 ? `HK$${PICKUP_FEE}` : 'Free'}</span>
      </div>
      {state.tableware && (
        <div className="mb-3 flex justify-between text-[13px] text-ink-700">
          <span>{`Tableware × ${cartCount}`}</span><span>{`HK$${tablewareFee}`}</span>
        </div>
      )}
    </>
  )
}

export function CartChip({ onClick }: { onClick: () => void }) {
  const { cartCount } = useApp()
  return (
    <button
      type="button"
      aria-label="Open order list"
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-maroon-100 active:opacity-70"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M2.5 2.5H4.5L6.5 13.5H15.5L17.5 6.5H5.5" stroke="#236B45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="16.5" r="1.5" fill="#236B45" />
        <circle cx="14" cy="16.5" r="1.5" fill="#236B45" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon-700 px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </button>
  )
}

export function CartBar({ onOpen }: { onOpen: () => void }) {
  const { cartCount, cartTotal } = useApp()
  if (cartCount === 0) return null
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 pt-3" style={{ background: 'linear-gradient(to top, var(--color-surface) 60%, transparent)' }}>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-[14px] bg-maroon-700 px-4 py-3 text-white shadow-lg active:bg-maroon-900"
      >
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/20 px-1.5 text-[13px] font-bold">{cartCount}</span>
        <span className="flex-1 text-left text-[14px] font-semibold">View order list</span>
        <span className="font-serif text-[17px] font-semibold">HK${cartTotal}</span>
      </button>
    </div>
  )
}

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, navigate, removeFromCart, updateCartQty, cartTotal, cartCount } = useApp()
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button type="button" aria-label="Close order list" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative flex max-h-[75%] flex-col rounded-t-[24px] border-t border-line bg-surface px-4 pb-8 pt-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <div className="mb-3 flex items-baseline justify-between px-1">
          <h2 className="font-serif text-[20px] font-semibold text-ink-900">Your order</h2>
          <span className="text-[12px] text-ink-500">{`${cartCount} item${cartCount === 1 ? '' : 's'}`}</span>
        </div>

        {state.cart.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-ink-500">Nothing here yet. Add a dish to get started.</p>
        ) : (
          <div className="-mx-1 flex-1 space-y-2 overflow-y-auto scrollbar-hide px-1">
            {state.cart.map(c => (
              <div key={c.lineId} className="rounded-[16px] bg-surface p-3" style={{ border: '1px solid #EAE1D9' }}>
                <div className="flex items-center gap-3">
                <FoodImg src={c.food.image} alt={c.food.name} className="h-12 w-12 flex-shrink-0 food-plate rounded-full bg-amber-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-ink-900">{c.food.name}</div>
                  {c.mode === 'set' && <div className="text-[11px] text-ink-500">Set menu</div>}
                  <div className="mt-0.5 font-serif text-[14px] font-semibold text-maroon-700">
                    HK${(c.food.price + c.extraPrice) * c.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={c.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                    onClick={() => (c.quantity === 1 ? removeFromCart(c.lineId) : updateCartQty(c.lineId, c.quantity - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon-100 font-bold text-maroon-700 active:opacity-70"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-[14px] font-semibold text-ink-900">{c.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateCartQty(c.lineId, c.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon-700 font-bold text-white active:bg-maroon-900"
                  >
                    +
                  </button>
                </div>
                </div>
                <LineBreakdown item={c} />
              </div>
            ))}
          </div>
        )}

        {state.cart.length > 0 && (
          <div className="mt-3">
            <ExtrasPicker />
            <div className="mt-3 mb-3 flex justify-between px-1">
              <span className="text-[14px] font-semibold text-ink-900">Total</span>
              <span className="font-serif text-[20px] font-semibold text-maroon-700">HK${cartTotal}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('cart')
              }}
              className="w-full rounded-[14px] bg-maroon-700 py-3.5 text-[15px] font-semibold text-white active:bg-maroon-900"
            >
              Submit order · HK${cartTotal} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
