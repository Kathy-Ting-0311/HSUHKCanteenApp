import { useLayoutEffect, useRef, type ReactNode } from "react"
import { useApp } from "../context"
import type { Lang } from "./Translations"

type ChinesePair = readonly [traditional: string, simplified: string]

const phrases: Record<string, ChinesePair> = {
  "Accessibility & Language": ["無障礙及語言", "无障碍及语言"],
  "Language": ["語言", "语言"],
  "Applies to menus, buttons, prices, pickup times, payments and order updates.": ["適用於餐牌、按鈕、價錢、取餐時間、付款及訂單通知。", "适用于菜单、按钮、价格、取餐时间、付款及订单通知。"],
  "Text Size": ["文字大小", "文字大小"],
  "Changes text everywhere in the app and is remembered next time.": ["全個應用程式的文字都會更改，並會記住你的選擇。", "整个应用的文字都会更改，并会记住你的选择。"],
  "Small": ["小", "小"],
  "Default": ["預設", "默认"],
  "Large": ["大", "大"],
  "Extra Large": ["特大", "特大"],
  "Live preview": ["即時預覽", "实时预览"],
  "Tender char siu glazed pork belly on jasmine rice with blanched kai-lan.": ["蜜汁叉燒配茉莉香米及灼芥蘭。", "蜜汁叉烧配茉莉香米及焯芥兰。"],
  "Pickup 12:45 · QB-4821": ["取餐 12:45 · QB-4821", "取餐 12:45 · QB-4821"],
  "Theme": ["主題", "主题"],
  "Pick the look that is easiest for you to read.": ["選擇最適合你閱讀的外觀。", "选择最适合你阅读的外观。"],
  "Light Mode": ["淺色模式", "浅色模式"],
  "Dark Mode": ["深色模式", "深色模式"],
  "High Contrast Mode": ["高對比模式", "高对比模式"],
  "Warm cream background": ["溫暖米色背景", "温暖米色背景"],
  "Easier on the eyes at night": ["夜間閱讀更舒適", "夜间阅读更舒适"],
  "Black and white with bold outlines": ["黑白配粗邊框", "黑白配粗边框"],
  "Status Guide": ["狀態說明", "状态说明"],
  "Every status uses a label, an icon and a shape, so colour is never the only clue.": ["每個狀態都有文字、圖示和形狀，不會只靠顏色區分。", "每个状态都有文字、图标和形状，不会只靠颜色区分。"],
  "Payment failed": ["付款失敗", "付款失败"],
  "Full": ["已滿", "已满"],
  "Check your email address": ["請檢查電郵地址", "请检查邮箱地址"],
  "It should look like name@hsu.edu.hk. Your other details are still saved.": ["格式應為 name@hsu.edu.hk，其他資料已保留。", "格式应为 name@hsu.edu.hk，其他资料已保留。"],
  "You are offline": ["你目前沒有網絡連線", "你目前没有网络连接"],
  "We could not reach the kitchen. Your cart is safe.": ["暫時無法連線至廚房，購物車內容已保留。", "暂时无法连接到厨房，购物车内容已保留。"],
  "Retry": ["重試", "重试"],
  "Order Received": ["已收到訂單", "已收到订单"],
  "Current status": ["目前狀態", "当前状态"],
  "Now": ["目前", "当前"],
  "Done": ["已完成", "已完成"],
  "Upcoming": ["稍後", "稍后"],
  "You have collected your meal. Enjoy!": ["你已取餐，請慢用！", "你已取餐，请慢用！"],
  "Collect at": ["取餐地點", "取餐地点"],
  "Estimated ready": ["預計完成", "预计完成"],
  "Ready now": ["現可取餐", "现可取餐"],
  "In progress": ["進行中", "进行中"],
  "Mark as Collected": ["標記為已取餐", "标记为已取餐"],
  "Placing your order…": ["正在提交訂單…", "正在提交订单…"],
  "Completed": ["已完成", "已完成"],
  "HSUHK Canteen Pre-Order": ["恒大飯堂預先點餐", "恒大食堂预先点餐"],
  "University Email": ["大學電郵", "大学邮箱"],
  Password: ["密碼", "密码"],
  "Forgot Password?": ["忘記密碼？", "忘记密码？"],
  "Sign In with HSUHK Portal": ["使用恒大入口網站登入", "使用恒大门户登录"],
  "By signing in you agree to HSUHK's Terms of Service and Privacy Policy": ["登入即表示你同意恒大的服務條款及私隱政策", "登录即表示你同意恒大的服务条款及隐私政策"],
  "Good Morning": ["早晨", "早上好"],
  "Lunch orders open until 11:00": ["午膳訂購至 11:00 截止", "午餐订购于 11:00 截止"],
  "Kitchen open now": ["廚房現正開放", "厨房现已开放"],
  "Today's Lunch": ["今日午膳", "今日午餐"],
  "Browse Menu →": ["瀏覽餐牌 →", "浏览菜单 →"],
  "6 dishes · Orders close at 11:00": ["6 款菜式 · 11:00 截止訂購", "6 款菜品 · 11:00 截止订购"],
  "Recent Orders": ["最近訂單", "最近订单"],
  Yesterday: ["昨日", "昨天"],
  Mon: ["週一", "周一"],
  Collected: ["已取餐", "已取餐"],
  Notice: ["公告", "公告"],
  "Special menu on Thursday:": ["星期四特別餐牌：", "星期四特别菜单："],
  "Poon Choi Set": ["盆菜套餐", "盆菜套餐"],
  "at HK$88. Pre-order by Wednesday noon.": ["售價 HK$88，請於星期三中午前預訂。", "售价 HK$88，请于星期三中午前预订。"],
  Home: ["主頁", "主页"],
  Order: ["點餐", "点餐"],
  Orders: ["訂單", "订单"],
  Profile: ["我的", "我的"],
  "Student ID": ["學號", "学号"],
  "My Orders": ["我的訂單", "我的订单"],
  Favorites: ["我的收藏", "我的收藏"],
  "Payment Methods": ["付款方式", "付款方式"],
  Notifications: ["通知設定", "通知设置"],
  Account: ["帳戶設定", "账户设置"],
  Privacy: ["私隱政策", "隐私政策"],
  "Help & Support": ["幫助及支援", "帮助与支持"],
  "Log Out": ["登出", "退出登录"],
  "Today's Menu": ["今日餐牌", "今日菜单"],
  "Weekly Menu": ["本週餐牌", "本周菜单"],
  "Week of 22–27 Sep · Stalls 1, 3 & 4": ["9 月 22 至 27 日 · 1、3 及 4 號檔口", "9 月 22 至 27 日 · 1、3 和 4 号档口"],
  "Monday, 22 Sep · Stalls 1, 3 & 4": ["9 月 22 日，星期一 · 1、3 及 4 號檔口", "9 月 22 日，星期一 · 1、3 和 4 号档口"],
  Tue: ["週二", "周二"],
  Wed: ["週三", "周三"],
  Thu: ["週四", "周四"],
  Fri: ["週五", "周五"],
  Sat: ["週六", "周六"],
  Monday: ["星期一", "星期一"],
  Tuesday: ["星期二", "星期二"],
  Wednesday: ["星期三", "星期三"],
  Thursday: ["星期四", "星期四"],
  Friday: ["星期五", "星期五"],
  Saturday: ["星期六", "星期六"],
  "4 dishes available": ["4 款菜式可供選擇", "4 款菜品可供选择"],
  "Preview only": ["只供預覽", "仅供预览"],
  "View only": ["只供查看", "仅供查看"],
  "Ordering is only available for today's menu.": ["只可訂購今日餐牌的菜式。", "仅可订购今日菜单的菜品。"],
  "Switch to today": ["切換至今日", "切换至今日"],
  "Got it": ["知道了", "知道了"],
  "A duplicate charge could result. Use": ["可能會重複扣款。請先使用", "可能会重复扣款。请先使用"],
  "Alipay HK": ["Alipay HK", "Alipay HK"],
  "AlipayHK": ["Alipay HK", "Alipay HK"],
  "Transaction ID: ALIPAY-ERR-2024-9822": ["交易編號：ALIPAY-ERR-2024-9822", "交易编号：ALIPAY-ERR-2024-9822"],
  "have been processed.": ["已被處理。", "已被处理。"],
  "may or may not": ["可能已經或尚未", "可能已经或尚未"],
  "⚡ Exception Demos": ["⚡ 異常情況示範", "⚡ 异常情况演示"],
  "Text size": ["文字大小", "文字大小"],
  "Choose any drink; iced drinks have their own surcharge": ["可選任何飲品；凍飲另有加價", "可选任何饮品；冻饮另有加价"],
  "Choose one side dish": ["選擇一款小食", "选择一款小食"],
  "Choose one soup": ["選擇一款湯", "选择一款汤"],
  "Coca-Cola": ["可樂", "可乐"],
  "Green tea": ["綠茶", "绿茶"],
  "Daily soup of the day": ["例湯", "例汤"],
  "Winter melon soup": ["冬瓜湯", "冬瓜汤"],
  "Egg drop soup": ["蛋花湯", "蛋花汤"],
  "Blanched kai-lan": ["白灼芥蘭", "白灼芥兰"],
  "Braised tofu": ["滷水豆腐", "卤水豆腐"],
  "Marinated cucumber": ["涼拌青瓜", "凉拌青瓜"],
  "Lemon tea": ["檸檬茶", "柠檬茶"],
  "Lemon water": ["檸檬水", "柠檬水"],
  "Dish + drink, soup & side": ["菜式 + 飲品、湯及小食", "菜品 + 饮品、汤及小食"],
  "Dish only": ["只要菜式", "只要菜品"],
  "Make it a set: add a drink, a soup and a side dish. Choose at the next step.": ["升級為套餐：加配飲品、湯及小食，下一步再選擇。", "升级为套餐：加配饮品、汤及小食，下一步再选择。"],
  "Order type": ["訂購類型", "订购类型"],
  "Set drink": ["套餐飲品", "套餐饮品"],
  "Set menu": ["套餐", "套餐"],
  "Set menu (drink, soup & side)": ["套餐（飲品、湯及小食）", "套餐（饮品、汤及小食）"],
  "Set soup": ["套餐湯品", "套餐汤品"],
  "Side dish": ["小食", "小食"],
  "Temperature": ["溫度", "温度"],
  "À la carte": ["單點", "单点"],
  "☕ Hot": ["☕ 熱", "☕ 热"],
  "🧊 Iced": ["🧊 凍", "🧊 冻"],
  "11:30 AM – 2:00 PM. Slots marked Full (striped, with a ⊘ icon) have more than 20 orders queued and cannot be selected. Pick an open slot for faster pickup.": ["上午 11:30 至下午 2:00。標示為「已滿」（斜紋及 ⊘ 圖示）的時段已有超過 20 張訂單排隊，無法選擇。選擇有空位的時段可更快取餐。", "上午 11:30 至下午 2:00。标示为“已满”（斜纹及 ⊘ 图标）的时段已有超过 20 份订单排队，无法选择。选择有空位的时段可更快取餐。"],
  "Available →": ["可選擇 →", "可选择 →"],
  "Full (unavailable)": ["已滿（無法選擇）", "已满（无法选择）"],
  "Tip:": ["提示：", "提示："],
  "13:15 has only 3 orders ahead — nearly as good as 13:00.": ["13:15 前方只有 3 張訂單，與 13:00 相差無幾。", "13:15 前方只有 3 份订单，与 13:00 相差无几。"],
  ". Please pick up within 15 minutes.": ["。請於 15 分鐘內取餐。", "。请于 15 分钟内取餐。"],
  "Stall 3": ["3 號檔口", "3 号档口"],
  "Stall 3 – Rice Box Counter": ["3 號檔口 – 飯盒櫃檯", "3 号档口 – 饭盒柜台"],
  "is ready for collection at": ["已可於以下地點取餐：", "已可在以下地点取餐："],
  "— your order was confirmed and payment received. The kitchen is preparing your meal. Head to Stall 3 at your scheduled pickup time.": ["— 你的訂單已確認並已收到付款。廚房正在準備餐點，請於預約取餐時間前往 3 號檔口。", "— 你的订单已确认并已收到付款。厨房正在准备餐点，请在预约取餐时间前往 3 号档口。"],
  "🍱 Your order is ready!": ["🍱 你的訂單已準備好！", "🍱 你的订单已准备好！"],
  "Back to sign in": ["返回登入", "返回登录"],
  "Categories": ["分類", "分类"],
  "Choose the payment method selected by default at checkout.": ["選擇結帳時預設使用的付款方式。", "选择结账时默认使用的付款方式。"],
  "Confirm Password": ["確認密碼", "确认密码"],
  "Contact canteen support": ["聯絡餐廳支援", "联系餐厅支持"],
  "Create account": ["建立帳戶", "创建账户"],
  "Local QuickBite account": ["本機 QuickBite 帳戶", "本机 QuickBite 账户"],
  "Pay securely in the AlipayHK app": ["在 AlipayHK 應用程式安全付款", "在 AlipayHK 应用安全付款"],
  "Pay when collecting your meal": ["取餐時付款", "取餐时付款"],
  "Order updates": ["訂單通知", "订单通知"],
  "Pickup reminders and order status changes": ["取餐提醒及訂單狀態更新", "取餐提醒及订单状态更新"],
  "Offers and menu news": ["優惠及餐牌消息", "优惠及菜单消息"],
  "New dishes, promotions and canteen notices": ["新菜式、推廣及飯堂公告", "新菜品、促销及饭堂公告"],
  "Lunch window 11:30 – 14:00. Full slots cannot be selected.": ["午膳時段 11:30 – 14:00，已滿時段無法選擇。", "午膳时段 11:30 – 14:00，已满时段无法选择。"],
  "Continue": ["繼續", "继续"],
  "Confirm": ["確認", "确认"],
  "As guest": ["以訪客身分進入", "以访客身份进入"],
  "Upgrade to set menu": ["升級為套餐", "升级为套餐"],
  "Add a drink, soup & side dish": ["加配飲品、湯及小食", "加配饮品、汤及小食"],
  "Edit Profile": ["編輯", "编辑"],
  "Edit profile": ["編輯個人資料", "编辑个人资料"],
  "User Name": ["用戶名稱", "用户名称"],
  Email: ["電郵", "邮箱"],
  "Full Name": ["全名", "全名"],
  "Get assistance with ordering, payment or meal collection.": ["取得訂購、付款或取餐方面的協助。", "获取订购、付款或取餐方面的协助。"],
  "Pickup available period": ["可取餐時段", "可取餐时段"],
  "Open now": ["現正開放", "现正开放"],
  "Opens at 11:30": ["11:30 開始", "11:30 开始"],
  "Closed for today": ["今日已結束", "今日已结束"],
  "Sorry, this dish is sold out and cannot be ordered right now. Please choose another dish.": ["抱歉，此菜式已售罄，暫時無法訂購，請選擇其他菜式。", "抱歉，此菜品已售罄，暂时无法订购，请选择其他菜品。"],
  "No favourites yet": ["暫無收藏", "暂无收藏"],
  "Tap the star on a dish to save it here.": ["點擊菜式上的星形圖示即可收藏。", "点击菜品上的星形图标即可收藏。"],
  "Your saved dishes for quick reordering.": ["你收藏的菜式，方便快速再訂。", "你收藏的菜品，方便快速再订。"],
  "Save HK$1 / item": ["每份可減 HK$1", "每份可减 HK$1"],
  "Hello!": ["你好！", "你好！"],
  "How can we help?": ["需要什麼協助？", "需要什么协助？"],
  "Name, student ID, university email, preferences and prototype order activity.": ["姓名、學生編號、大學電郵、偏好設定及原型訂單記錄。", "姓名、学生编号、大学邮箱、偏好设置及原型订单记录。"],
  "New to QuickBite?": ["初次使用 QuickBite？", "初次使用 QuickBite？"],
  "No dishes match. Try another category or search.": ["找不到相符的菜式，請試試其他分類或搜尋。", "找不到相符的菜品，请试试其他分类或搜索。"],
  "No real card or Alipay credentials are collected by this prototype.": ["此原型不會收集任何真實信用卡或支付寶資料。", "此原型不会收集任何真实信用卡或支付宝资料。"],
  "Open your orders to check status and pickup details": ["查看訂單狀態及取餐詳情", "查看订单状态及取餐详情"],
  "Order support": ["訂單支援", "订单支持"],
  "Payment help": ["付款協助", "付款协助"],
  "Payment privacy": ["付款私隱", "付款隐私"],
  "Profile details are linked to your local HSUHK account and stay available after refresh.": ["個人資料與你的本機 HSUHK 帳戶連結，重新整理後仍會保留。", "个人资料与你的本机 HSUHK 账户关联，刷新后仍会保留。"],
  "QuickBite stores your local account, language preference, cart and order history in this browser for the academic prototype.": ["此學術原型會在本瀏覽器儲存你的本機帳戶、語言偏好、購物車及訂單記錄。", "此学术原型会在本浏览器存储你的本机账户、语言偏好、购物车及订单记录。"],
  "Register once, then sign in directly next time.": ["註冊一次，下次即可直接登入。", "注册一次，下次即可直接登录。"],
  "Review available payment methods": ["查看可用的付款方式", "查看可用的付款方式"],
  "Search": ["搜尋", "搜索"],
  "Search dishes": ["搜尋菜式", "搜索菜品"],
  "Sign Up": ["註冊", "注册"],
  "Sign in": ["登入", "登录"],
  "Signed in as": ["登入身分：", "登录身份："],
  "What we store": ["我們儲存的資料", "我们存储的资料"],
  "Your HSUHK account details": ["你的 HSUHK 帳戶資料", "你的 HSUHK 账户资料"],
  "Your data stays on this device": ["你的資料只保存在此裝置", "你的资料只保存在此设备"],
  "Your saved dishes are ready for quick reordering.": ["你收藏的菜式可隨時快速再訂。", "你收藏的菜品可随时快速再订。"],
  "at HK$88.": ["，售價 HK$88。", "，售价 HK$88。"],
  "Pre-order by Wednesday noon.": ["請於星期三中午前預訂。", "请于星期三中午前预订。"],
  "1× Steamed Chicken Rice": ["1× 白切雞飯", "1× 白切鸡饭"],
  "HK$40": ["HK$40", "HK$40"],
  "No. 3": ["3 號", "3 号"],
  "QR expires in": ["二維碼有效時間：", "二维码有效时间："],
  "Ready ✓": ["已備妥 ✓", "已备妥 ✓"],
  "Valid until 13:15 · Stall 3": ["有效至 13:15 · 3 號檔口", "有效至 13:15 · 3 号档口"],
  "Current order status": ["目前訂單狀態", "当前订单状态"],
  "Error": ["錯誤", "错误"],
  "Failed": ["失敗", "失败"],
  "Fat": ["脂肪", "脂肪"],
  "Info": ["資訊", "信息"],
  "Success": ["成功", "成功"],
  "Warning": ["警告", "警告"],
  "kcal": ["千卡", "千卡"],
  "Close order list": ["關閉訂單列表", "关闭订单列表"],
  "Free": ["免費", "免费"],
  "Increase quantity": ["增加數量", "增加数量"],
  "Items": ["項目", "项目"],
  "Need tableware": ["需要餐具", "需要餐具"],
  "No tableware": ["不需要餐具", "不需要餐具"],
  "Nothing here yet. Add a dish to get started.": ["這裡暫時沒有內容，加入菜式即可開始。", "这里暂时没有内容，加入菜品即可开始。"],
  "Open order list": ["打開訂單列表", "打开订单列表"],
  "Pickup fee": ["取餐費", "取餐费"],
  "Pickup fee (self-pickup at stall)": ["取餐費（到檔口自取）", "取餐费（到档口自取）"],
  "Tableware": ["餐具", "餐具"],
  "View order list": ["查看訂單列表", "查看订单列表"],
  "Your order": ["你的訂單", "你的订单"],
  "Main": ["主選單", "主菜单"],
  "Already have an account?": ["已有帳戶？", "已有账户？"],
  "At least 6 characters": ["至少 6 個字元", "至少 6 个字符"],
  "Chan Tai Man": ["陳大文", "陈大文"],
  "Re-enter password": ["再次輸入密碼", "再次输入密码"],
  "your@hsu.edu.hk": ["your@hsu.edu.hk", "your@hsu.edu.hk"],
  "your@hsuhk.edu.hk": ["your@hsuhk.edu.hk", "your@hsuhk.edu.hk"],
  "Quiet": ["清靜", "清静"],
  "Moderate": ["適中", "适中"],
  "By confirming, you agree to the": ["確認即表示你同意", "确认即表示你同意"],
  "Order collected at": ["已於以下檔口取餐：", "已于以下档口取餐："],
  "Special menu on Thursday: Poon Choi Set at HK$88. Pre-order by Wednesday noon.": ["星期四特別餐牌：盆菜套餐 售價 HK$88，請於星期三中午前預訂。", "星期四特别菜单：盆菜套餐 售价 HK$88，请于星期三中午前预订。"],
  "Announcement": ["公告", "公告"],
  "Change language": ["更改語言", "更改语言"],
  "Orders queued": ["排隊中的訂單", "排队中的订单"],
  "Today's Picks": ["今日精選", "今日精选"],
  "Featured": ["精選推介", "精选推荐"],
  "All": ["全部", "全部"],
  "Rice Box": ["飯盒", "饭盒"],
  "Noodles": ["粉麵", "粉面"],
  "Healthy": ["健康餐", "健康餐"],
  "Terms of Service and Privacy Policy": ["服務條款及私隱政策", "服务条款及隐私政策"],
  "By signing in you agree to HSUHK's": ["登入即表示你同意 HSUHK 的", "登录即表示你同意 HSUHK 的"],
  "Sign In": ["登入", "登录"],
  "Ordering unavailable": ["暫不可下單", "暂不可下单"],
  "Ordering is available for Monday's menu only.": ["只可訂購星期一餐牌的菜式。", "仅可订购星期一菜单的菜品。"],
  "Search dishes...": ["搜尋菜式…", "搜索菜品…"],
  "Simulate Network Error": ["模擬網絡錯誤", "模拟网络错误"],
  "Lunch Boxes & Noodles": ["飯盒及粉麵", "饭盒及面食"],
  "No dishes found": ["找不到菜式", "未找到菜品"],
  "Connection Lost": ["連線中斷", "连接中断"],
  "We couldn't load the menu. Check your Wi-Fi or mobile data and try again.": ["未能載入餐牌。請檢查 Wi-Fi 或流動數據後再試。", "无法加载菜单。请检查 Wi-Fi 或移动数据后重试。"],
  "Network error": ["網絡錯誤", "网络错误"],
  "Last updated: 9:38 AM · Menu may have changed": ["最後更新：上午 9:38 · 餐牌可能已有變更", "最后更新：上午 9:38 · 菜单可能已有变更"],
  "Retry Connection": ["重新連線", "重新连接"],
  "Back to Home": ["返回主頁", "返回主页"],
  Popular: ["熱門", "热门"],
  Spicy: ["辣", "辣"],
  Veg: ["素食", "素食"],
  "Sold out": ["售罄", "售罄"],
  "Nutrition per serving": ["每份營養", "每份营养"],
  Calories: ["卡路里", "卡路里"],
  Carbs: ["碳水化合物", "碳水化合物"],
  Protein: ["蛋白質", "蛋白质"],
  "Add to Cart": ["加入購物車", "加入购物车"],
  Customise: ["自訂選項", "自定义选项"],
  Quantity: ["數量", "数量"],
  "Special Notes": ["特別備註", "特别备注"],
  "e.g. Less salt, no chilli sauce...": ["例如少鹽、不要辣椒醬…", "例如少盐、不要辣椒酱…"],
  Remarks: ["備註", "备注"],
  "Less salt": ["少鹽", "少盐"],
  "No spring onion": ["不要蔥", "不要葱"],
  "No chilli sauce": ["不要辣椒醬", "不要辣椒酱"],
  "Sauce on the side": ["醬汁另上", "酱汁另上"],
  "Select all that apply": ["可選擇多項", "可选择多项"],
  "Add a drink": ["加配飲品", "加配饮品"],
  "Hot drink": ["熱飲", "热饮"],
  "Iced drink": ["凍飲", "冰饮"],
  Included: ["已包括", "已包含"],
  "Choose one drink": ["可選擇一款飲品", "可选择一款饮品"],
  Allergens: ["致敏原", "过敏原"],
  "Contains gluten, soy, sesame. Made in a shared kitchen.": ["含麩質、大豆及芝麻，並於共用廚房製作。", "含麸质、大豆和芝麻，并在共用厨房制作。"],
  "Your Cart": ["你的購物車", "你的购物车"],
  "Cart is Empty": ["購物車是空的", "购物车是空的"],
  "Add something from the menu to get started.": ["先從餐牌加入喜愛的菜式吧。", "先从菜单添加喜欢的菜品吧。"],
  "Browse Menu": ["瀏覽餐牌", "浏览菜单"],
  "Simulate Item Sold Out": ["模擬菜式售罄", "模拟菜品售罄"],
  Subtotal: ["小計", "小计"],
  "Service fee": ["服務費", "服务费"],
  Total: ["總計", "总计"],
  "Choose Pickup Time →": ["選擇取餐時間 →", "选择取餐时间 →"],
  "Item sold out": ["菜式已售罄", "菜品已售罄"],
  "BBQ Pork Rice Box just sold out while you were shopping. Please choose an alternative.": ["叉燒飯剛剛售罄，請選擇其他菜式。", "叉烧饭刚刚售罄，请选择其他菜品。"],
  "See Alternatives": ["查看替代選擇", "查看替代选择"],
  "Continue Without It": ["不選此項並繼續", "不选此项并继续"],
  Alternatives: ["替代選擇", "替代选择"],
  "Replacing BBQ Pork Rice Box": ["替代叉燒飯", "替代叉烧饭"],
  "Similar dishes for you": ["為你推薦相似菜式", "为你推荐相似菜品"],
  "Based on your past orders and ratings, here are our picks.": ["根據你的過往訂單及評分，我們有以下推薦。", "根据你的过往订单和评分，我们有以下推荐。"],
  "Swap →": ["更換 →", "更换 →"],
  "Pickup Time": ["取餐時間", "取餐时间"],
  "Lunch window:": ["午膳時段：", "午餐时段："],
  "11:30 AM – 2:00 PM. Busy slots (🔴) have >20 orders queued — consider a quieter time for faster pickup.": ["上午 11:30 至下午 2:00。繁忙時段有超過 20 張訂單，建議選擇較清閒的時間以便更快取餐。", "上午 11:30 至下午 2:00。繁忙时段有超过 20 份订单，建议选择较空闲的时间以便更快取餐。"],
  "Smart Pickup Recommendation": ["智能取餐建議", "智能取餐建议"],
  "Smart Pickup Recommendation →": ["智能取餐建議 →", "智能取餐建议 →"],
  "We'll find the quietest slot for you": ["我們會為你尋找最清閒的時段", "我们会为你寻找最空闲的时段"],
  "Or pick manually": ["或自行選擇", "或自行选择"],
  Selected: ["已選擇", "已选择"],
  Busy: ["繁忙", "繁忙"],
  Available: ["可選", "可选"],
  Best: ["最佳", "最佳"],
  "Select a Time Slot": ["選擇時段", "选择时段"],
  "Smart Pickup": ["智能取餐", "智能取餐"],
  "AI-Recommended": ["AI 推薦", "AI 推荐"],
  "Best pickup time": ["最佳取餐時間", "最佳取餐时间"],
  "Today, Monday 22 Sep": ["今天，9 月 22 日星期一", "今天，9 月 22 日星期一"],
  "Orders ahead": ["前方訂單", "前方订单"],
  "Min wait": ["分鐘等候", "分钟等候"],
  "Why 13:00?": ["為何選擇 13:00？", "为何选择 13:00？"],
  "Queue drops by 78% after 12:45": ["12:45 後輪候量下降 78%", "12:45 后排队量下降 78%"],
  "Your dish is quick — ~6 min to prepare": ["你的菜式製作快捷，約需 6 分鐘", "你的菜品制作快捷，约需 6 分钟"],
  "Most students have 12–1 pm lectures on Mondays": ["大多數學生星期一中午 12 至 1 時上課", "大多数学生星期一中午 12 至 1 时上课"],
  "38 minutes from now — fits between your 12:20 lecture": ["距現在 38 分鐘，適合你的課堂空檔", "距现在 38 分钟，适合你的课堂空档"],
  "Queue forecast today": ["今日輪候預測", "今日排队预测"],
  Recommended: ["推薦", "推荐"],
  Peak: ["高峰", "高峰"],
  "Simulate Slot Full": ["模擬時段已滿", "模拟时段已满"],
  "Book 13:00 Pickup →": ["預約 13:00 取餐 →", "预约 13:00 取餐 →"],
  "Pick a different time manually": ["自行選擇其他時間", "自行选择其他时间"],
  "Slot Unavailable": ["時段不可用", "时段不可用"],
  "13:00 slot just filled up": ["13:00 時段剛剛額滿", "13:00 时段刚刚满额"],
  "Someone else booked this slot while you were reviewing. Don't worry — we've found alternatives below.": ["你查看期間該時段已被預約。別擔心，我們已找到以下替代時段。", "你查看期间该时段已被预约。别担心，我们已找到以下替代时段。"],
  "Next available times": ["下一個可選時段", "下一可选时段"],
  "See All Available Slots": ["查看所有可選時段", "查看所有可选时段"],
  "New Slot Options": ["新時段選擇", "新时段选择"],
  "13:00 is full — pick an alternative": ["13:00 已滿，請選擇其他時段", "13:00 已满，请选择其他时段"],
  Checkout: ["結帳", "结账"],
  "Order Summary": ["訂單摘要", "订单摘要"],
  Qty: ["數量", "数量"],
  today: ["今天", "今天"],
  Change: ["更改", "更改"],
  "Payment Method": ["付款方式", "付款方式"],
  "Scan QR to pay instantly": ["掃描二維碼即時付款", "扫描二维码即时付款"],
  "Pay at Counter": ["櫃檯付款", "柜台付款"],
  "Cash or Octopus when collecting": ["取餐時以現金或八達通付款", "取餐时以现金或八达通付款"],
  "Exception Demos": ["例外情況演示", "异常情况演示"],
  "Simulate Payment Failed": ["模擬付款失敗", "模拟付款失败"],
  "Simulate Payment Timeout": ["模擬付款逾時", "模拟付款超时"],
  "Pay with Alipay HK": ["使用 Alipay HK 付款", "使用 Alipay HK 付款"],
  "Confirm · Pay at Counter": ["確認 · 櫃檯付款", "确认 · 柜台付款"],
  "Canteen Order Policy": ["飯堂訂餐政策", "食堂订餐政策"],
  Processing: ["處理中", "处理中"],
  "Connecting to Alipay HK.": ["正在連接 Alipay HK。", "正在连接 Alipay HK。"],
  "Do not close this screen.": ["請勿關閉此畫面。", "请勿关闭此页面。"],
  "Simulate Success": ["模擬成功", "模拟成功"],
  "Simulate Failed": ["模擬失敗", "模拟失败"],
  "Simulate Timeout": ["模擬逾時", "模拟超时"],
  "Payment Failed": ["付款失敗", "付款失败"],
  "Payment Declined": ["付款被拒", "付款被拒"],
  "Your Alipay HK payment was not processed. This may be due to insufficient balance or a connection issue.": ["Alipay HK 付款未能處理，可能是餘額不足或連線問題。", "Alipay HK 付款未能处理，可能是余额不足或连接问题。"],
  "No funds were charged. Your order is still held for 5 minutes.": ["未有扣款，訂單仍會保留 5 分鐘。", "未有扣款，订单仍会保留 5 分钟。"],
  "Retry Payment": ["重新付款", "重新付款"],
  "Change Payment Method": ["更改付款方式", "更改付款方式"],
  "Why failed?": ["為何失敗？", "为何失败？"],
  "Payment Timeout": ["付款逾時", "付款超时"],
  "Request Timed Out": ["請求逾時", "请求超时"],
  "Do not retry immediately": ["請勿立即重試", "请勿立即重试"],
  "Check Order Status": ["檢查訂單狀態", "检查订单状态"],
  "Return to Checkout": ["返回結帳", "返回结账"],
  "What happened?": ["發生甚麼事？", "发生了什么？"],
  "Order Confirmed": ["訂單已確認", "订单已确认"],
  "Payment received · Mon, 22 Sep": ["已收款 · 9 月 22 日星期一", "已收款 · 9 月 22 日星期一"],
  "Pickup time": ["取餐時間", "取餐时间"],
  "Collection point": ["取餐地點", "取餐地点"],
  "Kitchen notified": ["廚房已收到通知", "厨房已收到通知"],
  "Your order has been sent to the kitchen. You'll receive a push notification when it's ready.": ["訂單已送交廚房，餐點備妥後你會收到推送通知。", "订单已发送至厨房，餐点备妥后你会收到推送通知。"],
  "Your Order": ["你的訂單", "你的订单"],
  "Total Paid (Alipay)": ["已付款總額（Alipay）", "已付款总额（Alipay）"],
  "Track My Order": ["追蹤我的訂單", "跟踪我的订单"],
  "Order Tracking": ["訂單追蹤", "订单跟踪"],
  "Order History": ["訂單紀錄", "订单记录"],
  "All Orders": ["所有訂單", "所有订单"],
  "No orders yet": ["尚未有訂單", "暂无订单"],
  "Your completed orders will appear here.": ["已完成的訂單會顯示在此。", "已完成的订单会显示在这里。"],
  Confirmed: ["已確認", "已确认"],
  Status: ["狀態", "状态"],
  "Estimated Ready": ["預計備妥", "预计备妥"],
  "Ready! 🎉": ["已備妥！", "已备妥！"],
  "Order Progress": ["訂單進度", "订单进度"],
  "Advance to Next Step": ["前往下一步", "前往下一步"],
  "View Pickup Notification": ["查看取餐通知", "查看取餐通知"],
  "Show Pickup Code": ["顯示取餐碼", "显示取餐码"],
  "Collection Point": ["取餐地點", "取餐地点"],
  "Ground floor, near entrance B": ["地下，B 入口附近", "一层，B 入口附近"],
  "Connection lost": ["連線中斷", "连接中断"],
  "Last Known Status": ["最後已知狀態", "最后已知状态"],
  "Preparing your order": ["正在準備你的訂單", "正在准备你的订单"],
  "Don't worry": ["不用擔心", "不用担心"],
  Location: ["地點", "地点"],
  "Reconnect & Refresh": ["重新連線並更新", "重新连接并刷新"],
  "Show Pickup Code Offline": ["離線顯示取餐碼", "离线显示取餐码"],
  now: ["現在", "现在"],
  "Your order is ready!": ["你的訂單已備妥！", "你的订单已备妥！"],
  "Tap notification to collect →": ["點按通知取餐 →", "点击通知取餐 →"],
  "Head to Stall 3 and show the QR code or pickup code to the staff.": ["前往 3 號檔口並向職員出示二維碼或取餐碼。", "前往 3 号档口并向工作人员出示二维码或取餐码。"],
  "Scan QR Code": ["掃描二維碼", "扫描二维码"],
  or: ["或", "或"],
  "Pickup Code": ["取餐碼", "取餐码"],
  "Your order is ready for pickup!": ["你的訂單已可取餐！", "你的订单已可取餐！"],
  "Head to Stall 3 and show this code to the staff.": ["前往 3 號檔口並向職員出示此碼。", "前往 3 号档口并向工作人员出示此码。"],
  "Order Number": ["訂單編號", "订单编号"],
  "Pickup slot": ["取餐時段", "取餐时段"],
  Stall: ["檔口", "档口"],
  Ready: ["已備妥", "已备妥"],
  "4-digit Pickup Code": ["4 位數取餐碼", "4 位数取餐码"],
  "Tell the staff this code or show it on screen": ["告知職員此碼或直接出示畫面", "告知工作人员此码或直接出示页面"],
  "Show QR Code Instead": ["改為顯示二維碼", "改为显示二维码"],
  "Pickup QR": ["取餐二維碼", "取餐二维码"],
  "Simulate Staff Scan": ["模擬職員掃描", "模拟工作人员扫描"],
  "Use Number Code Instead": ["改用數字取餐碼", "改用数字取餐码"],
  "QR Scanned!": ["二維碼已掃描！", "二维码已扫描！"],
  "Your order has been verified. Collect your meal from the counter.": ["訂單已核實，請到櫃檯領取餐點。", "订单已核实，请到柜台领取餐点。"],
  "I've Collected My Order →": ["我已領取訂單 →", "我已领取订单 →"],
  "Enjoy your meal!": ["請慢用！", "请慢用！"],
  "Quick Rating": ["快速評分", "快速评分"],
  "How was your Steamed Chicken Rice?": ["白切雞飯味道如何？", "白切鸡饭味道如何？"],
  "Submit Rating": ["提交評分", "提交评分"],
  "Skip for now": ["暫時略過", "暂时跳过"],
  "Skip rating": ["略過評分", "跳过评分"],
  "Thanks for your feedback!": ["多謝你的意見！", "感谢你的反馈！"],
  "Thanks for your feedback! 🙏": ["多謝你的意見！", "感谢你的反馈！"],
  Payment: ["付款", "付款"],
  "Order Again": ["再次點餐", "再次点餐"],
  "Order Queued": ["訂單已排隊", "订单已排队"],
  Preparing: ["準備中", "准备中"],
  "ETA Updated": ["預計時間已更新", "预计时间已更新"],
  "Ready for Pickup": ["可供取餐", "可以取餐"],
  "BBQ Pork Rice Box": ["叉燒飯", "叉烧饭"],
  "Steamed Chicken Rice": ["白切雞飯", "白切鸡饭"],
  "Braised Beef Brisket Noodle": ["柱侯牛腩麵", "柱侯牛腩面"],
  "Curry Fish Ball Udon": ["咖喱魚蛋烏冬", "咖喱鱼丸乌冬"],
  "Vegetarian Claypot Rice": ["齋砵仔飯", "素食煲仔饭"],
  "Wonton Noodle Soup": ["雲吞麵", "云吞面"],
  "Stall 3 – Rice Box": ["3 號檔口 · 飯盒", "3 号档口 · 饭盒"],
  "Stall 1 – Noodles": ["1 號檔口 · 粉麵", "1 号档口 · 面食"],
  "Stall 4 – Healthy": ["4 號檔口 · 健康餐", "4 号档口 · 健康餐"],
  "Tender char siu glazed pork belly on fragrant jasmine rice, served with blanched kai-lan and house soy sauce.": ["蜜汁叉燒配香米飯、灼芥蘭及自家製豉油。", "蜜汁叉烧配香米饭、焯芥蓝及自制酱油。"],
  "Silky poached free-range chicken over oily rice, with ginger-scallion dipping sauce and cucumber ribbons.": ["嫩滑白切雞配油飯、薑蔥醬及青瓜片。", "嫩滑白切鸡配油饭、姜葱酱和黄瓜片。"],
  "Fall-apart beef brisket braised in chu hou paste over flat rice noodles in rich bone broth.": ["柱侯醬炆牛腩配河粉及濃郁骨湯。", "柱侯酱焖牛腩配河粉和浓郁骨汤。"],
  "Springy HK-style fish balls in fragrant yellow curry broth with thick udon noodles and fish tofu.": ["彈牙港式魚蛋配香濃黃咖喱湯、烏冬及魚腐。", "弹牙港式鱼丸配香浓黄咖喱汤、乌冬和鱼豆腐。"],
  "Seasonal vegetables, mushrooms and tofu over brown rice with a light soy glaze. Fully plant-based.": ["時蔬、蘑菇及豆腐配糙米和清淡豉油，全植物製作。", "时蔬、蘑菇和豆腐配糙米和清淡酱油，全植物制作。"],
  "Classic shrimp and pork wontons in clear superior stock over springy egg noodles.": ["經典鮮蝦豬肉雲吞配上湯及彈牙蛋麵。", "经典鲜虾猪肉云吞配高汤和弹牙鸡蛋面。"],
  "The payment server took too long to respond. Your order may or may not have been processed.": ["付款伺服器回應時間過長，你的訂單可能已處理，也可能尚未處理。", "付款服务器响应时间过长，你的订单可能已处理，也可能尚未处理。"],
  "A duplicate charge could result. Use 'Check Order Status' first — the payment may have gone through.": ["立即重試可能導致重複扣款。請先檢查訂單狀態，付款可能已完成。", "立即重试可能导致重复扣款。请先检查订单状态，付款可能已完成。"],
  "A timeout differs from a failure — the server may have processed your payment but not responded in time. Always check status before retrying to avoid double charges.": ["逾時與失敗不同，伺服器可能已處理付款但未及回應。重試前請先檢查狀態，以免重複扣款。", "超时与失败不同，服务器可能已处理付款但未及时响应。重试前请先检查状态，以免重复扣款。"],
  "Common reasons: insufficient Alipay balance, expired card linked to account, or temporary bank hold. Check your Alipay app for details.": ["常見原因包括 Alipay 餘額不足、已連結的銀行卡過期或銀行暫時凍結。詳情請查看 Alipay 應用程式。", "常见原因包括 Alipay 余额不足、已绑定的银行卡过期或银行临时冻结。详情请查看 Alipay 应用。"],
  "Your order has been received by the kitchen.": ["廚房已收到你的訂單。", "厨房已收到你的订单。"],
  "Chef started cooking your meal.": ["廚師已開始製作你的餐點。", "厨师已开始制作你的餐点。"],
  "Estimated pickup moved to 12:55 due to high volume.": ["因訂單量較多，預計取餐時間延至 12:55。", "因订单量较多，预计取餐时间延至 12:55。"],
  "Your order is ready! Proceed to Stall 3.": ["訂單已備妥，請前往 3 號檔口。", "订单已备妥，请前往 3 号档口。"],
  "Show this QR code to the scanner at Stall 3. The staff will hand over your meal after scanning.": ["在 3 號檔口向掃描器出示此二維碼，職員掃描後會交付餐點。", "在 3 号档口向扫描器出示此二维码，工作人员扫描后会交付餐点。"],
}

