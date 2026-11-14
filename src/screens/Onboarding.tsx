import { useEffect, useRef, useState } from "react"
import Icon from '../components/Icon'
import { useApp } from "../context"
import { StatusBar, TopBar, Btn, FoodImg, StatusBadge, SoldOutDialog } from "../components/ui"
import { FOOD_ITEMS } from "../data"
import { WEEK_DAYS } from "./Browse"
import { BottomNav } from "../components/BottomNav"
import { authenticate, registerUser } from "../auth"
import { HKClock, hkClock, hkGreeting, todayIndex, useHKNow } from "../hkTime"

export function LoginScreen() {
  const { navigate, signIn } = useApp()
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !pw) {
      setError("Please enter your email and password.")
      return
    }
    setBusy(true)
    const res = await authenticate(email, pw)
    setBusy(false)
    if (res.user) signIn(res.user)
    else setError(res.error ?? "Sign in failed.")
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto scrollbar-hide">
      <StatusBar />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-4 pb-8">
        <h1 aria-label="QuickBite" className="brand-title font-serif text-ink-900 text-[44px] font-semibold mb-2">
          {"QuickBite".split("").map((ch, i) => (
            <span key={i} aria-hidden="true" className="brand-letter" style={{ animationDelay: `${i * 90}ms, ${900 + i * 90}ms` }}>
              {ch}
            </span>
          ))}
        </h1>
        <p className="brand-tagline text-ink-500 text-[14px] text-center">
          HSUHK Canteen Pre-Order
        </p>

        {/* Login form */}
        <form onSubmit={handleLogin} className="w-full mt-10 space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-1.5 block">
              University Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              autoComplete="email"
              className="w-full bg-surface border border-line rounded-[14px] px-4 py-3.5 text-ink-900 text-[14px] outline-none focus:border-maroon-700 transition-colors"
              placeholder="your@hsuhk.edu.hk"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink-500 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError("") }}
              autoComplete="current-password"
              className="w-full bg-surface border border-line rounded-[14px] px-4 py-3.5 text-ink-900 text-[14px] outline-none focus:border-maroon-700 transition-colors"
              placeholder="Password"
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-maroon-700 text-[13px] font-semibold">
              Forgot Password?
            </button>
          </div>

          {error && (
            <p role="alert" className="rounded-[12px] bg-red-100 px-3 py-2 text-[12px] text-red-600">
              {error}
            </p>
          )}

          <div className="pt-2">
            <Btn variant="amber" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign In"}
            </Btn>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-3">
            <span className="text-[13px] text-ink-500">New to QuickBite?</span>
            <button
              type="button"
              onClick={() => navigate("signup")}
              className="text-[13px] font-bold text-blue-700 underline underline-offset-2 active:opacity-60"
            >
              Sign Up
            </button>
          </div>
          <button
            type="button"
            onClick={() => signIn({ name: "Guest", studentId: "", email: "guest@quickbite.local" })}
            className="w-full pt-1 text-center text-[13px] font-semibold text-ink-700 underline underline-offset-2 active:opacity-60"
          >
            As guest
          </button>
        </form>

        <p className="text-ink-500 text-[11px] text-center mt-8 leading-relaxed">
          By signing in you agree to HSUHK's{"\n"}Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  )
}

