# QuickBite — HSUHK Canteen Pre-order Prototype

An interactive mobile prototype for pre-ordering meals at the Hang Seng University of Hong Kong (HSUHK) canteen. Built as a reference for an academic Figma submission. It runs entirely in the browser: there is no backend, and all data is kept in `localStorage`.

## Features

- **Accounts:** sign up with a user name, email and password, sign in, or continue as a guest. Accounts and sessions are stored locally (passwords are hashed with SHA-256).
- **Home:** greeting, a live "Pickup available period" card (11:30 – 14:00, Hong Kong time) with an Open / Opens at 11:30 / Closed status, today's picks and featured dishes.
- **Menu:** a Monday to Saturday weekly menu, search, and a star on every card to save a dish as a favourite. Ordering is only allowed on today's menu.
- **Sold-out handling:** sold-out dishes cannot be ordered and show a reminder dialog. The cart has a "Simulate Item Sold Out" flow where the customer can swap the dish or continue without it, then returns to the cart.
- **Food detail:** a la carte or set menu (drink, soup and side), hot or iced drinks, remarks, quantity.
- **Cart and pickup:** pickup time selection with a queue forecast is part of the cart page. Tableware is included by default, and the customer can choose "No tableware" (HK$1 per item otherwise).
- **Checkout and payment:** AlipayHK or pay at counter, with processing, failed and timeout states.
- **Order tracking:** confirmation, a progress stepper, order history, an auto-reminder, and an error state.
- **Pickup:** one page combining the QR code and the 4-digit pickup code, then a collected screen with a rating.
- **Favourites:** each registered account has its own list, which starts empty. Guests start empty and their list is not saved.
- **Accessibility and settings:**
  - Languages: English, Traditional Chinese, Simplified Chinese.
  - Themes: Light, Dark, High Contrast.
  - Text sizes: Small, Default, Large, Extra Large.
  - All of these are saved in `localStorage`.

## Design

| Token | Value |
| --- | --- |
| Primary green | `#236B45` |
| Light green | `#E7F3EA` |
| Background | `#F7F7F2` |
| Accent orange | `#E8A23A` |
| Headings | Fraunces |
| UI text | Inter |

The interface is flat: white surfaces with thin borders, no glass or blur effects. Icons are line SVGs from `src/components/Icon.tsx` (no emoji).

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4.

## Getting started

```bash
pnpm install
pnpm dev       # start the dev server
pnpm build     # production build
pnpm preview   # preview the production build
```

## Project structure

```
src/
  App.tsx            Screen map; the current screen is the last entry of state.history
  context.tsx        App state: navigation, cart, favourites, tableware, auth, language, theme, text size
  auth.ts            Local sign up, sign in and session storage
  data.ts            Menu items and the weekly menu
  hkTime.tsx         Hong Kong clock, greeting and weekday helpers
  types.ts           Shared types and the Screen union
  screens/
    Onboarding.tsx   Login, sign up, Home, Profile and its sub pages (favourites, account, help)
    Browse.tsx       Menu, food detail, cart, sold-out and alternatives
    Pickup.tsx       Pickup time, smart pickup, new slot options
    Checkout.tsx     Checkout and payment states
    Tracking.tsx     Order confirmed, history, tracking, error, auto-reminder
    Collection.tsx   Pickup code and QR (combined) and collected
    Settings.tsx     Language, theme and text size
  components/        ui.tsx (shared UI), BottomNav, MiniCart, QueueForecast, Icon, language toggle
  Language/          i18n.tsx (phrase dictionary and DOM text translation), Translations.tsx (UI labels)
public/exports/      PNG exports of every screen
```

## Screens (28)

| Group | Screens |
| --- | --- |
| Account | `login`, `signup` |
| Browse | `home`, `menu`, `food-detail`, `cart`, `cart-soldout`, `alternatives` |
| Pickup | `pickup-time`, `smart-pickup`, `new-slot-options` |
| Payment | `checkout`, `payment-processing`, `payment-failed`, `payment-timeout` |
| Orders | `order-confirmed`, `order-history`, `order-tracking`, `order-tracking-error`, `auto-reminder` |
| Collection | `order-code` (QR and pickup code), `pickup-qr` (alias of `order-code`), `collected` |
| Profile | `profile`, `edit-profile`, `favorites`, `account`, `help`, `settings` |

## Internationalisation

Text is written in English in the components. `src/Language/i18n.tsx` translates it to Traditional or Simplified Chinese at render time using a phrase dictionary plus a few pattern rules. To add a new string, add an entry such as:

```ts
"Sold out": ["售罄", "售罄"],   // [Traditional, Simplified]
```

The chosen language is saved under `quickbite-lang`.

## Opening a screen directly

Add `?screen=<name>` to the URL to open any screen with demo data (a guest user, a two-item cart and a pickup slot), for example `/?screen=order-code`. This is used to export the screen images in `public/exports/`.

## Local storage keys

`quickbite-users`, `quickbite-users-backup`, `quickbite-session`, `quickbite-order-history:<email>`, `quickbite-favorites:<email>`, `quickbite-lang`, `quickbite-theme`, `quickbite-text-size`, `quickbite-notify-orders`, `quickbite-notify-offers`.

## Notes

This is a prototype. Payments, queue forecasts and order progress are simulated, and no real orders are placed.
