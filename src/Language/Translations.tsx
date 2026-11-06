// src/Language/translations.ts

export const translations = {
  en: {
    // Login
    appName: 'QuickBite',
    appTagline: 'HSUHK Canteen Pre-Order',
    universityEmail: 'University Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In with HSUHK Portal',
    termsNotice: "By signing in you agree to HSUHK's Terms of Service and Privacy Policy",

    // Home
    goodMorning: 'Good Morning',
    ordersOpenUntil: 'Lunch orders open until 11:00',
    kitchenOpen: 'Kitchen open now',
    waitTime: 'wait',
    todaysLunch: "Today's Lunch",
    browseMenu: 'Browse Menu →',
    dishesAvailable: 'dishes · Orders close at 11:00',
    recentOrders: 'Recent Orders',
    collected: 'Collected',
    notice: 'Notice',

    // Bottom nav
    home: 'Home',
    order: 'Order',
    orders: 'Orders',
    profile: 'Profile',

    // Profile
    studentId: 'Student ID',
    myOrders: 'My Orders',
    favorites: 'Favorites',
    paymentMethods: 'Payment Methods',
    notifications: 'Notifications',
    account: 'Account',
    privacy: 'Privacy',
    helpSupport: 'Help & Support',
    accessibility: 'Accessibility & Language',
    logOut: 'Log Out',
    appVersion: 'QuickBite v1.0.0 · HSUHK Canteen',

    // Shared / misc
    retry: 'Retry',
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
  },

  "zh-Hant": {
    // Login
    appName: 'QuickBite',
    appTagline: '恒大飯堂預先點餐',
    universityEmail: '大學電郵',
    password: '密碼',
    forgotPassword: '忘記密碼？',
    signIn: '使用恒大入口網站登入',
    termsNotice: '登入即表示您同意恒大的服務條款及私隱政策',

    // Home
    goodMorning: '早晨',
    ordersOpenUntil: '午膳訂購至 11:00 截止',
    kitchenOpen: '廚房現正開放',
    waitTime: '等候',
    todaysLunch: '今日午膳',
    browseMenu: '瀏覽菜單 →',
    dishesAvailable: '款菜式 · 訂購至 11:00 截止',
    recentOrders: '最近訂單',
    collected: '已取餐',
    notice: '公告',

    // Bottom nav
    home: '主頁',
    order: '點餐',
    orders: '訂單',
    profile: '我的',

    // Profile
    studentId: '學號',
    myOrders: '我的訂單',
    favorites: '我的收藏',
    paymentMethods: '付款方式',
    notifications: '通知設定',
    account: '帳戶設定',
    privacy: '私隱政策',
    helpSupport: '幫助及支援',
    accessibility: '無障礙及語言',
    logOut: '登出',
    appVersion: 'QuickBite v1.0.0 · 恒大飯堂',

    // Shared / misc
    retry: '重試',
    confirm: '確認',
    cancel: '取消',
    back: '返回',
  },
  "zh-Hans": {
    appName: 'QuickBite',
    appTagline: '香港恒生大学食堂预先点餐',
    universityEmail: '大学邮箱',
    password: '密码',
    forgotPassword: '忘记密码？',
    signIn: '使用恒大门户登录',
    termsNotice: '登录即表示您同意恒大的服务条款及隐私政策',
    goodMorning: '早上好',
    ordersOpenUntil: '午餐订购于 11:00 截止',
    kitchenOpen: '厨房现已开放',
    waitTime: '等候',
    todaysLunch: '今日午餐',
    browseMenu: '浏览菜单 →',
    dishesAvailable: '款菜品 · 订购于 11:00 截止',
    recentOrders: '最近订单',
    collected: '已取餐',
    notice: '公告',
    home: '主页',
    order: '点餐',
    orders: '订单',
    profile: '我的',
    studentId: '学号',
    myOrders: '我的订单',
    favorites: '我的收藏',
    paymentMethods: '付款方式',
    notifications: '通知设置',
    account: '账户设置',
    privacy: '隐私政策',
    helpSupport: '帮助与支持',
    accessibility: '无障碍及语言',
    logOut: '退出登录',
    appVersion: 'QuickBite v1.0.0 · 恒大食堂',
    retry: '重试',
    confirm: '确认',
    cancel: '取消',
    back: '返回',
  },
} as const

export type Lang = keyof typeof translations
export type TranslationKey = keyof typeof translations['en']
