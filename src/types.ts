import type { User } from './auth'

export type Screen =
  | 'login'
  | 'signup'
  | 'home'
  | 'menu'
  | 'profile'
  | 'edit-profile'
  | 'favorites'
  | 'account'
  | 'help'
  | 'settings'
  | 'menu-error'
  | 'food-detail'
  | 'cart'
  | 'cart-soldout'
  | 'alternatives'
  | 'pickup-time'
  | 'smart-pickup'
  | 'smart-pickup-full'
  | 'new-slot-options'
  | 'checkout'
  | 'payment-processing'
  | 'payment-failed'
  | 'payment-timeout'
  | 'order-confirmed'
  | 'order-history'
  | 'order-tracking'
  | 'order-tracking-error'
  | 'auto-reminder'
  | 'order-code'
  | 'pickup-qr'
  | 'collected'

export interface FoodItem {
  id: string
  name: string
  nameCn: string
  price: number
  image: string
  tags: string[]
  desc: string
  soldOut: boolean
  isVeg: boolean
  isSpicy: boolean
  calories: number
  stall: string
  nutrition: { carbs: number; protein: number; fat: number }
}

export interface CartOption {
  label: string
  fee: number
}

export type OrderMode = 'alacarte' | 'set'

export interface CartItem {
  lineId: string
  mode: OrderMode
  food: FoodItem
  quantity: number
  notes: string
  extraPrice: number
  options: CartOption[]
}

export interface OrderRecord {
  id: string
  itemName: string
  itemCount: number
  total: number
  date: string
  pickupTime: string
  status: 'Confirmed' | 'Collected'
}

export interface TimeSlot {
  time: string
  label: string
  busy: boolean
  recommended?: boolean
  queueLength: number
}

export interface AppState {
  history: Screen[]
  cart: CartItem[]
  selectedFood: FoodItem | null
  selectedSlot: TimeSlot | null
  orderNumber: string
  trackingStep: number
  paymentMethod: 'alipay' | 'counter'
  pendingOrder: OrderRecord | null
  orderHistory: OrderRecord[]
  tableware: boolean
  favorites: string[]
  user: User | null
}