export function SignupScreen() {
  const { navigate, goBack, signIn } = useApp()
  const [f, setF] = useState({ name: "", email: "", pw: "", pw2: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setF(cur => ({ ...cur, [k]: e.target.value }))
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.name.trim() || !f.email.trim() || !f.pw) return setError("Please fill in all fields.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return setError("Please enter a valid email address.")
    if (f.pw.length < 6) return setError("Password must be at least 6 characters.")
    if (f.pw !== f.pw2) return setError("Passwords do not match.")
    setBusy(true)
    const res = await registerUser({ name: f.name, studentId: "", email: f.email, password: f.pw })
    setBusy(false)
    if (res.user) signIn(res.user)
    else setError(res.error ?? "Could not create account.")
  }

  const fields: { key: keyof typeof f; label: string; type: string; placeholder: string; auto: string }[] = [
    { key: "name", label: "User Name", type: "text", placeholder: "Chan Tai Man", auto: "username" },
    { key: "email", label: "Email", type: "email", placeholder: "your@email.com", auto: "email" },
    { key: "pw", label: "Password", type: "password", placeholder: "At least 6 characters", auto: "new-password" },
    { key: "pw2", label: "Confirm Password", type: "password", placeholder: "Re-enter password", auto: "new-password" },
  ]

  return (
    <div className="h-full flex flex-col bg-maroon-900 overflow-y-auto scrollbar-hide">
      <StatusBar light />
      <div className="px-6 pt-2 pb-10">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back to sign in"
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 active:opacity-60"
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none" aria-hidden="true">
            <path d="M9 1L1 8.5L9 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-serif text-white text-[30px] font-semibold leading-tight">Create account</h1>
        <p className="mt-1 text-[13px] text-white/60">Register once, then sign in directly next time.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {fields.map(fl => (
            <div key={fl.key}>
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1.5 block">{fl.label}</label>
              <input
                type={fl.type}
                value={f[fl.key]}
                onChange={set(fl.key)}
                autoComplete={fl.auto}
                placeholder={fl.placeholder}
                className="w-full bg-white/10 border border-white/20 rounded-[14px] px-4 py-3.5 text-white text-[14px] outline-none focus:border-amber-500 transition-colors placeholder:text-white/30"
              />
            </div>
          ))}

          {error && (
            <p role="alert" className="rounded-[12px] bg-red-600/20 px-3 py-2 text-[12px] text-red-100">{error}</p>
          )}

          <div className="pt-2">
            <Btn variant="amber" type="submit" disabled={busy}>{busy ? "Creating account…" : "Sign Up"}</Btn>
          </div>
          <button type="button" onClick={() => navigate("login")} className="w-full pt-2 text-center text-[13px] text-white/60">
            Already have an account? <span className="font-semibold text-amber-500">Sign in</span>
          </button>
        </form>
      </div>
    </div>
  )
}

// Add this export into the same file as LoginScreen / HomeScreen
// (same imports already cover everything this needs: useApp, StatusBar, Btn)
interface MenuItem {
  icon: React.ReactNode
  labelKey: Parameters<ReturnType<typeof useApp>['t']>[0]
  action: () => void
}

interface MenuGroup {
  items: MenuItem[]
}

export function ProfileScreen(){
  const { navigate, t, state, signOut } = useApp()
  const user = state.user

  const menuGroups: MenuGroup[] = [
    {
      items: [
        { icon: <Icon name="orders" size={20} />, labelKey: 'myOrders', action: () => navigate('order-history') },
        { icon: <Icon name="heart" size={20} />, labelKey: 'favorites', action: () => navigate('favorites') },
      ],
    },
    {
      items: [
        { icon: <Icon name="accessibility" size={20} />, labelKey: 'accessibility', action: () => navigate('settings') },
        { icon: <Icon name="sliders" size={20} />, labelKey: 'account', action: () => navigate('account') },
        { icon: <Icon name="help" size={20} />, labelKey: 'helpSupport', action: () => navigate('help') },
      ],
    },
  ]

  return (
    <div className="h-full flex flex-col bg-paper relative">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
      <div
        className="px-0 pb-4 flex-shrink-0 rounded-b-[24px]"
        style={{ background: 'linear-gradient(160deg, #123D27 0%, #236B45 100%)' }}
      >
        <StatusBar light />
        <div className="flex items-center justify-between px-5 pt-2">
          <h1 className="font-serif text-white text-[22px] font-semibold leading-none">{t('profile')}</h1>
          <button
            onClick={() => navigate('edit-profile')}
            aria-label="Edit profile"
            className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center"
          >
            <span className="text-white font-bold text-[12px]">{(user?.name || "C").charAt(0).toUpperCase()}</span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-7 pb-6 -mt-4">
        {menuGroups.map((group, gi) => (
          <div
            key={gi}
            className="bg-surface rounded-[16px] mb-4 overflow-hidden"
            style={{ border: '1px solid #EAE1D9' }}
          >
            {group.items.map((item, ii) => (
              <button
                key={ii}
                onClick={item.action}
                className="w-full flex items-center gap-4 px-5 py-4 active:bg-paper transition-colors"
                style={ii !== group.items.length - 1 ? { borderBottom: '1px solid #EAE1D9' } : undefined}
              >
                <div className="w-9 h-9 rounded-[10px] bg-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="flex-1 text-left text-[14px] font-medium text-ink-900">{t(item.labelKey)}</span>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path
                    d="M1 1L6 6L1 11"
                    stroke="#8A7D78"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={signOut}
          className="w-full bg-surface rounded-[16px] px-5 py-4 mt-6 flex items-center justify-center gap-2 active:opacity-70 transition-colors"
          style={{ border: '1px solid #EAE1D9' }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M6 2H2.5C2 2 1.5 2.5 1.5 3V12C1.5 12.5 2 13 2.5 13H6"
              stroke="#C0392B"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M10 10.5L13.5 7.5L10 4.5" stroke="#C0392B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 7.5H5.5" stroke="#C0392B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] font-semibold" style={{ color: '#C0392B' }}>
            {t('logOut')}
          </span>
        </button>

        <p className="text-center text-ink-500 text-[11px] mt-4">{t('appVersion')}</p>
      </div>
      </div>

      <BottomNav />
    </div>
  )
}

type ProfilePage = "edit-profile" | "favorites" | "account" | "help"

const PROFILE_PAGE_TITLES: Record<ProfilePage, string> = {
  "edit-profile": "Edit Profile",
  "favorites": "Favorites",
  "account": "Account",
  "help": "Help & Support",
}

function ProfileCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-surface">
      {children}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line px-4 py-3.5 last:border-b-0">
      <p className="text-[11px] font-bold uppercase tracking-widest text-ink-500">{label}</p>
      <p className="mt-1 text-[14px] font-medium text-ink-900">{value}</p>
    </div>
  )
}

export function ProfileSubScreen({ page }: { page: ProfilePage }) {
  const {
    goBack, navigate, state, setSelectedFood, setPaymentMethod,
  } = useApp()
  const [orderUpdates, setOrderUpdates] = useState(() => localStorage.getItem("quickbite-notify-orders") !== "off")
  const [offers, setOffers] = useState(() => localStorage.getItem("quickbite-notify-offers") === "on")
  const favoriteItems = FOOD_ITEMS.filter(item => state.favorites.includes(item.id))
  const [soldOutItem, setSoldOutItem] = useState<(typeof FOOD_ITEMS)[number] | null>(null)

  function setNotification(key: "orders" | "offers", value: boolean) {
    localStorage.setItem(`quickbite-notify-${key}`, value ? "on" : "off")
    if (key === "orders") setOrderUpdates(value)
    else setOffers(value)
  }

  const toggleRow = (label: string, description: string, enabled: boolean, onToggle: () => void) => (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      className="flex w-full items-center gap-4 border-b border-line px-4 py-4 text-left last:border-b-0 active:bg-paper"
    >
      <span className="flex-1">
        <span className="block text-[14px] font-semibold text-ink-900">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-500">{description}</span>
      </span>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-green-600" : "bg-line"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  )

  return (
    <div className="flex h-full flex-col bg-paper">
      <StatusBar />
      <TopBar title={PROFILE_PAGE_TITLES[page]} onBack={goBack} />
      <SoldOutDialog item={soldOutItem} onClose={() => setSoldOutItem(null)} />

      <div className="flex-1 overflow-y-auto px-4 pb-7 pt-2 scrollbar-hide">
        {page === "edit-profile" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-[28px] font-bold text-white">
                {(state.user?.name || "C").charAt(0).toUpperCase()}
              </div>
              <p className="mt-3 text-[13px] text-ink-500">Your HSUHK account details</p>
            </div>
            <ProfileCard>
              <DetailRow label="User Name" value={state.user?.name ?? "Chan Tai Man"} />
              <DetailRow label="Email" value={state.user?.email ?? "student@hsu.edu.hk"} />
            </ProfileCard>
            <div className="rounded-[14px] bg-amber-100 px-4 py-3 text-[12px] leading-relaxed text-ink-700">
              Profile details are linked to your local HSUHK account and stay available after refresh.
            </div>
          </div>
        )}

        {page === "favorites" && (
          <div className="space-y-3">
            <p className="px-1 text-[12px] leading-relaxed text-ink-500">Your saved dishes for quick reordering.</p>
            {favoriteItems.length === 0 && (
              <div className="rounded-[16px] border border-line bg-surface px-4 py-8 text-center">
                <Icon name="star" size={28} />
                <p className="mt-2 text-[14px] font-semibold text-ink-900">No favourites yet</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-500">Tap the star on a dish to save it here.</p>
              </div>
            )}
            {favoriteItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.soldOut) { setSoldOutItem(item); return }
                  setSelectedFood(item)
                  navigate("food-detail")
                }}
                className="flex w-full items-center gap-3 rounded-[16px] border border-line bg-surface p-3 text-left active:bg-paper"
              >
                <FoodImg src={item.image} alt={item.name} className="h-16 w-16 food-plate rounded-full object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-ink-900">{item.name}</span>
                  <span className="mt-1 block font-serif text-[15px] font-semibold text-maroon-700">HK${item.price}</span>
                </span>
                <span className="text-[18px] text-maroon-700">›</span>
              </button>
            ))}
          </div>
        )}

        {page === "account" && (
          <div className="space-y-4">
            <ProfileCard>
              <DetailRow label="Signed in as" value={state.user?.email ?? "Local QuickBite account"} />
            </ProfileCard>
            <div>
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">Payment</p>
              <p className="mb-2 px-1 text-[12px] leading-relaxed text-ink-500">Choose the payment method selected by default at checkout.</p>
              <ProfileCard>
                {[
                  { id: "alipay" as const, title: "AlipayHK", detail: "Pay securely in the AlipayHK app" },
                  { id: "counter" as const, title: "Pay at Counter", detail: "Pay when collecting your meal" },
                ].map(method => {
                  const selected = state.paymentMethod === method.id
                  return (
                    <button
                      key={method.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPaymentMethod(method.id)}
                      className="flex w-full items-center gap-3 border-b border-line px-4 py-4 text-left last:border-b-0 active:bg-paper"
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-maroon-700" : "border-line"}`}>
                        {selected && <span className="h-2.5 w-2.5 rounded-full bg-maroon-700" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[14px] font-semibold text-ink-900">{method.title}</span>
                        <span className="mt-0.5 block text-[11px] text-ink-500">{method.detail}</span>
                      </span>
                      {selected && <span className="text-[11px] font-bold text-green-600">Default</span>}
                    </button>
                  )
                })}
              </ProfileCard>
            </div>

            <div>
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">Notifications</p>
              <ProfileCard>
                {toggleRow("Order updates", "Pickup reminders and order status changes", orderUpdates, () => setNotification("orders", !orderUpdates))}
                {toggleRow("Offers and menu news", "New dishes, promotions and canteen notices", offers, () => setNotification("offers", !offers))}
              </ProfileCard>
            </div>

            <div>
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink-500">Privacy</p>
              <ProfileCard>
                <div className="p-4">
                  <p className="font-serif text-[18px] font-semibold text-ink-900">Your data stays on this device</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink-700">
                    QuickBite stores your local account, language preference, cart and order history in this browser for the academic prototype.
                  </p>
                </div>
                <div className="border-t border-line p-4">
                  <p className="text-[14px] font-semibold text-ink-900">What we store</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-500">Name, student ID, university email, preferences and prototype order activity.</p>
                </div>
                <div className="border-t border-line p-4">
                  <p className="text-[14px] font-semibold text-ink-900">Payment privacy</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-500">No real card or Alipay credentials are collected by this prototype.</p>
                </div>
              </ProfileCard>
            </div>
          </div>
        )}

        {page === "help" && (
          <div className="space-y-4">
            <div className="rounded-[20px] bg-maroon-900 p-5 text-white">
              <p className="font-serif text-[21px] font-semibold">How can we help?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/70">Get assistance with ordering, payment or meal collection.</p>
            </div>
            <ProfileCard>
              <button type="button" onClick={() => navigate("order-history")} className="w-full border-b border-line p-4 text-left active:bg-paper">
                <span className="block text-[14px] font-semibold text-ink-900">Order support</span>
                <span className="mt-1 block text-[11px] text-ink-500">Open your orders to check status and pickup details</span>
              </button>
              <button type="button" onClick={() => navigate("account")} className="w-full border-b border-line p-4 text-left active:bg-paper">
                <span className="block text-[14px] font-semibold text-ink-900">Payment help</span>
                <span className="mt-1 block text-[11px] text-ink-500">Review available payment methods</span>
              </button>
              <button type="button" onClick={() => window.location.href = "mailto:canteen@hsu.edu.hk"} className="w-full p-4 text-left active:bg-paper">
                <span className="block text-[14px] font-semibold text-ink-900">Contact canteen support</span>
                <span className="mt-1 block text-[11px] text-ink-500">canteen@hsu.edu.hk</span>
              </button>
            </ProfileCard>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

function DragRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })
  return (
    <div
      ref={ref}
      onPointerDown={e => {
        if (e.pointerType !== "mouse") return
        drag.current = { down: true, x: e.clientX, left: ref.current!.scrollLeft, moved: false }
      }}
      onPointerMove={e => {
        const d = drag.current
        if (!d.down) return
        const dx = e.clientX - d.x
        if (Math.abs(dx) > 4) d.moved = true
        ref.current!.scrollLeft = d.left - dx
      }}
      onDragStart={e => e.preventDefault()}
      onPointerUp={() => { drag.current.down = false }}
      onPointerLeave={() => { drag.current.down = false }}
      onClickCapture={e => {
        if (drag.current.moved) {
          e.stopPropagation()
          e.preventDefault()
          drag.current.moved = false
        }
      }}
      className={`cursor-grab select-none overflow-x-auto overscroll-x-contain touch-pan-x snap-x scrollbar-hide ${className}`}
    >
      {children}
    </div>
  )
}

export function HomeScreen() {
  const { navigate, state, setSelectedFood } = useApp()
  const [tab, setTab] = useState("All")
  const nowHK = useHKNow()
  const clock = hkClock(nowHK, "24h")
  const pickupOpen = clock >= "11:30" && clock < "14:00"
  const pickupStatus = pickupOpen ? "Open now" : clock < "11:30" ? "Opens at 11:30" : "Closed for today"
  const today = WEEK_DAYS[todayIndex()]
  const stallType = (f: { stall: string }) => f.stall.split("–")[1]?.trim() ?? "Other"
  const tabs = ["All", ...Array.from(new Set(FOOD_ITEMS.map(stallType)))]
  const matches = (f: (typeof FOOD_ITEMS)[number]) =>
    (tab === "All" || stallType(f) === tab)
  const picks = FOOD_ITEMS.filter(f => today.itemIds.includes(f.id) && !f.soldOut && matches(f))
  const featured = FOOD_ITEMS.filter(f => !today.itemIds.includes(f.id) && matches(f))
  const openFood = (item: (typeof FOOD_ITEMS)[number]) => {
    if (item.soldOut) { setSoldOutItem(item); return }
    setSelectedFood(item)
    navigate("food-detail")
  }
  const [soldOutItem, setSoldOutItem] = useState<(typeof FOOD_ITEMS)[number] | null>(null)
  const plateRow = (title: string, items: typeof FOOD_ITEMS) => (
    <section className="mb-5" aria-label={title}>
      <h3 className="mb-3 font-serif text-[20px] font-semibold text-maroon-700">{title}</h3>
      {items.length === 0 ? (
        <p className="text-[12px] text-ink-700">No dishes match. Try another category or search.</p>
      ) : (
        <DragRow className="-mx-4 flex gap-5 px-4 pb-3 pt-1">
          {items.map(item => (
            <button key={item.id} onClick={() => openFood(item)} className="flex w-[116px] flex-shrink-0 snap-start flex-col items-center text-center active:opacity-80">
              <span className="neo-plate relative block h-[116px] w-[116px] rounded-full bg-surface p-2.5">
                <FoodImg src={item.image} alt="" className="h-full w-full rounded-full object-cover" />
                {item.soldOut && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-[10px] font-bold uppercase text-white">Sold out</span>
                )}
              </span>
              <span className="mt-2.5 text-[13px] font-medium leading-tight text-ink-900">{item.name}</span>
              <span className="mt-0.5 font-serif text-[12px] font-semibold text-maroon-700">HK${item.price}</span>
            </button>
          ))}
        </DragRow>
      )}
    </section>
  )

  return (
    // Outer wrapper: fixed height, NOT scrollable — just a flex column
    <div className="h-full flex flex-col bg-paper relative">
      {/* Hero header — pinned, normal flex item */}
      <div
        className="relative px-5 pt-[46px] pb-4 flex-shrink-0 rounded-b-[24px]"
        style={{
          background: "linear-gradient(160deg, #123D27 0%, #236B45 100%)",
        }}
      >
        {/* Status bar time */}
        <div
          className="flex items-center justify-between mb-2"
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <HKClock />
          <div className="flex gap-2 items-center">
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="white"
              opacity="0.8"
            >
              <rect x="0" y="4" width="3" height="6" rx="0.5" />
              <rect x="4.5" y="2.5" width="3" height="7.5" rx="0.5" />
              <rect x="9" y="1" width="3" height="9" rx="0.5" />
              <rect x="13.5" y="0" width="2.5" height="10" rx="0.5" />
            </svg>
            <svg
              width="25"
              height="12"
              viewBox="0 0 25 12"
              fill="white"
              opacity="0.8"
            >
              <rect
                x="0.5"
                y="0.5"
                width="21"
                height="11"
                rx="3.5"
                stroke="white"
                strokeOpacity="0.5"
                fill="none"
              />
              <rect x="2" y="2" width="17" height="8" rx="2" fill="white" />
              <path
                d="M23 4.5V7.5C23.8 7.2 24.5 6.4 24.5 6C24.5 5.6 23.8 4.8 23 4.5Z"
                fill="white"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-serif text-white text-[22px] font-semibold leading-none">Hello!</h2>
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-[12px]">{(state.user?.name || "C").charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white/15 px-3 py-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/75">Pickup available period</p>
            <p className="text-[13px] font-semibold text-white">11:30 – 14:00</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-[13px] font-semibold tabular-nums text-white">{clock}</p>
            <p className={`text-[10px] font-bold ${pickupOpen ? "text-green-200" : "text-amber-200"}`}>{pickupStatus}</p>
          </div>
        </div>
      </div>

      <SoldOutDialog item={soldOutItem} onClose={() => setSoldOutItem(null)} />

      {/* Content — THIS is the scrollable region now (flex-1 + overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-5 pb-6">
        <div role="marquee" aria-label="Announcement" className="notice-marquee neo-inset mb-5 flex h-9 items-center gap-2 overflow-hidden rounded-full pl-3">
          <span className="flex-shrink-0 rounded-full bg-maroon-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Notice</span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="notice-track flex w-max">
              {[0, 1].map(i => (
                <span key={i} aria-hidden={i === 1} className="whitespace-nowrap pr-12 text-[12px] font-medium text-ink-700">{"Special menu on Thursday: Poon Choi Set at HK$88. Pre-order by Wednesday noon."}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <div role="tablist" aria-label="Categories" className="flex min-w-0 flex-1 gap-6 overflow-x-auto scrollbar-hide px-4 [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto">
            {tabs.map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`flex-shrink-0 border-b-2 pb-1.5 font-serif text-[24px] font-semibold leading-tight transition-colors ${tab === t ? "border-maroon-700 text-maroon-700" : "border-transparent text-ink-500"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {plateRow(`${today.label}'s Picks`, picks)}
        {plateRow("Featured", featured)}
      </div>

      <BottomNav />
    </div>
  )
}
