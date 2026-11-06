import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Screen, AppState, FoodItem, OrderMode, CartOption, TimeSlot } from './types'
import { generateOrderNumber } from './data'
import { todayText } from './hkTime'
import { loadSession, orderHistoryKey, saveSession } from './auth'
import type { User } from './auth'
import { translations } from './Language/Translations'
import type { Lang, TranslationKey } from './Language/Translations'

export type TextSize = 'small' | 'default' | 'large' | 'xlarge'
export type ThemeMode = 'light' | 'dark' | 'contrast'
export const TEXT_SIZES: TextSize[] = ['small', 'default', 'large', 'xlarge']
export const THEMES: ThemeMode[] = ['light', 'dark', 'contrast']

interface AppContextType {
  textSize: TextSize
  setTextSize: (size: TextSize) => void
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  state: AppState
  navigate: (screen: Screen) => void
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
  goBack: () => void
  resetTo: (screen: Screen) => void
  addToCart: (food: FoodItem, quantity: number, notes: string, extraPrice?: number, mode?: OrderMode, options?: CartOption[]) => void
  removeFromCart: (lineId: string) => void
  updateCartQty: (lineId: string, quantity: number) => void
  setSelectedFood: (food: FoodItem | null) => void
  setSelectedSlot: (slot: TimeSlot | null) => void
  setTrackingStep: (step: number) => void
  setPaymentMethod: (method: 'alipay' | 'counter') => void
  clearCart: () => void
  prepareOrder: () => void
  completeOrder: () => void
  markCurrentOrderCollected: () => void
  cartTotal: number
  itemsTotal: number
  extrasFee: number
  setTableware: (need: boolean) => void
  tablewareFee: number
  cartCount: number
  signIn: (user: User) => void
  signOut: () => void
  toggleFavorite: (foodId: string) => void
}

export const TABLEWARE_FEE = 1
export const PICKUP_FEE = 0

const AppContext = createContext<AppContextType | null>(null)

const initialState: AppState = {
  history: ['login'],
  cart: [],
  selectedFood: null,
  selectedSlot: null,
  orderNumber: generateOrderNumber(),
  trackingStep: 0,
  paymentMethod: 'alipay',
  pendingOrder: null,
  orderHistory: [],
  tableware: true,
  favorites: [],
  user: null,
}

const GUEST_EMAIL = 'guest@quickbite.local'
const favoritesKey = (user: User) => `quickbite-favorites:${user.email}`

// Guests never keep favourites; registered users start empty and persist their own list.
function readFavorites(user: User | null): string[] {
  if (!user || user.email === GUEST_EMAIL) return []
  try {
    const raw = JSON.parse(localStorage.getItem(favoritesKey(user)) || '[]')
    return Array.isArray(raw) ? raw.filter(x => typeof x === 'string') : []
  } catch {
    return []
  }
}

