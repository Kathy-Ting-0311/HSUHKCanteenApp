# COM3201 Figam Project HSUHK Canteen App Prototype
* Project Period: Oct 2026 - Dec 2026

**QuickBite** is a browser-based, mobile-first canteen pre-order prototype for HSUHK students. It lets a student browse the weekly menu, customise a dish or upgrade it to a set meal, build a cart, choose a pickup slot based on a queue forecast, pay (simulated), and follow the order through to collection.

> **Prototype notice:** this is an academic interaction prototype, not a production canteen system. There is no backend, no real payment integration and no HSUHK portal login. Accounts, preferences, favourites and order history live in the browser's `localStorage`; the cart is in-memory. Nothing is sent to a server.

## Contents

- [Feature walkthrough](#feature-walkthrough)
- [Screens](#screens)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [How the app works](#how-the-app-works)
- [Demo controls](#demo-controls)
- [Design notes](#design-notes)
- [Prototype limitations](#prototype-limitations)
- [Figma Make](#figma-make)

## Feature walkthrough

### Accounts and sign-in

- **Sign in** with a university email and password, or continue **as a guest**.
- **Sign up** collects full name, student ID, email, password and password confirmation. It validates the email format, a minimum password length of six characters, and matching passwords.
- Accounts are stored locally. Each password is hashed with SHA-256 over `email::password` using the Web Crypto API before being saved. A duplicate-email check prevents re-registering the same address.
- The signed-in email is kept in a session key, so a page refresh restores the session. Guest favourites are not persisted; registered users keep their own favourites and order history.
- "Forgot Password?" is present for completeness but has no recovery flow — there is no server to email a reset link.

### Home and weekly menu

- **Home** greets the student, shows the live Hong Kong time, and displays the pickup window (11:30 – 14:00) with an open/opens-soon/closed status.
- A scrolling notice announces the weekly special; category tabs are generated from the dish stalls (`All`, `Rice Box`, `Noodles`, `Healthy`).
- Dishes are split into **Today's Picks** (the weekday's rotation) and **Featured** (everything else).
- **Weekly Menu** has a Monday–Saturday day selector (the canteen is closed on Sunday), a search box that matches English and Chinese dish names, and a card per dish with price, tags, description and nutrition.
- Ordering is only open for **today's** menu. Other days are view-only and show an "Ordering unavailable" dialog with a shortcut back to today.
- Sold-out dishes are visually struck through and disabled; tapping one opens a sold-out dialog.

### Dish details and cart

- Dish details show the hero image, description, per-serving nutrition (calories, carbs, protein), allergens, and a favourite (heart) toggle.
- Quantity is limited to 1–5. Remarks can be selected from four presets: less salt, no spring onion, no chilli sauce, sauce on the side.
- **Upgrade to set menu** adds HK$15 and includes a drink, a soup and a side dish. Drinks can be hot or iced where available; iced drinks add their own surcharge (HK$2–4).
- The cart is reachable from the menu header, a bottom bar, or a sheet that opens automatically after adding a dish.
- Each cart line records the order mode, chosen options, remarks and extra price. Identical lines (same dish, mode, notes and extras) merge into one line with an increased quantity.
- The cart shows a per-line price breakdown, quantity controls, an order summary, and a **No tableware** switch that saves HK$1 per item.

### Pickup scheduling

- The lunch window is divided into 15-minute slots from 11:30 to 14:00.
- Slots with more than 20 queued orders are marked **Full** with a striped, dotted pattern and cannot be selected.
- A **Queue Forecast** bar chart visualises queued orders per slot. A rough wait estimate is derived as `queueLength × 1.3` minutes.
- 13:00 is flagged as the recommended slot and is the default suggestion.
- **Smart Pickup** presents the 13:00 recommendation with an "AI-recommended" explanation, then confirms that slot or lets the student pick manually.
- A "slot just filled up" demo offers the remaining afternoon slots (13:15–14:00) when the recommendation becomes unavailable.

### Checkout and payment

- Checkout repeats the order summary, pickup time, item total, pickup fee (free) and tableware fee, then offers two payment methods: **AlipayHK** or **Pay at Counter**.
- Placing an order snapshots it into a pending order, clears the cart and moves to a simulated payment-processing screen.
- Payment failure and timeout screens explain the difference between a declined payment and an unanswered request, and offer retry / change-method / check-status paths.
- No payment credentials are collected, and no charge is ever made.

### Tracking and collection

- A confirmed order receives a `QB-####` order number and is added to order history.
- **Order Tracking** moves through four steps: Order Received → Preparing → Ready for Pickup → Collected. The prototype includes buttons to advance the step and a simulated network-error screen with the last known status.
- A ready order can show a **4-digit pickup code** or a **QR code**, with a "simulate staff scan" action for demos.
- The collection screen marks the order as collected and asks for an optional 1–5 star rating.
- Order history lists past orders with item name, date, pickup time, total and status (Preparing or Collected), and keeps the current order's status in sync when it is collected.

### Profile, history and favourites

- Profile links to My Orders, Favourites, Accessibility & Language, Account, Help & Support, and Log Out.
- **Favourites** lists saved dishes and opens their detail screen; sold-out favourites still show the sold-out dialog.
- **Account** sets the default payment method, stores order/offer notification preferences, and explains what data is stored locally.
- **Edit Profile** displays the locally registered name, student ID and email. It is read-only in this prototype.
- **Help & Support** routes to order history or payment settings, and offers a `mailto:` contact link to canteen support.

### Language, text size and theme

- Three languages: **English**, **繁體中文** (Traditional Chinese) and **简体中文** (Simplified Chinese).
- Four text sizes: Small, Default, Large and Extra Large. Text scales across the whole phone screen, and controls get a 44px minimum target at the larger sizes.
- Three themes: **Light**, **Dark** and **High Contrast**.
- Preferences persist across refreshes.

## Screens

Navigation is a stack held in React state; there is no URL router. `src/App.tsx` maps the current screen name to a component.

| Flow | Screen keys | What the student sees |
| --- | --- | --- |
| Onboarding | `login`, `signup` | Sign in, create a local account, or continue as guest |
| Home | `home` | Greeting, HK clock, pickup window, notice, today's picks, featured dishes |
| Menu | `menu`, `food-detail` | Weekly menu with search and day selector; dish details, set-menu builder and favourites |
| Cart | `cart`, `cart-soldout`, `alternatives` | Cart lines, fees, slot picker, sold-out demo and alternative dishes |
| Pickup | `pickup-time`, `smart-pickup`, `new-slot-options` | Manual slot grid, queue forecast, smart recommendation, replacement slots |
| Checkout | `checkout`, `payment-processing`, `payment-failed`, `payment-timeout` | Order summary, payment method, simulated payment outcomes |
| After ordering | `order-confirmed`, `order-tracking`, `order-tracking-error`, `auto-reminder`, `order-code`, `pickup-qr`, `collected` | Confirmation, 4-step tracking, lock-screen reminder, pickup code/QR and collection/rating |
| History and profile | `order-history`, `profile`, `edit-profile`, `favorites`, `account`, `help`, `settings` | Past orders, profile menu, saved dishes, payment/notification settings, help, accessibility settings |

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19 + React DOM 19 |
| Language | TypeScript 5.7 |
| Build | Vite 8 with `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`; theme tokens and global CSS in `src/index.css` |
| Fonts | Fraunces (display serif), Inter (UI sans), Noto Sans/Serif TC & SC (Chinese) loaded from Google Fonts |
| Formatting | oxfmt |
| Toolchain | Node.js 22 and pnpm 10.34.3 (`.mise.toml`) |
| Platform | Figma Make scaffold (Figma-specific Vite plugins and `.figma/make/site.json`) |
| Routing / state | No routing or state library — a screen stack and app state in React Context |
| Tests | No test runner is configured in this prototype |

## Getting started

### Prerequisites

- Node.js 22 (the version pinned in `.mise.toml`)
- pnpm 10.34.3, or `mise install` to install both

### Commands

```bash
pnpm install     # install dependencies
pnpm dev         # start the Vite dev server (default http://localhost:8443)
pnpm build       # production build into dist/
pnpm preview     # preview the production build
pnpm format      # format with oxfmt
```

The dev server listens on `$PORT` (default `8443`) and binds to `$FIGMA_DEV_SERVER_HOST` (default `0.0.0.0`). Inside Figma Make, the preview server is already running, so only the local workflow needs `pnpm dev`.

There are no environment variables or secrets to configure.

## Project structure

```text
.
├── .figma/make/site.json       Figma Make site metadata (description, robots, accessibility flags)
├── .mise.toml                  Node 22 / pnpm 10.34.3 toolchain pins
├── index.html                  Vite HTML shell with the #root mount point
├── package.json                Scripts and dependencies
├── vite.config.ts              React, Tailwind v4, Figma Make plugins, and the @ → src alias
├── AGENTS.md                   Figma Make scaffold guide used by the in-editor agent
└── src/
    ├── main.tsx                React entrypoint; mounts App and imports global CSS
    ├── App.tsx                 AppProvider + PhoneFrame; screen-key → component map
    ├── context.tsx             App state, screen history, cart, pricing, session, language, theme
    ├── auth.ts                 Local account store, SHA-256 password hashing, session helpers
    ├── data.ts                 Six sample dishes, pickup slots, order-number generator
    ├── types.ts                Screen, FoodItem, CartItem, OrderRecord, TimeSlot, AppState
    ├── hkTime.tsx              Asia/Hong_Kong clock, dates, weekday and simulated-day helpers
    ├── index.css               Tailwind import, colour/font tokens, themes, text scaling, animations
    ├── components/
    │   ├── ui.tsx              PhoneFrame, StatusBar, TopBar, Btn, FoodCard, StatusBanner, steppers, QR
    │   ├── MiniCart.tsx        Cart bar, cart sheet, fee rows, line breakdown, tableware switch
    │   ├── QueueForecast.tsx   Queue bar chart and wait estimate
    │   ├── BottomNav.tsx       Home / Order / Orders / Profile tab bar
    │   ├── Icon.tsx            Inline SVG icon set
    │   └── Languagetoggle.tsx  Quick language menu used on login/home
    ├── screens/
    │   ├── Onboarding.tsx      Login, signup, home, profile and profile sub-pages
    │   ├── Browse.tsx          Weekly menu, dish details, cart, sold-out and alternatives
    │   ├── Pickup.tsx          Manual slots, smart pickup, replacement slots
    │   ├── Checkout.tsx        Checkout, payment processing, failed and timeout states
    │   ├── Tracking.tsx        Confirmation, history, tracking, network error, reminder
    │   ├── Collection.tsx      Pickup code, QR pickup, collected/rating screen
    │   └── Settings.tsx        Language, text size and theme
    └── Language/
        ├── Translations.tsx       Fixed English / Traditional / Simplified UI strings
        ├── i18n.tsx               LocalizedContent: runtime DOM translation and phrase table
        └── Context_i18n_patch.tsx Unused reference patch showing the language context wiring
```

## How the app works

### Navigation

`AppProvider` stores `history: Screen[]`. `navigate(screen)` pushes a screen, `goBack()` pops it, and `resetTo(screen)` replaces the stack. `App.tsx` reads the last entry and renders the matching screen inside a fixed 375 × 812 phone frame. This keeps the prototype's back behaviour predictable without adding a router dependency.

### State and pricing

All runtime state lives in one `AppState` object in `src/context.tsx`: the screen stack, cart, selected dish and slot, order number, tracking step, payment method, pending order, order history, tableware preference, favourites and the signed-in user.

Pricing rules come from that context:

- Item total: `(dish price + line extra) × quantity`
- Set-menu upgrade: **+HK$15** per item
- Iced-drink surcharge: **HK$2–4**, depending on the drink
- Pickup fee: **HK$0**
- Tableware: **HK$1 per item**, on by default; the cart sheet can switch it off
- Cart total: items + pickup fee + tableware fee

Placing an order calls `prepareOrder()`, which snapshots the cart into a pending order, generates a new `QB-####` number, clears the cart and resets tableware to on. `completeOrder()` then writes the pending order to history once, guarding against duplicates.

### Data and time

`src/data.ts` holds the prototype catalogue: six dishes across Stalls 1, 3 and 4, with names, Chinese names, prices, images, tags, descriptions, calories, nutrition and sold-out state. It also holds the weekday rotations, the 11 pickup slots (11:30–14:00) and four replacement afternoon slots.

`src/hkTime.tsx` formats everything in `Asia/Hong_Kong` using `Intl.DateTimeFormat`: the status-bar clock, long and short dates, the current weekday, and the week's dates. The canteen runs Monday–Saturday; Sunday is mapped to Monday's index so the prototype always has a menu to show. An optional `quickbite_sim_day` localStorage key can override the weekday through `getSimDay()` / `saveSimDay()` (the helpers exist, but no screen currently exposes a control for it).

### Persistence

| Key | Contents |
| --- | --- |
| `quickbite-users`, `quickbite-users-backup` | Registered local accounts: name, student ID, email, password hash, creation time |
| `quickbite-session` | Email of the signed-in user |
| `quickbite-favorites:<email>` | Favourites for a registered user (guests are never persisted) |
| `quickbite-order-history:<email>` | Confirmed orders for each signed-in user, including the guest account (the unsuffixed `quickbite-order-history` key is used only when no user is set) |
| `quickbite-lang` | `en`, `zh-Hant` or `zh-Hans` |
| `quickbite-text-size` | `small`, `default`, `large` or `xlarge` |
| `quickbite-theme` | `light`, `dark` or `contrast` |
| `quickbite-notify-orders`, `quickbite-notify-offers` | Notification preferences from Account |
| `quickbite_sim_day` | Optional simulated weekday index (0–5) |

The cart, selected slot and pending order are in-memory only, so a refresh restarts the ordering flow — while the account session, preferences, favourites and order history survive.

### Internationalisation

Fixed labels and longer UI copy live in `src/Language/Translations.tsx`. In addition, `LocalizedContent` (in `src/Language/i18n.tsx`) walks the rendered DOM and translates text nodes plus `placeholder`, `alt`, `title` and `aria-label` attributes at runtime. It uses an exact-phrase table, then pattern rules for dynamic strings such as dates, queue counts, wait times and prices. This means new English copy that is not in the phrase table will remain in English until a translation entry is added.

### Design tokens and accessibility

- Colour, font, radius and theme tokens are defined in `src/index.css` with Tailwind v4's `@theme` block and `[data-theme="…"]` overrides.
- The colour tokens keep legacy `maroon-*` names but resolve to HSUHK green values (deep green `#123D27`, green `#236B45`, amber `#E8A23A`).
- Text-size modes scale every `text-[Npx]` utility in the phone stage, and increase button minimum heights at Large and Extra Large.
- Status is never communicated by colour alone: badges pair a colour with an icon, label and shape/pattern (solid, dashed, dotted or striped).
- Focus-visible rings, reduced-motion handling and spacious touch targets are built into the shared components.

## Demo controls

Because there is no backend, the prototype exposes explicit buttons to exercise exception paths:

| Where | Control | What it demonstrates |
| --- | --- | --- |
| Cart | Simulate Item Sold Out | A dish sells out mid-session; offers alternatives or continuing without it |
| Smart Pickup | Simulate Slot Full | The recommended 13:00 slot becomes unavailable; offers 13:15–14:00 |
| Checkout | Simulate Payment Failed / Timeout | Declined vs. unanswered payment states |
| Payment processing | Simulate Success / Failed / Timeout | The three simulated payment outcomes |
| Order tracking | Simulate Network Error | Offline tracking with the last known status and offline pickup code |
| Order tracking | Advance to Next Step | Moves the four-step order status forward |
| Order tracking | View Pickup Notification | Simulated lock-screen "order ready" notification |
| Pickup QR | Simulate Staff Scan | The staff-scan handover flow |

## Design notes

- The UI is presented inside a fixed iPhone-sized frame (375 × 812) on a styled page background, so the prototype reads as a mobile app on desktop.
- The palette is drawn from HSUHK green and warm neutrals: paper `#F7F7F2`, surface white, ink `#202820`, green `#236B45`, amber `#E8A23A`.
- Typography pairs **Fraunces** for display headings and prices with **Inter** for body/UI, and switches to **Noto Sans/Serif TC or SC** for Chinese.
- The three themes are not cosmetic only — Dark and High Contrast redefine every token and adjust surface shadows, borders and focus outlines.
- Shared primitives (`Btn`, `FoodCard`, `StatusBanner`, `StatusBadge`, `SlotChip`, `OrderStepper`, `PayRow`, `QRCode`, `FoodImg`) keep states visually consistent across screens. `FoodImg` falls back to an inline bento-box SVG if a remote image fails.

## Prototype limitations

- **No backend:** accounts, orders, favourites and settings are per-browser. Clearing site data resets everything.
- **Demo-grade auth:** passwords are unsalted SHA-256 digests in `localStorage`. This is sufficient for a UI prototype but not for real credentials.
- **Simulated payments:** AlipayHK and counter payment are UI states only; no payment SDK, charge or credential handling exists.
- **Static operational data:** dish catalogue, queue lengths, stall assignment and prep times are hard-coded sample data.
- **Simulated tracking:** kitchen progress advances through demo buttons, not live updates.
- **Some screens use fixed demo content:** the sold-out example, the 4-digit code `4827`, the collected-order summary and the tracking timeline are illustrative rather than driven by the live cart.
- **Read-only profile editing and no password recovery**, as there is no account service behind the prototype.
- **Sunday has no menu:** the week selector covers Monday–Saturday, and Sunday falls back to Monday's rotation.
- **Ratings are not persisted** after the collected screen.

## Figma Make

This repository follows the Figma Make React/Vite scaffold. `vite.config.ts` loads the Figma Make Vite plugins, `.figma/make/site.json` holds the generated site metadata (including `robots.index: false`), and `AGENTS.md` documents the scaffold for the in-editor agent. The app can be developed in the Figma Make preview or run locally with the commands above.