const reverseTraditional = new Map(Object.values(phrases).map((pair) => [pair[0], pair]))
const normalizedPhrases = new Map(
  Object.entries(phrases).map(([source, pair]) => [source.replace(/\s+/g, " "), pair]),
)
const sortedPhrases = Object.entries(phrases)
  .filter(([source]) => source.length > 3)
  .sort((a, b) => b[0].length - a[0].length)
const originals = new WeakMap<Node, string>()
const attributeOriginals = new WeakMap<Element, Map<string, string>>()

function translateExact(value: string, lang: Lang): string {
  if (lang === "en") return value
  // Cart option lines such as "Soup: Winter melon soup" or comma-joined lists of them.
  if (/(^|, )(Drink|Soup|Side|Remark): /.test(value)) {
    const labels: Record<string, [string, string]> = { Drink: ["飲品", "饮品"], Soup: ["湯", "汤"], Side: ["小食", "小食"], Remark: ["備註", "备注"] }
    return value.split(", ").map(part => {
      const m = part.match(/^(Drink|Soup|Side|Remark): (.*)$/)
      if (!m) return translateExact(part, lang)
      const hm = m[2].match(/^(.*) \((Hot|Iced)\)$/)
      const body = hm ? `${translateExact(hm[1], lang)}（${hm[2] === "Hot" ? (lang === "zh-Hant" ? "熱" : "热") : (lang === "zh-Hant" ? "凍" : "冻")}）` : translateExact(m[2], lang)
      return `${labels[m[1]][lang === "zh-Hant" ? 0 : 1]}：${body}`
    }).join("、")
  }
  const pair = phrases[value] ?? normalizedPhrases.get(value.replace(/\s+/g, " ")) ?? reverseTraditional.get(value)
  if (pair) return pair[lang === "zh-Hant" ? 0 : 1]

  let result = value
  const index = lang === "zh-Hant" ? 0 : 1
  const hant = lang === "zh-Hant"
  const dayNames: Record<string, string> = { Monday: "星期一", Tuesday: "星期二", Wednesday: "星期三", Thursday: "星期四", Friday: "星期五", Saturday: "星期六", Sunday: "星期日" }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const custom = value.match(/^Customise & Add · from (HK\$\d+)$/)
  if (custom) return `${lang === "zh-Hans" ? "自选并加入" : "自訂並加入"} · ${custom[1]} 起`
  const submit = value.match(/^Submit order · (HK\$\d+) →$/)
  if (submit) return `${lang === "zh-Hans" ? "提交订单" : "提交訂單"} · ${submit[1]} →`
  const perItem = value.match(/^\+HK\$(\d+) \/ item$/)
  if (perItem) return `+HK$${perItem[1]} / 份`
  const lead = value.match(/^([^A-Za-z0-9~]+)\s*([A-Za-z].*)$/)
  if (lead) return `${lead[1]} ${translateExact(lead[2], lang)}`
  const prefixed = value.match(/^(Add one more|Remove one|Add) (.+)$/)
  if (prefixed && !/^\d/.test(prefixed[2]) && !/^(to|\d)/.test(prefixed[2])) {
    const verb = prefixed[1] === "Remove one" ? (hant ? "減少一份" : "减少一份") : prefixed[1] === "Add one more" ? (hant ? "多加一份" : "多加一份") : (hant ? "加入" : "加入")
    return `${verb} ${translateExact(prefixed[2], lang)}`
  }
  const slot = value.match(/^(\d{1,2}:\d{2}), (.+)$/)
  if (slot) return `${slot[1]}，${slot[2].split(", ").map(part => translateExact(part, lang)).join("，")}`
  const weekdaysShort: Record<string, string> = { Mon: "週一", Tue: "週二", Wed: "週三", Thu: "週四", Fri: "週五", Sat: "週六", Sun: "週日" }
  const monthFull = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const toHans = (text: string) => (hant ? text : text.replace(/週/g, "周").replace(/訂單/g, "订单").replace(/等候/g, "等候"))
  result = result
    .replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun),? (\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/g, (_m, d: string, n: string, mo: string) => toHans(`${monthFull.indexOf(mo) + 1} 月 ${n} 日（${weekdaysShort[d]}）`))
    .replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),? (\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/g, (_m, d: string, n: string, mo: string) => `${monthFull.indexOf(mo) + 1} 月 ${n} 日${dayNames[d]}`)
    .replace(/(\d+) orders? queued/g, hant ? "$1 張訂單排隊" : "$1 份订单排队")
    .replace(/^Step (\d) of (\d)/, hant ? "第 $1 步，共 $2 步" : "第 $1 步，共 $2 步")
    .replace(/Updated (\d{1,2}:\d{2}) (AM|PM)/, hant ? "更新於 $1 $2" : "更新于 $1 $2")
    .replace(/~?(\d+) ahead/g, hant ? "約 $1 張訂單在前" : "约 $1 份订单在前")
    .replace(/~?(\d+) min wait/g, hant ? "約 $1 分鐘等候" : "约 $1 分钟等候")
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)'s Picks$/, (_m, d: string) => `${dayNames[d]}${hant ? "精選" : "精选"}`)
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d+) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/, (_m, d: string, n: string, mo: string) => `${dayNames[d]}，${monthNames.indexOf(mo) + 1} 月 ${n} 日`)
  result = result
    .replace(/^Tableware × (\d+)$/, "餐具 × $1")
    .replace(/^Today, /, "今天，")
    .replace(/^Qty (\d+)/, "數量 $1")
    .replace(/^(\d{1,2}:\d{2}) today$/, "今天 $1")
    .replace(/^Per item × (\d+)$/, "每份 × $1")
    .replace(/^Your (\d)-star review helps the kitchen\.$/, "您的 $1 星評價能幫助廚房改進。")
    .replace(/^Payment received · /, "已收到付款 · ")
    .replace(/^(\d+) items?$/, "$1 項")
    .replace(/^· (.*)$/, "· $1")
  if (!hant) result = result.replace("數量", "数量").replace("每份", "每份").replace("您的 ", "您的 ").replace("評價能幫助廚房改進", "评价能帮助厨房改进").replace("已收到付款", "已收到付款").replace(/ 星評/, " 星评")
  const replacements: ChinesePair[] = [
    ["項", "项"], ["分鐘", "分钟"], ["等候", "等候"], ["今天", "今天"],
    ["前方", "前方"], ["確認", "确认"], ["取餐", "取餐"],
  ]
  for (const [source, replacement] of sortedPhrases) {
    if (result.includes(source)) result = result.replaceAll(source, replacement[index])
  }
  if (lang === "zh-Hans") {
    for (const [traditional, simplified] of replacements) result = result.replaceAll(traditional, simplified)
  }
  const compact = lang === "zh-Hant"
    ? { item: "項", ahead: "張訂單在前", minute: "分鐘等候", confirm: "確認", pickup: "取餐", add: "加入購物車" }
    : { item: "项", ahead: "份订单在前", minute: "分钟等候", confirm: "确认", pickup: "取餐", add: "加入购物车" }
  result = result
    .replace(/^(\d+) items?$/, `$1 ${compact.item}`)
            .replace(/^Confirm ([\d:]+) Pickup$/, `${compact.confirm} $1 ${compact.pickup}`)
    .replace(/^Add \d+ to Cart/, compact.add)
  return result
}