function readHistory(user: User | null) {
  try {
    const raw = JSON.parse(localStorage.getItem(orderHistoryKey(user)) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const user = loadSession()
    return { ...initialState, user, history: [user ? 'home' : 'login'], orderHistory: readHistory(user), favorites: readFavorites(user) }
  })

  const signIn = useCallback((user: User) => {
    saveSession(user)
    setState(s => ({ ...initialState, user, history: ['home'], orderHistory: readHistory(user), favorites: readFavorites(user), orderNumber: s.orderNumber }))
  }, [])

  const signOut = useCallback(() => {
    saveSession(null)
    setState(() => ({ ...initialState, orderNumber: generateOrderNumber() }))
  }, [])

  // ---- language state ----
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('quickbite-lang')
    return saved === 'en' || saved === 'zh-Hant' || saved === 'zh-Hans' ? saved : 'en'
  })

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem('quickbite-lang', next)
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key],
    [lang]
  )
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    const saved = localStorage.getItem('quickbite-text-size')
    return TEXT_SIZES.includes(saved as TextSize) ? (saved as TextSize) : 'default'
  })
  const setTextSize = useCallback((next: TextSize) => {
    setTextSizeState(next)
    localStorage.setItem('quickbite-text-size', next)
  }, [])

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('quickbite-theme')
    return THEMES.includes(saved as ThemeMode) ? (saved as ThemeMode) : 'light'
  })
  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next)
    localStorage.setItem('quickbite-theme', next)
  }, [])
  // --------------------------

  const navigate = useCallback((screen: Screen) => {
    setState(s => ({ ...s, history: [...s.history, screen] }))
  }, [])

  const resetTo = useCallback((screen: Screen) => {
    setState(s => ({ ...s, history: [screen] }))
  }, [])

  const goBack = useCallback(() => {
    setState(s => {
      if (s.history.length <= 1) return s
      return { ...s, history: s.history.slice(0, -1) }
    })
  }, [])

  const addToCart = useCallback((food: FoodItem, quantity: number, notes: string, extraPrice = 0, mode: OrderMode = 'alacarte', options: CartOption[] = []) => {
    setState(s => {
      const lineId = `${food.id}:${mode}:${notes}:${extraPrice}`
      const existing = s.cart.findIndex(c => c.lineId === lineId)
      if (existing >= 0) {
        const cart = [...s.cart]
        cart[existing] = { ...cart[existing], quantity: cart[existing].quantity + quantity }
        return { ...s, cart }
      }
      return { ...s, cart: [...s.cart, { lineId, mode, food, quantity, notes, extraPrice, options }] }
    })
  }, [])

  const removeFromCart = useCallback((lineId: string) => {
    setState(s => ({ ...s, cart: s.cart.filter(c => c.lineId !== lineId) }))
  }, [])

  const updateCartQty = useCallback((lineId: string, quantity: number) => {
    setState(s => ({
      ...s,
      cart: s.cart
        .map(c => c.lineId === lineId ? { ...c, quantity } : c)
        .filter(c => c.quantity > 0),
    }))
  }, [])

  const setSelectedFood = useCallback((food: FoodItem | null) => {
    setState(s => ({ ...s, selectedFood: food }))
  }, [])

  const setSelectedSlot = useCallback((slot: TimeSlot | null) => {
    setState(s => ({ ...s, selectedSlot: slot }))
  }, [])

  const setTrackingStep = useCallback((step: number) => {
    setState(s => ({ ...s, trackingStep: step }))
  }, [])

  const setPaymentMethod = useCallback((method: 'alipay' | 'counter') => {
    setState(s => ({ ...s, paymentMethod: method }))
  }, [])

  const clearCart = useCallback(() => {
    setState(s => ({ ...s, cart: [], orderNumber: generateOrderNumber() }))
  }, [])

  const prepareOrder = useCallback(() => {
    setState(s => {
      if (s.cart.length === 0) return s
      const id = generateOrderNumber()
      const itemCount = s.cart.reduce((sum, item) => sum + item.quantity, 0)
      const total = s.cart.reduce((sum, item) => sum + (item.food.price + (item.extraPrice || 0)) * item.quantity, 0)
        + PICKUP_FEE + (s.tableware ? TABLEWARE_FEE * itemCount : 0)
      const firstItem = s.cart[0].food.name
      return {
        ...s,
        cart: [],
        tableware: true,
        orderNumber: id,
        pendingOrder: {
          id,
          itemName: s.cart.length > 1 ? `${firstItem} + ${s.cart.length - 1} more` : firstItem,
          itemCount,
          total,
          date: todayText().wdDate,
          pickupTime: s.selectedSlot?.time || '13:00',
          status: 'Confirmed',
        },
      }
    })
  }, [])

  const completeOrder = useCallback(() => {
    setState(s => {
      if (!s.pendingOrder || s.orderHistory.some(order => order.id === s.pendingOrder?.id)) return s
      const orderHistory = [s.pendingOrder, ...s.orderHistory]
      localStorage.setItem(orderHistoryKey(s.user), JSON.stringify(orderHistory))
      return { ...s, orderHistory }
    })
  }, [])

  const markCurrentOrderCollected = useCallback(() => {
    setState(s => {
      const orderHistory = s.orderHistory.map(order =>
        order.id === s.orderNumber ? { ...order, status: 'Collected' as const } : order
      )
      localStorage.setItem(orderHistoryKey(s.user), JSON.stringify(orderHistory))
      return {
        ...s,
        pendingOrder: s.pendingOrder?.id === s.orderNumber
          ? { ...s.pendingOrder, status: 'Collected' }
          : s.pendingOrder,
        orderHistory,
      }
    })
  }, [])

  const toggleFavorite = useCallback((foodId: string) => {
    setState(s => {
      const favorites = s.favorites.includes(foodId)
        ? s.favorites.filter(id => id !== foodId)
        : [...s.favorites, foodId]
      if (s.user && s.user.email !== GUEST_EMAIL) {
        try { localStorage.setItem(favoritesKey(s.user), JSON.stringify(favorites)) } catch { /* ignore */ }
      }
      return { ...s, favorites }
    })
  }, [])

  const setTableware = useCallback((need: boolean) => {
    setState(s => ({ ...s, tableware: need }))
  }, [])

  const itemsTotal = state.cart.reduce((sum, c) => sum + (c.food.price + (c.extraPrice || 0)) * c.quantity, 0)
  const cartCount = state.cart.reduce((sum, c) => sum + c.quantity, 0)
  const tablewareFee = state.cart.length > 0 && state.tableware ? TABLEWARE_FEE * cartCount : 0
  const extrasFee = state.cart.length > 0 ? PICKUP_FEE + tablewareFee : 0
  const cartTotal = itemsTotal + extrasFee

  return (
    <AppContext.Provider value={{
      state, navigate, goBack, resetTo,
      lang, setLang, t,
      textSize, setTextSize, theme, setTheme,
      addToCart, removeFromCart, updateCartQty,
      setSelectedFood, setSelectedSlot, setTrackingStep,
      setPaymentMethod, clearCart, prepareOrder, completeOrder, markCurrentOrderCollected,
      cartTotal, itemsTotal, extrasFee, tablewareFee, setTableware, cartCount,
      signIn, signOut, toggleFavorite,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
