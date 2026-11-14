import { HKClock, hkClock, todayText } from '../hkTime'
import Icon from '../components/Icon'
import { useEffect, useState } from 'react'
import { useApp } from '../context'
import { StatusBar, TopBar, Btn, QRCode, StatusBanner } from '../components/ui'

export function OrderCodeScreen() {
  const { state, navigate, goBack } = useApp()
  const [scanned, setScanned] = useState(false)

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Pickup Code" onBack={goBack} subtitle={state.orderNumber} />

      <div className="px-5 pt-4 pb-32 space-y-4">
        {!scanned ? (
          <>
            <StatusBanner
              variant="success"
              title="Your order is ready for pickup!"
              body="Head to Stall 3 and show the QR code or pickup code to the staff."
            />

            <div className="bg-surface rounded-[24px] p-5 flex flex-col items-center" style={{ border: '2px solid #EAE1D9' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">Scan QR Code</p>
              <div className="relative">
                <QRCode size={180} />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-maroon-700 opacity-60"
                    style={{ animation: 'scan 2s ease-in-out infinite', top: 0 }}
                  />
                </div>
              </div>

              <div className="my-4 flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-line" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">or</span>
                <div className="h-px flex-1 bg-line" />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">4-digit Pickup Code</p>
              <div className="flex gap-2.5 justify-center">
                {['4', '8', '2', '7'].map((d, i) => (
                  <div key={i} className="w-12 h-14 bg-maroon-100 rounded-[12px] flex items-center justify-center">
                    <span className="font-serif text-[32px] font-semibold text-maroon-700">{d}</span>
                  </div>
                ))}
              </div>
              <p className="font-serif text-[22px] font-semibold text-ink-900 mt-4">{state.orderNumber}</p>
              <p className="text-[11px] text-ink-500 mt-1">Valid until 13:15 · Stall 3</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 bg-surface rounded-[12px] px-3 py-2.5 text-center" style={{ border: '1px solid #EAE1D9' }}>
                <div className="text-ink-500 text-[10px] uppercase tracking-wide mb-0.5">Pickup slot</div>
                <div className="text-ink-900 font-semibold text-[14px]">{state.selectedSlot?.time || '13:00'}</div>
              </div>
              <div className="flex-1 bg-surface rounded-[12px] px-3 py-2.5 text-center" style={{ border: '1px solid #EAE1D9' }}>
                <div className="text-ink-500 text-[10px] uppercase tracking-wide mb-0.5">Stall</div>
                <div className="text-ink-900 font-semibold text-[14px]">No. 3</div>
              </div>
              <div className="flex-1 bg-surface rounded-[12px] px-3 py-2.5 text-center" style={{ border: '1px solid #EAE1D9' }}>
                <div className="text-ink-500 text-[10px] uppercase tracking-wide mb-0.5">Status</div>
                <div className="text-green-600 font-semibold text-[14px]">Ready</div>
              </div>
            </div>

            <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Your Order</div>
              <div className="text-[13px] text-ink-900">1× Steamed Chicken Rice</div>
            </div>

            <button
              onClick={() => setScanned(true)}
              className="w-full py-2.5 rounded-[14px] bg-green-100 text-green-600 text-[13px] font-semibold active:opacity-70"
            >
              Simulate Staff Scan
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-center pt-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#3F8358" />
                <path d="M11 20l7 7 12-14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-serif text-[26px] font-semibold text-ink-900 mb-2">QR Scanned!</h2>
            <p className="text-ink-500 text-[14px] mb-6">Your order has been verified. Collect your meal from the counter.</p>
            <Btn variant="green" onClick={() => navigate('collected')}>
              I've Collected My Order →
            </Btn>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// The QR and number code now share one screen; keep the old route working.
export const PickupQRScreen = OrderCodeScreen

export function CollectedScreen() {
  const { navigate, markCurrentOrderCollected } = useApp()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    markCurrentOrderCollected()
  }, [markCurrentOrderCollected])

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />

      <div className="flex-1 flex flex-col px-6 pb-24 pt-6">
        {/* Success hero */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3F8358, #2D6142)' }}
            >
              <Icon name="bento" size={48} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center border-2 border-paper">
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="font-serif text-[28px] font-semibold text-ink-900 mb-2">Enjoy your meal!</h1>
          <p className="text-ink-500 text-[14px] leading-relaxed">
            Order collected at <strong className="text-ink-700">Stall 3</strong> {`· ${todayText().wdDate}, ${hkClock(new Date(), '24h')}`}
          </p>
        </div>

        {/* Rating */}
        {!submitted ? (
          <div className="bg-surface rounded-[20px] p-5 mb-5" style={{ border: '1.5px solid #EAE1D9' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 text-center mb-1">Quick Rating</div>
            <p className="text-[13px] text-ink-700 text-center mb-4">How was your Steamed Chicken Rice?</p>

            {/* Stars */}
            <div className="flex gap-2 justify-center mb-5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-[36px] transition-transform active:scale-110"
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill={star <= (hovered || rating) ? '#E8A23A' : 'none'} stroke={star <= (hovered || rating) ? '#E8A23A' : 'currentColor'} strokeWidth="1.6" strokeLinejoin="round" className="text-ink-500"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" /></svg>
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="space-y-2">
                <Btn variant="green" onClick={() => setSubmitted(true)}>
                  Submit Rating
                </Btn>
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full text-center text-[13px] text-ink-500 py-2 active:opacity-60"
                >
                  Skip for now
                </button>
              </div>
            )}
            {rating === 0 && (
              <button
                onClick={() => setSubmitted(true)}
                className="w-full text-center text-[13px] text-ink-500 py-2 active:opacity-60"
              >
                Skip rating
              </button>
            )}
          </div>
        ) : (
          <div className="bg-green-100 rounded-[16px] p-4 mb-5 text-center">
            <div className="text-green-600 font-semibold text-[14px]">Thanks for your feedback!</div>
            {rating > 0 && (
              <div className="text-[12px] text-ink-700 mt-1">{`Your ${rating}-star review helps the kitchen.`}</div>
            )}
          </div>
        )}

        {/* Summary card */}
        <div className="bg-surface rounded-[16px] p-4 mb-6" style={{ border: '1px solid #EAE1D9' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">Order Summary</div>
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-ink-700">1× Steamed Chicken Rice</span>
            <span className="text-ink-900 font-semibold">HK$40</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-ink-700">Payment</span>
            <span className="text-ink-900 font-semibold">Alipay HK</span>
          </div>
        </div>

        <div className="space-y-3">
          <Btn variant="primary" onClick={() => navigate('menu')}>
            Order Again
          </Btn>
          <Btn variant="outline" onClick={() => navigate('home')}>
            Back to Home
          </Btn>
        </div>
      </div>
    </div>
  )
}
