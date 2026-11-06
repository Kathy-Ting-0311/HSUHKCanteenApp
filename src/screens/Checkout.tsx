import { HKClock, hkClock, todayText } from '../hkTime'
import Icon from '../components/Icon'
import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context'
import { StatusBar, TopBar, Btn, PayRow, StatusBanner } from '../components/ui'
import { FeeRows, LineBreakdown } from '../components/MiniCart'

export function CheckoutScreen() {
  const { state, navigate, goBack, cartTotal, setPaymentMethod, prepareOrder } = useApp()
  const method = state.paymentMethod
  const slot = state.selectedSlot

  const submitting = useRef(false)
  const [placing, setPlacing] = useState(false)

  function handlePay() {
    if (submitting.current) return
    submitting.current = true
    setPlacing(true)
    prepareOrder()
    navigate('payment-processing')
  }

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Checkout" onBack={goBack} />

      <div className="px-4 pt-2 pb-36 space-y-4">
        {/* Order summary */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Order Summary</div>
          <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
            {state.cart.map(c => (
              <div key={c.lineId} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-semibold text-ink-900">{c.food.name}</div>
                  <div className="text-[11px] text-ink-500">{`Qty ${c.quantity}${c.mode === 'set' ? ' · Set menu' : ''}`}</div>

                </div>
                <span className="font-serif text-[16px] font-semibold text-maroon-700">HK${(c.food.price + (c.extraPrice || 0)) * c.quantity}</span>
                </div>
                <LineBreakdown item={c} />
              </div>
            ))}
            {state.cart.length === 0 && (
              <div className="text-[13px] text-ink-500 text-center py-2">
                1× Steamed Chicken Rice · HK$40
              </div>
            )}
            <div className="h-px bg-line my-3" />
            <div className="flex items-center justify-between gap-2 text-[13px] text-ink-700">
              <span>Pickup Time</span>
              <span className="font-serif text-[16px] font-semibold text-maroon-700">{slot?.time || '13:00'}</span>
            </div>
            <div className="h-px bg-line my-3" />
            {state.cart.length > 0 && <FeeRows />}
            <div className="flex justify-between">
              <span className="text-[15px] font-semibold text-ink-900">Total</span>
              <span className="font-serif text-[20px] font-semibold text-maroon-700">
                HK${cartTotal > 0 ? cartTotal : 40}
              </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Payment Method</div>
          <div className="space-y-2">
            <PayRow
              selected={method === 'alipay'}
              onSelect={() => setPaymentMethod('alipay')}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#1677FF" />
                  <path d="M4 14.5c2 0 10 2.8 14 4-2.5 1.5-8.5 2-12-1.5-.8-.8-2-2.5-2-2.5z" fill="white" />
                  <path d="M7 6h10M7 9.5h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              label="Alipay HK"
              sublabel="Scan QR to pay instantly"
            />
            <PayRow
              selected={method === 'counter'}
              onSelect={() => setPaymentMethod('counter')}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#3F8358" />
                  <path d="M7 13l2-4h6l2 4M5 16h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              label="Pay at Counter"
              sublabel="Cash or Octopus when collecting"
            />
          </div>
        </div>

        {/* Simulate failure options */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Exception Demos</div>
          <button
            onClick={() => { prepareOrder(); navigate('payment-failed') }}
            className="w-full py-2 rounded-[10px] bg-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wide active:opacity-70"
          >
            Simulate Payment Failed
          </button>
          <button
            onClick={() => { prepareOrder(); navigate('payment-timeout') }}
            className="w-full py-2 rounded-[10px] bg-amber-100 text-amber-500 text-[11px] font-bold uppercase tracking-wide active:opacity-70"
          >
            Simulate Payment Timeout
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-paper" style={{ borderTop: '1px solid #EAE1D9' }}>
        <Btn variant={method === 'alipay' ? 'primary' : 'green'} disabled={placing} onClick={handlePay}>
          {placing ? 'Placing your order…' : method === 'alipay' ? 'Pay with Alipay HK' : 'Confirm · Pay at Counter'}
        </Btn>
        <p className="text-center text-[10px] text-ink-500 mt-2">
          By confirming, you agree to the{' '}
          <span className="text-maroon-700 font-semibold">Canteen Order Policy</span>
        </p>
      </div>
    </div>
  )
}

export function PaymentProcessingScreen() {
  const { navigate } = useApp()
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const t = setInterval(() => setDots(d => d < 3 ? d + 1 : 1), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="h-full flex flex-col bg-paper items-center justify-center px-8 text-center">
      <StatusBar />
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        {/* Animated spinner */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-maroon-100" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-maroon-700"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#F7E8ED" />
              <path d="M9 20.5c2 0 10 2.8 14 4-2.5 1.5-8.5 2-12-1.5-.8-.8-2-2.5-2-2.5z" fill="#236B45" />
              <path d="M12 11h12M12 14.5h9" stroke="#236B45" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-[24px] font-semibold text-ink-900 mb-2">
            Processing{'.'.repeat(dots)}
          </h2>
          <p className="text-ink-500 text-[14px] leading-relaxed">
            Connecting to Alipay HK.<br />Do not close this screen.
          </p>
        </div>

        {/* Quick navigate buttons for demo */}
        <div className="w-full space-y-2 mt-4">
          <Btn variant="green" onClick={() => navigate('order-confirmed')}>
            Simulate Success
          </Btn>
          <Btn variant="outline" onClick={() => navigate('payment-failed')}>
            Simulate Failed
          </Btn>
          <Btn variant="outline" onClick={() => navigate('payment-timeout')}>
            Simulate Timeout
          </Btn>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function PaymentFailedScreen() {
  const { navigate, goBack } = useApp()

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Payment Failed" onBack={goBack} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-32">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: '#FBE7E4' }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 10v10M18 26v1" stroke="#C0392B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="18" cy="18" r="16.5" stroke="#C0392B" strokeWidth="3" />
          </svg>
        </div>

        <h2 className="font-serif text-[26px] font-semibold text-ink-900 mb-2">Payment Declined</h2>
        <p className="text-ink-500 text-[14px] leading-relaxed mb-6">
          Your Alipay HK payment was not processed. This may be due to insufficient balance or a connection issue.
        </p>

        <StatusBanner
          variant="error"
          title="Transaction ID: ALIPAY-ERR-2024-9822"
          body="No funds were charged. Your order is still held for 5 minutes."
        />

        <div className="w-full mt-6 space-y-3">
          <Btn variant="primary" onClick={() => navigate('payment-processing')}>
            Retry Payment
          </Btn>
          <Btn variant="outline" onClick={() => navigate('checkout')}>
            Change Payment Method
          </Btn>
        </div>

        <div className="mt-5 bg-maroon-100 rounded-[14px] px-4 py-3 w-full text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-maroon-700 mb-1">Why failed?</p>
          <p className="text-[12px] text-ink-700 leading-relaxed">
            Common reasons: insufficient Alipay balance, expired card linked to account, or temporary bank hold. Check your Alipay app for details.
          </p>
        </div>
      </div>
    </div>
  )
}

export function PaymentTimeoutScreen() {
  const { navigate, goBack } = useApp()

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Payment Timeout" onBack={goBack} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-32">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: '#FBEDD4' }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16.5" stroke="#E8A23A" strokeWidth="3" />
            <path d="M18 10v8.5l5 3" stroke="#E8A23A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="font-serif text-[26px] font-semibold text-ink-900 mb-2">Request Timed Out</h2>
        <p className="text-ink-500 text-[14px] leading-relaxed mb-6">
          The payment server took too long to respond. Your order <strong className="text-ink-900">may or may not</strong> have been processed.
        </p>

        <StatusBanner
          variant="warning"
          title="Do not retry immediately"
          body="A duplicate charge could result. Use 'Check Order Status' first — the payment may have gone through."
        />

        <div className="w-full mt-6 space-y-3">
          <Btn variant="amber" onClick={() => navigate('order-confirmed')}>
            Check Order Status
          </Btn>
          <Btn variant="outline" onClick={() => navigate('checkout')}>
            Return to Checkout
          </Btn>
        </div>

        <div className="mt-5 bg-amber-100 rounded-[14px] px-4 py-3 w-full text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-500 mb-1">What happened?</p>
          <p className="text-[12px] text-ink-700 leading-relaxed">
            A timeout differs from a failure — the server may have processed your payment but not responded in time. Always check status before retrying to avoid double charges.
          </p>
        </div>
      </div>
    </div>
  )
}
