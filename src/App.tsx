import { AppProvider, useApp } from './context'
import { PhoneFrame } from './components/ui'

import { LoginScreen, SignupScreen, HomeScreen, ProfileScreen, ProfileSubScreen } from './screens/Onboarding'
import {
  MenuScreen, FoodDetailScreen,
  CartScreen, CartSoldOutScreen, AlternativesScreen,
} from './screens/Browse'
import {
  PickupTimeScreen, SmartPickupScreen, NewSlotOptionsScreen,
} from './screens/Pickup'
import {
  CheckoutScreen, PaymentProcessingScreen, PaymentFailedScreen, PaymentTimeoutScreen,
} from './screens/Checkout'
import {
  OrderConfirmedScreen, OrderHistoryScreen, OrderTrackingScreen, OrderTrackingErrorScreen, AutoReminderScreen,
} from './screens/Tracking'
import { SettingsScreen } from './screens/Settings'
import { OrderCodeScreen, PickupQRScreen, CollectedScreen } from './screens/Collection'


function AppContent() {
  const { state } = useApp()
  const screen = state.history[state.history.length - 1]

  const screenMap: Record<string, React.ReactNode> = {
    'login':                   <LoginScreen />,
    'signup':                  <SignupScreen />,
    'home':                    <HomeScreen />,
    'menu':                    <MenuScreen />,
    'profile':                 <ProfileScreen />,
    'edit-profile':            <ProfileSubScreen page="edit-profile" />,
    'favorites':               <ProfileSubScreen page="favorites" />,
    'account':                 <ProfileSubScreen page="account" />,
    'help':                    <ProfileSubScreen page="help" />,
    'settings':                <SettingsScreen />,
    'food-detail':             <FoodDetailScreen />,
    'cart':                    <CartScreen />,
    'cart-soldout':            <CartSoldOutScreen />,
    'alternatives':            <AlternativesScreen />,
    'pickup-time':             <PickupTimeScreen />,
    'smart-pickup':            <SmartPickupScreen />,
    'new-slot-options':        <NewSlotOptionsScreen />,
    'checkout':                <CheckoutScreen />,
    'payment-processing':      <PaymentProcessingScreen />,
    'payment-failed':          <PaymentFailedScreen />,
    'payment-timeout':         <PaymentTimeoutScreen />,
    'order-confirmed':         <OrderConfirmedScreen />,
    'order-history':           <OrderHistoryScreen />,
    'order-tracking':          <OrderTrackingScreen />,
    'order-tracking-error':    <OrderTrackingErrorScreen />,
    'auto-reminder':           <AutoReminderScreen />,
    'order-code':              <OrderCodeScreen />,
    'pickup-qr':               <PickupQRScreen />,
    'collected':               <CollectedScreen />,
  }

  return (
    <PhoneFrame>
      {screenMap[screen] ?? (state.user ? <ProfileScreen /> : <LoginScreen />)}
    </PhoneFrame>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