export function translateText(value: string, lang: Lang): string {
  const leading = value.match(/^\s*/)?.[0] ?? ""
  const trailing = value.match(/\s*$/)?.[0] ?? ""
  const core = value.trim()
  if (!core) return value
  return `${leading}${translateExact(core, lang)}${trailing}`
}

function localize(root: HTMLElement, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const current = node.nodeValue ?? ""
    const saved = originals.get(node)
    if (!saved) originals.set(node, current)
    else if (!(["en", "zh-Hant", "zh-Hans"] as const).some((candidate) => current === translateText(saved, candidate))) {
      originals.set(node, current)
    }
    const source = originals.get(node) ?? current
    const next = translateText(source, lang)
    if (current !== next) node.nodeValue = next
  }

  root.querySelectorAll<HTMLElement>("[placeholder], [alt], [title], [aria-label]").forEach((element) => {
    for (const name of ["placeholder", "alt", "title", "aria-label"]) {
      if (!element.hasAttribute(name)) continue
      let saved = attributeOriginals.get(element)
      if (!saved) {
        saved = new Map()
        attributeOriginals.set(element, saved)
      }
      const current = element.getAttribute(name) ?? ""
      const original = saved.get(name)
      if (
        !original ||
        !(["en", "zh-Hant", "zh-Hans"] as const).some((candidate) => current === translateText(original, candidate))
      ) {
        saved.set(name, current)
      }
      const translated = translateText(saved.get(name) ?? current, lang)
      if (current !== translated) element.setAttribute(name, translated)
    }
  })
}

export function LocalizedContent({ children }: { children: ReactNode }) {
  const { lang } = useApp()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    document.documentElement.lang = lang === "en" ? "en" : lang === "zh-Hant" ? "zh-Hant-HK" : "zh-Hans"
    localize(root, lang)
    const observer = new MutationObserver(() => localize(root, lang))
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "alt", "title", "aria-label"],
    })
    return () => observer.disconnect()
  }, [lang])

  return <div ref={ref} className="contents">{children}</div>
}
