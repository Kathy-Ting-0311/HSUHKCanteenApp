import { BottomNav } from '../components/BottomNav'
import Icon from '../components/Icon'
import { HKClock, hkClock, todayText } from '../hkTime'
import { useEffect } from 'react'
import { useApp } from '../context'
import { StatusBar, TopBar, Btn, OrderStepper, OrderStatusCard, StatusBanner, StatusBadge } from '../components/ui'

export function OrderConfirmedScreen() {
  const { state, navigate, completeOrder } = useApp()

  useEffect(() => {
    completeOrder()
  }, [completeOrder])

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />

      {/* Hero */}
      <div
        className="px-5 pt-4 pb-8 flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(160deg, #123D27 0%, #236B45 100%)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(63,131,88,0.3)' }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" fill="#3F8358" />
            <path d="M10 18l6 6 10-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Order Confirmed</p>
        <h1 className="font-serif text-white text-[32px] font-semibold mb-1">{state.orderNumber}</h1>
        <p className="text-white/70 text-[13px]">{`Payment received · ${todayText().wdDate}`}</p>

        <div className="mt-5 flex gap-3 w-full">
          <div className="flex-1 bg-white/10 rounded-[14px] px-3 py-3 text-center">
            <div className="font-serif text-white text-[18px] font-semibold">
              {state.selectedSlot?.time || '13:00'}
            </div>
            <div className="text-white/60 text-[10px] uppercase tracking-wide mt-0.5">Pickup time</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-[14px] px-3 py-3 text-center">
            <div className="font-serif text-white text-[18px] font-semibold">Stall 3</div>
            <div className="text-white/60 text-[10px] uppercase tracking-wide mt-0.5">Collection point</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-[14px] px-3 py-3 text-center">
            <div className="font-serif text-white text-[18px] font-semibold">~8</div>
            <div className="text-white/60 text-[10px] uppercase tracking-wide mt-0.5">Min wait</div>
          </div>
        </div>
      </div>

      {/* Status message */}
      <div className="px-5 pt-5 pb-32 space-y-4">
        <div className="bg-green-100 rounded-[16px] p-4 flex gap-3">
          <Icon name="check" size={18} className="text-green-600" />
          <div>
            <div className="text-[13px] font-semibold text-green-600">Kitchen notified</div>
            <div className="text-[12px] text-ink-700 mt-0.5">Your order has been sent to the kitchen. You'll receive a push notification when it's ready.</div>
          </div>
        </div>

        {/* Order items recap */}
        <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">Your Order</div>
          <div className="text-[13px] text-ink-900">
            {state.pendingOrder?.itemCount || 1}× {state.pendingOrder?.itemName || 'Steamed Chicken Rice'} · HK${state.pendingOrder?.total || 40}
          </div>
          <div className="h-px bg-line my-3" />
          <div className="flex justify-between">
            <span className="text-[13px] text-ink-700">Total Paid (Alipay)</span>
            <span className="font-serif text-[17px] font-semibold text-maroon-700">HK${state.pendingOrder?.total || 40}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Btn variant="primary" onClick={() => navigate('order-tracking')}>
            Track My Order
          </Btn>
          <Btn variant="outline" onClick={() => navigate('home')}>
            Back to Home
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function OrderHistoryScreen() {
  const { state, navigate, goBack } = useApp()

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Order History" onBack={goBack} />

      <div className="flex-1 px-4 pt-3 pb-28">
        {state.orderHistory.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M7 4h14v20H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M10 9h8M10 14h8M10 19h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="font-serif text-[22px] font-semibold text-ink-900">No orders yet</div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-500">Your completed orders will appear here.</p>
            <div className="mt-6 w-full">
              <Btn variant="primary" onClick={() => navigate('menu')}>Browse Menu</Btn>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-500">All Orders</div>
            {state.orderHistory.map(order => (
              <div key={order.id} className="rounded-[20px] border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold text-ink-900">{order.itemName}</div>
                    <div className="mt-1 text-[11px] text-ink-500">{order.date} · {order.pickupTime}</div>
                    <div className="mt-2"><StatusBadge kind={order.status === 'Collected' ? 'completed' : 'warning'} label={order.status === 'Collected' ? 'Collected' : 'Preparing'} /></div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-[18px] font-semibold text-maroon-700">HK${order.total}</div>
                    <div className="mt-1 text-[10px] text-ink-500">{order.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav className="absolute inset-x-0 bottom-0 z-40" />
    </div>
  )
}

export function OrderTrackingScreen() {
  const { state, navigate, goBack, setTrackingStep } = useApp()
  const step = state.trackingStep
  const isReady = step === 2
  const isCollected = step === 3

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Order Tracking" onBack={goBack} subtitle={state.orderNumber} />

      <div className="px-4 pt-3 pb-32 space-y-4">
        <OrderStatusCard currentStep={step} />

        {!isCollected && (
          <div className="flex items-center gap-3 rounded-[16px] border-2 border-line bg-surface p-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500">{isReady ? 'Collect at' : 'Estimated ready'}</p>
              <p className="font-serif text-[28px] font-semibold leading-tight text-ink-900">{isReady ? 'Stall 3' : '12:55'}</p>
              <p className="text-[12px] text-ink-700">{isReady ? state.orderNumber : `${todayText().wdDate} · Stall 3`}</p>
            </div>
            <StatusBadge kind={isReady ? 'success' : 'warning'} label={isReady ? 'Ready now' : 'In progress'} />
          </div>
        )}

        {/* Network error hotspot */}
        <button
          onClick={() => navigate('order-tracking-error')}
          className="w-full py-2 rounded-[10px] bg-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wide active:opacity-70"
        >
          Simulate Network Error
        </button>

        {/* Stepper */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3 px-4">Order Progress</div>
          <OrderStepper currentStep={step} />
        </div>

        {/* Advance step controls */}
        {step < 2 && (
          <div className="px-4">
            <Btn variant="outline" onClick={() => setTrackingStep(Math.min(3, step + 1))}>
              Advance to Next Step
            </Btn>
          </div>
        )}

        {isReady && (
          <div className="px-4 space-y-3">
            <Btn variant="green" onClick={() => navigate('auto-reminder')}>
              View Pickup Notification
            </Btn>
            <Btn variant="primary" onClick={() => navigate('order-code')}>
              Show Pickup Code
            </Btn>
            <Btn variant="outline" onClick={() => setTrackingStep(3)}>
              Mark as Collected
            </Btn>
          </div>
        )}

        {/* Stall info */}
        <div className="mx-4 bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Collection Point</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-amber-100 flex items-center justify-center">
              <Icon name="bento" size={22} className="text-amber-500" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-ink-900">Stall 3 – Rice Box Counter</div>
              <div className="text-[12px] text-ink-500">Ground floor, near entrance B</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderTrackingErrorScreen() {
  const { navigate, goBack } = useApp()
  const lastUpdate = '12:48 PM'

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Order Tracking" onBack={goBack} />

      <div className="px-4 pt-3 pb-32 space-y-4">
        <StatusBanner
          variant="error"
          title="Connection lost"
          body={`Real-time updates paused. Last synced at ${lastUpdate}. Your order is likely still being prepared.`}
        />

        {/* Last known state */}
        <div className="bg-surface rounded-[20px] p-5" style={{ border: '1px solid #EAE1D9' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">Last Known Status</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#E8A23A" strokeWidth="1.5" />
                <path d="M9 5v4.5l2.5 1.5" stroke="#E8A23A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-ink-900">Preparing your order</div>
              <div className="text-[11px] text-ink-500">{`Step 2 of 4 · Updated ${lastUpdate}`}</div>
            </div>
          </div>
        </div>

        {/* Reassurance */}
        <div className="bg-green-100 rounded-[16px] p-4">
          <p className="text-[12px] text-ink-700 leading-relaxed">
            <strong className="text-green-600">Don't worry</strong> — your order was confirmed and payment received. The kitchen is preparing your meal. Head to Stall 3 at your scheduled pickup time.
          </p>
        </div>

        {/* Estimated pickup */}
        <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-1">Pickup time</div>
              <div className="font-serif text-[28px] font-semibold text-ink-900">13:00</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-1">Location</div>
              <div className="text-[16px] font-semibold text-ink-900">Stall 3</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Btn variant="primary" onClick={() => navigate('order-tracking')}>
            Reconnect & Refresh
          </Btn>
          <Btn variant="outline" onClick={() => navigate('order-code')}>
            Show Pickup Code Offline
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function AutoReminderScreen() {
  const { state, navigate } = useApp()

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      {/* Lock screen simulation */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0B1A11 0%, #14281C 50%, #0B1A11 100%)',
        }}
      >
        {/* Background blur bokeh */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-maroon-700 opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-5 w-24 h-24 rounded-full bg-amber-500 opacity-15 blur-3xl" />

        {/* Lock screen status bar */}
        <div className="absolute top-[54px] left-0 right-0 flex justify-between px-6 text-white/80" style={{ fontSize: 12, fontWeight: 600 }}>
          <HKClock />
          <svg width="25" height="12" viewBox="0 0 25 12" fill="white" opacity="0.8">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5" fill="none" />
            <rect x="2" y="2" width="17" height="8" rx="2" />
          </svg>
        </div>

        {/* Time display */}
        <div className="pt-28 px-6 text-center">
          <div className="text-white text-[70px] font-semibold leading-none" style={{ fontFamily: 'Inter, system-ui' }}>{hkClock(new Date(), 'lock')}</div>
          <div className="text-white/60 text-[16px] mt-2">{todayText().full}</div>
        </div>

        {/* Notification card */}
        <div className="mx-4 mt-10">
          <div
            className="rounded-[22px] p-4"
            style={{ background: 'var(--color-surface)' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-amber-500 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 17C4 11 7 7 11 7C15 7 18 11 18 17" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <ellipse cx="11" cy="5" rx="3.5" ry="4" stroke="white" strokeWidth="1.8" fill="none"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-bold text-ink-700">QuickBite</span>
                  <span className="text-[11px] text-ink-500">now</span>
                </div>
                <div className="text-[14px] font-semibold text-ink-900 mb-0.5">Your order is ready!</div>
                <div className="text-[12px] text-ink-700 leading-relaxed">
                  Order <strong>{state.orderNumber}</strong> is ready for collection at <strong>Stall 3</strong>. Please pick up within 15 minutes.
                </div>
              </div>
            </div>
          </div>

          {/* Slide hint */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('order-code')}
              className="text-white/60 text-[13px] active:text-white/90"
            >
              Tap notification to collect →
            </button>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white opacity-30" />
      </div>
    </div>
  )
}
