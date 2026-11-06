import { HKClock, hkClock, todayText } from '../hkTime'
import Icon from '../components/Icon'
import { useEffect, useState } from 'react'
import { useApp } from '../context'
import { StatusBar, TopBar, Btn, QRCode, StatusBanner } from '../components/ui'

export function OrderCodeScreen() {
  const { state, navigate, goBack } = useApp()

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Pickup Code" onBack={goBack} />

      <div className="px-5 pt-4 pb-32 space-y-5">
        {/* Ready banner */}
        <StatusBanner
          variant="success"
          title="Your order is ready for pickup!"
          body="Head to Stall 3 and show this code to the staff."
        />

        {/* Order # card */}
        <div
          className="rounded-[24px] p-6 text-center"
          style={{ background: 'linear-gradient(160deg, #123D27 0%, #236B45 100%)' }}
        >
          <p className="text-white/60 text-[11px] uppercase tracking-widest font-bold mb-2">Order Number</p>
          <p className="font-serif text-white text-[52px] font-semibold leading-none tracking-tight">
            {state.orderNumber}
          </p>
          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-white/10 rounded-[12px] px-3 py-2.5 text-center">
              <div className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">Pickup slot</div>
              <div className="text-white font-semibold text-[14px]">{state.selectedSlot?.time || '13:00'}</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-[12px] px-3 py-2.5 text-center">
              <div className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">Stall</div>
              <div className="text-white font-semibold text-[14px]">No. 3</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-[12px] px-3 py-2.5 text-center">
              <div className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">Status</div>
              <div className="text-green-400 font-semibold text-[14px]">Ready</div>
            </div>
          </div>
        </div>

        {/* Pickup code large display */}
        <div className="bg-surface rounded-[20px] p-5 text-center" style={{ border: '2px solid #EAE1D9' }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-3">4-digit Pickup Code</p>
          <div className="flex gap-3 justify-center">
            {['4', '8', '2', '7'].map((d, i) => (
              <div key={i} className="w-14 h-16 bg-maroon-100 rounded-[14px] flex items-center justify-center">
                <span className="font-serif text-[36px] font-semibold text-maroon-700">{d}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-ink-500 mt-3">Tell the staff this code or show it on screen</p>
        </div>

        {/* Items reminder */}
        <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-2">Your Order</div>
          <div className="text-[13px] text-ink-900">1× Steamed Chicken Rice</div>
        </div>

        <Btn variant="primary" onClick={() => navigate('pickup-qr')}>
          Show QR Code Instead
        </Btn>
      </div>
    </div>
  )
}

export function PickupQRScreen() {
  const { state, navigate, goBack } = useApp()
  const [scanned, setScanned] = useState(false)

  return (
    <div className="h-full flex flex-col bg-paper overflow-y-auto scrollbar-hide">
      <StatusBar />
      <TopBar title="Pickup QR" onBack={goBack} subtitle={state.orderNumber} />

      <div className="px-5 pt-4 pb-32 space-y-5">
        {!scanned ? (
          <>
            <div className="text-center">
              <p className="text-[13px] text-ink-700 leading-relaxed">
                Show this QR code to the scanner at Stall 3. The staff will hand over your meal after scanning.
              </p>
            </div>

            {/* QR code */}
            <div className="bg-surface rounded-[24px] p-6 flex flex-col items-center" style={{ border: '2px solid #EAE1D9' }}>
              <div className="mb-4">
                <QRCode size={200} />
              </div>
              <p className="font-serif text-[28px] font-semibold text-ink-900">{state.orderNumber}</p>
              <p className="text-[11px] text-ink-500 mt-1">Valid until 13:15 · Stall 3</p>

              {/* Scanner animation */}
              <div className="relative mt-4 w-[200px] h-[200px] -mt-[200px] pointer-events-none">
                <div
                  className="absolute left-0 right-0 h-0.5 bg-maroon-700 opacity-60"
                  style={{ animation: 'scan 2s ease-in-out infinite', top: 0 }}
                />
              </div>
            </div>

            {/* Simulate scan */}
            <button
              onClick={() => setScanned(true)}
              className="w-full py-2.5 rounded-[14px] bg-green-100 text-green-600 text-[13px] font-semibold active:opacity-70"
            >
              Simulate Staff Scan
            </button>

            <div className="bg-surface rounded-[16px] p-4" style={{ border: '1px solid #EAE1D9' }}>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#8A7D78" />
                  <path d="M7 4v4l2 2" stroke="#8A7D78" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] text-ink-500">QR expires in <strong className="text-ink-700">14:23</strong></span>
              </div>
            </div>

            <Btn variant="outline" onClick={() => navigate('order-code')}>
              Use Number Code Instead
            </Btn>
          </>
        ) : (
          /* Post-scan collected view */
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
