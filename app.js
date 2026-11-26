'use strict';
/* =========================================================
 * AI 記帳 v2 — 手機端（PWA，可離線）
 * 資料先存在手機 IndexedDB，連線時同步到 Google 試算表。
 * ========================================================= */

// ---------- 圖示 ----------
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  plus: 'M12 5v14M5 12h14',
  chart: 'M3 3v18h18M7.5 16v-5M12 16V8M16.5 16v-8',
  sparkles: 'M12 3l1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6-4.6-1.9 4.6-1.9zM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  pencil: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  cash: 'M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6.5 10v4M17.5 10v4',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
  copy: 'M9 4h6v3H9zM9 5.5H6a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1h-3M9 12h6M9 16h4',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  gear: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  cloudOff: 'M3 3l18 18M8.5 6.6A6 6 0 0 1 18 11h.5a3.5 3.5 0 0 1 2.2 6.2M16 19H7a4 4 0 0 1-1.9-7.5',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  chevL: 'M15 18l-6-6 6-6', chevR: 'M9 6l6 6-6 6',
  x: 'M6 6l12 12M18 6 6 18',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  check: 'M5 12l5 5L20 7',
  store: 'M4 10v10h16V10M3 4h18l-1 6H4zM9 20v-6h6v6',
  car: 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 17H3v-4l2.2-5.2A1.5 1.5 0 0 1 6.6 7h10.8a1.5 1.5 0 0 1 1.4.8L21 13v4h-2M9 17h6M3 13h18',
  // 分類・帳戶・功能（統一極簡線條）
  utensils: 'M5 3v5a2 2 0 0 0 4 0V3M7 3v18M17 21V3c-1.9 1.2-3 3.8-3 7v4h3',
  cart: 'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  bottle: 'M10 3h4M10 3v3L8 9v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9l-2-3V3M8 13h8',
  train: 'M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 10h14M8.5 13.5h.01M15.5 13.5h.01M8 17l-2 4M16 17l2 4',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  mobile: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  shirt: 'M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a3 3 0 0 1-8 0z',
  medical: 'M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5z',
  film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14M8 7h8',
  gift: 'M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7c-1-2.5-2.5-4-4-3.5S6.5 7 12 7zm0 0c1-2.5 2.5-4 4-3.5S17.5 7 12 7z',
  repeat: 'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',
  plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  sofa: 'M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M3 18v-5a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5zM5 18v2M19 18v2',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',
  box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
  briefcase: 'M3 8h18v12H3zM8 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 13h18',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  laptop: 'M5 5h14v10H5zM2 19h20',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  undo: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  luggage: 'M6 7h12v13H6zM9 7V4h6v3M10 11v5M14 11v5M8 20v1M16 20v1',
  wallet: 'M4 7a2 2 0 0 1 2-2h11v2M4 7v11a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM15.5 13.5h1',
  atm: 'M3 4h18v6H3zM7 10v10h10V10M12 12.5v5M10 15.5l2 2 2-2',
  bank: 'M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M12 3l9 5H3z',
  transfer: 'M4 8h15l-3-3M20 16H5l3 3',
  exchange: 'M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16',
  ticket: 'M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM14 6v2M14 11v2M14 16v2',
  tag: 'M3 3h8l10 10-8 8L3 11zM7.5 7.5h.01',
  fuel: 'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3',
  road: 'M5 21 9 3M19 21 15 3M12 5v2M12 11v2M12 17v2',
  parking: 'M5 3h14v18H5zM10 17V7h3a3 3 0 0 1 0 6h-3',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  inbox: 'M3 13h5l1.5 3h5l1.5-3h5M5.5 5h13L21 13v6H3v-6z',
  calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  image: 'M4 4h16v16H4zM4 16l5-5 4 4 2-2 5 5M15 8.5h.01',
  nfc: 'M7 8.5a5 5 0 0 1 0 7M11 6a9 9 0 0 1 0 12M15 3.5a13 13 0 0 1 0 17',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6',
  download: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  cloud: 'M7 19a5 5 0 0 1-.5-9.98A6 6 0 0 1 18 10h.5a4.5 4.5 0 0 1 0 9z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01',
  ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8',
  alert: 'M12 3.5 2.5 20h19zM12 10v4.5M12 17.5h.01',
  okCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12l3 3 5-6',
  xCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 9l6 6M15 9l-6 6',
  plusCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v8M8 12h8',
  bag: 'M5 7h14l-1 14H6zM9 7a3 3 0 0 1 6 0',
  heart: 'M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z',
  paw: 'M12 20c-3 0-5-1.5-5-3.5S9.5 12 12 12s5 2.5 5 4.5-2 3.5-5 3.5zM6 10.5h.01M9.5 7h.01M14.5 7h.01M18 10.5h.01',
  baby: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.5 12h.01M14.5 12h.01M10 15.5a3 3 0 0 0 4 0M12 5c0-1.5 1-2 2-2',
  cup: 'M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2',
  dumbbell: 'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  scissors: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.1 7.9 20 20M8.1 16.1 20 4',
  wifi: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 19.5h.01',
  pkg: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9M7.5 5.2l9 4.6',
};
const icon = (n, cls) => `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24"><path d="${ICONS[n] || ICONS.tag}"/></svg>`;
/** 舊資料裡的 emoji 圖示 → 線條圖示名稱 */
const EMO = {
  '🍜': 'utensils', '🍱': 'utensils', '🍽': 'utensils', '🍔': 'utensils', '🍣': 'utensils', '🍰': 'cup', '☕': 'cup', '🍺': 'cup', '🛒': 'cart', '🧴': 'bottle', '🧻': 'bottle',
  '🚃': 'train', '🚇': 'train', '🚌': 'train', '🚕': 'car', '🏠': 'home', '💡': 'bulb', '📱': 'mobile', '☎': 'phone', '👕': 'shirt', '👗': 'shirt', '💄': 'scissors', '💇': 'scissors',
  '💊': 'medical', '🏥': 'medical', '🎬': 'film', '🎮': 'film', '🎵': 'music', '📚': 'book', '✏': 'pencil', '🎁': 'gift', '🔁': 'repeat', '✈': 'plane', '🛋': 'sofa',
  '🧾': 'receipt', '🚗': 'car', '📦': 'box', '💼': 'briefcase', '🎉': 'star', '⭐': 'star', '💻': 'laptop', '📈': 'trend', '↩': 'undo', '🪙': 'coin', '🧳': 'luggage',
  '💰': 'wallet', '👛': 'wallet', '🏧': 'atm', '🏦': 'bank', '🔄': 'transfer', '↔': 'transfer', '💳': 'card', '📲': 'nfc', '💱': 'exchange', '💴': 'cash', '💵': 'cash',
  '🎟': 'ticket', '🏷': 'tag', '⛽': 'fuel', '🛣': 'road', '🅿': 'parking', '🔧': 'wrench', '🧽': 'drop', '🛡': 'shield', '🐶': 'paw', '🐱': 'paw', '👶': 'baby', '🏋': 'dumbbell',
  '❤': 'heart', '💪': 'dumbbell', '📶': 'wifi', '🛍': 'bag', '📄': 'doc', '📑': 'doc',
};
/** 任何圖示值（線條名稱或舊 emoji）→ 線條圖示名稱 */
const glyphName = (x, fb) => { x = String(x || '').replace(/[\ufe0f\u200d]/g, '').trim(); return ICONS[x] ? x : EMO[x] || EMO[[...x][0]] || fb || 'tag'; };
const glyph = (x, cls, fb) => icon(glyphName(x, fb), cls);
/** 新增分類時可選的圖示 */
const PICK_ICONS = ['utensils', 'cup', 'cart', 'bottle', 'train', 'car', 'home', 'bulb', 'mobile', 'wifi', 'shirt', 'scissors', 'medical', 'heart', 'film', 'music', 'book', 'gift', 'repeat', 'plane', 'sofa', 'receipt', 'dumbbell', 'paw', 'baby', 'bag', 'briefcase', 'laptop', 'trend', 'coin', 'wallet', 'star', 'box', 'tag'];
const iconPicker = (id, cur) => `<div class="ipick" id="${id}" data-v="${cur || 'tag'}">${PICK_ICONS.map(n => `<button type="button" data-pk="${n}" class="${n === (cur || 'tag') ? 'on' : ''}">${icon(n)}</button>`).join('')}</div>`;
function bindPicker(root) { $$('.ipick', root).forEach(p => p.onclick = e => { const b = e.target.closest('[data-pk]'); if (!b) return; p.dataset.v = b.dataset.pk; $$('[data-pk]', p).forEach(x => x.classList.toggle('on', x === b)); }); }
function hydrate(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(el => {
    if (el._i) return; el._i = 1; el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon));
  });
}

// ---------- 預設資料（與伺服器相同，離線首次使用也能記帳）----------
const DEFAULT_ACCOUNTS = [
  { name: '現金', type: '現金', currency: 'JPY', initial: 0 }, { name: '銀行帳戶', type: '銀行', currency: 'JPY', initial: 0 },
  { name: '信用卡', type: '信用卡', currency: 'JPY', initial: 0 }, { name: 'Suica/PayPay', type: '電子錢包', currency: 'JPY', initial: 0 },
  { name: '台幣現金', type: '現金', currency: 'TWD', initial: 0 },
];
const DC = (s, t) => s.split(' ').map(x => { const [name, icon] = x.split(':'); return { name, icon }; });
const DEFAULT_CATS = {
  '支出': DC('餐飲:utensils 食材/超市:cart 日用品:bottle 交通:train 居住:home 水電瓦斯:bulb 通訊:mobile 服飾美容:shirt 醫療保健:medical 娛樂:film 教育:book 交際:gift 訂閱服務:repeat 旅行:plane 家具家電:sofa 稅金保險:receipt 汽車:car 其他:box'),
  '收入': DC('薪資:briefcase 獎金:star 副業:laptop 利息/投資:trend 退款:undo 點數回饋:coin 出差報銷:luggage 其他收入:wallet'),
  '振替': DC('提款:atm 存款:bank 帳戶互轉:transfer 信用卡繳費:card 儲值:wallet 換匯:exchange 其他振替:transfer'),
};
const TRANSFER_PRESETS = {
  '提款': ['銀行', '現金', '從銀行領現金'], '存款': ['現金', '銀行', '把現金存進銀行'],
  '信用卡繳費': ['銀行', '信用卡', '從銀行扣款繳卡費，信用卡未繳金額會減少'], '儲值': ['銀行', '電子錢包', '儲值 Suica / PayPay 等電子錢包'],
  '帳戶互轉': [null, null, '兩個帳戶之間轉帳'], '換匯': ['銀行', null, '日圓 ⇄ 台幣換匯，請填實際換到的金額'],
};

// ---------- 小工具 ----------
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => new Date().toLocaleDateString('sv-SE');
const pad = n => String(n).padStart(2, '0');
function addDays(ymd, n) { const d = new Date(ymd + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toLocaleDateString('sv-SE'); }
function addMonths(ym, n) { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
function monthEnd(ym) { const [y, m] = ym.split('-').map(Number); return ym + '-' + pad(new Date(y, m, 0).getDate()); }
const monthLabel = ym => `${ym.slice(0, 4)}年${Number(ym.slice(5))}月`;
// ---- 每月記帳區間（起始日可自訂，> 15 時以結束月份命名）----
const monthStartDay = () => Math.min(28, Math.max(1, Number(S.prefs.monthStart) || 1));
function cycleRange(ym) {
  const sd = monthStartDay();
  if (sd === 1) return { from: ym + '-01', to: monthEnd(ym) };
  const startYm = sd > 15 ? addMonths(ym, -1) : ym;
  return { from: startYm + '-' + pad(sd), to: addDays(addMonths(startYm, 1) + '-' + pad(sd), -1) };
}
function cycleKey(date) {
  const sd = monthStartDay();
  if (sd === 1) return date.slice(0, 7);
  const startYm = Number(date.slice(8, 10)) >= sd ? date.slice(0, 7) : addMonths(date.slice(0, 7), -1);
  return sd > 15 ? addMonths(startYm, 1) : startYm;
}
const fmtMD = d => `${Number(d.slice(5, 7))}/${Number(d.slice(8))}`;
function cycleLabelHtml(ym) {
  if (monthStartDay() === 1) return monthLabel(ym);
  const r = cycleRange(ym);
  return `${monthLabel(ym)}<small class="rng">${fmtMD(r.from)} – ${fmtMD(r.to)}</small>`;
}
const inCycle = (t, ym) => { const r = cycleRange(ym); return t.date >= r.from && t.date <= r.to; };
const newId = () => 'T' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function money(n, cur) {
  n = Number(n) || 0;
  if (cur === 'TWD') return (n < 0 ? '-' : '') + 'NT$' + Math.abs(n).toLocaleString('zh-TW', { maximumFractionDigits: 2 });
  return (n < 0 ? '-' : '') + '¥' + Math.abs(Math.round(n)).toLocaleString('ja-JP');
}
const yen = n => money(n, 'JPY');
const compact = v => Math.abs(v) >= 10000 ? (Math.round(v / 1000) / 10) + '萬' : Math.round(v).toLocaleString();
function parseAmt(s) {
  s = String(s || '').replace(/[,，\s¥$円元NT]/g, '').replace(/[×xX]/g, '*').replace(/÷/g, '/');
  if (!s) return 0;
  if (!/^[\d+\-*/.()]+$/.test(s)) return NaN;
  try { const v = Function('"use strict";return (' + s + ')')(); return Math.round(v * 100) / 100; } catch (e) { return NaN; }
}
function hashTint(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return `var(--t${h % 8 + 1})`; }
function pctChip(a, b) {
  if (!b) return '';
  const p = Math.round((a - b) / b * 100);
  return `${p > 0 ? '▲' : p < 0 ? '▼' : '±'}${Math.abs(p)}%`;
}

let toastT;
function toast(msg, ms) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms || 2400); }
function busy(on, text, sub, scan) {
  $('#busy').classList.toggle('on', !!on);
  if (!on) return;
  $('#busyText').textContent = text || '處理中…'; $('#busySub').textContent = sub || '';
  $('#busyIcon').innerHTML = scan ? '<div class="scan"></div>' : '<div class="spinner"></div>';
}

// ---------- 裝置判斷（iPhone / iPad / Mac）----------
const isTouch = () => navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
// ---------- iPhone／iPad 原生 App 橋接（網頁版時為 null）----------
const NATIVE = window.KAKEIBO_NATIVE || null;
const hasNFC = () => !!(NATIVE && NATIVE.nfc);
const nativeCbs = {};
window.__nativeReply = m => { const cb = nativeCbs[m.id]; if (!cb) return; delete nativeCbs[m.id]; m.ok ? cb.res(m.data) : cb.rej(new Error((m.data && m.data.error) || '失敗')); };
function nativeCall(action, args) {
  return new Promise((res, rej) => {
    if (!NATIVE || !window.webkit || !window.webkit.messageHandlers.native) return rej(new Error('只有 App 版才能使用'));
    const id = 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    nativeCbs[id] = { res, rej };
    window.webkit.messageHandlers.native.postMessage(Object.assign({ id, action }, args || {}));
  });
}
const isWide = () => matchMedia('(min-width: 1000px)').matches;
const isMac = /Mac/.test(navigator.platform || navigator.userAgent) && !isTouch();

// ---------- IndexedDB ----------
const DB = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('kakeibo', 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        db.createObjectStore('kv');
        db.createObjectStore('tx', { keyPath: 'id' });
        db.createObjectStore('ops', { keyPath: 'k', autoIncrement: true });
        db.createObjectStore('drafts', { keyPath: 'id' });
        db.createObjectStore('photos', { keyPath: 'id' });
      };
      r.onsuccess = () => { this.db = r.result; res(); };
      r.onerror = () => rej(r.error);
    });
  },
  run(store, mode, fn) {
    return new Promise((res, rej) => {
      const t = this.db.transaction(store, mode); const r = fn(t.objectStore(store));
      t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error);
    });
  },
  get(s, k) { return this.run(s, 'readonly', st => st.get(k)); },
  put(s, v, k) { return this.run(s, 'readwrite', st => k === undefined ? st.put(v) : st.put(v, k)); },
  del(s, k) { return this.run(s, 'readwrite', st => st.delete(k)); },
  all(s) { return this.run(s, 'readonly', st => st.getAll()); },
  replaceAll(s, arr) { return this.run(s, 'readwrite', st => { st.clear(); arr.forEach(v => st.put(v)); }); },
};

// ---------- 狀態 ----------
const S = {
  conn: { url: '', token: '' }, prefs: { queuePhotos: false, near: true, lastAcc: {} },
  meta: { accounts: DEFAULT_ACCOUNTS, categories: DEFAULT_CATS, stores: [], trips: [], settings: null, sheetUrl: '' },
  anaMode: 'daily',
  rates: {}, txs: [], ops: [], inflight: new Set(), drafts: [], photos: 0, reports: [], lastSync: 0,
  syncing: false, page: 'home', listMonth: today().slice(0, 7), listFilter: '全部', listAcc: '', accTab: '全部',
  anaMonth: today().slice(0, 7), rType: 'week', rRef: today(),
};
async function persist(key) { await DB.put('kv', S[key], key); }
async function reload() {
  S.txs = (await DB.all('tx')).sort((a, b) => (b.date + (b.createdAt || 0)).localeCompare(a.date + (a.createdAt || 0)));
  S.ops = await DB.all('ops');
  S.drafts = await DB.all('drafts');
  S.photos = (await DB.all('photos')).length;
}
const pendingCount = () => S.ops.length;
const BASE_TYPES = ['銀行', '信用卡', '現金', '電子錢包', 'Point卡'];
const TYPE_ICON_N = { '銀行': 'bank', '信用卡': 'card', '現金': 'cash', '電子錢包': 'wallet', 'Point卡': 'ticket' };
const typeIcon = (t, cls) => icon(TYPE_ICON_N[t] || 'tag', cls);
function accountTypes() {
  const out = BASE_TYPES.slice();
  (S.meta.accountTypes || []).concat(S.meta.accounts.map(a => a.type)).forEach(t => { if (t && !out.includes(t)) out.push(t); });
  return out;
}
const DEFAULT_ACC_NAMES = new Set(DEFAULT_ACCOUNTS.map(a => a.name));
/** 匯入後，沒用過的預設帳戶（現金、銀行帳戶…）自動隱藏，避免和自己的帳戶混在一起 */
function visibleAccounts() {
  const used = new Set();
  S.txs.forEach(t => { used.add(t.account); if (t.toAccount) used.add(t.toAccount); });
  const custom = S.meta.accounts.filter(a => !DEFAULT_ACC_NAMES.has(a.name));
  if (custom.length < 2) return S.meta.accounts;
  return S.meta.accounts.filter(a => !DEFAULT_ACC_NAMES.has(a.name) || used.has(a.name) || Number(a.initial));
}
const accMap = () => Object.fromEntries(S.meta.accounts.map(a => [a.name, a]));
const cats = type => (S.meta.categories && S.meta.categories[type] && S.meta.categories[type].length) ? S.meta.categories[type] : DEFAULT_CATS[type];
function catInfo(type, name) {
  const c = cats(type).find(x => x.name === name);
  // 預設分類一律用對應的線條圖示；自訂分類用自己選的（舊的 emoji 會轉成線條）
  const def = (DEFAULT_CATS[type] || []).find(x => x.name === name);
  const raw = c ? c.icon : '';
  const nm = ICONS[raw] ? raw : def ? def.icon : glyphName(raw, type === '振替' ? 'transfer' : type === '收入' ? 'wallet' : 'box');
  return { name, raw: nm, icon: icon(nm) };
}

// ---------- API ----------
async function api(action, payload, timeout) {
  if (!S.conn.url || !S.conn.token) throw new Error('尚未連線 Google 試算表');
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout || 90000);
  try {
    const res = await fetch(S.conn.url, {
      method: 'POST', redirect: 'follow', signal: ctl.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ token: S.conn.token, action }, payload || {})),
    });
    let j;
    try { j = await res.json(); } catch (e) { throw new Error('伺服器回應格式錯誤（請確認部署權限為「所有人」）'); }
    if (!j.ok) throw new Error(j.error || '伺服器錯誤');
    return j.data;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('連線逾時');
    if (e instanceof TypeError) throw new Error('無法連線');
    throw e;
  } finally { clearTimeout(timer); }
}
const canOnline = () => navigator.onLine && !!S.conn.url && !!S.conn.token;

// ---------- 本機寫入 + 同步佇列 ----------
const stripTx = t => { const o = Object.assign({}, t); delete o._pending; return o; };
async function localSaveTx(tx, isEdit) {
  const existed = S.txs.some(x => x.id === tx.id);
  tx._pending = true;
  await DB.put('tx', tx);
  const ops = await DB.all('ops');
  // 正在送出的操作不能再修改，否則這次的變更會遺失
  const ex = ops.find(o => o.op === 'add' && o.tx.id === tx.id && !S.inflight.has(o.k));
  if (ex) { ex.tx = stripTx(tx); await DB.put('ops', ex); }
  // 已存在的紀錄一律用「取代」送出（伺服器端找不到時就直接新增），避免被當成重複而略過
  else await DB.put('ops', { op: 'add', tx: stripTx(tx), replace: !!isEdit || existed });
  learnStore(tx);
  await reload();
}
async function localDeleteTx(id) {
  await DB.del('tx', id);
  const ops = await DB.all('ops');
  const add = ops.find(o => o.op === 'add' && o.tx.id === id && !S.inflight.has(o.k));
  if (add) { await DB.del('ops', add.k); if (add.replace) await DB.put('ops', { op: 'del', id }); }
  else await DB.put('ops', { op: 'del', id });
  await reload();
}
function learnStore(tx) {
  if (!tx.store || tx.type === '振替') return;
  const list = S.meta.stores || (S.meta.stores = []);
  let s = list.find(x => x.name === tx.store);
  if (!s) { s = { name: tx.store, address: '', phone: '', category: '', count: 0 }; list.push(s); }
  s.address = tx.storeAddress || s.address; s.phone = tx.storePhone || s.phone; s.category = tx.category || s.category;
  s.count = (s.count || 0) + 1; s.last = tx.date;
  persist('meta');
}

let syncAgain = false;
async function sync(manual) {
  if (S.syncing) { syncAgain = true; return; }
  if (!canOnline()) { renderSync(); if (manual) toast(navigator.onLine ? '請先到設定連線 Google 試算表' : '目前離線，資料已存在手機，連線後自動同步'); return; }
  S.syncing = true; renderSync();
  try {
    const ops = await DB.all('ops');
    S.inflight = new Set(ops.map(o => o.k));
    if (ops.length) {
      const r = await api('push', { ops: ops.map(o => { const c = Object.assign({}, o); delete c.k; return c; }) });
      for (let i = 0; i < ops.length; i++) {
        await DB.del('ops', ops[i].k);
        const res = r.results[i];
        if (res && !res.ok) toast('有一筆同步失敗：' + res.error, 5000);
      }
    }
    const d = await api('pull');
    const rest = await DB.all('ops');
    const pendIds = new Set(rest.filter(o => o.op === 'add').map(o => o.tx.id));
    const delIds = new Set(rest.filter(o => o.op === 'del').map(o => o.id));
    const localPend = (await DB.all('tx')).filter(t => pendIds.has(t.id));
    const twdPend = {}; rest.filter(o => o.op === 'twdFill').forEach(o => o.items.forEach(x => twdPend[x.id] = x.twd));
    d.transactions.forEach(t => { if (t.id in twdPend) t.twd = twdPend[t.id]; });
    await DB.replaceAll('tx', d.transactions.filter(t => !pendIds.has(t.id) && !delIds.has(t.id)).concat(localPend));
    const accounts = d.accounts.slice();
    rest.filter(o => o.op === 'account').forEach(o => { if (!accounts.some(a => a.name === o.account.name)) accounts.push(o.account); });
    const trips = (d.trips || []).slice();
    rest.filter(o => o.op === 'trip').forEach(o => { const i = trips.findIndex(t => t.id === o.trip.id); if (i >= 0) trips[i] = o.trip; else trips.push(o.trip); });
    const delTrips = new Set(rest.filter(o => o.op === 'tripDel').map(o => o.id));
    if (!rest.some(o => o.op === 'settings') && d.settings && d.settings.monthStart && d.settings.monthStart !== S.prefs.monthStart) { S.prefs.monthStart = d.settings.monthStart; await persist('prefs'); S.listMonth = S.anaMonth = cycleKey(today()); }
    if (!rest.some(o => o.op === 'settings' && o.settings && o.settings.accOrder) && d.settings && Array.isArray(d.settings.accOrder) && d.settings.accOrder.length) { S.prefs.accOrder = d.settings.accOrder; await persist('prefs'); }
    if (!rest.some(o => o.op === 'settings' && o.settings && 'defaultPay' in o.settings) && d.settings && d.settings.defaultPay) { S.prefs.defaultPay = d.settings.defaultPay; await persist('prefs'); }
    if (!rest.some(o => o.op === 'settings' && o.settings && o.settings.cardBills) && d.settings && d.settings.cardBills && typeof d.settings.cardBills === 'object') { S.prefs.cardBills = d.settings.cardBills; await persist('prefs'); }
    const acTypes = (d.accountTypes || []).concat(rest.filter(o => o.op === 'accountType').map(o => o.name));
    S.meta = { accountTypes: acTypes, accounts, categories: d.categories, stores: d.stores, trips: trips.filter(t => !delTrips.has(t.id)), settings: d.settings, sheetUrl: d.sheetUrl };
    await persist('meta');
    S.lastSync = Date.now(); await persist('lastSync');
    await reload();
    S.syncErr = '';
    if (manual) toast('✓ 已同步');
    processPhotoQueue();
    setTimeout(fillTwdAll, 300);
  } catch (e) {
    S.syncErr = e.message;
    if (manual) toast('同步失敗：' + e.message, 4500);
  }
  S.syncing = false; S.inflight = new Set();
  renderSync(); renderPage();
  if (syncAgain) { syncAgain = false; sync(); }
}

// ---------- 匯率（1 台幣 = ? 日圓）----------
async function fetchT(url, ms) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms || 6000);
  try { return await fetch(url, { signal: c.signal }); } finally { clearTimeout(t); }
}
async function getRate(date) {
  const hit = S.rates[date];
  if (hit && !(date >= today() && Date.now() - (hit.at || 0) > 3600e3)) return hit;
  if (navigator.onLine) {
    const urls = [];
    if (date >= today()) urls.push('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/twd.json');
    for (let b = 0; b < 3; b++) {
      const d = addDays(date, -b);
      urls.push(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/twd.json`, `https://${d}.currency-api.pages.dev/v1/currencies/twd.json`);
    }
    try {
      const v = await Promise.any(urls.map(async u => {
        const r = await fetchT(u, 5000);
        if (!r.ok) throw new Error('http');
        const j = await r.json();
        if (!(j.twd && j.twd.jpy > 0)) throw new Error('bad');
        return { rate: Math.round(j.twd.jpy * 10000) / 10000, date: j.date, at: Date.now(), _u: urls.indexOf(u) };
      }));
      delete v._u; S.rates[date] = v; persist('rates'); return v;
    } catch (e) {}
    if (canOnline()) {
      try { const v = await api('rate', { date }, 20000); v.at = Date.now(); S.rates[date] = v; persist('rates'); return v; } catch (e) {}
    }
  }
  const keys = Object.keys(S.rates).sort();
  if (keys.length) { const k = keys.filter(x => x <= date).pop() || keys[keys.length - 1]; return Object.assign({}, S.rates[k], { est: true }); }
  return { rate: 4.8, date: null, est: true };
}
function latestRate() {
  const keys = Object.keys(S.rates).sort();
  if (keys.length) return S.rates[keys[keys.length - 1]].rate;
  const t = S.txs.find(x => x.currency === 'TWD' && x.rate > 0);
  return t ? t.rate : 4.8;
}

// ---------- 計算 ----------
function amtIn(t, accName, side) {
  const a = accMap()[accName];
  if (!a) return 0;
  if (side === 'to' && Number(t.toAmount) > 0) return Number(t.toAmount);
  if (t.currency === a.currency) return t.original;
  if (a.currency === 'JPY') return t.jpy;
  return t.rate > 0 ? t.jpy / t.rate : 0;
}
function balances() {
  const bal = {};
  S.meta.accounts.forEach(a => bal[a.name] = Number(a.initial) || 0);
  S.txs.forEach(t => {
    if (t.type === '支出' && t.account in bal) bal[t.account] -= amtIn(t, t.account);
    if (t.type === '收入' && t.account in bal) bal[t.account] += amtIn(t, t.account);
    if (t.type === '振替') {
      if (t.account in bal) bal[t.account] -= amtIn(t, t.account);
      if (t.toAccount in bal) bal[t.toAccount] += amtIn(t, t.toAccount, 'to');
    }
  });
  const r = latestRate();
  const list = S.meta.accounts.map(a => {
    const b = Math.round(bal[a.name] * 100) / 100;
    return Object.assign({}, a, { balance: b, jpy: a.currency === 'TWD' ? b * r : b });
  });
  const assets = list.filter(a => a.type !== '信用卡').reduce((s, a) => s + a.jpy, 0);
  const debt = list.filter(a => a.type === '信用卡').reduce((s, a) => s + Math.min(0, a.jpy), 0);
  return { list, assets, debt, net: assets + debt };
}
function stats(from, to) {
  const am = accMap();
  const s = { income: 0, expense: 0, byCat: {}, byPay: {}, byStore: {}, transfers: [], count: 0, twd: 0, twdJpy: 0, daily: {}, tripExp: 0, tripInc: 0, exclExp: 0, exclInc: 0 };
  S.txs.forEach(t => {
    if (t.date < from || t.date > to) return;
    // 出差：另計，不併入日常收支
    if (t.trip && t.type !== '振替') { if (t.type === '支出') s.tripExp += t.jpy; else s.tripInc += t.jpy; return; }
    if (isExcluded(t)) { if (t.type === '支出') s.exclExp += t.jpy; else s.exclInc += t.jpy; return; }
    if (t.type === '支出') {
      s.expense += t.jpy; s.count++;
      const c = t.category || '其他'; s.byCat[c] = (s.byCat[c] || 0) + t.jpy;
      const p = am[t.account] ? am[t.account].type : '其他'; s.byPay[p] = (s.byPay[p] || 0) + t.jpy;
      if (t.store) { const st = s.byStore[t.store] || (s.byStore[t.store] = { total: 0, n: 0 }); st.total += t.jpy; st.n++; }
      if (t.currency === 'TWD') { s.twd += t.original; s.twdJpy += t.jpy; }
      s.daily[t.date] = (s.daily[t.date] || 0) + t.jpy;
    } else if (t.type === '收入') s.income += t.jpy;
    else if (t.type === '振替') s.transfers.push(t);
  });
  s.net = s.income - s.expense;
  return s;
}
const monthStats = ym => { const r = cycleRange(ym); return stats(r.from, r.to); };

// ---------- 版面 ----------
const TITLES = { home: '首頁', list: '明細', ana: '分析', rep: '報告', car: '汽車' };
function go(page) {
  S.page = page;
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'pg-' + page));
  $$('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === page || (page === 'rep' && b.dataset.tab === 'ana' && b.closest('#tabbar'))));
  $('#hdrTitle').textContent = TITLES[page];
  window.scrollTo(0, 0);
  renderPage();
}
function renderPage() {
  const d = new Date();
  $('#hdrSub').textContent = `${d.getMonth() + 1}月${d.getDate()}日 星期${'日一二三四五六'[d.getDay()]}`;
  if (S.page === 'home' && !$('#accScroll.reorder')) renderHome();
  if (S.page === 'list') renderList();
  if (S.page === 'ana') renderAna();
  if (S.page === 'rep') renderRep();
  if (S.page === 'car') renderCar();
  if ($('#sh-drill').classList.contains('on')) renderDrill();
}
function renderSync() {
  const p = $('#syncPill'); const n = pendingCount();
  p.className = 'pill';
  if (!S.conn.url) { p.classList.add('warn'); p.innerHTML = icon('cloudOff') + '未連線'; }
  else if (!navigator.onLine) { p.classList.add('warn'); p.innerHTML = icon('cloudOff') + (n ? `離線・${n} 筆待同步` : '離線'); }
  else if (S.syncing) { p.classList.add('spin'); p.innerHTML = icon('refresh') + '同步中'; }
  else if (S.syncErr) { p.classList.add('warn'); p.innerHTML = icon('refresh') + (n ? `${n} 筆待同步` : '同步失敗'); }
  else if (n) { p.classList.add('warn'); p.innerHTML = icon('refresh') + `${n} 筆待同步`; }
  else { p.classList.add('ok'); p.innerHTML = '<span class="dot"></span>已同步'; }
}

function txRow(t) {
  const c = catInfo(t.type, t.category);
  const am = accMap();
  let title, sub;
  if (t.type === '振替') { title = `${t.account} → ${t.toAccount}`; sub = t.category + (t.note ? '・' + t.note : ''); }
  else {
    title = t.store || t.sub || t.category;
    sub = [t.store ? t.category + (t.sub ? '／' + t.sub : '') : (t.sub || ''), t.account, t.items && t.items.length ? t.items.length + ' 品項' : '', t.note].filter(Boolean).join('・');
  }
  const sign = t.type === '收入' ? '+' : t.type === '支出' ? '-' : '';
  const cls = t.type === '收入' ? 'inc' : '';
  const acc = am[t.account];
  const other = t.currency !== 'JPY' ? `<small>≈ ${yen(t.jpy)}</small>` : Number(t.twd) > 0 && wantsTwd(acc) ? `<small class="twd">≈ ${money(t.twd, 'TWD')}</small>` : '';
  return `<button class="tx" data-id="${esc(t.id)}">
    <div class="ico" style="background:${hashTint(t.category)}">${c.icon}</div>
    <div class="mid"><b>${esc(title)}</b><small>${t._pending ? '<span class="badge pend">待同步</span> ' : ''}${t.trip ? `<span class="badge trip">${icon('plane', 'ii')}出差</span> ` : ''}${isExcluded(t) ? '<span class="badge excl">不計入</span> ' : ''}${t.group ? '<span class="badge">拆分</span> ' : ''}${instN(t) ? `<span class="badge inst">分${instN(t)}期</span> ` : ''}${esc(sub)}</small></div>
    <div class="amt num ${cls}">${sign}${money(t.original, t.currency)}${other}</div></button>`;
}
/** 點明細直接進入編輯 */
function openTx(id) {
  const t = S.txs.find(x => x.id === id); if (!t) return;
  S.selTx = id;
  closeSheet('detail');
  openEntry({ tx: t });
}
function bindTx(root) { $$('.tx[data-id]', root).forEach(b => b.onclick = () => openDetail(b.dataset.id)); }

// ----- 帳戶卡片排序（長按拖曳）-----
function accOrderIndex() {
  const o = S.prefs.accOrder || [];
  const base = S.meta.accounts.map(a => a.name);
  return n => { const i = o.indexOf(n); return i >= 0 ? i : 1000 + base.indexOf(n); };
}
async function saveAccOrder(visibleNames) {
  const ord = accOrderIndex();
  const full = S.meta.accounts.map(a => a.name).sort((x, y) => ord(x) - ord(y));
  // 只調整這個分頁裡的帳戶：把它們依新順序放回原本占的位置
  const slots = full.map((n, i) => visibleNames.includes(n) ? i : -1).filter(i => i >= 0);
  slots.forEach((pos, k) => { full[pos] = visibleNames[k]; });
  S.prefs.accOrder = full; await persist('prefs');
  const ops = await DB.all('ops');
  const old = ops.find(o => o.op === 'settings' && o.settings && o.settings.accOrder && !S.inflight.has(o.k));
  if (old) { old.settings.accOrder = full; await DB.put('ops', old); } else await DB.put('ops', { op: 'settings', settings: { accOrder: full } });
  await reload(); renderSync(); sync();
}
let accDragJustEnded = false;
function enableAccDrag() {
  const box = $('#accScroll');
  if (box._drag) return; box._drag = true;
  let st = null;   // { card, timer, sx, sy, gx, gy, on }
  const cards = () => $$('.acc-card[data-acc]', box);
  const place = (x, y) => {
    const c = st.card;
    c.style.transform = 'none';
    const r = c.getBoundingClientRect();
    c.style.transform = `translate(${x - st.gx - r.left}px, ${y - st.gy - r.top}px) scale(1.04)`;
  };
  const begin = () => {
    st.on = true;
    const r = st.card.getBoundingClientRect(); st.gx = st.sx - r.left; st.gy = st.sy - r.top;
    st.card.classList.add('dragging'); box.classList.add('reorder');
    if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) {}
  };
  const move = (x, y) => {
    if (!st) return false;
    if (!st.on) { if (Math.hypot(x - st.sx, y - st.sy) > 8) { clearTimeout(st.timer); st = null; } return false; }
    const over = cards().find(c => { if (c === st.card) return false; const r = c.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
    if (over) {
      const r = over.getBoundingClientRect();
      const after = (x - r.left) > r.width / 2;
      const list = cards(); const from = list.indexOf(st.card), to = list.indexOf(over);
      if (after && to > from) over.after(st.card); else if (!after && to < from) over.before(st.card);
      else if (after) over.after(st.card); else over.before(st.card);
    }
    // 拖到邊緣時自動捲動（手機的橫向列表）
    const br = box.getBoundingClientRect();
    if (box.scrollWidth > box.clientWidth) { if (x < br.left + 30) box.scrollLeft -= 12; else if (x > br.right - 30) box.scrollLeft += 12; }
    place(x, y);
    return true;
  };
  const end = () => {
    if (!st) return;
    clearTimeout(st.timer);
    if (st.on) {
      st.card.classList.remove('dragging'); st.card.style.transform = ''; box.classList.remove('reorder');
      accDragJustEnded = true; setTimeout(() => { accDragJustEnded = false; }, 350);
      const names = cards().map(c => c.dataset.acc);
      if (names.join('|') !== st.before) { saveAccOrder(names); toast('✓ 已調整帳戶順序', 1500); }
    }
    st = null;
  };
  const start = (target, x, y, delay) => {
    const card = target.closest('.acc-card[data-acc]'); if (!card) return;
    st = { card, sx: x, sy: y, on: false, before: cards().map(c => c.dataset.acc).join('|') };
    st.timer = setTimeout(() => { if (st) begin(); }, delay);
  };
  // 觸控：長按 0.35 秒後開始拖曳；拖曳中阻止頁面捲動
  box.addEventListener('touchstart', e => { if (e.touches.length === 1) start(e.target, e.touches[0].clientX, e.touches[0].clientY, 350); }, { passive: true });
  box.addEventListener('touchmove', e => { if (st && st.on) e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
  box.addEventListener('touchend', end); box.addEventListener('touchcancel', end);
  box.addEventListener('contextmenu', e => { if (e.target.closest('.acc-card[data-acc]')) e.preventDefault(); });
  // 滑鼠：按住 0.18 秒後拖曳
  box.addEventListener('mousedown', e => { if (e.button === 0) start(e.target, e.clientX, e.clientY, 180); });
  window.addEventListener('mousemove', e => { if (st && move(e.clientX, e.clientY)) e.preventDefault(); });
  window.addEventListener('mouseup', end);
}

// ----- 首頁 -----
function renderHome() {
  requestAnimationFrame(() => { const h = $('#pg-home .hero'); if (h && h.offsetHeight > 100) S.heroH = h.offsetHeight; });
  const ym = cycleKey(today());
  const cur = monthStats(ym);
  const cr = cycleRange(ym), pr = cycleRange(addMonths(ym, -1));
  const offset = Math.round((new Date(today() + 'T12:00:00') - new Date(cr.from + 'T12:00:00')) / 864e5);
  const pEnd = addDays(pr.from, offset);
  const prevSame = stats(pr.from, pEnd > pr.to ? pr.to : pEnd);
  const b = balances();
  $('#h-month').innerHTML = `${Number(ym.slice(5))}月支出${monthStartDay() > 1 ? `<small style="opacity:.7;margin-left:6px">${fmtMD(cr.from)}–${fmtMD(cr.to)}</small>` : ''}`;
  const cmp = pctChip(cur.expense, prevSame.expense);
  $('#h-cmp').textContent = cmp ? '比上月同期 ' + cmp : '本月';
  $('#h-exp').innerHTML = `<small>¥</small>${Math.round(cur.expense).toLocaleString('ja-JP')}`;
  $('#h-inc').textContent = yen(cur.income);
  $('#h-net').textContent = yen(cur.net);
  $('#h-asset').textContent = yen(b.net);
  const sep = [cur.tripExp ? `出差 ${yen(cur.tripExp)}` : '', cur.exclExp ? `不計入 ${yen(cur.exclExp)}` : ''].filter(Boolean);
  $('#h-trip').innerHTML = sep.length ? '另計：' + sep.join('・') : '';
  $('#h-trip').classList.toggle('hidden', !sep.length);

  let banner = '';
  if (!S.conn.url) banner += `<button class="banner" id="bn-conn"><span class="em">${icon('link')}</span><span>尚未連線 Google 試算表，資料暫存在手機。點此設定</span></button>`;
  if (S.drafts.length) banner += `<button class="banner" id="bn-draft"><span class="em">${icon('receipt')}</span><span>${S.drafts.length} 張收據已辨識完成，點此確認並儲存</span></button>`;
  if (S.photos) banner += `<div class="banner"><span class="em">${icon('cloudOff')}</span><span>${S.photos} 張收據等待連線後辨識</span></div>`;
  $('#draftBanner').innerHTML = banner;
  if ($('#bn-conn')) $('#bn-conn').onclick = () => openSettings();
  if ($('#bn-draft')) $('#bn-draft').onclick = () => { if (S.drafts.length > 1) { S.multi = { ids: S.drafts.map(d => d.id), errs: [] }; openMulti(); } else openDraft(S.drafts[0]); };

  const vis = new Set(visibleAccounts().map(a => a.name));
  const shown = b.list.filter(a => vis.has(a.name));
  const tabs = ['全部'].concat(accountTypes().filter(t => shown.some(a => a.type === t)));
  if (!tabs.includes(S.accTab)) S.accTab = '全部';
  $('#accTabs').innerHTML = tabs.map(t => `<button class="chip ${t === S.accTab ? 'on' : ''}" data-at="${esc(t)}">${t === '全部' ? '全部' : typeIcon(t, 'ii') + ' ' + esc(t)}</button>`).join('');
  $$('#accTabs [data-at]').forEach(x => x.onclick = () => { S.accTab = x.dataset.at; renderHome(); });
  const ord = accOrderIndex();
  const inTab = shown.filter(a => S.accTab === '全部' || a.type === S.accTab).sort((x, y) => ord(x.name) - ord(y.name));
  const tabSum = inTab.reduce((s2, a) => s2 + a.jpy, 0);
  const accCard = a => {
    const head = `<div class="t"><span>${typeIcon(a.type, 'ii')} ${esc(a.type)}</span>${dispCur(a) === 'TWD' ? '<span class="badge twd">TWD</span>' : ''}</div><div class="n">${esc(a.name)}</div>`;
    const dc = dispCur(a), db = showsTwd(a) ? dispBalance(a) : a.balance;
    if (a.type === '信用卡' && (closeDayOf(a) || Number(a.limit))) {
      // 信用卡：顯示本期（結帳日區間）已使用，小字寫總額度與剩餘額度
      const c = cardInfo(a, db);
      if (c.jp) {
        // 日本信用卡：下一次繳款金額、本期已用、可用額度
        const d = c.due;
        return `<div class="acc-card" data-acc="${esc(a.name)}">${head}
        <div class="b num">${money(d ? d.used : 0, dc)}</div>
        <div class="s" style="white-space:nowrap">${d ? `${fmtMD(d.payDate)} 繳款${d.closed ? '' : '（結帳前）'}` : '目前沒有待繳'}</div>
        ${d && d.closed ? `<div class="lim num">本期已用 ${money(c.used, dc)}</div>` : ''}
        ${c.limit ? `<div class="lim num">可用 <span class="${c.left < 0 ? 'exp' : ''}">${money(c.left, dc)}</span>／${money(c.limit, dc)}</div>` : ''}</div>`;
      }
      return `<div class="acc-card" data-acc="${esc(a.name)}">${head}
        <div class="b num">${money(c.used, dc)}</div>
        <div class="s" style="white-space:nowrap">本期已用 ${fmtMD(c.from)}–${fmtMD(c.to)}</div>
        ${c.limit ? `<div class="lim num">總額度 ${money(c.limit, dc)}</div><div class="lim num">剩餘 <span class="${c.left < 0 ? 'exp' : ''}">${money(c.left, dc)}</span></div>` : ''}</div>`;
    }
    return `<div class="acc-card" data-acc="${esc(a.name)}">${head}
    <div class="b num ${db < 0 ? 'exp' : ''}">${money(db, dc)}</div>
    <div class="s">${a.type === '信用卡' ? (a.balance < 0 ? '未繳金額' : '無未繳') : a.currency === 'TWD' ? '≈ ' + yen(a.jpy) : '&nbsp;'}</div></div>`;
  };
  $('#accScroll').innerHTML = (S.accTab !== '全部' ? `<div class="acc-card tot"><div class="t">${esc(S.accTab)} 合計</div><div class="n">${inTab.length} 個帳戶</div><div class="b num ${tabSum < 0 ? 'exp' : ''}">${yen(tabSum)}</div><div class="s">&nbsp;</div></div>` : '') + inTab.map(accCard).join('') +
    `<button class="acc-card" id="accAddCard" style="border:2px dashed var(--line-2);box-shadow:none;background:none;text-align:center;color:var(--ink-2)"><div style="font-size:26px">＋</div><div style="font-size:13px;font-weight:650">新增帳戶</div></button>`;
  $('#accAddCard').onclick = () => openAccountEditor(S.accTab !== '全部' ? S.accTab : '');
  $$('#accScroll [data-acc]').forEach(c => c.onclick = () => { if (accDragJustEnded) return; openAccount(c.dataset.acc); });
  enableAccDrag();

  const top = Object.entries(cur.byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const mx = Math.max(1, ...top.map(x => x[1]));
  $('#h-cats').innerHTML = top.length ? top.map(([k, v]) => `<div class="cbar drill" data-dc="${esc(k)}"><div class="ico" style="background:${hashTint(k)}">${catInfo('支出', k).icon}</div>
    <div><div class="nm"><span>${esc(k)}</span><small>${Math.round(v / cur.expense * 100)}%</small></div><div class="track"><div class="fill" style="width:${v / mx * 100}%"></div></div></div>
    <div class="v num">${yen(v)}</div><span class="chev">›</span></div>`).join('') : '<div class="empty" style="padding:12px">本月尚無支出</div>';
  $$('#h-cats [data-dc]').forEach(x => x.onclick = () => openDrill({ ym, cat: x.dataset.dc }));
  const rec = S.txs.slice(0, 6);
  $('#recent').innerHTML = rec.length ? `<div class="tx-group">${rec.map(txRow).join('')}</div>`
    : `<div class="card empty"><span class="em">${icon('pencil')}</span>還沒有紀錄，從「拍收據」或「＋」開始吧</div>`;
  bindTx($('#recent'));
}

// ----- 明細 -----
// ---------- 搜尋 ----------
const norm = x => String(x == null ? '' : x).normalize('NFKC').toLowerCase();
/** 搜尋：空白分隔的每個關鍵字都要符合；純數字會比對金額（也比對文字，例如電話） */
function txMatcher(q) {
  const toks = norm(q).split(/\s+/).filter(Boolean);
  if (!toks.length) return null;
  return t => {
    const hay = norm([t.store, t.note, t.category, t.sub, t.account, t.toAccount, t.storeAddress, t.storePhone, t.date, t.type, t.trip ? '出差' : '', instN(t) ? '分期' : '',
      (t.items || []).map(i => [i.name, i.name_zh, i.nameZh, i.category].join(' ')).join(' ')].join(' '));
    return toks.every(k => {
      const num = k.replace(/^[¥￥]|^nt\$|,/g, '');
      if (/^\d+(\.\d+)?$/.test(num)) {
        const v = Number(num);
        if ([t.jpy, t.original, t.toAmount, t.twd].some(a => Number(a) === v)) return true;
        return hay.includes(num) && num.length >= 3;
      }
      return hay.includes(k);
    });
  };
}
const hlText = (txt, q) => {
  const toks = norm(q).split(/\s+/).filter(k => k && !/^[¥￥]?[\d,.]+$/.test(k));
  let h = esc(txt);
  toks.forEach(k => { const e = esc(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); h = h.replace(new RegExp(`(${e})`, 'ig'), '<mark class="hl">$1</mark>'); });
  return h;
};
let searchT;
function onSearchInput() {
  S.listQ = $('#l-q').value.trim();
  $('#l-qx').classList.toggle('hidden', !$('#l-q').value);
  clearTimeout(searchT); searchT = setTimeout(renderList, 120);
}
function focusSearch() { go('list'); setTimeout(() => { $('#l-q').focus(); $('#l-q').select(); }, 60); }

function renderList() {
  S.listView = S.listView || S.prefs.listView || 'list';
  const ym = S.listMonth;
  const q = S.listQ || '';
  const match = txMatcher(q);
  $('#l-month').innerHTML = cycleLabelHtml(ym);
  $('#l-top').classList.toggle('hidden', !!match);
  $$('#l-view [data-lv]').forEach(b => b.classList.toggle('on', b.dataset.lv === (S.listView || 'list')));
  if ($('#l-q').value.trim() !== q) $('#l-q').value = q;
  $('#l-qx').classList.toggle('hidden', !q);
  const accSel = $('#l-acc');
  accSel.innerHTML = '<option value="">所有帳戶</option>' + S.meta.accounts.map(a => `<option ${a.name === S.listAcc ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
  // 有搜尋字時搜尋全部期間
  let txs = match ? S.txs.filter(match) : S.txs.filter(t => inCycle(t, ym));
  if (S.listAcc) txs = txs.filter(t => t.account === S.listAcc || t.toAccount === S.listAcc);
  const st = { inc: 0, out: 0, trip: 0 };
  st.excl = 0;
  txs.forEach(t => { if (t.trip && t.type !== '振替') { if (t.type === '支出') st.trip += t.jpy; return; } if (isExcluded(t)) { if (t.type === '支出') st.excl += t.jpy; return; } if (t.type === '收入') st.inc += t.jpy; if (t.type === '支出') st.out += t.jpy; });
  const notes = [st.trip ? `出差 ${yen(st.trip)}` : '', st.excl ? `不計入日常 ${yen(st.excl)}` : ''].filter(Boolean);
  $('#l-tripNote').textContent = notes.length ? notes.join('、') + ' 另計，不含在上面的支出' : '';
  $('#l-tripNote').classList.toggle('hidden', !notes.length);
  $('#l-in').textContent = yen(st.inc); $('#l-out').textContent = yen(st.out);
  $('#l-net').textContent = yen(st.inc - st.out);
  if (S.listFilter === '出差') txs = txs.filter(t => t.trip);
  else if (S.listFilter === '不計入') txs = txs.filter(isExcluded);
  else if (S.listFilter !== '全部') txs = txs.filter(t => t.type === S.listFilter);
  if (!txs.length) { renderCal(match ? null : ym); $('#l-list').innerHTML = match ? `<div class="card empty"><span class="em">${icon('search')}</span>找不到符合「${esc(q)}」的紀錄<br><small class="faint">可以搜尋店家、品項、備註、分類、帳戶或金額</small></div>` : `<div class="card empty"><span class="em">${icon('inbox')}</span>這個月沒有紀錄</div>`; $('#l-pane').innerHTML = `<div class="empty"><span class="em">${icon('receipt')}</span>選擇一筆紀錄查看詳情</div>`; return; }
  const groups = {};
  const LIMIT = 400;
  const shown = match ? txs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, LIMIT) : txs;
  shown.forEach(t => (groups[t.date] = groups[t.date] || []).push(t));
  const note = match ? `<div class="search-note">找到 ${txs.length} 筆（全部期間）・支出合計 ${yen(txs.filter(t => t.type === '支出').reduce((a, t) => a + t.jpy, 0))}${txs.length > LIMIT ? `，顯示最近 ${LIMIT} 筆` : ''}</div>` : '';
  $('#l-list').innerHTML = note + Object.keys(groups).sort().reverse().map(d => {
    const day = new Date(d + 'T12:00:00');
    const out = groups[d].filter(t => t.type === '支出' && isDaily(t)).reduce((s, t) => s + t.jpy, 0);
    return `<div class="tx-group" data-day="${d}"><div class="tx-day"><span>${match ? d.slice(0, 4) + '/' : ''}${Number(d.slice(5, 7))}/${Number(d.slice(8))}（${'日一二三四五六'[day.getDay()]}）</span><span class="num">${out ? '支出 ' + yen(out) : ''}</span></div>${groups[d].map(txRow).join('')}</div>`;
  }).join('');
  renderCal(match ? null : ym);
  if (match) $$('#l-list .tx .mid').forEach(m => { const b = $('b', m), sm = $('small', m); if (b) b.innerHTML = hlText(b.textContent, q); if (sm && !sm.querySelector('.badge')) sm.innerHTML = hlText(sm.textContent, q); });
  bindTx($('#l-list'));
  if (isWide()) {
    if (S.selTx && txs.some(t => t.id === S.selTx)) { if (!S.keepPane && !$('#l-pane').contains(document.activeElement)) openDetail(S.selTx); else $$('#l-list .tx').forEach(b => b.classList.toggle('sel', b.dataset.id === S.selTx)); }
    else { S.selTx = null; $('#l-pane').innerHTML = `<div class="empty"><span class="em">${icon('receipt')}</span>選擇一筆紀錄查看詳情</div>`; }
  }
}

// ----- 明細頁月曆：每天的支出，點日期跳到那天 -----
function renderCal(ym) {
  const box = $('#l-cal');
  const on = !!ym && S.listView === 'cal';
  box.classList.toggle('hidden', !on);
  if (!on) return;
  const r = cycleRange(ym), now = today();
  const spend = {}, has = {};
  S.txs.forEach(t => {
    if (t.date < r.from || t.date > r.to) return;
    if (S.listAcc && t.account !== S.listAcc && t.toAccount !== S.listAcc) return;
    has[t.date] = 1;
    if (t.type === '支出' && isDaily(t)) spend[t.date] = (spend[t.date] || 0) + t.jpy;
  });
  const fmtK = v => v >= 100000 ? Math.round(v / 1000) + 'k' : v >= 10000 ? (v / 1000).toFixed(1) + 'k' : Math.round(v).toLocaleString();
  const start = new Date(r.from + 'T12:00:00');
  let d = addDays(r.from, -start.getDay());           // 從那週的星期日開始
  const cells = [];
  while (d <= r.to || cells.length % 7) {
    const inR = d >= r.from && d <= r.to, w = new Date(d + 'T12:00:00').getDay();
    const cls = ['cal-d', w === 0 ? 'sun' : w === 6 ? 'sat' : '', !inR ? 'out' : '', d === now ? 'today' : '', d === S.calSel ? 'sel' : '', inR && !has[d] ? 'none' : '', d.slice(8) === '01' && r.from.slice(8) !== '01' ? 'mon1' : ''].filter(Boolean).join(' ');
    cells.push(`<button class="${cls}" data-cd="${d}" data-mo="/${Number(d.slice(5, 7))}" ${inR ? '' : 'tabindex="-1" aria-hidden="true"'}><span class="n">${Number(d.slice(8))}</span><span class="m">${spend[d] ? fmtK(spend[d]) : ''}</span></button>`);
    d = addDays(d, 1);
    if (cells.length > 42) break;
  }
  box.innerHTML = `<div class="cal-h">${'日一二三四五六'.split('').map((x, i) => `<span class="${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${x}</span>`).join('')}</div><div class="cal-grid">${cells.join('')}</div>`;
  $$('[data-cd]', box).forEach(b => b.onclick = () => jumpToDay(b.dataset.cd));
}
function jumpToDay(d) {
  S.calSel = d;
  $$('#l-cal [data-cd]').forEach(b => b.classList.toggle('sel', b.dataset.cd === d));
  const g = $(`#l-list [data-day="${d}"]`);
  if (!g) return toast(`${fmtMD(d)} 沒有紀錄`, 1500);
  const y = g.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  const sc = g.closest('.list-main'); if (isWide() && sc && sc.scrollHeight > sc.clientHeight) sc.scrollTo({ top: g.offsetTop - sc.offsetTop - 8, behavior: 'smooth' });
  g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash'); setTimeout(() => g.classList.remove('flash'), 1400);
}

// ----- 圖表（SVG，離線可用）-----
const cssv = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function niceMax(v) { if (v <= 0) return 1000; const p = 10 ** Math.floor(Math.log10(v)); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
function rtop(x, y, w, h, r) {
  if (h <= 0) return '';
  r = Math.min(r, h, w / 2);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}
function chartFrame(el, H, max, min) {
  min = min || 0;
  const W = Math.max(280, el.clientWidth || 320);
  const padL = 34, padB = 22, padT = 8, ih = H - padB - padT;
  let g = '';
  for (let i = 0; i <= 4; i++) {
    const y = padT + ih - ih * i / 4;
    const v = min + (max - min) * i / 4;
    g += `<line class="grid" x1="${padL}" x2="${W}" y1="${y}" y2="${y}"/><text class="axis" x="${padL - 6}" y="${y + 3.5}" text-anchor="end">${max - min < 50 ? (Math.round(v * 10) / 10) : compact(v)}</text>`;
  }
  return { W, padL, padB, padT, ih, g, y: v => padT + ih - ih * (v - min) / (max - min) };
}
function attachTip(el, n, fx, html, onIdx) {
  let tip = $('.tip', el);
  if (!tip) { tip = document.createElement('div'); tip.className = 'tip hidden'; el.appendChild(tip); }
  const svg = $('svg', el);
  const show = e => {
    const r = svg.getBoundingClientRect();
    const x = (e.clientX - r.left) * (svg.viewBox.baseVal.width / r.width);
    const i = fx(x);
    if (i < 0 || i >= n) return hide();
    const h = html(i);
    if (!h) return hide();
    tip.innerHTML = h; tip.classList.remove('hidden');
    const px = Math.min(Math.max(e.clientX - r.left, 70), r.width - 70);
    tip.style.left = px + 'px'; tip.style.top = '0px';
    onIdx && onIdx(i);
  };
  const hide = () => { tip.classList.add('hidden'); onIdx && onIdx(-1); };
  svg.onpointermove = show; svg.onpointerdown = show; svg.onpointerleave = hide;
}
function barChart(el, opt) {
  const H = opt.height || 190;
  const n = opt.labels.length;
  const sums = opt.labels.map((_, i) => opt.series.reduce((s, x) => s + (x.values[i] || 0), 0));
  const max = niceMax(opt.stacked ? Math.max(...sums) : Math.max(...opt.series.flatMap(s => s.values)));
  const f = chartFrame(el, H, max);
  const gw = (f.W - f.padL) / n;
  let bars = '', hits = '', labels = '';
  for (let i = 0; i < n; i++) {
    const x0 = f.padL + gw * i;
    hits += `<rect class="hl hidden" data-hl="${i}" x="${x0 + 1}" y="${f.padT}" width="${gw - 2}" height="${f.ih}" rx="6"/>`;
    if (opt.stacked) {
      const bw = Math.min(16, gw * .55), bx = x0 + (gw - bw) / 2;
      let base = f.y(0);
      const vis = opt.series.map((s, k) => [s, k]).filter(([s]) => (s.values[i] || 0) > 0);
      vis.forEach(([s], j) => {
        const h = f.y(0) - f.y(s.values[i]);
        const top = j === vis.length - 1;
        const gap = j > 0 ? 2 : 0;
        const y = base - h;
        bars += top ? `<path d="${rtop(bx, y, bw, h - gap, 4)}" fill="${s.color}"/>` : `<rect x="${bx}" y="${y}" width="${bw}" height="${Math.max(0, h - gap)}" fill="${s.color}"/>`;
        base = y;
      });
    } else {
      const k = opt.series.length, bw = Math.min(10, gw * .3), gap = 2;
      const total = k * bw + (k - 1) * gap, bx = x0 + (gw - total) / 2;
      opt.series.forEach((s, j) => {
        const v = s.values[i] || 0; const h = f.y(0) - f.y(v);
        bars += `<path d="${rtop(bx + j * (bw + gap), f.y(v), bw, h, 4)}" fill="${s.color}"/>`;
      });
    }
    if (n <= 12 || i % 2 === 0) labels += `<text class="axis" x="${x0 + gw / 2}" y="${H - 6}" text-anchor="middle">${opt.labels[i]}</text>`;
  }
  el.innerHTML = `<svg viewBox="0 0 ${f.W} ${H}" height="${H}">${f.g}${hits}${bars}${labels}<line x1="${f.padL}" x2="${f.W}" y1="${f.y(0)}" y2="${f.y(0)}" stroke="${cssv('--line-2')}"/></svg>`;
  attachTip(el, n, x => Math.floor((x - f.padL) / gw), i => {
    const rows = opt.series.map(s => `<div><i style="background:${s.color}"></i>${s.name}　<b>${yen(s.values[i] || 0)}</b></div>`).join('');
    return `<div style="opacity:.7">${opt.full ? opt.full[i] : opt.labels[i]}</div>${rows}${opt.footer ? opt.footer(i) : ''}`;
  }, i => $$('[data-hl]', el).forEach(r => r.classList.toggle('hidden', Number(r.dataset.hl) !== i)));
}
function lineChart(el, opt) {
  const H = opt.height || 180;
  const n = opt.labels.length;
  const vals = opt.series.flatMap(s => s.values.filter(v => v != null));
  let max = niceMax(Math.max(1, ...vals)), min = 0;
  if (opt.fit && vals.length) {
    const lo = Math.min(...vals), hi = Math.max(...vals), span = Math.max(hi - lo, hi * 0.08, 1);
    const step = niceMax(span / 3) / (niceMax(span / 3) / (span / 3) > 4 ? 1 : 1);
    min = Math.max(0, Math.floor((lo - span * 0.25) / step) * step); max = Math.ceil((hi + span * 0.25) / step) * step;
    if (max === min) max = min + step;
  }
  const f = chartFrame(el, H, max, min);
  const step = (f.W - f.padL - 8) / Math.max(1, n - 1);
  const X = i => f.padL + 4 + step * i;
  let paths = '', labels = '';
  opt.series.forEach(s => {
    let d = '', on = false;
    s.values.forEach((v, i) => { if (v == null) { on = false; return; } d += (on ? 'L' : 'M') + X(i).toFixed(1) + ',' + f.y(v).toFixed(1); on = true; });
    paths += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? 'stroke-dasharray="4 4"' : ''}/>`;
    if (s.dots) s.values.forEach((v, i) => { if (v != null) paths += `<circle cx="${X(i)}" cy="${f.y(v)}" r="3.5" fill="${s.color}" stroke="${cssv('--surface')}" stroke-width="1.5"/>`; });
    if (s.endDot) {
      const li = s.values.map((v, i) => v == null ? -1 : i).filter(i => i >= 0).pop();
      if (li != null && li >= 0) paths += `<circle cx="${X(li)}" cy="${f.y(s.values[li])}" r="4.5" fill="${s.color}" stroke="${cssv('--surface')}" stroke-width="2"/>`;
    }
  });
  (opt.ticks || [0, 7, 14, 21, 28]).forEach(i => { if (i < n) labels += `<text class="axis" x="${X(i)}" y="${H - 6}" text-anchor="middle">${opt.labels[i]}</text>`; });
  el.innerHTML = `<svg viewBox="0 0 ${f.W} ${H}" height="${H}">${f.g}${paths}<g class="xh"></g>${labels}</svg>`;
  const xh = $('.xh', el);
  attachTip(el, n, x => Math.round((x - f.padL - 4) / step), i => {
    const rows = opt.series.filter(s => s.values[i] != null).map(s => `<div><i style="background:${s.color}"></i>${s.name}　<b>${(opt.fmt || yen)(s.values[i])}</b></div>`).join('');
    return rows ? `<div style="opacity:.7">${opt.labels[i]} 日</div>${rows}` : '';
  }, i => {
    if (i < 0) { xh.innerHTML = ''; return; }
    xh.innerHTML = `<line x1="${X(i)}" x2="${X(i)}" y1="${f.padT}" y2="${f.y(0)}" stroke="${cssv('--ink-3')}" stroke-width="1"/>` +
      opt.series.filter(s => s.values[i] != null).map(s => `<circle cx="${X(i)}" cy="${f.y(s.values[i])}" r="4.5" fill="${s.color}" stroke="${cssv('--surface')}" stroke-width="2"/>`).join('');
  });
}

// ----- 分析 -----
function renderAna() {
  $$('#a-seg button').forEach(b => b.classList.toggle('on', b.dataset.a === S.anaMode));
  $('#a-trips').classList.toggle('hidden', S.anaMode !== 'trip');
  $('#a-daily').classList.toggle('hidden', S.anaMode === 'trip');
  if (S.anaMode === 'trip') return renderTrips();
  const ym = S.anaMonth;
  $('#a-month').innerHTML = cycleLabelHtml(ym);
  const C = { inc: cssv('--income'), exp: cssv('--expense'), vio: cssv('--violet'), ink3: cssv('--ink-3') };
  const months = []; for (let i = 11; i >= 0; i--) months.push(addMonths(ym, -i));
  const ms = months.map(monthStats);
  const am = accMap();
  const pay = months.map(m => { const r = { card: 0, cash: 0, other: 0 }; S.txs.forEach(t => {
    if (t.type !== '支出' || !isDaily(t) || !inCycle(t, m)) return;
    const ty = am[t.account] ? am[t.account].type : '';
    if (ty === '信用卡') r.card += t.jpy; else if (ty === '現金') r.cash += t.jpy; else r.other += t.jpy;
  }); return r; });

  barChart($('#ch-month'), {
    labels: months.map(m => Number(m.slice(5)) + '月'), full: months.map(monthLabel),
    series: [{ name: '收入', color: C.inc, values: ms.map(s => s.income) }, { name: '支出', color: C.exp, values: ms.map(s => s.expense) }],
    footer: i => `<div style="margin-top:3px;border-top:1px solid rgba(127,127,127,.4);padding-top:3px">結餘　<b>${yen(ms[i].net)}</b></div>`,
  });

  // 累積支出
  const cur = ms[11], prevYm = addMonths(ym, -1);
  const c0 = cycleRange(ym).from;
  const days = Array.from({ length: 31 }, (_, i) => Number(addDays(c0, i).slice(8)));
  const cum = (m, s) => { let a = 0; const r = cycleRange(m); return days.map((_, i) => { const k = addDays(r.from, i); if (k > r.to) return null; a += s.daily[k] || 0; return k > today() ? null : a; }); };
  lineChart($('#ch-cum'), { labels: days, series: [
    { name: '上月', color: C.ink3, dash: true, values: cum(prevYm, ms[10]) },
    { name: '本月', color: C.exp, values: cum(ym, cur), endDot: true },
  ] });

  // 支付方式
  const p = pay[11], pt = p.card + p.cash + p.other;
  $('#a-pay').innerHTML = pt ? `<div class="stack-bar">${[[p.card, C.inc], [p.cash, C.exp], [p.other, C.vio]].filter(x => x[0] > 0).map(x => `<div style="width:${x[0] / pt * 100}%;background:${x[1]}"></div>`).join('')}</div>
    ${[['信用卡', p.card, C.inc, 'card'], ['現金', p.cash, C.exp, 'cash'], ['電子錢包・銀行', p.other, C.vio, 'other']].map(x => `<div class="stat-row ${x[1] ? 'drill' : ''}" ${x[1] ? `data-dg="${x[3]}"` : ''}><span><span class="sw" style="background:${x[2]}"></span>${x[0]}</span><span class="num"><b>${yen(x[1])}</b> <span class="faint">${Math.round(x[1] / pt * 100)}%</span>${x[1] ? ' <span class="chev">›</span>' : ''}</span></div>`).join('')}`
    : '<div class="empty" style="padding:12px">本月尚無支出</div>';
  barChart($('#ch-pay'), { labels: months.map(m => Number(m.slice(5)) + '月'), full: months.map(monthLabel), stacked: true, height: 150, series: [
    { name: '信用卡', color: C.inc, values: pay.map(x => x.card) }, { name: '現金', color: C.exp, values: pay.map(x => x.cash) }, { name: '電子錢包・銀行', color: C.vio, values: pay.map(x => x.other) },
  ] });

  // 台幣
  $('#a-twdCard').classList.toggle('hidden', !cur.twd);
  if (cur.twd) $('#a-twd').innerHTML = `<div class="stat-row"><span>台幣消費</span><b class="num">${money(cur.twd, 'TWD')}</b></div><div class="stat-row"><span>換算日圓</span><b class="num">${yen(cur.twdJpy)}</b></div><div class="stat-row"><span>佔本月支出</span><b class="num">${Math.round(cur.twdJpy / cur.expense * 100)}%</b></div>`;

  // 分類
  const prev = ms[10];
  const all = Object.entries(cur.byCat).sort((a, b) => b[1] - a[1]);
  // 篩選：只看選取的分類（記在這台裝置）
  const fsel = (S.prefs.anaCats || []).filter(k => k);
  const list = fsel.length ? all.filter(([k]) => fsel.includes(k)) : all;
  const names = [...new Set(all.map(x => x[0]).concat(fsel))];
  $('#a-catF').innerHTML = `<button class="chip ${fsel.length ? '' : 'on'}" data-cf="">全部</button>` + names.map(k => `<button class="chip ${fsel.includes(k) ? 'on' : ''}" data-cf="${esc(k)}">${catInfo('支出', k).icon.replace('class="i"', 'class="i ii"')} ${esc(k)}</button>`).join('');
  $$('#a-catF [data-cf]').forEach(b => b.onclick = () => {
    const k = b.dataset.cf; let f = (S.prefs.anaCats || []).slice();
    if (!k) f = []; else f = f.includes(k) ? f.filter(x => x !== k) : f.concat(k);
    S.prefs.anaCats = f; persist('prefs'); renderAna();
  });
  const fsum = list.reduce((a, x) => a + x[1], 0);
  $('#a-catSum').classList.toggle('hidden', !fsel.length);
  if (fsel.length) $('#a-catSum').innerHTML = `已選 ${fsel.length} 個分類：<b class="num">${yen(fsum)}</b>・佔本月支出 ${cur.expense ? Math.round(fsum / cur.expense * 100) : 0}%${prev.byCat ? `・上月 ${yen(fsel.reduce((a, k) => a + (prev.byCat[k] || 0), 0))}` : ''}`;
  const mx = Math.max(1, ...list.map(x => x[1]));
  $('#a-cats').innerHTML = list.length ? list.map(([k, v]) => {
    const c = catInfo('支出', k); const ch = pctChip(v, prev.byCat[k]);
    return `<div class="cbar drill" data-dc="${esc(k)}"><div class="ico" style="background:${hashTint(k)}">${c.icon}</div>
      <div><div class="nm"><span>${esc(k)}</span><small>${Math.round(v / cur.expense * 100)}%</small></div><div class="track"><div class="fill" style="width:${v / mx * 100}%"></div></div></div>
      <div class="v num">${yen(v)}${ch ? `<small class="${ch[0] === '▲' ? 'exp' : 'inc'}">${ch}</small>` : ''}</div><span class="chev">›</span></div>`;
  }).join('') : `<div class="empty" style="padding:12px">${fsel.length ? '選取的分類本月沒有支出' : '本月尚無支出'}</div>`;
  $$('#a-pay [data-dg]').forEach(x => x.onclick = () => openDrill({ ym, group: x.dataset.dg }));
  $$('#a-cats [data-dc]').forEach(x => x.onclick = () => openDrill({ ym, cat: x.dataset.dc }));

  const stores = Object.entries(cur.byStore).sort((a, b) => b[1].total - a[1].total).slice(0, 6);
  $('#a-stores').innerHTML = stores.length ? stores.map(([k, v]) => `<div class="stat-row drill" data-ds="${esc(k)}"><span>${esc(k)} <span class="faint">${v.n} 次</span></span><b class="num">${yen(v.total)}</b></div>`).join('')
    : '<div class="empty" style="padding:12px">還沒有店家紀錄</div>';
  $$('#a-stores [data-ds]').forEach(x => x.onclick = () => openDrill({ ym, store: x.dataset.ds }));
}

// ----- 報告 -----
function period(type, ref) {
  if (type === 'week') {
    const dow = (new Date(ref + 'T12:00:00').getDay() + 6) % 7;
    const from = addDays(ref, -dow);
    return { from, to: addDays(from, 6), prevFrom: addDays(from, -7), prevTo: addDays(from, -1) };
  }
  const ym = cycleKey(ref), c = cycleRange(ym), p = cycleRange(addMonths(ym, -1));
  return { from: c.from, to: c.to, prevFrom: p.from, prevTo: p.to };
}
function adviceHtml(text) {
  return esc(text).split('\n').map(l => {
    l = l.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    const m = l.match(/^\s*#*\s*(【[^】]+】)\s*(.*)$/);
    if (m) return `<div class="h">${m[1]}</div>` + (m[2] ? `<div>${m[2]}</div>` : '');
    return l.trim() ? `<div>${l}</div>` : '';
  }).join('');
}
function renderRep() {
  const p = period(S.rType, S.rRef);
  $('#r-period').textContent = S.rType === 'week' ? `${p.from.slice(5).replace('-', '/')} – ${p.to.slice(5).replace('-', '/')}` : monthLabel(cycleKey(p.from)) + (monthStartDay() > 1 ? `（${fmtMD(p.from)}–${fmtMD(p.to)}）` : '');
  const c = stats(p.from, p.to), v = stats(p.prevFrom, p.prevTo);
  const top = Object.entries(c.byCat).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const ch = pctChip(c.expense, v.expense);
  $('#r-local').innerHTML = `<div class="sum3">
      <div><small>收入</small><b class="num inc">${yen(c.income)}</b></div>
      <div><small>支出</small><b class="num exp">${yen(c.expense)}</b>${ch ? `<small class="faint">${ch}</small>` : ''}</div>
      <div><small>結餘</small><b class="num">${yen(c.net)}</b></div></div>
    ${top.length ? `<div class="rep-h">支出前三名：${top.map(([k, x]) => `${catInfo('支出', k).icon} ${esc(k)} ${yen(x)}`).join('　')}</div>` : ''}`;
  renderRepHist();
}
function renderRepHist() {
  $('#r-hist').innerHTML = S.reports.length ? `<div class="tx-group">${S.reports.map((r, i) => `<button class="tx" data-rep="${i}">
    <div class="ico" style="background:var(--brand-soft)">${icon('calendar')}</div>
    <div class="mid"><b>${esc(r.label)} ${r.from.slice(5).replace('-', '/')} – ${r.to.slice(5).replace('-', '/')}</b><small>收入 ${yen(r.income)}・支出 ${yen(r.expense)}</small></div>
    <div class="amt faint">${icon('chevR')}</div></button>`).join('')}</div>` : `<div class="card empty"><span class="em">${icon('bulb')}</span>產生的報告會保存在這裡</div>`;
  $$('[data-rep]').forEach(b => b.onclick = () => {
    const r = S.reports[Number(b.dataset.rep)];
    openSheet('detail', `${r.label} ${r.from} ~ ${r.to}`, `<div class="card"><div class="sum3"><div><small>收入</small><b class="num inc">${yen(r.income)}</b></div><div><small>支出</small><b class="num exp">${yen(r.expense)}</b></div><div><small>結餘</small><b class="num">${yen(r.net)}</b></div></div></div><div class="card advice">${adviceHtml(r.advice)}</div>`);
  });
}
async function genReport() {
  if (!canOnline()) return toast(navigator.onLine ? '請先連線 Google 試算表' : '離線中：上方是本機統計，AI 建議需要網路');
  busy(true, 'AI 分析中…', '正在整理收支並產生省錢建議');
  try {
    if (pendingCount()) await sync();
    const r = await api('report', { type: S.rType, refDate: S.rRef });
    $('#r-out').innerHTML = `<div class="card"><h3>${icon('bulb', 'ii')} ${r.label}・AI 分析與建議</h3><div class="advice">${adviceHtml(r.advice)}</div></div>`;
    S.reports = await api('reports'); await persist('reports'); renderRepHist();
  } catch (e) { toast('產生失敗：' + e.message, 4500); }
  busy(false);
}

// ---------- Sheets ----------
function openSheet(name, title, html) {
  const h2 = $(`#sh-${name} .sheet-h h2`), body = $(`#sh-${name} .sheet-b`);
  if (title != null && h2) h2.textContent = title;
  if (html != null && body) { body.innerHTML = html; hydrate($(`#sh-${name}`)); }
  $('#scrim-' + name).classList.add('on'); $('#sh-' + name).classList.add('on');
  if (body) body.scrollTop = 0;
}
function closeSheet(name) { $('#scrim-' + name).classList.remove('on'); $('#sh-' + name).classList.remove('on'); }

// ---------- 記帳表單 ----------
const E = {};
function resetEntry() {
  Object.assign(E, { forced: false, group: '', type: '支出', currency: 'JPY', category: '', editId: null, draftId: null, source: '手動', placeId: '', createdAt: null, wasPending: false, rateInfo: null, tax: 'in', taxBase: 0, totalManual: false, silent: false });
  setTaxUI();
  setInst(0); $('#e-amount').value = ''; $('#e-toAmt').value = ''; $('#e-store').value = ''; $('#e-addr').value = ''; $('#e-phone').value = ''; $('#e-note').value = '';
  $('#e-items').innerHTML = ''; $('#e-date').value = today(); $('#e-sub').value = ''; $('#e-unit').value = ''; $('#e-liters').value = ''; $('#e-odo').value = ''; $('#e-fuelCalc').textContent = '';
  $('#e-trip').checked = false; E.dailyTouched = false; $('#e-daily').checked = true; E.tripId = '';
  $('#e-tripSel').innerHTML = ''; $('#e-tnName').value = ''; $('#e-tnFrom').value = ''; $('#e-tnTo').value = ''; onTripChange();
}
function onCatChange() {
  if ($('#e-subSel')) fillSubList();
  const car = E.type === '支出' && E.category === '汽車';
  $('#e-subChipsRow').classList.toggle('hidden', !car);
  if (car) {
    const cur = $('#e-sub').value.trim();
    $('#e-subChips').innerHTML = CAR_SUBS.map(([n, ic]) => `<button class="chip ${n === cur ? 'on' : ''}" data-sc="${n}">${ic} ${n}</button>`).join('');
    $$('#e-subChips [data-sc]').forEach(b => b.onclick = () => { $('#e-sub').value = b.dataset.sc; onCatChange(); });
  }
  const fuel = car && carGroupName($('#e-sub').value) === '加油';
  $('#e-dailyRow').classList.toggle('hidden', E.type === '振替' || $('#e-trip').checked);
  autoDaily();
  $('#e-fuelGroup').classList.toggle('hidden', !fuel);
  if (fuel) fuelCalc();
}
function fuelCalc(src) {
  const unit = parseAmt($('#e-unit').value), lit = parseAmt($('#e-liters').value), amt = parseAmt($('#e-amount').value);
  if (src !== 'amount' && unit > 0 && lit > 0 && !(amt > 0)) { $('#e-amount').value = Math.round(unit * lit); updateConv(); }
  else if (unit > 0 && amt > 0 && !(lit > 0) && src !== 'liters') $('#e-liters').value = Math.round(amt / unit * 100) / 100;
  else if (lit > 0 && amt > 0 && !(unit > 0) && src !== 'unit') $('#e-unit').value = Math.round(amt / lit * 10) / 10;
  const odo = parseAmt($('#e-odo').value), l2 = parseAmt($('#e-liters').value);
  const prev = fuelLog().filter(r => r.odo > 0 && r.t.id !== E.editId && r.date <= ($('#e-date').value || today())).pop();
  $('#e-fuelCalc').textContent = odo > 0 && prev && odo > prev.odo && l2 > 0 ? `油耗 ${Math.round((odo - prev.odo) / l2 * 10) / 10} km/L（距上次 ${odo - prev.odo} km）` : prev ? `上次里程 ${prev.odo.toLocaleString()} km` : '';
}
// ---------- 出差：每一趟分開記（例：11/11–11/13 四日市）----------
const tripsAll = () => (S.meta.trips || []).slice().sort((a, b) => String(b.start).localeCompare(String(a.start)));
const tripRange = t => t.start ? `${fmtMD(t.start)}${t.end && t.end !== t.start ? '–' + fmtMD(t.end) : ''}` : '';
const tripDays = t => t.start && t.end ? Math.round((new Date(t.end + 'T12:00:00') - new Date(t.start + 'T12:00:00')) / 864e5) + 1 : 1;
/** 涵蓋這一天的出差（多個重疊時取最近開始的） */
const tripCover = d => tripsAll().find(t => t.start && t.start <= d && (t.end || t.start) >= d) || null;
/** 這筆紀錄屬於哪一趟：有指定就用指定的，否則依日期自動對應 */
function tripOf(t) {
  if (!t.trip) return null;
  if (t.trip !== '1') { const x = (S.meta.trips || []).find(r => r.id === t.trip); if (x) return x; }
  return tripCover(t.date);
}
async function saveTrip(t) {
  const list = S.meta.trips = S.meta.trips || [];
  const i = list.findIndex(x => x.id === t.id); if (i >= 0) list[i] = t; else list.push(t);
  await persist('meta'); await DB.put('ops', { op: 'trip', trip: t });
}
async function deleteTripLocal(id) {
  S.meta.trips = (S.meta.trips || []).filter(x => x.id !== id);
  await persist('meta'); await DB.put('ops', { op: 'tripDel', id });
  // 指定到這一趟的紀錄改回「依日期自動對應」
  for (const t of S.txs.filter(x => x.trip === id)) await localSaveTx(Object.assign({}, t, { trip: '1' }), !t._pending);
}
function fillTripSel(cur) {
  const d = $('#e-date').value || today();
  const auto = tripCover(d);
  $('#e-tripSel').innerHTML = `<option value="">依日期自動${auto ? `（${esc(auto.name)}）` : '（還沒建立這幾天的出差）'}</option>`
    + tripsAll().map(t => `<option value="${esc(t.id)}" ${t.id === cur ? 'selected' : ''}>${esc(t.name)}　${tripRange(t)}</option>`).join('')
    + `<option value="__new">＋ 新增一趟出差…</option>`;
  if (cur && !tripsAll().some(t => t.id === cur)) $('#e-tripSel').value = '';
}
function onTripSel() {
  const nw = $('#e-tripSel').value === '__new';
  $('#e-tripNew').classList.toggle('hidden', !nw);
  if (nw) { const d = $('#e-date').value || today(); if (!$('#e-tnFrom').value) $('#e-tnFrom').value = d; if (!$('#e-tnTo').value) $('#e-tnTo').value = d; setTimeout(() => $('#e-tnName').focus(), 50); }
}
function onTripChange() {
  const on = $('#e-trip').checked;
  $('#e-tripPick').classList.toggle('hidden', !on);
  if (on) { if (!$('#e-tripSel').options.length) fillTripSel(E.tripId || ''); } else $('#e-tripNew').classList.add('hidden');
  $('#e-tripRow').classList.toggle('on', on);
  $('#e-tripHint').classList.toggle('hidden', !on);
  $('#e-dailyRow').classList.toggle('hidden', on || E.type === '振替');
  onDailyChange();
}
/** 計入日常開銷：沒手動切換過時，依規則自動決定（車貸、購車預設不計入） */
function autoDaily() {
  if (E.dailyTouched) return;
  $('#e-daily').checked = !defaultExcluded({ category: E.category, sub: $('#e-sub').value, note: $('#e-note').value, store: $('#e-store').value });
  onDailyChange();
}
function onDailyChange() {
  const off = !$('#e-daily').checked && !$('#e-trip').checked && E.type !== '振替';
  $('#e-dailyRow').classList.toggle('off', off);
  $('#e-dailyHint').textContent = off ? '這筆不會算進本月支出、圖表與省錢建議（仍會計入帳戶餘額）' : '算進本月支出、圖表與省錢建議';
}
/** 這個分類用過的子分類（常用的排前面） */
function usedSubs(type, category) {
  const n = {};
  S.txs.forEach(t => { if (t.type === type && t.category === category && t.sub) n[t.sub] = (n[t.sub] || 0) + 1; });
  if (category === '汽車') CAR_SUBS.forEach(([x]) => { if (!(x in n)) n[x] = 0; });
  return Object.keys(n).sort((a, b) => n[b] - n[a] || a.localeCompare(b));
}
/** 子分類下拉選單：用過的項目 ＋ 不填 ＋ 新增 */
function subOptions(type, category, cur) {
  const list = usedSubs(type, category);
  if (cur && !list.includes(cur)) list.unshift(cur);
  return `<option value="">（不填）</option>` + list.map(x => `<option value="${esc(x)}" ${x === cur ? 'selected' : ''}>${esc(x)}</option>`).join('') + `<option value="__new">＋ 新增子分類…</option>`;
}
function askNewSub(category) {
  const v = prompt(`「${category}」的新子分類名稱`);
  return v == null ? null : v.trim().slice(0, 30);
}
function fillSubList() {
  $('#e-subSel').innerHTML = subOptions(E.type, E.category, $('#e-sub').value.trim());
}
function fillAccSelects() {
  const opts = visibleAccounts().map(a => `<option value="${esc(a.name)}">${esc(a.name)}${a.currency === 'TWD' ? '（台幣）' : ''}</option>`).join('');
  $('#e-acc').innerHTML = opts; $('#e-to').innerHTML = opts;
}
function firstAcc(type, currency) {
  const A = visibleAccounts();
  return (A.find(a => a.type === type && (!currency || a.currency === currency)) || A.find(a => a.type === type) || {}).name;
}
function setType(t, keepCat) {
  E.type = t;
  $$('#e-type button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  const list = cats(t);
  if (!keepCat || !list.some(c => c.name === E.category)) E.category = list[0].name;
  renderCats();
  const tr = t === '振替';
  $('#e-toRow').classList.toggle('hidden', !tr);
  $('#e-storeGroup').classList.toggle('hidden', tr);
  $('#e-itemsGroup').classList.toggle('hidden', t !== '支出');
  $('#e-taxRow').classList.toggle('hidden', t !== '支出');
  $('#e-tripRow').classList.toggle('hidden', tr);
  if (tr) { $('#e-trip').checked = false; onTripChange(); }
  fillSubList(); renderSplit();
  $('#e-accLbl').textContent = t === '支出' ? '付款' : t === '收入' ? '存入' : '轉出';
  if (!keepCat) {
    const last = S.prefs.lastAcc && S.prefs.lastAcc[t];
    if (t === '收入') $('#e-acc').value = last || firstAcc('銀行', 'JPY') || $('#e-acc').value;
    else if (t === '支出' && last && accMap()[last]) $('#e-acc').value = last;
    if (tr) applyPreset();
  }
  onAccChange(); onCatChange();
}
function renderCats() {
  $('#e-cats').innerHTML = cats(E.type).map(c => `<button class="cat ${c.name === E.category ? 'on' : ''}" data-c="${esc(c.name)}"><div class="ico" style="background:${hashTint(c.name)}">${catInfo(E.type, c.name).icon}</div><span>${esc(c.name)}</span></button>`).join('') +
    `<button class="cat add" id="e-catAdd"><div class="ico">＋</div><span>新增</span></button>`;
  $('#e-catAdd').onclick = () => openCategoryEditor(E.type);
  $$('#e-cats .cat[data-c]').forEach(b => b.onclick = () => {
    const prev = E.category;
    if (E.type === '支出') $$('#e-items .i-c').forEach(sel => { if (sel.value === prev) sel.value = b.dataset.c; });
    E.category = b.dataset.c;
    itemSum(); fillSubList(); onCatChange();
    if (E.type === '收入' && E.category === '出差報銷') { $('#e-trip').checked = true; onTripChange(); }
    $$('#e-cats .cat[data-c]').forEach(x => x.classList.toggle('on', x === b));
    if (E.type === '振替') applyPreset();
  });
}
function applyPreset() {
  const p = TRANSFER_PRESETS[E.category];
  if (p) {
    if (p[0]) { const a = firstAcc(p[0], 'JPY'); if (a) $('#e-acc').value = a; }
    if (p[1]) { const a = firstAcc(p[1], 'JPY'); if (a) $('#e-to').value = a; }
    if (E.category === '換匯') { const a = S.meta.accounts.find(x => x.currency === 'TWD'); if (a) $('#e-to').value = a.name; }
  }
  onAccChange();
}
function onAccChange() {
  const am = accMap(); const from = am[$('#e-acc').value]; const to = am[$('#e-to').value];
  if (from && from.currency === 'TWD') { E.forced = true; setCurrency('TWD'); }
  else if (E.forced) { E.forced = false; setCurrency('JPY'); }
  const cross = E.type === '振替' && from && to && from.currency !== to.currency;
  $('#e-toAmtRow').classList.toggle('hidden', !cross);
  if (cross) $('#e-toAmt').previousElementSibling.textContent = to.currency === 'TWD' ? '轉入 NT$' : '轉入 ¥';
  let h = '';
  if (E.type === '振替') {
    const p = TRANSFER_PRESETS[E.category];
    h = (p ? p[2] + '。' : '') + '振替只在帳戶間移動金額，不算收入或支出。';
  } else if (from && from.type === '信用卡' && E.currency === 'TWD') h = '用日本信用卡刷台幣，會以當天匯率換算成日圓記在卡上。';
  $('#e-tHint').textContent = h; $('#e-tHint').classList.toggle('hidden', !h);
  updateConv(); updInst();
}
// ---- 分期（只有信用卡支出可以設定）
const INST_OPTS = [2, 3, 5, 6, 10, 12, 15, 18, 20, 24, 30, 36];
function updInst() {
  const a = accMap()[$('#e-acc').value];
  const show = E.type === '支出' && !!a && a.type === '信用卡';
  $('#e-instGroup').classList.toggle('hidden', !show);
  const sel = $('#e-inst');
  if (sel.options.length < 2) sel.innerHTML = '<option value="0">一次付清</option>' + INST_OPTS.map(n => `<option value="${n}">分 ${n} 期</option>`).join('');
  const n = Number(sel.value) || 0, amt = entryAmount();
  $('#e-instRow').classList.toggle('on', n > 1);
  $('#e-instHint').textContent = n > 1 ? (amt > 0 ? `每期約 ${money(instAmount(amt, n, 1), E.currency)}・帳單分 ${n} 個月計入` : `帳單分 ${n} 個月計入`) : '一次付清';
}
function setInst(n) {
  n = Math.round(Number(n) || 0);
  const sel = $('#e-inst'); updInst();
  if (n > 1 && !INST_OPTS.includes(n)) sel.insertAdjacentHTML('beforeend', `<option value="${n}">分 ${n} 期</option>`);
  sel.value = n > 1 ? String(n) : '0'; updInst();
}
function setCurrency(c) {
  const am = accMap(); const from = am[$('#e-acc').value];
  if (from && from.currency === 'TWD') c = 'TWD';
  E.currency = c;
  const b = $('#e-cur');
  b.textContent = c === 'TWD' ? 'NT$ 台幣' : '¥ 日圓';
  b.classList.toggle('twd', c === 'TWD');
  updateConv();
}
let convSeq = 0;
async function updateConv() {
  const amt = entryAmount();
  const am = accMap(); const from = am[$('#e-acc').value]; const to = am[$('#e-to').value];
  const needRate = E.currency === 'TWD' || (from && from.currency === 'TWD') || (E.type === '振替' && to && to.currency === 'TWD');
  const conv = $('#e-conv');
  if (isNaN(amt)) { conv.innerHTML = '<span class="exp">金額格式錯誤</span>'; return; }
  if (!needRate) { conv.innerHTML = /[+\-*/]/.test($('#e-amount').value) && amt ? `= <b>${yen(amt)}</b>` : ''; E.rateInfo = null; return; }
  const seq = ++convSeq;
  conv.textContent = '取得匯率中…';
  const r = await getRate($('#e-date').value || today());
  if (seq !== convSeq) return;
  E.rateInfo = r;
  const rateTxt = `1 NT$ = ${r.rate} 円${r.date ? `（${r.date.slice(5).replace('-', '/')}）` : ''}${r.est ? '・離線估算，同步時以當天匯率更新' : ''}`;
  if (E.currency === 'TWD') conv.innerHTML = amt ? `≈ <b>${yen(amt * r.rate)}</b>・${rateTxt}` : rateTxt;
  else conv.innerHTML = amt ? `≈ <b>${money(amt / r.rate, 'TWD')}</b>・${rateTxt}` : rateTxt;
  if (E.type === '振替' && from && to && from.currency !== to.currency && amt) {
    $('#e-toAmt').placeholder = '約 ' + (to.currency === 'TWD' ? money(amt / r.rate, 'TWD') : yen(amt * r.rate));
  }
}

function addItemRow(it) {
  it = it || { name: '', name_zh: '', qty: 1, subtotal: '' };
  const d = document.createElement('div');
  d.className = 'item';
  const cat = it.category && cats('支出').some(c => c.name === it.category) ? it.category : E.category;
  const tx = it.tax === '10' || it.tax === '8' ? it.tax : (it.subtotal === '' && E.tax !== 'in' ? E.tax : '');
  d.innerHTML = `<label class="i-cw" title="分類">${catInfo('支出', cat).icon}<select class="i-c">${cats('支出').map(c => `<option value="${esc(c.name)}" ${c.name === cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
    <input class="i-n" placeholder="品名" value="${esc(it.name_zh || it.name)}" data-orig="${esc(it.name)}">
    <input class="i-q r num" inputmode="decimal" value="${esc(it.qty)}" placeholder="數">
    <input class="i-s r num" inputmode="decimal" value="${esc(it.subtotal)}" placeholder="小計">
    <button type="button" class="i-t ${tx ? 'on' : ''}" data-v="${tx}" title="這個品項的金額：税込／未稅 10%／未稅 8%">${tx ? tx + '%' : '込'}</button>
    <button class="del">${icon('x')}</button>`;
  d.querySelector('.del').onclick = () => { d.remove(); itemSum(); };
  d.querySelector('.i-s').oninput = itemSum;
  d.querySelector('.i-c').onchange = e => { e.target.parentElement.querySelector('svg').outerHTML = catInfo('支出', e.target.value).icon; itemSum(); };
  d.querySelector('.i-t').onclick = e => { const b = e.currentTarget; const nx = { '': '10', '10': '8', '8': '' }[b.dataset.v || '']; setItemTax(b, nx); E.totalManual = false; itemSum(); };
  $('#e-items').appendChild(d);
  itemSum();
}
function readItems() {
  return $$('#e-items .item').map(r => {
    const n = $('.i-n', r), q = parseAmt($('.i-q', r).value) || 1, s = parseAmt($('.i-s', r).value) || 0;
    const tx = $('.i-t', r).dataset.v || '';
    return { name: n.dataset.orig || n.value, name_zh: n.value, qty: q, price: Math.round(s / q * 100) / 100, subtotal: s, category: $('.i-c', r).value || E.category, ...(tx ? { tax: tx } : {}) };
  }).filter(x => x.name_zh || x.name || x.subtotal > 0); // 沒填品名、只填小計也算
}
function itemSum() {
  const s = readItems().reduce((a, b) => a + b.subtotal, 0);
  $('#e-itemSum').textContent = s ? '小計合計 ' + money(s, E.currency) : '';
  applyTotals();
  renderSplit();
}
function setItemTax(b, v) { b.dataset.v = v; b.textContent = v ? v + '%' : '込'; b.classList.toggle('on', !!v); }

// ---------- 小計自動加總・稅額 ----------
const TAX_RATE = { '10': 0.1, '8': 0.08 };
const taxRound = v => E.currency === 'JPY' ? Math.floor(v + 1e-9) : Math.round(v * 100) / 100;
const hasItemAmounts = () => readItems().some(i => i.subtotal > 0);
/** 依品項小計（各自可標 10%／8% 未稅）或「稅前金額 × 稅率」算出含稅總額 */
function taxCalc() {
  const items = readItems().filter(i => i.subtotal > 0);
  if (items.length) {
    const g = { in: 0, '10': 0, '8': 0 };
    items.forEach(i => { g[i.tax || 'in'] += i.subtotal; });
    const t10 = taxRound(g['10'] * 0.1), t8 = taxRound(g['8'] * 0.08);
    const base = Math.round((g.in + g['10'] + g['8']) * 100) / 100;
    return { auto: true, base, t10, t8, tax: t10 + t8, total: Math.round((base + t10 + t8) * 100) / 100 };
  }
  if (E.tax !== 'in') {
    const base = E.taxBase || 0, tax = taxRound(base * TAX_RATE[E.tax]);
    return { auto: false, base, t10: E.tax === '10' ? tax : 0, t8: E.tax === '8' ? tax : 0, tax, total: Math.round((base + tax) * 100) / 100 };
  }
  return null;
}
/** 實際要記的金額（含稅） */
function entryAmount() {
  if (E.type === '支出' && E.tax !== 'in' && !hasItemAmounts()) { const c = taxCalc(); return c ? c.total : 0; }
  return parseAmt($('#e-amount').value);
}
function setTaxUI() {
  $$('#e-tax [data-tx]').forEach(b => b.classList.toggle('on', b.dataset.tx === E.tax));
}
function applyTotals() {
  const info = $('#e-taxInfo'); if (!info) return;
  const c = E.type === '支出' ? taxCalc() : null;
  const field = $('#e-amount'), focused = document.activeElement === field;
  const m = v => money(v, E.currency);
  const parts = c ? [c.t10 ? `10% ${m(c.t10)}` : '', c.t8 ? `8% ${m(c.t8)}` : ''].filter(Boolean).join('・') : '';
  if (c && c.auto) {
    if (!E.totalManual) { field.value = c.total; }
    info.innerHTML = E.totalManual
      ? `總額為手動輸入（品項合計含稅 ${m(c.total)}）・<a href="#" id="e-reauto">改回自動加總</a>`
      : `依品項小計自動加總${c.tax ? `：小計 ${m(c.base)} ＋ 稅 ${m(c.tax)}（${parts}）` : ''}`;
  } else if (c) {
    if (!focused) field.value = c.base ? c.total : '';
    info.innerHTML = c.base ? `稅前 ${m(c.base)} ＋ ${E.tax}% 稅 ${m(c.tax)} ＝ <b>${m(c.total)}</b>` : `輸入稅前金額，自動加上 ${E.tax}% 稅`;
  } else info.innerHTML = '';
  if ($('#e-reauto')) $('#e-reauto').onclick = ev => { ev.preventDefault(); E.totalManual = false; applyTotals(); };
  updateConv(); updInst();
}
function onTaxBtn(v) {
  const items = hasItemAmounts();
  if (document.activeElement === $('#e-amount')) { if (E.tax !== 'in' && !items) E.taxBase = parseAmt($('#e-amount').value) || 0; $('#e-amount').blur(); }
  if (!items) {
    const cur = parseAmt($('#e-amount').value) || 0;
    if (E.tax === 'in') E.taxBase = cur;                 // 原本輸入的金額當成稅前
    if (v === 'in') $('#e-amount').value = E.taxBase || ''; // 改回税込：金額回到原本輸入的數字
  } else {
    $$('#e-items .i-t').forEach(b => setItemTax(b, v === 'in' ? '' : v));
    E.totalManual = false;
  }
  E.tax = v; setTaxUI();
  if (v === 'in' && !items) { $('#e-taxInfo').innerHTML = ''; updateConv(); updInst(); }
  else applyTotals();
  renderSplit();
}
function onAmountInput() {
  if (E.type === '支出' && E.tax !== 'in' && !hasItemAmounts()) { E.taxBase = parseAmt($('#e-amount').value) || 0; applyTotals(); renderSplit(); return; }
  if (hasItemAmounts()) { E.totalManual = true; const info = $('#e-taxInfo'); const c = taxCalc(); if (c) info.innerHTML = `總額為手動輸入（品項合計含稅 ${money(c.total, E.currency)}）・<a href="#" id="e-reauto">改回自動加總</a>`; if ($('#e-reauto')) $('#e-reauto').onclick = ev => { ev.preventDefault(); E.totalManual = false; applyTotals(); }; }
  updateConv(); renderSplit(); updInst();
}
/** 依品項分類拆分：總額（含稅、折扣）依各分類小計比例分配，最後一筆吸收尾差 */
function splitPlan(total, items) {
  const g = {};
  items.forEach(it => { const k = it.category || E.category; (g[k] = g[k] || { category: k, sum: 0, items: [] }); g[k].sum += it.subtotal; g[k].items.push(it); });
  const groups = Object.values(g).sort((a, b) => b.sum - a.sum);
  const S0 = groups.reduce((a, x) => a + x.sum, 0);
  if (groups.length < 2 || !(S0 > 0) || !(total > 0)) return null;
  const r2 = v => E.currency === 'JPY' ? Math.round(v) : Math.round(v * 100) / 100;
  let used = 0;
  groups.forEach((x, i) => { x.amount = i === groups.length - 1 ? r2(total - used) : r2(total * x.sum / S0); used += x.amount; });
  return groups;
}
function renderSplit() {
  const el = $('#e-split');
  if (!el) return;
  const plan = E.type === '支出' ? splitPlan(entryAmount(), readItems()) : null;
  el.classList.toggle('hidden', !plan);
  if (plan) el.innerHTML = `<div class="split-h">${icon('list')}這張收據會依分類拆成 ${plan.length} 筆</div>` +
    plan.map(x => `<div class="split-r"><span>${catInfo('支出', x.category).icon} ${esc(x.category)} <small class="faint">${x.items.length} 項</small></span><b class="num">${money(x.amount, E.currency)}</b></div>`).join('') +
    `<div class="split-f">稅金與折扣依比例分攤，各筆會標示為同一張收據</div>`;
}
function showStoreExtra() { $('#e-storeExtra').classList.toggle('hidden', !$('#e-store').value.trim()); }

function openEntry(o) {
  o = o || {};
  resetEntry(); fillAccSelects();
  setCurrency('JPY');
  setType(o.type || '支出');
  if (o.category) { E.category = o.category; renderCats(); if (E.type === '振替') applyPreset(); }
  if (o.tx) {
    const t = o.tx;
    Object.assign(E, { editId: t.id, source: t.source || '手動', placeId: t.placeId || '', createdAt: t.createdAt || null, wasPending: !!t._pending });
    setType(t.type); E.category = t.category; renderCats();
    $('#e-acc').value = t.account; if (t.toAccount) $('#e-to').value = t.toAccount;
    $('#e-amount').value = t.original; $('#e-date').value = t.date; $('#e-toAmt').value = t.toAmount || '';
    $('#e-store').value = t.store || ''; $('#e-addr').value = t.storeAddress || ''; $('#e-phone').value = t.storePhone || ''; $('#e-note').value = t.note || '';
    $('#e-sub').value = t.sub || ''; E.group = t.group || '';
    $('#e-unit').value = t.unitPrice || ''; $('#e-liters').value = t.liters || ''; $('#e-odo').value = t.odo || ''; $('#e-trip').checked = !!t.trip; E.tripId = t.trip && t.trip !== '1' ? t.trip : ''; $('#e-tripSel').innerHTML = ''; setInst(t.inst); E.dailyTouched = !!t.excl; $('#e-daily').checked = !isExcluded(Object.assign({}, t, { trip: '' })); onTripChange();
    E.totalManual = true; (t.items || []).forEach(addItemRow); E.totalManual = true; applyTotals();
    setCurrency(t.currency || 'JPY'); onAccChange();
  }
  if (o.copy) {
    // 複製：內容都帶好，當成新的一筆，日期改成今天
    Object.assign(E, { editId: null, createdAt: null, wasPending: false, group: '', source: '手動' });
    $('#e-date').value = today();
  }
  if (o.receipt) fillReceipt(o.receipt, o.draftId);
  if (o.date) $('#e-date').value = o.date;
  if (o.account && accMap()[o.account]) { $('#e-acc').value = o.account; onAccChange(); }
  if (o.trip) { $('#e-trip').checked = true; onTripChange(); }
  if (o.sub != null) $('#e-sub').value = o.sub;
  fillSubList(); renderSplit(); onCatChange();
  showStoreExtra();
  $('#e-save').innerHTML = icon('check') + (E.editId ? '更新' : '儲存');
  $('#e-del').classList.toggle('hidden', !E.editId);
  openSheet('entry');
  if (!o.tx && !o.receipt) setTimeout(() => $('#e-amount').focus(), 350);
}
/** 收據建議的付款帳戶：AI 建議的 → 同類型裡最常用的 */
// ---------- 收據 → 付款帳戶（卡號末 4 碼 → 付款方式關鍵字 → 預設帳戶）----------
const splitTags = v => String(v || '').split(/[,、，\n]+/).map(x => x.trim()).filter(Boolean);
const last4Of = a => splitTags(a.last4).map(x => x.replace(/\D/g, '')).filter(x => x.length === 4);
/** 內建的付款方式關鍵字（帳戶名稱含楽天／PayPay 的信用卡） */
function builtinKeys(a) {
  if (!a || a.type !== '信用卡') return [];
  if (/楽天|樂天|rakuten/i.test(a.name)) return ['楽天ペイ', '楽天Pay', 'Rakuten Pay', 'R Pay', '楽天カード', '楽天SP'];
  if (/paypay/i.test(a.name)) return ['PayPay', 'ペイペイ'];
  return [];
}
const payKeysOf = a => splitTags(a.payKeys).concat(builtinKeys(a));
const normKey = x => norm(x).replace(/[\s・･\-－]/g, '');
function defaultPayAccount(cur) {
  const am = accMap(), vis = visibleAccounts();
  if (cur === 'TWD') { const tw = vis.find(a => a.type === '現金' && a.currency === 'TWD'); if (tw) return tw.name; }
  if (S.prefs.defaultPay && am[S.prefs.defaultPay]) return S.prefs.defaultPay;
  const c = vis.find(a => /cash in my pocket/i.test(a.name)) || vis.find(a => a.type === '現金' && a.currency === 'JPY') || vis.find(a => a.type === '現金');
  return c ? c.name : (vis[0] ? vis[0].name : '');
}
/** 這張收據該記到哪個帳戶，回傳 { name, why } */
function matchReceiptAccount(r) {
  const vis = visibleAccounts();
  if (S.pickAcc && accMap()[S.pickAcc]) return { name: S.pickAcc, why: '你指定的帳戶' };
  const l4 = (String(r.cardLast4 || '').match(/\d{4}(?!.*\d)/) || [''])[0];
  if (l4) { const a = vis.find(x => last4Of(x).includes(l4)); if (a) return { name: a.name, why: `卡號末 4 碼 ${l4}` }; }
  // 付款方式原文優先，其次備註、店名（舊版後端沒有 paymentText）
  const texts = [r.paymentText, r.note, r.store].map(normKey).filter(Boolean);
  let best = null;
  vis.forEach(a => payKeysOf(a).forEach(k => {
    const nk = normKey(k); if (!nk) return;
    // 很短的關鍵字（例：iD）只比對付款方式欄位，而且要是完整的一個詞，避免店名裡剛好有這兩個字
    const pt = normKey(r.paymentText);
    const at = nk.length <= 2 ? (pt && norm(r.paymentText).split(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/).includes(nk) ? 0 : -1) : texts.findIndex(t => t.includes(nk));
    if (at < 0) return;
    const score = (3 - at) * 100 + nk.length;           // 付款方式欄位 > 備註 > 店名；關鍵字越長越準
    if (!best || score > best.score) best = { name: a.name, why: `付款方式「${k}」`, score };
  }));
  if (best) return best;
  return { name: defaultPayAccount(r.currency), why: '沒有對應的卡號或付款方式，使用預設帳戶' };
}
function receiptAccount(r) { return matchReceiptAccount(r).name; }
function fillReceipt(r, draftId) {
  E.draftId = draftId || null; E.source = '收據AI';
  setType('支出');
  E.category = r.category; renderCats();
  { const m = matchReceiptAccount(r); if (m.name) $('#e-acc').value = m.name; E.accWhy = m.why; }
  setCurrency(r.currency || 'JPY');
  $('#e-amount').value = r.total || '';
  $('#e-date').value = r.date || today();
  $('#e-store').value = r.store || ''; $('#e-addr').value = r.storeAddress || ''; $('#e-phone').value = r.storePhone || '';
  const note = []; if (r.discount) note.push('折扣 ' + money(r.discount, r.currency)); if (r.tax) note.push('稅 ' + money(r.tax, r.currency)); if (r.note) note.push(r.note);
  $('#e-note').value = note.join('｜');
  $('#e-items').innerHTML = ''; E.totalManual = true; (r.items || []).forEach(addItemRow); E.totalManual = true; applyTotals();
  onAccChange(); showStoreExtra();
  if (E.accWhy) { const h = $('#e-tHint'); h.textContent = (h.textContent ? h.textContent + '　' : '') + '付款帳戶：' + E.accWhy; h.classList.remove('hidden'); }
  $('#e-sub').value = r.sub || '';
  if (r.fuel) { $('#e-unit').value = r.fuel.unitPrice || ''; $('#e-liters').value = r.fuel.liters || ''; }
  onCatChange();
  if (E.silent) return;
  if (r.fuel) { setTimeout(() => { $('#e-odo').scrollIntoView({ block: 'center' }); $('#e-odo').focus(); }, 400); return toast('加油收據：已記到汽車。請填目前里程來計算油耗', 4000); }
  const pl = splitPlan(r.total, readItems());
  toast(pl ? `辨識完成：品項分屬 ${pl.length} 個分類，會拆成 ${pl.length} 筆` : '辨識完成，請確認內容', 3000);
}
async function saveEntry(opt) {
  const silent = !!(opt && opt.silent === true);
  const amount = entryAmount();
  if (!(amount > 0)) { if (!silent) toast('請輸入金額'); return false; }
  const am = accMap(); const account = $('#e-acc').value; const toAccount = E.type === '振替' ? $('#e-to').value : '';
  if (!am[account]) { if (silent) return false; $('#e-acc').focus(); toast('請選擇付款帳戶'); return false; }
  if (E.type === '振替' && (!am[toAccount] || toAccount === account)) { if (!silent) toast('轉出與轉入帳戶不能相同'); return false; }
  const date = $('#e-date').value || today();
  const needRate = E.currency === 'TWD' || am[account].currency === 'TWD' || (toAccount && am[toAccount].currency === 'TWD');
  $('#e-save').disabled = true;
  let r = { rate: 1 };
  if (needRate) r = await getRate(date);
  // Richart 等：日幣消費另外記下當天匯率換算的台幣
  const twdOn = E.type !== '振替' && E.currency === 'JPY' && wantsTwd(am[account]);
  const tr = twdOn ? await getRate(date) : null;
  const inst = E.type === '支出' && am[account].type === '信用卡' ? (Number($('#e-inst').value) || 0) : 0;
  const toAmount = parseAmt($('#e-toAmt').value) || '';
  const items = E.type === '支出' ? readItems() : [];
  let trip = E.type !== '振替' && $('#e-trip').checked ? '1' : '';
  if (trip) {
    const sv = $('#e-tripSel').value;
    if (sv === '__new') {
      const name = $('#e-tnName').value.trim(), f = $('#e-tnFrom').value, t2 = $('#e-tnTo').value || f;
      if (!name) { if (!silent) { toast('請填出差名稱'); $('#e-tnName').focus(); } return false; }
      const nt = { id: newId(), name, start: f <= t2 ? f : t2, end: f <= t2 ? t2 : f, note: '' };
      await saveTrip(nt); trip = nt.id;
    } else if (sv) trip = sv;
  }
  const defEx = defaultExcluded({ category: E.category, sub: $('#e-sub').value, note: $('#e-note').value, store: $('#e-store').value });
  const wantEx = E.type !== '振替' && !trip && !$('#e-daily').checked;
  const excl = E.type === '振替' || trip ? '' : wantEx === defEx ? '' : (wantEx ? '1' : '0');
  const base = {
    date, type: E.type, currency: E.currency, rate: needRate ? r.rate : 1, rateEstimated: !!r.est,
    account, toAccount, toAmount: E.type === '振替' ? toAmount : '', sub: $('#e-sub').value.trim(), trip, excl,
    ...(E.type === '支出' && E.category === '汽車' && carGroupName($('#e-sub').value) === '加油'
      ? { liters: parseAmt($('#e-liters').value) || 0, unitPrice: parseAmt($('#e-unit').value) || 0, odo: parseAmt($('#e-odo').value) || 0 } : { liters: 0, unitPrice: 0, odo: 0 }),
    store: E.type === '振替' ? '' : $('#e-store').value.trim(), storeAddress: $('#e-addr').value.trim(), storePhone: $('#e-phone').value.trim(), placeId: E.placeId,
    note: $('#e-note').value.trim(), source: E.source, createdAt: E.createdAt || Date.now(),
  };
  const mk = (id, amt, category, its, group) => Object.assign({}, base, {
    id, original: amt, jpy: E.currency === 'JPY' ? amt : Math.round(amt * r.rate), category, items: its, group: group || '',
    inst: inst > 1 ? inst : 0, twd: tr && !tr.est ? twdOf(amt, tr.rate) : 0,
  });
  const plan = E.type === '支出' ? splitPlan(amount, items) : null;
  let txs;
  if (plan) {
    const firstId = E.editId || newId();
    const group = E.group || 'G' + firstId;
    txs = plan.map((x, i) => mk(i === 0 ? firstId : newId(), x.amount, x.category, x.items, group));
  } else {
    const cat = items.length && items.every(it => it.category === items[0].category) ? items[0].category : E.category;
    txs = [mk(E.editId || newId(), amount, cat, items, E.group)];
  }
  try {
    for (let i = 0; i < txs.length; i++) await localSaveTx(txs[i], i === 0 && !!E.editId && !E.wasPending);
    if (E.draftId) { await DB.del('drafts', E.draftId); await reload(); }
    if (E.source === '手動') { S.prefs.lastAcc = S.prefs.lastAcc || {}; S.prefs.lastAcc[E.type] = account; persist('prefs'); }
    $('#e-save').disabled = false;
    if (silent) return true;
    closeSheet('entry');
    toast(`✓ 已記錄 ${money(amount, E.currency)}${txs.length > 1 ? `（拆成 ${txs.length} 筆）` : ''}${trip ? '・出差' : ''}${navigator.onLine ? '' : '（離線，稍後同步）'}`);
    renderPage(); renderSync();
    sync();
    const left = multiLeft();
    if (E.draftId && left.length) setTimeout(openMulti, 500);
    else if (E.draftId && S.drafts.length) setTimeout(() => openDraft(S.drafts[0]), 600);
  } catch (e) { if (!silent) toast('儲存失敗：' + e.message); $('#e-save').disabled = false; return false; }
  $('#e-save').disabled = false;
  return true;
}

// ---------- 拍收據（照片只在記憶體）----------
/** dock 中間：AI 辨識（拍照／剪貼簿貼上／選擇截圖）。長按改成手動記帳 */
function aiMenu(clip) {
  if (!canOnline() && !S.prefs.queuePhotos) return toast(navigator.onLine ? '請先到設定連線 Google 試算表' : '離線中：長按中間的按鈕可以手動記帳', 3500);
  closeSheet('detail');
  if (!clip) S.pickAcc = '';
  const showClip = !!clip || canClipRead();
  openSheet('detail', 'AI 辨識', `<div class="hint" style="margin:2px 4px 4px">收據、網購截圖、銀行或信用卡明細都可以。</div>
    <div class="ai-grid">
      <button data-ai="cam">${icon('camera')}拍照</button>
      ${showClip ? `<button data-ai="clip" class="${clip ? 'hot' : ''}">${clip ? `<span class="thumb" style="background-image:url('${URL.createObjectURL(clip.files[0])}')"></span>` : ''}${icon('copy')}剪貼簿貼上</button>` : ''}
      <button data-ai="pick">${icon('image')}選擇截圖</button>
      <button data-ai="csv">${icon('doc')}CSV 明細</button>
    </div>
    <div class="form-group"><div class="frow"><label>記到帳戶</label><select id="ai-acc"><option value="">自動判斷（依收據的卡號、付款方式）</option>${visibleAccounts().map(a => `<option value="${esc(a.name)}" ${a.name === S.pickAcc ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></div></div>
    <div class="hint" style="text-align:center">CSV 是信用卡或銀行網站下載的明細，會和已記的紀錄比對、補上漏記的。長按中間的按鈕可以直接手動記帳。</div>`);
  $('#ai-acc').onchange = () => { S.pickAcc = $('#ai-acc').value; };
  $$('#d-body [data-ai]').forEach(b => b.onclick = () => {
    S.pickAcc = $('#ai-acc').value;
    S.batchTarget = S.pickAcc || null;
    closeSheet('detail');
    if (b.dataset.ai === 'csv') return startReconcile(S.pickAcc || undefined);
    if (b.dataset.ai === 'clip') return clip ? handleReceiptFiles(clip.files) : pasteFromClipboard();
    $(b.dataset.ai === 'cam' ? '#f-cam' : '#f-pick').click();
  });
  if (!clip) peekClipboard().then(p => { if (p && $('#sh-detail').classList.contains('on') && $('#d-body [data-ai]')) aiMenu(p); });
}
// ---------- 左右滑動切換頁面（手機）：分析 ← 明細 ← 首頁 → 汽車（手指往右滑＝明細） ----------
const SWIPE_ORDER = ['ana', 'list', 'home', 'car'];
function pageSlide(to, dir) {
  // dir: 1 = 新頁面從右邊進來（往左滑），-1 = 從左邊進來
  const cur = $('.page.active');
  const done = () => {
    if (cur) { cur.style.transition = ''; cur.style.transform = ''; cur.style.opacity = ''; }
    go(to);
    const pg = $('#pg-' + to); if (!pg) return;
    pg.style.transition = 'none'; pg.style.transform = `translate3d(${dir * 42}%,0,0)`; pg.style.opacity = '.35';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      pg.style.transition = 'transform .32s cubic-bezier(.22,.9,.24,1), opacity .26s ease-out';
      pg.style.transform = 'translate3d(0,0,0)'; pg.style.opacity = '1';
      setTimeout(() => { pg.style.transition = ''; pg.style.transform = ''; pg.style.opacity = ''; }, 340);
    }));
  };
  if (!cur) return done();
  cur.style.transition = 'transform .16s cubic-bezier(.4,0,1,1), opacity .16s';
  cur.style.transform = `translate3d(${-dir * 38}%,0,0)`; cur.style.opacity = '0';
  setTimeout(done, 150);
}
function goHome() {
  if (S.page === 'home') return window.scrollTo({ top: 0, behavior: 'smooth' });
  const i = SWIPE_ORDER.indexOf(S.page === 'rep' ? 'ana' : S.page);
  pageSlide('home', i >= 0 && i < 1 ? 1 : -1);
  if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {}
}
function bindSwipePages() {
  let st = null, two = null;
  const blocked = t => {
    if (isWide()) return true;
    if ($$('.sheet.on, .drawer.on').length || $('#accScroll.reorder')) return true;
    return !!t.closest('.hscroll, .chips, .seg, .tax-seg, input, select, textarea, .tagbox, [data-noswipe], #tabbar, .cal-grid, input[type=range]');
  };
  document.addEventListener('touchstart', e => {
    // 兩指輕點：回首頁
    if (e.touches.length === 2) { st && st.el && (st.el.style.transform = ''); st = null; two = { t: Date.now(), x: e.touches[0].clientX + e.touches[1].clientX, y: e.touches[0].clientY + e.touches[1].clientY }; return; }
    if (e.touches.length !== 1) { st = null; return; }
    two = null;
    const x = e.touches[0].clientX, y = e.touches[0].clientY;
    if (x < 18 || x > innerWidth - 18 || blocked(e.target)) { st = null; return; }
    st = { x, y, t: Date.now(), lock: null, dx: 0, el: $('.page.active') };
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (two && e.touches.length === 2) { const x = e.touches[0].clientX + e.touches[1].clientX, y = e.touches[0].clientY + e.touches[1].clientY; if (Math.hypot(x - two.x, y - two.y) > 30) two = null; return; }
    if (!st || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - st.x, dy = e.touches[0].clientY - st.y;
    if (!st.lock) { if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; st.lock = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v'; }
    if (st.lock !== 'h') return;
    e.preventDefault();
    const cur = SWIPE_ORDER.indexOf(S.page === 'rep' ? 'ana' : S.page);
    const edge = cur < 0 || (dx > 0 && cur === 0) || (dx < 0 && cur === SWIPE_ORDER.length - 1);
    st.dx = edge ? dx * 0.25 : dx;                      // 最邊邊的頁面：橡皮筋阻力
    if (st.el) { st.el.style.transition = 'none'; st.el.style.transform = `translate3d(${st.dx}px,0,0)`; st.el.style.opacity = String(1 - Math.min(.45, Math.abs(st.dx) / innerWidth)); }
  }, { passive: false });
  const end = e => {
    if (two && !e.touches.length) { const ok = Date.now() - two.t < 350; two = null; if (ok) goHome(); return; }
    if (!st) return;
    const s0 = st; st = null;
    if (s0.lock !== 'h' || !s0.el) return;
    const dt = Math.max(1, Date.now() - s0.t), v = s0.dx / dt;
    const cur = SWIPE_ORDER.indexOf(S.page === 'rep' ? 'ana' : S.page);
    const j = cur + (s0.dx < 0 ? 1 : -1);
    const go2 = cur >= 0 && j >= 0 && j < SWIPE_ORDER.length && (Math.abs(s0.dx) > innerWidth * 0.22 || Math.abs(v) > 0.45);
    if (go2) { pageSlide(SWIPE_ORDER[j], s0.dx < 0 ? 1 : -1); return; }
    s0.el.style.transition = 'transform .28s cubic-bezier(.22,.9,.24,1), opacity .2s';
    s0.el.style.transform = 'translate3d(0,0,0)'; s0.el.style.opacity = '1';
    setTimeout(() => { s0.el.style.transition = ''; s0.el.style.transform = ''; s0.el.style.opacity = ''; }, 300);
  };
  document.addEventListener('touchend', end, { passive: true });
  document.addEventListener('touchcancel', end, { passive: true });
  // 點兩下頁面標題也能回首頁
  let lastTap = 0;
  $('.appbar') && $('.appbar').addEventListener('click', e => { if (e.target.closest('button, a, input, select')) return; const n = Date.now(); if (n - lastTap < 320) { lastTap = 0; goHome(); } else lastTap = n; });
}
let fabLong = false;
function bindFab() {
  const b = $('#tabbar [data-tab=add]'), fab = $('.fab', b);
  let timer = null;
  const start = () => { fabLong = false; fab.classList.add('press'); timer = setTimeout(() => { fabLong = true; fab.classList.remove('press'); if (navigator.vibrate) try { navigator.vibrate(15); } catch (e) {} openEntry(); }, 450); };
  const stop = () => { clearTimeout(timer); fab.classList.remove('press'); };
  b.addEventListener('touchstart', start, { passive: true });
  b.addEventListener('touchend', stop); b.addEventListener('touchcancel', stop); b.addEventListener('touchmove', stop, { passive: true });
  b.addEventListener('mousedown', e => { if (e.button === 0 && !isTouch()) start(); });
  b.addEventListener('mouseup', stop); b.addEventListener('mouseleave', stop);
  b.addEventListener('contextmenu', e => e.preventDefault());
}
function startScan() {
  if (!canOnline() && !S.prefs.queuePhotos && !hasNFC()) {
    return toast(navigator.onLine ? '請先到設定連線 Google 試算表' : '離線中：請手動輸入，或在設定開啟「離線時暫存收據」', 3500);
  }
  if (!isTouch()) {
    // 電腦：剪貼簿有圖就先問要不要貼上，否則直接選檔
    return peekClipboard().then(p => p ? scanChooser(p) : $('#f-pick').click());
  }
  scanChooser(null);
  peekClipboard().then(p => { if (p && $('#sh-detail').classList.contains('on') && $('#d-body [data-sc=clip]')) scanChooser(p); });
}
function scanChooser(clip) {
  S.pickAcc = '';
  closeSheet('detail');
  const clipBtn = clip
    ? `<button class="store-item clip-hit" data-sc="clip"><span class="thumb" style="background-image:url('${URL.createObjectURL(clip.files[0])}')"></span><div><b>偵測到剪貼簿有${clip.files.length > 1 ? ` ${clip.files.length} 張` : ''}截圖</b><small>直接貼上辨識</small></div></button>`
    : canClipRead() ? `<button class="store-item" data-sc="clip"><div class="ico">${icon('copy')}</div><div><b>從剪貼簿貼上</b><small>剛截的圖、在相簿按了「拷貝」的圖片</small></div></button>` : '';
  openSheet('detail', 'AI 辨識', `<div class="hint" style="margin:6px 4px 14px">AI 會自動判斷內容：一筆消費會打開記帳畫面；多筆明細（IC 卡履歷、信用卡明細）會列出來讓你勾選匯入。可以一次選多張收據，會各自記成一筆。</div>
    <div class="form-group">${clipBtn}
      <button class="store-item" data-sc="cam"><div class="ico">${icon('camera')}</div><div><b>拍照</b><small>紙本收據、發票、帳單</small></div></button>
      <button class="store-item" data-sc="pick"><div class="ico">${icon('image')}</div><div><b>選擇截圖・圖片・PDF</b><small>可一次選多張。網購訂單、付款完成畫面、電子收據</small></div></button>
      ${hasNFC() ? `<button class="store-item" data-sc="nfc"><div class="ico">${icon('nfc')}</div><div><b>感應 IC 卡</b><small>Suica・PASMO・ICOCA・Kitaca 等實體卡，貼近 iPhone 上緣直接讀取最近 20 筆</small></div></button>` : ''}
      <button class="store-item" data-sc="pick"><div class="ico">${icon('train')}</div><div><b>IC 卡履歷截圖</b><small>Apple Wallet／モバイルSuica／PASMO 的利用履歷</small></div></button>
      <button class="store-item" data-sc="stmt"><div class="ico">${icon('doc')}</div><div><b>信用卡明細比對</b><small>CSV・PDF・截圖，跟現有紀錄比對，補上漏記的</small></div></button>
    </div>`);
  $$('#d-body [data-sc]').forEach(b => b.onclick = () => {
    closeSheet('detail');
    if (b.dataset.sc === 'clip') return clip ? handleReceiptFiles(clip.files) : pasteFromClipboard();
    if (b.dataset.sc === 'stmt') return startReconcile(); if (b.dataset.sc === 'nfc') return readICCard();
    $(b.dataset.sc === 'cam' ? '#f-cam' : '#f-pick').click();
  });
}
function readB64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1]);
    r.onerror = () => rej(new Error('無法讀取檔案'));
    r.readAsDataURL(file);
  });
}
function compress(file, maxSide, q) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => {
      const k = Math.min(1, maxSide / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      const d = c.toDataURL('image/jpeg', q).split(',')[1]; c.width = c.height = 0; res(d);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('無法讀取照片（格式不支援）')); };
    img.src = url;
  });
}
async function onPhoto(e) {
  const fs = [...(e.target.files || [])];
  e.target.value = '';
  if (fs.length) handleReceiptFiles(fs);
}

// ---------- 一次多張收據：各自辨識、各自成為一筆（或依分類拆成多筆）----------
S.multi = null;
function multiLeft() { return S.multi ? S.drafts.filter(d => S.multi.ids.includes(d.id)) : []; }
async function handleReceiptFiles(files) {
  files = [...files].filter(f => f && (f.type === 'application/pdf' || /^image\//.test(f.type)));
  if (!files.length) return toast('請使用圖片或 PDF');
  if (files.length === 1) return handleReceiptFile(files[0]);
  if (!canOnline() && !S.prefs.queuePhotos) return toast(navigator.onLine ? '請先到設定連線 Google 試算表' : '離線中：請手動輸入，或在設定開啟「離線時暫存收據」', 3500);
  if (files.length > 20) { toast('一次最多 20 張，先處理前 20 張', 3000); files = files.slice(0, 20); }
  const n = files.length, errs = [], imgs = [];
  busy(true, `準備 ${n} 張收據`, '', true);
  for (const [i, f] of files.entries()) {
    const isPdf = f.type === 'application/pdf';
    try {
      if (isPdf && f.size > 8 * 1024 * 1024) throw new Error('PDF 太大（上限 8MB）');
      imgs.push({ i, name: f.name, mime: isPdf ? 'application/pdf' : 'image/jpeg', b64: isPdf ? await readB64(f) : await compress(f, 2000, .85) });
    } catch (e) { errs.push({ name: f.name || `第 ${i + 1} 張`, msg: e.message }); }
  }
  if (!canOnline()) { busy(false); for (const x of imgs) await DB.put('photos', { id: newId(), b64: x.b64, mime: x.mime, created: Date.now() + x.i }); await reload(); renderPage(); return toast(`${imgs.length} 張已暫存，連線後自動辨識`, 3000); }
  let done = 0; const got = [];
  busy(true, `AI 辨識 ${n} 張收據`, `0 / ${imgs.length} 完成`, true);
  let k = 0;
  const worker = async () => {
    while (k < imgs.length) {
      const x = imgs[k++];
      try {
        const r = await api('analyzeReceipt', { image: x.b64, mimeType: x.mime }, 150000);
        const id = newId() + '-' + x.i;
        await DB.put('drafts', { id, result: r, created: Date.now() + x.i, name: x.name });
        got.push({ i: x.i, id });
      } catch (e) { errs.push({ name: x.name || `第 ${x.i + 1} 張`, msg: e.message }); }
      x.b64 = null;
      $('#busySub').textContent = `${++done} / ${imgs.length} 完成`;
    }
  };
  await Promise.all([worker(), worker()]);
  busy(false);
  await reload(); renderPage();
  S.multi = { ids: got.sort((a, b) => a.i - b.i).map(x => x.id), errs };
  openMulti();
}
function openMulti() {
  if (!S.multi) return;
  const ds = multiLeft();
  const recs = ds.filter(d => !(d.result && d.result.docType === 'list'));
  const lists = ds.filter(d => d.result && d.result.docType === 'list');
  const errs = S.multi.errs || [];
  if (!ds.length && !errs.length) { S.multi = null; return; }
  const row = d => {
    const r = d.result || {};
    const cat = r.fuel ? '汽車' : (cats('支出').some(c => c.name === r.category) ? r.category : '其他');
    const acc = receiptAccount(r);
    const items = (r.items || []).map(it => Object.assign({ subtotal: Number(it.subtotal) || 0 }, it, { category: cats('支出').some(c => c.name === it.category) ? it.category : cat }));
    const pl = splitPlan(Number(r.total) || 0, items);
    return `<div class="mr"><input type="checkbox" checked data-mc="${d.id}" ${acc && r.total > 0 ? '' : 'disabled'}>
      <div class="ico" style="background:${hashTint(cat)}">${catInfo('支出', cat).icon}</div>
      <div class="nm" data-mo="${d.id}"><b>${esc(r.store || '（未辨識店名）')}</b><small>${r.date ? fmtMD(r.date) : '日期待確認'}・${esc(cat)}${pl ? `・拆成 ${pl.length} 筆` : ''}・${acc ? esc(acc) : '<span class="exp">請選帳戶</span>'}</small></div>
      <div class="v num">${r.total > 0 ? money(r.total, r.currency || 'JPY') : '<span class="exp">金額?</span>'}<small>${(r.items || []).length} 項</small></div></div>`;
  };
  let h = `<div class="hint" style="margin:4px 4px 12px">每張收據各記成一筆（品項分屬不同分類時會再拆開）。點店名可以先打開修改再儲存。</div>
    <div class="form-group"><div class="frow"><label>付款帳戶</label><select id="mr-acc"><option value="">每張自動判斷</option>${visibleAccounts().map(a => `<option value="${esc(a.name)}" ${a.name === S.pickAcc ? 'selected' : ''}>全部記到 ${esc(a.name)}</option>`).join('')}</select></div></div>`;
  if (recs.length) h += `<div class="form-group">${recs.map(row).join('')}</div>`;
  if (lists.length) h += `<div class="set-h">明細清單（逐張確認）</div><div class="form-group">${lists.map(d => `<button class="store-item" data-mo="${d.id}"><div class="ico">${icon(d.result.listType === 'ic_card' ? 'train' : 'doc')}</div><div><b>${d.result.listType === 'ic_card' ? 'IC 卡履歷' : d.result.listType === 'card' ? '信用卡明細' : '明細清單'}</b><small>${(d.result.transactions || []).length} 筆・點此確認匯入</small></div></button>`).join('')}</div>`;
  if (errs.length) h += `<div class="set-h">無法辨識</div><div class="form-group">${errs.map(e => `<div class="mr err" style="grid-template-columns:38px 1fr"><div class="ico" style="background:var(--expense-soft, var(--surface-2))">${icon('alert')}</div><div class="nm"><b>${esc(e.name)}</b><small>${esc(e.msg)}</small></div></div>`).join('')}</div>`;
  if (recs.length) h += `<button class="btn" id="mr-save">${icon('check')}儲存勾選的收據</button>`;
  h += `<button class="btn sec" id="mr-later" style="margin-top:8px">稍後再確認</button>`;
  closeSheet('detail');
  openSheet('detail', `多張收據（${recs.length + lists.length} 張）`, h);
  const upd = () => { const c = $$('#d-body [data-mc]:checked').length; if ($('#mr-save')) { $('#mr-save').disabled = !c; $('#mr-save').lastChild.textContent = `儲存勾選的 ${c} 張收據`; } };
  $$('#d-body [data-mc]').forEach(x => x.onchange = upd); upd();
  $('#mr-acc').onchange = () => { S.pickAcc = $('#mr-acc').value; const y = $('#d-body').scrollTop; openMulti(); $('#d-body').scrollTop = y; };
  $$('#d-body [data-mo]').forEach(b => b.onclick = () => { const d = S.drafts.find(x => x.id === b.dataset.mo); closeSheet('detail'); if (d) openDraft(d); });
  if ($('#mr-save')) $('#mr-save').onclick = saveMulti;
  $('#mr-later').onclick = () => { S.multi.errs = []; closeSheet('detail'); };
}
async function saveMulti() {
  const ids = $$('#d-body [data-mc]:checked').map(x => x.dataset.mc);
  closeSheet('detail');
  busy(true, `儲存 ${ids.length} 張收據`, '');
  let ok = 0, nTx = 0; const fail = [];
  for (const id of ids) {
    const d = S.drafts.find(x => x.id === id); if (!d) continue;
    resetEntry(); fillAccSelects(); setCurrency('JPY');
    E.silent = true;
    let good = false;
    try { fillReceipt(d.result, d.id); good = await saveEntry({ silent: true }); } catch (e) { good = false; }
    E.silent = false;
    if (good) { ok++; nTx += splitPlan(entryAmount(), readItems()) ? splitPlan(entryAmount(), readItems()).length : 1; } else fail.push(d.result.store || '一張收據');
    $('#busySub').textContent = `${ok} / ${ids.length}`;
  }
  resetEntry();
  await reload(); busy(false);
  renderPage(); renderSync(); sync();
  S.multi.errs = [];
  toast(`✓ 已記錄 ${ok} 張收據${nTx > ok ? `（共 ${nTx} 筆）` : ''}${fail.length ? `，${fail.length} 張需要手動確認` : ''}`, 3500);
  if (multiLeft().length) setTimeout(openMulti, 500); else S.multi = null;
}

// ---------- 剪貼簿截圖 ----------
const canClipRead = () => !!(navigator.clipboard && navigator.clipboard.read);
async function readClipboardImages() {
  const items = await navigator.clipboard.read();
  const files = [];
  for (const it of items) {
    const t = it.types.find(x => /^image\//.test(x));
    if (t) { const b = await it.getType(t); files.push(new File([b], 'clipboard.' + (t.split('/')[1] || 'png'), { type: t })); }
  }
  return files;
}
async function pasteFromClipboard() {
  try {
    const f = await readClipboardImages();
    if (!f.length) return toast('剪貼簿裡沒有圖片。先截圖或在相簿按「拷貝」再試一次', 3500);
    hideClipPill();
    handleReceiptFiles(f);
  } catch (e) { toast(e.name === 'NotAllowedError' ? '需要允許讀取剪貼簿才能貼上' : '無法讀取剪貼簿：' + e.message, 3500); }
}
/** 只在已經允許讀取剪貼簿的瀏覽器偵測（不會跳出詢問） */
async function peekClipboard() {
  if (!canClipRead() || !navigator.permissions || document.hidden) return null;
  try { const st = await navigator.permissions.query({ name: 'clipboard-read' }); if (st.state !== 'granted') return null; } catch (e) { return null; }
  try { const f = await readClipboardImages(); return f.length ? { files: f, sig: f.map(x => x.size + x.type).join('|') } : null; } catch (e) { return null; }
}
let clipSeen = '', clipTimer;
function hideClipPill() { $('#clipPill').classList.remove('on'); clearTimeout(clipTimer); }
async function checkClipPill() {
  if (!canOnline()) return;
  const p = await peekClipboard();
  if (!p || p.sig === clipSeen || p.sig === S.prefs.clipDismissed) return;
  clipSeen = p.sig;
  const pill = $('#clipPill');
  const th = $('.thumb', pill); if (th.dataset.u) URL.revokeObjectURL(th.dataset.u); th.dataset.u = URL.createObjectURL(p.files[0]); th.style.backgroundImage = `url('${th.dataset.u}')`;
  $('.lbl', pill).textContent = p.files.length > 1 ? `剪貼簿有 ${p.files.length} 張圖・貼上辨識` : '剪貼簿有截圖・貼上辨識';
  pill.onclick = e => {
    if (e.target.closest('.x2')) { S.prefs.clipDismissed = p.sig; persist('prefs'); return hideClipPill(); }
    hideClipPill(); S.prefs.clipDismissed = p.sig; persist('prefs'); handleReceiptFiles(p.files);
  };
  pill.classList.add('on');
  clearTimeout(clipTimer); clipTimer = setTimeout(hideClipPill, 12000);
}
/** 收據檔案（相機、選檔、拖曳、貼上共用）。照片只在記憶體中處理 */
async function handleReceiptFile(f) {
  const isPdf = f.type === 'application/pdf';
  if (!isPdf && !/^image\//.test(f.type)) return toast('請使用圖片或 PDF');
  if (!canOnline() && !S.prefs.queuePhotos) return toast(navigator.onLine ? '請先到設定連線 Google 試算表' : '離線中：請手動輸入，或在設定開啟「離線時暫存收據」', 3500);
  if (isPdf && f.size > 8 * 1024 * 1024) return toast('PDF 太大（上限 8MB）');
  let b64, mime = isPdf ? 'application/pdf' : 'image/jpeg';
  try { b64 = isPdf ? await readB64(f) : await compress(f, 2000, .85); } catch (err) { return toast(err.message + (isPdf ? '' : '（HEIC 格式請改存成 JPG）'), 4000); }
  if (!canOnline()) { await queuePhoto(b64, mime); return; }
  busy(true, 'AI 辨識收據中', '通常需要 5～20 秒', true);
  const t0 = Date.now();
  const tick = setInterval(() => { $('#busySub').textContent = `已經過 ${Math.round((Date.now() - t0) / 1000)} 秒${Date.now() - t0 > 30000 ? '，AI 回應較慢，請稍候' : ''}`; }, 1000);
  try {
    const r = await api('analyzeReceipt', { image: b64, mimeType: mime }, 150000);
    clearInterval(tick);
    b64 = null; busy(false);
    if (r.docType === 'list' && (r.listType === 'card' || r.listType === 'bank')) { closeSheet('entry'); openReconcile(r.transactions, r); }
    else if (r.docType === 'list') { closeSheet('entry'); openBatch(r); }
    else if (!$('#sh-entry').classList.contains('on')) openEntry({ receipt: r });
    else fillReceipt(r);
  } catch (err) {
    clearInterval(tick);
    busy(false);
    if (/無法連線|逾時/.test(err.message) && S.prefs.queuePhotos && !navigator.onLine) await queuePhoto(b64, mime);
    else showAIError(err.message);
  }
}
async function queuePhoto(b64, mime) {
  if (!S.prefs.queuePhotos) return toast('離線中無法辨識，請手動輸入');
  await DB.put('photos', { id: newId(), b64, mime: mime || 'image/jpeg', created: Date.now() });
  await reload(); renderPage();
  toast('已暫存，連線後自動辨識', 3000);
}
let processing = false;
async function processPhotoQueue() {
  if (processing || !canOnline()) return;
  processing = true;
  try {
    const list = await DB.all('photos');
    for (const p of list) {
      try {
        const r = await api('analyzeReceipt', { image: p.b64, mimeType: p.mime || 'image/jpeg' }, 150000);
        await DB.put('drafts', { id: p.id, result: r, created: p.created });
        await DB.del('photos', p.id);
      } catch (e) {
        if (!/無法連線|逾時/.test(e.message)) { await DB.del('photos', p.id); toast('一張暫存收據無法辨識：' + e.message, 4000); }
        else break;
      }
    }
  } finally { processing = false; await reload(); renderPage(); }
}
function openDraft(d) { if (!d) return; if (d.result && d.result.docType === 'list' && /card|bank/.test(d.result.listType)) { DB.del('drafts', d.id).then(reload); openReconcile(d.result.transactions, d.result); } else if (d.result && d.result.docType === 'list') openBatch(d.result, d.id); else openEntry({ receipt: d.result, draftId: d.id }); }

// ---------- 店家查詢 ----------
function openStoreSearch() {
  $('#s-q').value = $('#e-store').value.trim();
  $('#s-near').checked = S.prefs.near !== false;
  renderStoreLocal();
  openSheet('store');
  setTimeout(() => $('#s-q').focus(), 350);
}
function storeItem(s, i, src) {
  return `<button class="store-item" data-src="${src}" data-i="${i}"><div class="ico">${src === 'new' ? icon('pencil') : src === 'local' ? icon('star') : icon('pin')}</div>
    <div><b>${esc(s.name)}</b>${s.address ? `<small>${esc(s.address)}</small>` : ''}${s.phone ? `<small>${icon('phone', 'ii')} ${esc(s.phone)}</small>` : ''}${src === 'local' && s.count ? `<small>記過 ${s.count} 次${s.category ? '・' + esc(s.category) : ''}</small>` : ''}${s.source ? `<small class="faint">${esc(s.source)}</small>` : ''}</div></button>`;
}
let storeOnline = [];
function renderStoreLocal(onlineHtml) {
  const q = $('#s-q').value.trim().toLowerCase();
  const all = (S.meta.stores || []).slice().sort((a, b) => (b.count || 0) - (a.count || 0));
  const local = (q ? all.filter(s => (s.name + ' ' + s.address).toLowerCase().includes(q)) : all).slice(0, 8);
  let h = '';
  if (q) h += `<div class="form-group">${storeItem({ name: $('#s-q').value.trim(), address: '直接使用這個名稱' }, 0, 'new')}</div>`;
  if (local.length) h += `<div class="set-h">常用店家・離線可用</div><div class="form-group">${local.map((s, i) => storeItem(s, i, 'local')).join('')}</div>`;
  if (onlineHtml !== undefined) h += onlineHtml;
  else if (q) h += navigator.onLine && canOnline()
    ? `<button class="btn sec" id="s-go" style="margin-top:4px">${icon('search')}線上搜尋「${esc($('#s-q').value.trim())}」的地址與電話</button>`
    : `<div class="hint" style="margin-top:4px">離線中，只能使用常用店家。連線後可查詢地址與電話。</div>`;
  $('#s-results').innerHTML = h;
  if ($('#s-go')) $('#s-go').onclick = searchOnline;
  $$('#s-results .store-item').forEach(b => b.onclick = () => {
    const i = Number(b.dataset.i), src = b.dataset.src;
    const s = src === 'new' ? { name: $('#s-q').value.trim() } : src === 'local' ? local[i] : storeOnline[i];
    pickStore(s);
  });
  S._local = local;
}
function pickStore(s) {
  $('#e-store').value = s.name || '';
  if (s.address != null && s.address !== '直接使用這個名稱') $('#e-addr').value = s.address || '';
  if (s.phone != null) $('#e-phone').value = s.phone || '';
  E.placeId = s.placeId || '';
  if (s.category && E.type === '支出' && cats('支出').some(c => c.name === s.category)) { E.category = s.category; renderCats(); }
  showStoreExtra();
  closeSheet('store');
}
function getPos() {
  return new Promise(res => {
    if (!navigator.geolocation) return res(null);
    navigator.geolocation.getCurrentPosition(p => res({ lat: p.coords.latitude, lng: p.coords.longitude }), () => res(null), { timeout: 6000, maximumAge: 300000 });
  });
}
async function searchOnline() {
  const q = $('#s-q').value.trim();
  if (!q) return;
  if (!canOnline()) return toast('離線中無法線上搜尋');
  renderStoreLocal(`<div class="empty" style="padding:20px"><div class="spinner"></div>搜尋中…</div>`);
  const pos = $('#s-near').checked ? await getPos() : null;
  try {
    storeOnline = await api('searchStore', Object.assign({ q }, pos || {}), 45000);
    renderStoreLocal(storeOnline.length ? `<div class="set-h">搜尋結果</div><div class="form-group">${storeOnline.map((s, i) => storeItem(s, i, 'online')).join('')}</div>`
      : `<div class="hint">找不到「${esc(q)}」，可直接使用名稱並手動填寫地址電話。</div>`);
  } catch (e) { renderStoreLocal(`<div class="hint exp">搜尋失敗：${esc(e.message)}</div>`); }
}

// ---------- 交易明細 ----------
function groupHtml(t) {
  if (!t.group) return '';
  const sib = S.txs.filter(x => x.group === t.group);
  if (sib.length < 2) return '';
  return `<div class="set-h">同一張收據拆成 ${sib.length} 筆</div><div class="form-group">${sib.map(x => `<div class="kv"><span>${catInfo('支出', x.category).icon} ${esc(x.category)}${x.id === t.id ? '（這筆）' : ''}</span><span class="num">${money(x.original, x.currency)}</span></div>`).join('')}<div class="kv"><span>收據合計</span><span class="num">${money(sib.reduce((a, x) => a + x.original, 0), t.currency)}</span></div></div>`;
}
function openDetail(id) {
  const t = S.txs.find(x => x.id === id);
  if (!t) return;
  const c = catInfo(t.type, t.category);
  const sign = t.type === '收入' ? '+' : t.type === '支出' ? '-' : '';
  const am = accMap(), acc = am[t.account];
  // ---- 右欄直接編輯（改完離開欄位就自動儲存）----
  const accOpts = sel => visibleAccounts().concat(S.meta.accounts.filter(a => a.name === sel && !visibleAccounts().includes(a)))
    .map(a => `<option value="${esc(a.name)}" ${a.name === sel ? 'selected' : ''}>${esc(a.name)}${a.currency === 'TWD' ? '（台幣）' : ''}</option>`).join('');
  const catOpts = cats(t.type).map(x => `<option ${x.name === t.category ? 'selected' : ''}>${esc(x.name)}</option>`).join('') + (cats(t.type).some(x => x.name === t.category) ? '' : `<option selected>${esc(t.category)}</option>`);
  const f = [];
  f.push(`<div class="frow"><label>日期</label><input type="date" data-f="date" value="${esc(t.date)}"></div>`);
  f.push(`<div class="frow"><label>分類</label><select data-f="category">${catOpts}</select></div>`);
  f.push(`<div class="frow"><label>子分類</label><select data-f="sub">${subOptions(t.type, t.category, t.sub || '')}</select></div>`);
  if (t.type === '振替') {
    f.push(`<div class="frow"><label>轉出</label><select data-f="account">${accOpts(t.account)}</select></div>`);
    f.push(`<div class="frow"><label>轉入</label><select data-f="toAccount">${accOpts(t.toAccount)}</select></div>`);
    f.push(`<div class="frow"><label>轉入金額</label><input data-f="toAmount" inputmode="decimal" value="${esc(t.toAmount || '')}" placeholder="同轉出金額"></div>`);
  } else {
    f.push(`<div class="frow"><label>${t.type === '支出' ? '付款' : '存入'}</label><select data-f="account">${accOpts(t.account)}</select></div>`);
    if (t.type === '支出' && acc && acc.type === '信用卡') f.push(`<div class="frow"><label>分期</label><select data-f="inst"><option value="0">一次付清</option>${INST_OPTS.concat(instN(t) && !INST_OPTS.includes(instN(t)) ? [instN(t)] : []).map(n => `<option value="${n}" ${instN(t) === n ? 'selected' : ''}>分 ${n} 期</option>`).join('')}</select></div>`);
    f.push(`<div class="frow"><label>店家</label><input data-f="store" value="${esc(t.store || '')}" placeholder="選填"></div>`);
  }
  f.push(`<div class="frow"><label>備註</label><input data-f="note" value="${esc(t.note || '')}" placeholder="選填"></div>`);
  if (t.type !== '振替') {
    f.push(`<div class="frow"><div class="grow">出差<small>另計，不算日常開銷</small></div><label class="switch"><input type="checkbox" data-f="trip" ${t.trip ? 'checked' : ''}><span></span></label></div>`);
    if (t.trip) { const auto = tripCover(t.date); f.push(`<div class="frow"><label>哪次出差</label><select data-f="tripId"><option value="1" ${t.trip === '1' ? 'selected' : ''}>依日期自動${auto ? `（${esc(auto.name)}）` : '（未分配）'}</option>${tripsAll().map(r => `<option value="${esc(r.id)}" ${t.trip === r.id ? 'selected' : ''}>${esc(r.name)}　${tripRange(r)}</option>`).join('')}</select></div>`); }
    if (!t.trip) f.push(`<div class="frow"><div class="grow">計入日常開銷<small>${!t.excl && defaultExcluded(t) ? '車貸／購車預設不計入' : '算進本月支出與省錢建議'}</small></div><label class="switch"><input type="checkbox" data-f="daily" ${isExcluded(t) ? '' : 'checked'}><span></span></label></div>`);
  }
  // 只能看的資訊
  const info = [];
  if (t.currency !== 'JPY') info.push(['日幣金額', yen(t.jpy)], ['匯率', `1 NT$ = ${t.rate} 円${t.rateEstimated ? '（估算）' : ''}`]);
  else if (Number(t.twd) > 0 && wantsTwd(acc)) info.push(['台幣換算', `${money(t.twd, 'TWD')}（1 NT$ ≈ ${(t.jpy / t.twd).toFixed(3)} 円）`]);
  if (instN(t)) {
    const paid = acc ? Math.min(instN(t), Math.max(0, monthsBetween(cardKey(acc, t.date), cardKey(acc, today())))) : 0;
    info.push(['分期', `${instLabel(t)}・已過 ${paid}/${instN(t)} 期`]);
  }
  if (t.liters || t.odo) info.push(['加油', [t.liters ? t.liters + ' L' : '', t.unitPrice ? '¥' + t.unitPrice + '/L' : '', t.odo ? t.odo.toLocaleString() + ' km' : ''].filter(Boolean).join('・')]);
  info.push(['來源', (t.source || '手動') + (t._pending ? '・待同步' : '')]);
  const tel = (t.storePhone || '').replace(/[^\d+]/g, '');
  const mapQ = encodeURIComponent([t.store, t.storeAddress].filter(Boolean).join(' '));
  const store = t.store && (t.storeAddress || t.storePhone) ? `<div class="set-h">店家資訊</div><div class="form-group">
      <div class="store-item" style="pointer-events:none"><div class="ico">${icon('store')}</div><div><b>${esc(t.store)}</b>${t.storeAddress ? `<small>${esc(t.storeAddress)}</small>` : ''}${t.storePhone ? `<small>${icon('phone', 'ii')} ${esc(t.storePhone)}</small>` : ''}</div></div>
      <div class="call-row">${tel ? `<a href="tel:${tel}">${icon('phone')}打電話</a>` : ''}<a href="https://www.google.com/maps/search/?api=1&query=${mapQ}" target="_blank" rel="noopener">${icon('map')}地圖</a></div></div>` : '';
  const items = t.items && t.items.length ? `<div class="set-h">品項（${t.items.length}）</div><div class="form-group">${t.items.map(i =>
    `<div class="kv"><span>${esc(i.name_zh || i.name || '（未命名）')}${i.name && i.name_zh && i.name !== i.name_zh ? `<br><small class="faint">${esc(i.name)}</small>` : ''}${i.qty > 1 ? ` ×${i.qty}` : ''}</span><span class="num">${money(i.subtotal, t.currency)}${i.tax ? `<small class="faint"> +${i.tax}%</small>` : ''}</span></div>`).join('')}</div>` : '';
  const html = `<div class="det-hero"><div class="ico" style="background:${hashTint(t.category)}">${c.icon}</div>
      <div class="det-amt"><span class="num ${t.type === '收入' ? 'inc' : ''}">${sign}${t.currency === 'TWD' ? 'NT$' : '¥'}</span><input class="num ${t.type === '收入' ? 'inc' : ''}" data-f="original" inputmode="decimal" value="${esc(t.original)}" aria-label="金額"></div>
      <div class="sub">${esc(t.type)}・${esc(t.type === '振替' ? t.category : (t.store || t.category))}<span class="det-saved" id="det-saved"></span></div></div>
    <div class="form-group det-form">${f.join('')}</div>
    <div class="form-group">${info.map(r => `<div class="kv"><span>${r[0]}</span><span>${esc(r[1])}</span></div>`).join('')}</div>
    ${store}${items}${groupHtml(t)}
    <div class="btn-row det-act" style="margin-top:6px"><button class="btn danger" data-d="del">${icon('trash')}刪除</button><button class="btn sec copy" data-d="copy">${icon('copy')}複製</button><button class="btn sec" data-d="edit">${icon('pencil')}編輯</button></div>
    <div class="hint" style="text-align:center;margin-top:8px">直接修改上面的欄位，離開欄位後會自動儲存。品項、幣別等請按「編輯」。</div>`;
  const inPane = isWide() && S.page === 'list';
  let root;
  if (inPane) {
    S.selTx = id; root = $('#l-pane'); root.innerHTML = html;
    $$('#l-list .tx').forEach(b => b.classList.toggle('sel', b.dataset.id === id));
  } else { openSheet('detail', '', html); root = $('#d-body'); }
  $$('[data-f]', root).forEach(el => {
    el.addEventListener('change', () => patchTx(id, el.dataset.f, el.type === 'checkbox' ? el.checked : el.value, root, inPane));
    if (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'date') el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); el.blur(); } });
  });
  const amtIn = $('[data-f=original]', root);
  const fit = () => { amtIn.style.width = (Math.max(2, String(amtIn.value).length) + 0.8) + 'ch'; };
  amtIn.addEventListener('input', fit); fit();
  $('[data-d=copy]', root).onclick = () => {
    const cur = S.txs.find(x => x.id === id) || t;
    closeSheet('detail');
    setTimeout(() => { openEntry({ tx: cur, copy: true }); toast(`已複製，日期改為今天（${fmtMD(today())}）`, 2200); }, inPane ? 0 : 200);
  };
  $('[data-d=edit]', root).onclick = () => { const cur = S.txs.find(x => x.id === id) || t; closeSheet('detail'); setTimeout(() => openEntry({ tx: cur }), inPane ? 0 : 200); };
  $('[data-d=del]', root).onclick = async () => {
    if (!confirm('確定刪除這筆紀錄？')) return;
    await localDeleteTx(t.id); closeSheet('detail'); S.selTx = null; renderPage(); renderSync(); toast('已刪除'); sync();
  };
}
/** 明細右欄的單一欄位修改 → 重新計算相關金額後存檔 */
async function patchTx(id, field, value, root, inPane) {
  const t = S.txs.find(x => x.id === id); if (!t) return;
  const n = Object.assign({}, t);
  const am = accMap();
  const flash = (msg, bad) => { const el = $('#det-saved', root); if (el) { el.textContent = msg; el.className = 'det-saved on' + (bad ? ' bad' : ''); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200); } };
  if (field === 'original' || field === 'toAmount') {
    const v = parseAmt(value);
    if (field === 'original' && !(v > 0)) { flash('金額格式錯誤', true); return; }
    n[field] = field === 'toAmount' ? (v > 0 ? v : '') : v;
  } else if (field === 'trip') { n.trip = value ? '1' : ''; if (value) n.excl = ''; }
  else if (field === 'tripId') n.trip = value || '1';
  else if (field === 'daily') { const wantEx = !value, defEx = defaultExcluded(n); n.excl = wantEx === defEx ? '' : (wantEx ? '1' : '0'); }
  else if (field === 'inst') n.inst = Number(value) > 1 ? Number(value) : 0;
  else if (field === 'date') { if (!value) return; n.date = value; }
  else if (field === 'sub' && value === '__new') {
    const v = askNewSub(n.category); const sel = $('[data-f=sub]', root);
    if (!v) { if (sel) sel.innerHTML = subOptions(n.type, n.category, n.sub || ''); return; }
    n.sub = v; if (sel) sel.innerHTML = subOptions(n.type, n.category, v);
  }
  else if (field === 'account' || field === 'toAccount') { if (!am[value]) return; n[field] = value; if (n.type === '振替' && n.account === n.toAccount) { flash('轉出與轉入不能相同', true); return; } }
  else n[field] = String(value).trim();
  // 金額、日期、帳戶變了 → 重算日幣／匯率／台幣換算
  if (['original', 'date', 'account', 'toAccount'].includes(field)) {
    const a = am[n.account], b = am[n.toAccount];
    const needRate = n.currency === 'TWD' || (a && a.currency === 'TWD') || (n.type === '振替' && b && b.currency === 'TWD');
    let r = { rate: 1 };
    if (needRate || (n.currency === 'JPY' && n.type !== '振替' ? wantsTwd(a) : (wantsTwd(a) || wantsTwd(b)))) r = await getRate(n.date);
    if (n.currency === 'TWD') { n.rate = r.rate; n.rateEstimated = !!r.est; n.jpy = Math.round(n.original * r.rate); }
    else { n.jpy = n.original; if (needRate) { n.rate = r.rate; n.rateEstimated = !!r.est; } }
    n.twd = n.currency === 'JPY' && (wantsTwd(a) || (n.type === '振替' && wantsTwd(b))) && !r.est && r.rate > 1 ? twdOf(n.jpy, r.rate) : 0;
    if (n.type === '支出' && !(a && a.type === '信用卡')) n.inst = 0;
  }
  try {
    await localSaveTx(n, !t._pending);
    flash('✓ 已儲存');
    // 只重畫列表，不重畫正在編輯的右欄（避免游標跳掉）
    S.keepPane = inPane;
    renderPage(); renderSync(); sync();
    S.keepPane = false;
    // 影響欄位結構的修改（帳戶類型、出差）→ 重畫這一筆
    if (['account', 'trip', 'category'].includes(field)) {
      if (field === 'category') { const ic = $('.det-hero .ico', root); if (ic) { ic.style.background = hashTint(n.category); ic.innerHTML = catInfo(n.type, n.category).icon; } const ss = $('[data-f=sub]', root); if (ss) ss.innerHTML = subOptions(n.type, n.category, n.sub || ''); }
      else openDetail(id);
    }
  } catch (e) { flash('儲存失敗：' + e.message, true); }
}

// ---------- 信用卡：結帳區間、額度、分期 ----------
/** 結帳日（0＝未設定；31＝月底） */
const closeDayOf = a => a && a.type === '信用卡' ? Math.min(31, Math.max(0, Math.round(Number(a.closeDay) || 0))) : 0;
function closeDate(ym, d) { const last = Number(monthEnd(ym).slice(8)); return ym + '-' + pad(Math.min(d, last)); }
/** 某天屬於哪一期帳單（以結帳日所在月份命名） */
function cardKey(a, date) {
  const d = closeDayOf(a); if (!d) return cycleKey(date);
  const ym = date.slice(0, 7);
  return date <= closeDate(ym, d) ? ym : addMonths(ym, 1);
}
function cardRange(a, ym) {
  const d = closeDayOf(a); if (!d) return cycleRange(ym);
  return { from: addDays(closeDate(addMonths(ym, -1), d), 1), to: closeDate(ym, d) };
}
const monthsBetween = (a, b) => (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(b.slice(5, 7)) - Number(a.slice(5, 7));
const instN = t => t.type === '支出' && Number(t.inst) > 1 ? Math.round(Number(t.inst)) : 0;
/** 分期：第 i 期（0 起算）的金額，餘數算在第一期 */
function instAmount(total, n, i) { const per = Math.floor(total / n); return i === 0 ? Math.round((total - per * (n - 1)) * 100) / 100 : per; }
/** 這張卡某一期帳單的使用金額（分期只算當期應繳的那一期） */
function cardUsage(a, ym) {
  const r = cardRange(a, ym);
  let used = 0, n = 0;
  S.txs.forEach(t => {
    // 刷卡消費、退款，以及從卡片轉出（例：用卡片儲值 Suica）都算進帳單；繳卡費（轉入卡片）不算
    if (t.account !== a.name || (t.type !== '支出' && t.type !== '收入' && t.type !== '振替')) return;
    const amt = toDisp(a, t, amtIn(t, a.name));
    const N = instN(t);
    if (N) {
      const i = monthsBetween(cardKey(a, t.date), ym);
      if (i >= 0 && i < N) { used += instAmount(amt, N, i); n++; }
      return;
    }
    if (t.date < r.from || t.date > r.to) return;
    used += t.type === '收入' ? -amt : amt; n++;
  });
  return { used: Math.round(used * 100) / 100, n, from: r.from, to: r.to };
}
/** 分期中的消費：還沒繳完的期數與金額 */
function cardInstallments(a) {
  const now = cardKey(a, today());
  return S.txs.filter(t => t.account === a.name && instN(t)).map(t => {
    const N = instN(t), amt = toDisp(a, t, amtIn(t, a.name));
    const paid = Math.min(N, Math.max(0, monthsBetween(cardKey(a, t.date), now)));
    let left = 0; for (let i = paid; i < N; i++) left += instAmount(amt, N, i);
    return { t, N, paid, left };
  }).filter(x => x.left > 0);
}
/** 額度資訊：本期使用、未繳總額、剩餘額度 */
/** 繳款日（0＝未設定；31＝月底）與繳款月（1＝翌月、2＝翌々月） */
const payDayOf = a => a && a.type === '信用卡' ? Math.min(31, Math.max(0, Math.round(Number(a.payDay) || 0))) : 0;
const payMonOf = a => Number(a.payMonth) === 2 ? 2 : 1;
/** 某一期帳單（以結帳月命名）的扣款日 */
const payDateRaw = (a, ym) => closeDate(addMonths(ym, payMonOf(a)), payDayOf(a));
/** 實際扣款日：遇到週末、年底年初（12/31–1/3）順延到下一個營業日 */
function bizDay(d) {
  for (let i = 0; i < 7; i++) {
    const w = new Date(d + 'T12:00:00').getDay(), md = d.slice(5);
    if (w !== 0 && w !== 6 && md !== '12-31' && md !== '01-01' && md !== '01-02' && md !== '01-03') return d;
    d = addDays(d, 1);
  }
  return d;
}
const payDateOf = (a, ym) => bizDay(payDateRaw(a, ym));
/** 卡片帳單確定的金額（依帳單修正，同步到所有裝置）：{ 帳戶: { 'YYYY-MM': 金額 } } */
const billFixed = (a, ym) => { const m = (S.prefs.cardBills || {})[a.name]; return m && m[ym] != null ? Number(m[ym]) : null; };
async function setBillFixed(name, ym, v) {
  const all = S.prefs.cardBills = S.prefs.cardBills || {};
  const m = all[name] = all[name] || {};
  if (v == null) delete m[ym]; else m[ym] = v;
  // 只留最近 12 期
  Object.keys(m).sort().slice(0, -12).forEach(k => delete m[k]);
  await persist('prefs');
  const ops = await DB.all('ops');
  const old = ops.find(o => o.op === 'settings' && o.settings && o.settings.cardBills && !S.inflight.has(o.k));
  if (old) { old.settings.cardBills = all; await DB.put('ops', old); } else await DB.put('ops', { op: 'settings', settings: { cardBills: all } });
  await reload(); renderPage(); renderSync(); sync();
}
/** 日本信用卡的帳單：還沒扣款的各期（含正在累積的本期） */
function cardBills(a) {
  const now = today(), cur = cardKey(a, now);
  const out = [];
  for (let i = -3; i <= 0; i++) {
    const k = addMonths(cur, i);
    const pd = payDateOf(a, k);
    if (pd < now) continue;                       // 已扣款
    const u = cardUsage(a, k);
    const fx = billFixed(a, k);
    out.push(Object.assign(u, { key: k, payDate: pd, closed: u.to < now, est: u.used, fixed: fx, used: fx != null ? fx : u.used }));
  }
  return out;
}
/** 分期：本期之後才會請款的部分 */
function futureInstallments(a) {
  const cur = cardKey(a, today());
  let v = 0;
  S.txs.forEach(t => {
    if (t.account !== a.name || !instN(t)) return;
    const N = instN(t), amt = toDisp(a, t, amtIn(t, a.name));
    for (let i = 0; i < N; i++) if (monthsBetween(cur, addMonths(cardKey(a, t.date), i)) > 0) v += instAmount(amt, N, i);
  });
  return v;
}
function cardInfo(a, bal) {
  const u = cardUsage(a, cardKey(a, today()));
  // 台灣的卡：額度以台幣填寫，日幣顯示時用最新匯率換算
  let limit = Number(a.limit) || 0;
  if (limit && a.currency === 'JPY' && wantsTwd(a) && !showsTwd(a)) limit = Math.round(limit * latestRate());
  if (closeDayOf(a) && payDayOf(a)) {
    // 有設繳款日：未繳＝還沒扣款的各期帳單＋之後的分期（不靠帳戶餘額，期初餘額不準也不影響）
    const bills = cardBills(a);
    const due = bills.find(b => b.closed) || bills[0] || null;   // 下一次要繳的帳單
    // 依消費日估算的未繳總額；帳單確定金額不同時（有消費晚入帳、跨到下一期），以較大的為準
    const byUsage = bills.reduce((s2, b) => s2 + b.est, 0);
    const byBill = bills.reduce((s2, b) => s2 + b.used, 0);
    const owed = Math.round((Math.max(byUsage, byBill) + futureInstallments(a)) * 100) / 100;
    // 已確定的帳單比估算少 → 少掉的部分會出現在下一期
    const shift = bills.filter(b => b.fixed != null && b.closed).reduce((s2, b) => s2 + (b.est - b.fixed), 0);
    if (shift > 0) u.used = Math.round((u.used + shift) * 100) / 100;
    return Object.assign(u, { limit, owed, left: limit ? limit - owed : 0, bills, due, jp: true });
  }
  const owed = Math.max(u.used, bal < 0 ? -bal : 0);
  return Object.assign(u, { limit, owed, left: limit ? limit - owed : 0 });
}
function instLabel(t) {
  const N = instN(t); if (!N) return '';
  return `分 ${N} 期・每期約 ${money(instAmount(t.original, N, 1), t.currency)}`;
}

// ---------- 台幣換算（Richart 等台灣發行的卡）----------
/** 這個帳戶的日幣消費要不要備註台幣（手動設定優先；名稱有 Richart 時預設開啟） */
const wantsTwd = a => !!a && a.currency === 'JPY' && (a.showTwd === '1' || (a.showTwd !== '0' && /richart/i.test(a.name)));
const needsTwd = t => { if (t.currency !== 'JPY' || Number(t.twd) > 0) return false; const am = accMap(); return wantsTwd(am[t.account]) || (t.type === '振替' && wantsTwd(am[t.toAccount])); };
/** 台灣的卡：可以切換用台幣顯示（帳戶設定同步；舊版後端沒有這欄時存在這台裝置） */
const dispCur = a => !a ? 'JPY' : a.currency === 'JPY' && wantsTwd(a) && (a.dispCur || (S.prefs.accCur || {})[a.name]) === 'TWD' ? 'TWD' : a.currency;
const showsTwd = a => !!a && a.currency === 'JPY' && dispCur(a) === 'TWD';
/** 這筆交易當天的匯率（1 台幣 = ? 日圓）：記帳時的匯率 → 台幣換算欄 → 當天匯率快取 → 最新匯率 */
function txRate(t) {
  if (t.currency === 'TWD' && t.rate > 0) return t.rate;
  if (Number(t.twd) > 0 && t.jpy > 0) return t.jpy / t.twd;
  const h = S.rates[t.date]; return h && h.rate > 0 ? h.rate : latestRate();
}
/** 日幣帳戶的金額 → 顯示幣別（台幣時用消費日當天匯率換算） */
const toDisp = (a, t, v) => showsTwd(a) ? Math.round(v / txRate(t)) : v;
const accDeltaDisp = (t, a) => toDisp(a, t, accDelta(t, a.name));
/** 帳戶餘額（顯示幣別）：期初用最新匯率，每筆用各自當天的匯率 */
function dispBalance(a) {
  if (!showsTwd(a)) return null;
  let b = (Number(a.initial) || 0) / latestRate();
  S.txs.forEach(t => { if (t.account === a.name || t.toAccount === a.name) b += accDeltaDisp(t, a); });
  return Math.round(b);
}
const twdOf = (jpy, rate) => rate > 0 ? Math.round(jpy / rate) : 0;
let twdBusy = false;
/** 補上缺少的台幣換算（依每筆的消費日期查當天匯率），一次寫回試算表 */
async function fillTwdAll() {
  if (twdBusy || !navigator.onLine) return;
  const todo = S.txs.filter(t => needsTwd(t) && !t._pending);
  if (!todo.length) return;
  twdBusy = true;
  try {
    const dates = [...new Set(todo.map(t => t.date))];
    const rates = {};
    for (let i = 0; i < dates.length; i += 4) {
      await Promise.all(dates.slice(i, i + 4).map(async d => { const r = await getRate(d); if (!r.est && r.rate > 0) rates[d] = r.rate; }));
    }
    const items = [];
    for (const t of todo) {
      if (!rates[t.date]) continue;
      const cur = await DB.get('tx', t.id); if (!cur || cur._pending) continue;
      cur.twd = twdOf(cur.jpy, rates[t.date]);
      await DB.put('tx', cur); items.push({ id: cur.id, twd: cur.twd });
    }
    if (items.length) {
      for (let i = 0; i < items.length; i += 300) await DB.put('ops', { op: 'twdFill', items: items.slice(i, i + 300) });
      await reload(); renderPage(); renderSync(); sync();
    }
  } finally { twdBusy = false; }
}

// ---------- 分析細項（點擊後往下看）----------
const PAY_GROUPS = { card: '信用卡', cash: '現金', other: '電子錢包・銀行' };
function payGroupOf(type) { return type === '信用卡' ? 'card' : type === '現金' ? 'cash' : 'other'; }
function drillBase(ym) { return S.txs.filter(t => t.type === '支出' && isDaily(t) && inCycle(t, ym)); }
function openDrill(level) { S.drill = [level]; renderDrill(); openSheet('drill'); }
function drillPush(level) { S.drill.push(level); renderDrill(); $('#drill-body').scrollTop = 0; }
function drillBack() { if (S.drill && S.drill.length > 1) { S.drill.pop(); renderDrill(); } else closeSheet('drill'); }
function drRow(attrs, ico, tint, name, sub, v, vs, pct) {
  return `<button class="dr-row" ${attrs}><div class="ico" style="background:${tint}">${ico}</div>
    <div class="nm"><b>${esc(name)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}${pct != null ? `<div class="track"><div class="fill" style="width:${Math.max(1, pct)}%"></div></div>` : ''}</div>
    <div class="v num">${v}${vs ? `<small>${vs}</small>` : ''}</div><span class="chev">›</span></button>`;
}
function drillTxHtml(list) {
  const groups = {}; list.forEach(t => (groups[t.date] = groups[t.date] || []).push(t));
  return Object.keys(groups).sort().reverse().map(d => {
    const sum = groups[d].reduce((s, t) => s + t.jpy, 0);
    return `<div class="tx-group"><div class="tx-day"><span>${fmtMD(d)}（${'日一二三四五六'[new Date(d + 'T12:00:00').getDay()]}）</span><span class="num">${yen(sum)}</span></div>${groups[d].map(txRow).join('')}</div>`;
  }).join('') || `<div class="card empty"><span class="em">${icon('inbox')}</span>沒有紀錄</div>`;
}
function renderDrill() {
  if (!S.drill || !S.drill.length) return;
  const L = S.drill[S.drill.length - 1];
  const am = accMap();
  let txs = drillBase(L.ym);
  if (L.group) txs = txs.filter(t => payGroupOf(am[t.account] ? am[t.account].type : '') === L.group);
  if (L.acc) txs = txs.filter(t => t.account === L.acc);
  if (L.cat) txs = txs.filter(t => (t.category || '其他') === L.cat);
  if (L.sub != null) txs = txs.filter(t => (t.sub || '') === L.sub);
  if (L.store) txs = txs.filter(t => t.store === L.store);
  const total = txs.reduce((s, t) => s + t.jpy, 0);
  const title = L.acc || (L.sub != null ? (L.sub || '未分細項') : '') || L.store || L.cat || PAY_GROUPS[L.group] || '';
  $('#sh-drill h2').textContent = title;
  const crumbs = [cycleLabelHtml(L.ym)].concat(S.drill.slice(0, -1).map(x => esc(x.acc || (x.sub != null ? x.sub || '未分細項' : '') || x.store || x.cat || PAY_GROUPS[x.group]))).join(' › ');
  const head = `<div class="dr-head"><small>${crumbs}</small><b class="num">${yen(total)}</b><small>${txs.length} 筆</small></div>`;
  let body = '';
  const agg = (keyFn) => { const m = {}; txs.forEach(t => { const k = keyFn(t); const o = m[k] || (m[k] = { v: 0, n: 0 }); o.v += t.jpy; o.n++; }); return Object.entries(m).sort((a, b) => b[1].v - a[1].v); };
  const all = `<div class="form-group">${drRow('data-dall="1"', icon('receipt'), 'var(--surface-2)', '查看全部明細', txs.length + ' 筆', yen(total))}</div>`;
  if (L.all || L.sub != null || L.store) {
    body = drillTxHtml(txs);
  } else if (L.group && !L.acc) {
    // 第二層：這個支付方式底下各帳戶（例：各張信用卡）
    const rows = agg(t => t.account);
    const mx = Math.max(1, ...rows.map(r => r[1].v));
    body = `<div class="set-h">各帳戶</div><div class="form-group">${rows.map(([k, o]) => {
      const a = am[k] || {};
      let sub = `${o.n} 筆・${Math.round(o.v / total * 100)}%`;
      if (a.type === '信用卡' && closeDayOf(a)) { const u = cardUsage(a, cardKey(a, today())); sub += `・本期帳單 ${money(u.used, dispCur(a))}`; }
      return drRow(`data-dacc="${esc(k)}"`, typeIcon(a.type), hashTint(k), k, sub, yen(o.v), '', o.v / mx * 100);
    }).join('')}</div>` + all;
  } else if (L.cat && !L.acc) {
    // 第二層：分類底下的細項
    const rows = agg(t => t.sub || '');
    const mx = Math.max(1, ...rows.map(r => r[1].v));
    body = `<div class="set-h">細項</div><div class="form-group">${rows.map(([k, o]) =>
      drRow(`data-dsub="${esc(k)}"`, catInfo('支出', L.cat).icon, hashTint(L.cat + k), k || '未分細項', `${o.n} 筆・${Math.round(o.v / total * 100)}%`, yen(o.v), '', o.v / mx * 100)).join('')}</div>`;
    const st = agg(t => t.store || '').filter(r => r[0]).slice(0, 5);
    if (st.length) body += `<div class="set-h">常去店家</div><div class="form-group">${st.map(([k, o]) => drRow(`data-dstore="${esc(k)}"`, icon('store'), 'var(--surface-2)', k, o.n + ' 次', yen(o.v))).join('')}</div>`;
    body += all;
  } else if (L.acc) {
    // 第三層：某帳戶底下依分類
    const rows = agg(t => t.category || '其他');
    const mx = Math.max(1, ...rows.map(r => r[1].v));
    body = `<div class="set-h">依分類</div><div class="form-group">${rows.map(([k, o]) =>
      drRow(`data-dcat="${esc(k)}"`, catInfo('支出', k).icon, hashTint(k), k, `${o.n} 筆・${Math.round(o.v / total * 100)}%`, yen(o.v), '', o.v / mx * 100)).join('')}</div>`;
    body += `<div class="set-h">明細</div>${drillTxHtml(txs)}`;
  } else {
    body = drillTxHtml(txs);
  }
  const root = $('#drill-body');
  root.innerHTML = head + body;
  bindTx(root);
  const base = Object.assign({}, L); delete base.all;
  $$('[data-dacc]', root).forEach(b => b.onclick = () => drillPush(Object.assign({}, base, { acc: b.dataset.dacc })));
  $$('[data-dsub]', root).forEach(b => b.onclick = () => drillPush(Object.assign({}, base, { sub: b.dataset.dsub })));
  $$('[data-dcat]', root).forEach(b => b.onclick = () => drillPush(Object.assign({}, base, { cat: b.dataset.dcat, sub: undefined, all: true })));
  $$('[data-dstore]', root).forEach(b => b.onclick = () => drillPush(Object.assign({}, base, { store: b.dataset.dstore, sub: undefined, all: true })));
  $$('[data-dall]', root).forEach(b => b.onclick = () => drillPush(Object.assign({}, base, { all: true, sub: L.cat ? undefined : L.sub })));
}

// ---------- 帳戶明細 ----------
/** 這筆紀錄對某帳戶的增減（以該帳戶幣別） */
function accDelta(t, name) {
  let d = 0;
  if (t.account === name) d += (t.type === '收入' ? 1 : -1) * amtIn(t, name);
  if (t.type === '振替' && t.toAccount === name) d += amtIn(t, name, 'to');
  return Math.round(d * 100) / 100;
}
function openAccount(name, period, kind) {
  const a = accMap()[name]; if (!a) return;
  const same = S.accView && S.accView.name === name;
  // 信用卡有設結帳日時，期間改用帳單區間（上次結帳日隔天 ～ 這次結帳日）
  const isCard = a.type === '信用卡' && !!closeDayOf(a);
  const keyNow = isCard ? cardKey(a, today()) : cycleKey(today());
  S.accView = { name, period: period || (same ? S.accView.period : keyNow), kind: kind || (same ? S.accView.kind : '全部') || '全部' };
  const per = S.accView.period, kd = S.accView.kind;
  const all = S.txs.filter(t => t.account === name || t.toAccount === name)
    .sort((x, y) => x.date.localeCompare(y.date) || (x.createdAt || 0) - (y.createdAt || 0));
  const cur = dispCur(a), tw = showsTwd(a);
  const dl0 = t => tw ? accDeltaDisp(t, a) : accDelta(t, name);
  let bal = tw ? (Number(a.initial) || 0) / latestRate() : Number(a.initial) || 0;
  const bals = {}; all.forEach(t => { bal += dl0(t); bals[t.id] = Math.round(bal * 100) / 100; });
  bal = Math.round(bal * 100) / 100;
  const r = per === 'all' ? null : isCard ? cardRange(a, per) : cycleRange(per);
  const inPer = all.filter(t => !r || (t.date >= r.from && t.date <= r.to));
  const list = inPer.filter(t => kd === '全部' || t.type === kd).reverse();
  let pin = 0, pout = 0; list.forEach(t => { const d = dl0(t); if (d > 0) pin += d; else pout -= d; });
  const kCount = k => inPer.filter(t => t.type === k).length;
  const perLabel = per === 'all' ? '全部期間' : isCard ? `${monthLabel(per)}帳單<small class="rng">${fmtMD(r.from)} – ${fmtMD(r.to)}</small>` : cycleLabelHtml(per);
  // 信用卡：本期已使用、額度、分期
  let cardHtml = '';
  if (a.type === '信用卡') {
    const c = cardInfo(a, bal);
    const insts = cardInstallments(a);
    const pct = c.limit ? Math.min(100, Math.max(0, c.owed / c.limit * 100)) : 0;
    cardHtml = c.jp ? `<div class="card">
      ${c.bills.filter(b => b.closed).map(b => `<div class="faint" style="font-size:12.5px">${fmtMD(b.payDate)} 繳款（${fmtMD(b.from)} – ${fmtMD(b.to)} 的消費）</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin:2px 0 8px"><span class="num" style="font-size:24px;font-weight:800">${money(b.used, cur)}</span>
        <span class="badge ${b.fixed != null ? '' : 'inst'}">${b.fixed != null ? '帳單金額' : '依消費估算'}</span>
        <a href="#" data-bill="${b.key}" data-est="${b.est}" style="margin-left:auto;font-size:12.5px;font-weight:650;color:var(--brand-ink)">${b.fixed != null ? '修改' : '輸入帳單金額'}</a></div>
      ${b.fixed != null && Math.round(b.fixed) !== Math.round(b.est) ? `<div class="faint" style="font-size:11.5px;margin:-4px 0 8px">依消費估算 ${money(b.est, cur)}，差額 ${money(b.est - b.fixed, cur)} 視為晚入帳、算到下一期</div>` : ''}`).join('')}
      <div class="faint" style="font-size:12.5px">本期已用（${fmtMD(c.from)} – ${fmtMD(c.to)}・${fmtMD(payDateOf(a, cardKey(a, today())))} 繳款）</div>
      <div class="num" style="font-size:${c.bills.some(b => b.closed) ? 18 : 24}px;font-weight:800;margin-top:2px">${money(c.used, cur)}</div>
      ${c.limit ? `<div class="limit-bar ${pct > 85 ? 'warn' : ''}"><div style="width:${pct}%"></div></div>
      <div class="faint num" style="font-size:12px;display:flex;justify-content:space-between"><span>總額度 ${money(c.limit, cur)}</span><span>可用額度 <b class="${c.left < 0 ? 'exp' : ''}">${money(c.left, cur)}</b></span></div>` : ''}
      ${insts.length ? `<div class="faint" style="font-size:12px;margin-top:6px">分期中 ${insts.length} 筆・未到期 ${money(insts.reduce((s2, x) => s2 + x.left, 0), cur)}</div>` : ''}
      <div class="faint" style="font-size:11.5px;margin-top:6px">可用額度＝總額度 − 還沒扣款的所有消費 − 之後的分期。卡片公司是依「入帳日」分期，月底的消費可能晚入帳、算到下一期；拿到帳單後按「輸入帳單金額」就會跟帳單一致。和卡片 App 的可用額度不同時，多半是有消費還沒記錄，可以用「比對明細」補上。</div>
    </div>` : closeDayOf(a) || c.limit ? `<div class="card">
      <div class="faint" style="font-size:12.5px">本期已使用（${fmtMD(c.from)} – ${fmtMD(c.to)}・每月 ${closeDayOf(a) === 31 ? '月底' : closeDayOf(a) + ' 日'}結帳）</div>
      <div class="num" style="font-size:24px;font-weight:800;margin-top:2px">${money(c.used, cur)}</div>
      ${c.limit ? `<div class="limit-bar ${pct > 85 ? 'warn' : ''}"><div style="width:${pct}%"></div></div>
      <div class="faint num" style="font-size:12px;display:flex;justify-content:space-between"><span>總額度 ${money(c.limit, cur)}</span><span>剩餘額度 <b class="${c.left < 0 ? 'exp' : ''}">${money(c.left, cur)}</b></span></div>` : ''}
      ${insts.length ? `<div class="faint" style="font-size:12px;margin-top:6px">分期中 ${insts.length} 筆・未到期 ${money(insts.reduce((s2, x) => s2 + x.left, 0), cur)}</div>` : ''}
    </div>` : `<div class="hint" style="margin:-4px 0 10px"><a href="#" data-aa="setclose">設定結帳日與額度</a>，就能看本期已使用與剩餘額度。</div>`;
  }
  const groups = {}; list.forEach(t => (groups[t.date] = groups[t.date] || []).push(t));
  const rowsHtml = Object.keys(groups).map(d => `<div class="tx-group"><div class="tx-day"><span>${fmtMD(d)}（${'日一二三四五六'[new Date(d + 'T12:00:00').getDay()]}）</span></div>${groups[d].map(t => {
    const dl = dl0(t), c = catInfo(t.type, t.category);
    const title = t.type === '振替' ? (t.account === name ? `→ ${t.toAccount}` : `← ${t.account}`) : (t.store || t.sub || t.category);
    const sub = t.type === '振替' ? t.category : [t.category + (t.sub ? '／' + t.sub : ''), t.note].filter(Boolean).join('・');
    return `<button class="tx" data-id="${esc(t.id)}"><div class="ico" style="background:${hashTint(t.category)}">${c.icon}</div>
      <div class="mid"><b>${esc(title)}</b><small>${t.trip ? `<span class="badge trip">${icon('plane', 'ii')}出差</span> ` : ''}${isExcluded(t) ? '<span class="badge excl">不計入</span> ' : ''}${instN(t) ? `<span class="badge inst">分${instN(t)}期</span> ` : ''}${esc(sub)}</small></div>
      <div class="amt num ${dl > 0 ? 'inc' : ''}">${dl > 0 ? '+' : ''}${money(dl, cur)}${tw ? `<small class="twd">${money(accDelta(t, name), 'JPY')}</small>` : Number(t.twd) > 0 && wantsTwd(a) ? `<small class="twd">≈ ${money(t.twd, 'TWD')}</small>` : ''}<small>餘額 ${money(bals[t.id], cur)}</small></div></button>`;
  }).join('')}</div>`).join('');
  const isIC = /suica|pasmo|icoca|kitaca|sapica|manaca|toica|nimoca|sugoca|はやかけん|pitapa/i.test(name) || a.type === '電子錢包';
  $('#acc-edit').classList.remove('hidden');
  openSheet('acc', name, `
    ${a.currency === 'JPY' && wantsTwd(a) ? `<div class="seg" id="acc-cur" style="margin:8px 0 0"><button class="${tw ? '' : 'on'}" data-acur="JPY">¥ 日幣</button><button class="${tw ? 'on' : ''}" data-acur="TWD">NT$ 台幣</button></div>` : ''}
    <div class="card" style="margin-top:8px"><div class="faint" style="font-size:12.5px">${esc(a.type)}${cur === 'TWD' ? '・台幣' : ''}・目前餘額${tw ? '（依各筆消費日匯率換算）' : ''}</div>
      <div class="num" style="font-size:30px;font-weight:800;margin:2px 0 4px" ${a.type === '信用卡' && bal < 0 ? 'class="exp"' : ''}>${money(bal, cur)}</div>
      ${a.type === '信用卡' ? `<div class="hint" style="margin:0">${bal < 0 ? '未繳金額 ' + money(-bal, cur) : '目前沒有未繳金額'}</div>` : ''}</div>
    ${cardHtml}
    <div class="msw" style="margin-bottom:10px"><button data-ap="-1">${icon('chevL')}</button><b>${perLabel}</b><button data-ap="1">${icon('chevR')}</button></div>
    <div class="chips"><button class="chip ${per === 'all' ? 'on' : ''}" data-ap="all">全部期間</button><button class="chip ${per !== 'all' ? 'on' : ''}" data-ap="now">${isCard ? '本期帳單' : '本期'}</button></div>
    <div class="seg" id="acc-kind" style="margin-bottom:10px">${['全部', '支出', '收入', '振替'].map(k => `<button class="${k === kd ? 'on' : ''}" data-ak="${k}">${k}${k === '全部' ? '' : `<small class="faint" style="margin-left:3px">${kCount(k)}</small>`}</button>`).join('')}</div>
    ${kd === '全部' ? `<div class="card sum3"><div><small>流入</small><b class="num inc">${money(pin, cur)}</b></div><div><small>流出</small><b class="num exp">${money(pout, cur)}</b></div><div><small>筆數</small><b class="num">${list.length}</b></div></div>`
      : `<div class="card sum3"><div><small>${kd}合計</small><b class="num ${kd === '支出' ? 'exp' : kd === '收入' ? 'inc' : ''}">${money(kd === '收入' ? pin : kd === '支出' ? pout : pin + pout, cur)}</b></div><div><small>筆數</small><b class="num">${list.length}</b></div><div><small>平均每筆</small><b class="num">${money(list.length ? Math.round((kd === '收入' ? pin : kd === '支出' ? pout : pin + pout) / list.length) : 0, cur)}</b></div></div>`}
    <div class="btn-row" style="margin-bottom:12px"><button class="btn sec" data-aa="new">${icon('plus')}用這個帳戶記一筆</button>${isIC ? (hasNFC() ? `<button class="btn sec" data-aa="nfc">${icon('nfc', 'ii')} 感應卡片</button>` : `<button class="btn sec" data-aa="ic">${icon('train', 'ii')} 匯入履歷截圖</button>`) : (a.type === '信用卡' || a.type === '銀行') ? `<button class="btn sec" data-aa="rec">${icon('doc', 'ii')} 比對明細</button>` : `<button class="btn sec" data-aa="cal">校正餘額</button>`}</div>
    <button class="btn sec" data-aa="exp" style="margin:-4px 0 12px">${icon('download', 'ii')} 匯出明細</button>
    ${rowsHtml || `<div class="card empty"><span class="em">${icon('inbox')}</span>這段期間沒有紀錄</div>`}`);
  const root = $('#acc-body');
  bindTx(root);
  $$('[data-ap]', root).forEach(b => b.onclick = () => {
    const v = b.dataset.ap;
    const base = per === 'all' ? keyNow : per;
    openAccount(name, v === 'all' ? 'all' : v === 'now' ? keyNow : addMonths(base, Number(v)));
  });
  $$('[data-ak]', root).forEach(b => b.onclick = () => openAccount(name, per, b.dataset.ak));
  $$('[data-acur]', root).forEach(b => b.onclick = () => setDispCur(name, b.dataset.acur));
  $$('[data-bill]', root).forEach(x => x.onclick = async e => {
    e.preventDefault();
    const k = x.dataset.bill, cur0 = billFixed(a, k);
    const v = prompt(`輸入卡片帳單（e-NAVI／明細書）上的「${Number(k.slice(5))}月消費」請求金額。\n留空則改回依消費估算。`, cur0 != null ? cur0 : Math.round(Number(x.dataset.est)));
    if (v == null) return;
    const n = parseAmt(v);
    await setBillFixed(name, k, String(v).trim() === '' ? null : (n >= 0 ? n : null));
    openAccount(name);
  });
  if ($('[data-aa=setclose]', root)) $('[data-aa=setclose]', root).onclick = e => { e.preventDefault(); closeSheet('acc'); setTimeout(() => openSettings({ edit: name }), 150); };
  $('[data-aa=new]', root).onclick = () => { closeSheet('acc'); setTimeout(() => openEntry({ account: name }), 200); };
  if ($('[data-aa=nfc]', root)) $('[data-aa=nfc]', root).onclick = () => readICCard(name);
  if ($('[data-aa=ic]', root)) $('[data-aa=ic]', root).onclick = () => { S.batchTarget = name; $('#f-pick').click(); };
  if ($('[data-aa=rec]', root)) $('[data-aa=rec]', root).onclick = () => startReconcile(name);
  if ($('[data-aa=cal]', root)) $('[data-aa=cal]', root).onclick = () => { calibrate(name).then(() => openAccount(name)); };
  $('[data-aa=exp]', root).onclick = () => openExport(name, per, kd);
}

/** 切換台灣卡的顯示幣別（存到帳戶設定，所有裝置一致） */
async function setDispCur(name, c) {
  const a = S.meta.accounts.find(x => x.name === name); if (!a) return;
  a.dispCur = c === 'TWD' ? 'TWD' : '';
  S.prefs.accCur = S.prefs.accCur || {}; S.prefs.accCur[name] = a.dispCur; persist('prefs');
  await persist('meta');
  await DB.put('ops', { op: 'accountUpdate', account: { name, dispCur: a.dispCur } });
  if (a.dispCur === 'TWD') { await Promise.all([...new Set(S.txs.filter(t => (t.account === name || t.toAccount === name) && !(Number(t.twd) > 0) && !S.rates[t.date]).map(t => t.date))].slice(0, 60).map(d => getRate(d).catch(() => null))); }
  openAccount(name); renderPage(); renderSync(); sync();
  if (a.dispCur === 'TWD') setTimeout(fillTwdAll, 300);
}

// ---------- 帳戶明細匯出（CSV，Excel／Numbers／Google 試算表都能開）----------
function exportPresets(a) {
  const isCard = a.type === '信用卡' && !!closeDayOf(a);
  const k = isCard ? cardKey(a, today()) : cycleKey(today());
  const rg = key => isCard ? cardRange(a, key) : cycleRange(key);
  const y = today().slice(0, 4);
  const first = S.txs.filter(t => t.account === a.name || t.toAccount === a.name).reduce((m, t) => t.date < m ? t.date : m, today());
  return [
    ['cur', isCard ? '本期帳單' : '本期', rg(k)],
    ['prev', isCard ? '上期帳單' : '上個月', rg(addMonths(k, -1))],
    ['3m', '近 3 個月', { from: rg(addMonths(k, -2)).from, to: rg(k).to }],
    ['year', y + ' 年', { from: y + '-01-01', to: y + '-12-31' }],
    ['lastyear', (Number(y) - 1) + ' 年', { from: (Number(y) - 1) + '-01-01', to: (Number(y) - 1) + '-12-31' }],
    ['all', '全部', { from: first, to: today() }],
  ];
}
function openExport(name, per, kind) {
  const a = accMap()[name]; if (!a) return;
  const pre = exportPresets(a);
  const isCard = a.type === '信用卡' && !!closeDayOf(a);
  // 預設：目前帳戶畫面看的期間
  let init = pre[0][2];
  if (per === 'all') init = pre[pre.length - 1][2];
  else if (per) init = isCard ? cardRange(a, per) : cycleRange(per);
  openSheet('detail', `匯出 ${name}`, `
    <div class="chips" id="ex-pre" style="margin-top:6px">${pre.map(p => `<button class="chip" data-ep="${p[0]}">${p[1]}</button>`).join('')}</div>
    <div class="form-group">
      <div class="frow"><label>開始</label><input type="date" id="ex-from" value="${init.from}"></div>
      <div class="frow"><label>結束</label><input type="date" id="ex-to" value="${init.to}"></div>
      <div class="frow"><label>類型</label><select id="ex-kind">${['全部', '支出', '收入', '振替'].map(k => `<option ${k === (kind || '全部') ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
      <div class="frow"><div class="grow">包含品項明細<small>每個品項各占一列</small></div><label class="switch"><input type="checkbox" id="ex-items"><span></span></label></div>
    </div>
    <div class="card" id="ex-sum" style="font-size:14px"></div>
    <button class="btn" id="ex-go">${icon('download')}匯出 CSV</button>
    <div class="hint" style="margin-top:8px">CSV 可以用 Excel、Numbers、Google 試算表打開。手機上會跳出分享選單，可以存到「檔案」或傳給別人。</div>`);
  const sum = () => {
    const rows = exportRows(a, $('#ex-from').value, $('#ex-to').value, $('#ex-kind').value);
    const out = rows.reduce((x, r) => x + (r.delta < 0 ? -r.delta : 0), 0), inn = rows.reduce((x, r) => x + (r.delta > 0 ? r.delta : 0), 0);
    $('#ex-sum').innerHTML = rows.length ? `<div class="kv"><span>筆數</span><span class="num">${rows.length} 筆</span></div><div class="kv"><span>流出</span><span class="num exp">${money(out, a.currency)}</span></div><div class="kv"><span>流入</span><span class="num inc">${money(inn, a.currency)}</span></div>`
      : '<div class="faint" style="text-align:center;padding:6px">這個區間沒有紀錄</div>';
    $('#ex-go').disabled = !rows.length;
    $$('#ex-pre [data-ep]').forEach(b => { const p = pre.find(x => x[0] === b.dataset.ep)[2]; b.classList.toggle('on', p.from === $('#ex-from').value && p.to === $('#ex-to').value); });
  };
  $$('#ex-pre [data-ep]').forEach(b => b.onclick = () => { const p = pre.find(x => x[0] === b.dataset.ep)[2]; $('#ex-from').value = p.from; $('#ex-to').value = p.to; sum(); });
  ['#ex-from', '#ex-to', '#ex-kind'].forEach(id => $(id).onchange = sum);
  $('#ex-go').onclick = () => {
    let f = $('#ex-from').value, t = $('#ex-to').value;
    if (f > t) [f, t] = [t, f];
    const csv = exportCSV(a, exportRows(a, f, t, $('#ex-kind').value), $('#ex-items').checked);
    saveFile(`${name.replace(/[\\/:*?"<>|]/g, '_')}_${f.replace(/-/g, '')}-${t.replace(/-/g, '')}.csv`, csv, 'text/csv');
  };
  sum();
}
/** 區間內的明細（含每筆後的帳戶餘額，用全部紀錄依序累計） */
function exportRows(a, from, to, kind) {
  if (from > to) [from, to] = [to, from];
  const all = S.txs.filter(t => t.account === a.name || t.toAccount === a.name)
    .sort((x, y) => x.date.localeCompare(y.date) || String(x.createdAt || '').localeCompare(String(y.createdAt || '')));
  let bal = Number(a.initial) || 0;
  const out = [];
  all.forEach(t => {
    const d = accDelta(t, a.name); bal += d;
    if (t.date < from || t.date > to) return;
    if (kind && kind !== '全部' && t.type !== kind) return;
    out.push({ t, delta: Math.round(d * 100) / 100, bal: Math.round(bal * 100) / 100 });
  });
  return out;
}
function exportCSV(a, rows, withItems) {
  const twd = wantsTwd(a) && a.currency === 'JPY';
  const q = v => { const x = v == null ? '' : String(v); return /[",\r\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; };
  const head = ['日期', '類型', '分類', '子分類', '店家', '備註', `金額（${a.currency === 'TWD' ? '台幣' : '日幣'}）`, '帳戶餘額', '對方帳戶', '原幣', '原幣金額',
    ...(twd ? ['台幣換算'] : []), '分期', '出差', '計入日常', '來源'];
  if (withItems) head.push('品名', '數量', '品項小計', '品項分類');
  const lines = [head];
  rows.forEach(({ t, delta, bal }) => {
    const other = t.type === '振替' ? (t.account === a.name ? t.toAccount : t.account) : '';
    const base = [t.date, t.type, t.category, t.sub || '', t.store || '', t.note || '', delta, bal, other, t.currency, t.original,
      ...(twd ? [Number(t.twd) > 0 ? (delta < 0 ? -t.twd : t.twd) : ''] : []), instN(t) ? instN(t) + ' 期' : '', t.trip ? '是' : '', t.type === '振替' ? '' : (isExcluded(t) ? '否' : '是'), t.source || '手動'];
    if (withItems && t.items && t.items.length) t.items.forEach((it, i) => lines.push((i === 0 ? base : base.map(() => '')).concat([it.name_zh || it.name || '', it.qty || 1, it.subtotal, it.category || ''])));
    else lines.push(withItems ? base.concat(['', '', '', '']) : base);
  });
  return '\ufeff' + lines.map(r => r.map(q).join(',')).join('\r\n') + '\r\n';
}
/** 存檔：手機用分享選單（可存到「檔案」），電腦直接下載 */
async function saveFile(name, text, type) {
  const blob = new Blob([text], { type: type + ';charset=utf-8' });
  try {
    const file = new File([blob], name, { type });
    if (isTouch() && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(blob);
  const el = document.createElement('a'); el.href = url; el.download = name; document.body.appendChild(el); el.click(); el.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast('✓ 已匯出 ' + name, 2500);
}

// ---------- 信用卡明細比對 ----------
function startReconcile(account) {
  if (!canOnline()) return toast(navigator.onLine ? '請先連線 Google 試算表' : '明細比對需要網路');
  S.recTarget = account || null;
  $('#f-stmt').click();
}
const DATE_RE = /^(\d{2,4})[\/\-.年](\d{1,2})[\/\-.月](\d{1,2})|^(\d{1,2})[\/\-.月](\d{1,2})日?$/;
function parseDateAny(v) {
  v = nk(v); const m = v.match(DATE_RE); if (!m) return null;
  const t = today();
  if (m[1]) { let y = Number(m[1]); if (y < 100) y += 2000; return y + '-' + pad(m[2]) + '-' + pad(m[3]); }
  let out = t.slice(0, 4) + '-' + pad(m[4]) + '-' + pad(m[5]);
  if (out > t) out = (Number(t.slice(0, 4)) - 1) + out.slice(4);
  return out;
}
const numAny = v => { const x = nk(v).replace(/[,¥円\s]/g, '').replace(/^\((.*)\)$/, '-$1'); return /^-?\d+(\.\d+)?$/.test(x) ? Number(x) : null; };
/** 常見日本信用卡 CSV（楽天カード、Vpass、PayPayカード、エポス…）→ 統一格式；看不懂就回傳 null */
function parseStatementCSV(text) {
  const rows = parseCSV(text).map(r => r.map(nk));
  if (!rows.length) return null;
  let hi = rows.findIndex(r => r.some(c => /利用日|ご利用日|日付|取引日|^date/i.test(c)) && r.some(c => /金額|amount/i.test(c)));
  let di, ai, si;
  if (hi >= 0) {
    const h = rows[hi];
    di = h.findIndex(c => /利用日|ご利用日|日付|取引日|^date/i.test(c));
    for (const re of [/^利用金額|^ご利用金額/, /支払総額|お支払金額|支払金額/, /請求金額/, /金額|amount/i]) { ai = h.findIndex(c => re.test(c)); if (ai >= 0) break; }
    si = h.findIndex(c => /利用店名|ご利用店名|加盟店|利用先|内容|摘要|店名|description|merchant/i.test(c));
  } else {
    const data = rows.filter(r => r.length >= 3 && r.some(c => DATE_RE.test(c)));
    if (data.length < 1) return null;
    const ncol = Math.max(...data.map(r => r.length));
    const ratio = f => Array.from({ length: ncol }, (_, i) => data.filter(r => r[i] != null && f(r[i])).length / data.length);
    const dr = ratio(c => DATE_RE.test(c)); di = dr.indexOf(Math.max(...dr));
    const nr = ratio(c => numAny(c) != null && Math.abs(numAny(c)) >= 1);
    ai = nr.findIndex((v, i) => i !== di && v > 0.6);
    const tr = ratio(c => c && numAny(c) == null && !DATE_RE.test(c));
    si = tr.indexOf(Math.max(...tr));
  }
  if (di < 0 || ai < 0) return null;
  const out = [];
  rows.slice(hi + 1).forEach(r => {
    const d = parseDateAny(r[di] || ''), a = numAny(r[ai] || '');
    if (!d || a == null || a === 0) return;
    out.push({ date: d, desc: (si >= 0 ? r[si] : '') || '', amount: Math.abs(a), direction: a < 0 ? 'in' : 'out', kind: a < 0 ? 'refund' : 'purchase', category: '' });
  });
  return out.length ? out : null;
}
async function onStatementFile(f) {
  const isCsv = /\.csv$|\.txt$/i.test(f.name) || /csv|text\/plain/.test(f.type);
  let rows = null, info = { accountName: '', suggestedAccount: '' };
  busy(true, '讀取明細中…', isCsv ? '' : 'AI 辨識中，通常需要 10～30 秒', !isCsv);
  try {
    if (isCsv) {
      const text = await readTextAuto(f);
      rows = parseStatementCSV(text);
      if (!rows) { $('#busySub').textContent = '格式比較特別，交給 AI 讀取中…'; const r = await api('parseStatementText', { text }, 150000); rows = r.transactions; info = r; }
      const need = rows.filter(r => r.direction === 'out' && !r.category);
      // 先用記過的店家猜分類，猜不到的交給 AI
      const storeCat = {}; (S.meta.stores || []).forEach(x => { if (x.category) storeCat[nk(x.name).toLowerCase()] = x.category; });
      need.forEach(r => { const k = nk(r.desc).toLowerCase(); r.category = storeCat[k] || ''; });
      const rest = need.filter(r => !r.category);
      if (rest.length) { $('#busySub').textContent = `AI 分類中（${rest.length} 筆）…`; try { const c = await api('classify', { items: rest.map(r => ({ desc: r.desc })) }, 120000); rest.forEach((r, i) => r.category = c[i] || ''); } catch (e) {} }
    } else {
      const isPdf = f.type === 'application/pdf';
      const b64 = isPdf ? await readB64(f) : await compress(f, 2400, .9);
      const r = await api('analyzeReceipt', { image: b64, mimeType: isPdf ? 'application/pdf' : 'image/jpeg' }, 150000);
      if (r.docType !== 'list') throw new Error('這份檔案看起來是單筆收據，不是刷卡明細。請改用「AI 辨識」記帳');
      rows = r.transactions; info = r;
    }
    busy(false);
    if (!rows || !rows.length) return toast('讀不到任何交易', 4000);
    openReconcile(rows, info);
  } catch (e) { busy(false); showAIError(e.message); }
}
function simi(a, b) {
  const g = x => { x = nk(x).toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''); const set = new Set(); for (let i = 0; i < x.length - 1; i++) set.add(x.slice(i, i + 2)); return set; };
  const A = g(a), B = g(b); if (!A.size || !B.size) return 0;
  let n = 0; A.forEach(x => { if (B.has(x)) n++; });
  return n / Math.min(A.size, B.size);
}
const dayDiff = (a, b) => Math.abs((new Date(a + 'T12:00:00') - new Date(b + 'T12:00:00')) / 864e5);
/** 比對：同帳戶、金額相同、日期差 3 天內 → 已記錄；日期相近且店名相似但金額不同 → 金額不同；其餘 → 漏記 */
function reconcile(rows, acc) {
  const used = new Set();
  const cand = dir => S.txs.filter(t => dir === 'out'
    ? (t.account === acc && (t.type === '支出' || t.type === '振替'))
    : ((t.type === '收入' && t.account === acc) || (t.type === '振替' && t.toAccount === acc)));
  const C = { out: cand('out'), in: cand('in') };
  const txt = t => [t.store, t.note, t.sub, t.category, t.toAccount].join(' ');
  rows.forEach(r => { r.status = 'missing'; r.match = null; });
  // 先配對金額完全相同的（日期越近越優先），再找金額不同但店名相似的
  rows.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(r => {
    let best = null;
    C[r.direction].forEach(t => {
      if (used.has(t.id) || Math.abs((t.jpy || t.original) - r.amount) >= 1) return;
      const dd = dayDiff(t.date, r.date); if (dd > 3) return;
      const sc = dd - simi(r.desc, txt(t));
      if (!best || sc < best[0]) best = [sc, t];
    });
    if (best) { used.add(best[1].id); r.status = 'match'; r.match = best[1]; }
  });
  rows.filter(r => r.status === 'missing').forEach(r => {
    let best = null;
    C[r.direction].forEach(t => {
      if (used.has(t.id)) return;
      const dd = dayDiff(t.date, r.date); if (dd > 3) return;
      const sm = simi(r.desc, txt(t)), amt = t.jpy || t.original;
      const close = Math.abs(amt - r.amount) / Math.max(r.amount, 1) < 0.06; // 外幣匯率差
      if (sm < 0.5 && !close) return;
      const sc = dd - sm * 2;
      if (!best || sc < best[0]) best = [sc, t];
    });
    if (best) { used.add(best[1].id); r.status = 'near'; r.match = best[1]; }
  });
  const from = rows.reduce((a, r) => r.date < a ? r.date : a, '9999'), to = rows.reduce((a, r) => r.date > a ? r.date : a, '0000');
  const extras = C.out.filter(t => t.type === '支出' && !used.has(t.id) && t.date >= from && t.date <= to);
  return { from, to, extras };
}
const REC_MODES = [
  ['missing', '只補漏記的（建議）', '已記錄的略過，明細上有、紀錄裡沒有的補進去。'],
  ['fix', '補漏記＋修正金額', '另外把「金額不同」的紀錄改成明細上的金額（例如外幣刷卡的實際扣款）。'],
  ['all', '全部當新紀錄匯入', '不比對，明細上每一筆都新增（同一份明細重複匯入不會重複）。'],
  ['view', '只看比對結果', '不寫入任何資料，只用來對帳。'],
];
const REC_ACT = { add: '補進去', skip: '略過', fix: '更新金額', keep: '視為已記錄' };
function defaultAct(r, mode) {
  if (mode === 'view') return 'skip';
  if (mode === 'all') return 'add';
  if (r.status === 'match') return 'skip';
  if (r.status === 'near') return mode === 'fix' ? 'fix' : 'keep';
  return 'add';
}
function openReconcile(rows, info) {
  const cards = visibleAccounts().filter(a => a.type === '信用卡' || a.type === '銀行');
  // 沒指定帳戶時，自動選「對得上最多筆」的卡片（CSV 通常不寫卡片名稱）
  const score = name => { const tmp = rows.map(r => Object.assign({}, r)); reconcile(tmp, name); return tmp.filter(r => r.status === 'match').length * 2 + tmp.filter(r => r.status === 'near').length; };
  let pick = S.recTarget && accMap()[S.recTarget] ? S.recTarget : info.suggestedAccount && accMap()[info.suggestedAccount] ? info.suggestedAccount : null;
  if (!pick) {
    const ranked = cards.map(a => [a.name, score(a.name)]).sort((x, y) => y[1] - x[1]);
    pick = ranked.length && ranked[0][1] > 0 ? ranked[0][0] : ((cards.find(a => a.type === '信用卡') || cards[0] || visibleAccounts()[0]) || {}).name;
  }
  S.rec = { rows, info, acc: pick, mode: 'missing' };
  S.recTarget = null;
  rows.forEach(r => { r.act = null; });
  renderReconcile();
}
function renderReconcile() {
  const R = S.rec, rows = R.rows;
  const res = reconcile(rows, R.acc);
  rows.forEach(r => { if (!r._touched) r.act = defaultAct(r, R.mode); });
  const cnt = st => rows.filter(r => r.status === st).length;
  const sum = rows.reduce((a, r) => a + (r.direction === 'out' ? r.amount : -r.amount), 0);
  const accOpt = visibleAccounts().map(a => `<option value="${esc(a.name)}" ${a.name === R.acc ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
  const ST = { match: [icon('okCircle'), '已記錄'], near: [icon('alert'), '金額不同'], missing: [icon('plusCircle'), '漏記'] };
  const rowHtml = (r, i) => {
    const m = r.match, acts = r.status === 'near' ? ['fix', 'keep', 'add', 'skip'] : r.status === 'match' ? ['skip', 'add'] : ['add', 'skip'];
    return `<div class="rec-row ${r.status}">
      <div class="rr-top"><span class="rr-st">${ST[r.status][0]}</span><div class="mid"><b>${esc(r.desc || '（無內容）')}</b><small>${fmtMD(r.date)}${r.direction === 'in' ? '・退款／入帳' : ''}${m ? `・紀錄：${fmtMD(m.date)} ${esc(m.store || m.sub || m.category)} ${yen(m.jpy || m.original)}` : ''}</small></div>
        <b class="num ${r.direction === 'in' ? 'inc' : ''}">${r.direction === 'in' ? '+' : ''}${yen(r.amount)}</b></div>
      <div class="rr-bot">${R.mode === 'view' ? `<span class="faint">${ST[r.status][1]}</span>` : `<select data-ra="${i}">${acts.map(a => `<option value="${a}" ${a === r.act ? 'selected' : ''}>${REC_ACT[a]}</option>`).join('')}</select>`}
        ${R.mode !== 'view' && r.act === 'add' ? `<select data-rc="${i}">${cats(r.direction === 'in' ? '收入' : '支出').map(c => `<option ${c.name === (r.category || (r.direction === 'in' ? '退款' : '')) ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>` : ''}</div></div>`;
  };
  const sec = (st, title) => { const list = rows.map((r, i) => [r, i]).filter(([r]) => r.status === st); return list.length ? `<div class="set-h">${title}（${list.length}）</div><div class="form-group">${list.map(([r, i]) => rowHtml(r, i)).join('')}</div>` : ''; };
  const nAdd = rows.filter(r => r.act === 'add').length, nFix = rows.filter(r => r.act === 'fix').length;
  $('#acc-edit').classList.add('hidden');
  openSheet('acc', '刷卡明細比對', `
    <div class="form-group" style="margin-top:6px"><div class="frow"><label>比對帳戶</label><select id="rc-acc">${accOpt}</select></div></div>
    <div class="card"><div class="faint" style="font-size:12.5px">${fmtMD(res.from)} – ${fmtMD(res.to)}・明細 ${rows.length} 筆・合計 ${yen(sum)}</div>
      <div class="sum3" style="margin-top:10px"><div><small>已記錄</small><b class="num">${cnt('match')}</b></div><div><small>漏記</small><b class="num exp">${cnt('missing')}</b></div><div><small>金額不同</small><b class="num">${cnt('near')}</b></div></div></div>
    <div class="set-h">處置方式</div>
    <div class="form-group">${REC_MODES.map(([k, t, d]) => `<label class="chk"><input type="radio" name="rc-mode" value="${k}" ${k === R.mode ? 'checked' : ''}><div class="mid"><b>${t}</b><small>${d}</small></div></label>`).join('')}</div>
    ${sec('missing', '漏記：明細有、紀錄沒有')}${sec('near', '金額不同')}${sec('match', '已記錄')}
    ${res.extras.length ? `<div class="set-h">紀錄有、明細沒有（${res.extras.length}）</div><div class="hint" style="margin:-4px 6px 8px">可能還沒請款、記錯卡片，或是現金付款。點開可以修改。</div><div class="tx-group">${res.extras.map(txRow).join('')}</div>` : ''}
    <div class="rec-foot"><button class="btn" id="rc-go" ${R.mode === 'view' || !(nAdd + nFix) ? 'disabled' : ''}>${icon('check')}${R.mode === 'view' ? '只檢視，不寫入' : !(nAdd + nFix) ? '全部都已記錄，不需處理' : `執行：新增 ${nAdd} 筆${nFix ? `・更新 ${nFix} 筆` : ''}`}</button></div>`);
  const root = $('#acc-body');
  bindTx(root);
  $('#rc-acc').onchange = e => { R.acc = e.target.value; rows.forEach(r => r._touched = false); renderReconcile(); };
  $$('[name=rc-mode]', root).forEach(x => x.onchange = () => { R.mode = x.value; rows.forEach(r => r._touched = false); renderReconcile(); });
  $$('[data-ra]', root).forEach(x => x.onchange = () => { const r = rows[Number(x.dataset.ra)]; r.act = x.value; r._touched = true; const sc = root.scrollTop; renderReconcile(); $('#acc-body').scrollTop = sc; });
  $$('[data-rc]', root).forEach(x => x.onchange = () => { rows[Number(x.dataset.rc)].category = x.value; });
  $('#rc-go').onclick = runReconcile;
}
async function runReconcile() {
  const R = S.rec, rows = R.rows, acc = R.acc;
  const todo = rows.filter(r => r.act === 'add' || (r.act === 'fix' && r.match));
  if (!todo.length) return;
  if (!confirm(`對「${acc}」新增 ${rows.filter(r => r.act === 'add').length} 筆、更新 ${rows.filter(r => r.act === 'fix').length} 筆？`)) return;
  busy(true, '寫入中…', `0 / ${todo.length}`);
  const seen = {}; let n = 0, skipped = 0;
  for (const r of rows) {
    const k = r.date + '|' + r.amount + '|' + r.desc; seen[k] = (seen[k] || 0) + 1;
    if (r.act === 'add') {
      const id = 'ST' + hashStr(acc + '|' + k + '|' + seen[k]);
      if (S.txs.some(x => x.id === id)) { skipped++; continue; }
      const isIn = r.direction === 'in';
      await localSaveTx({ id, date: r.date, type: isIn ? '收入' : '支出', currency: 'JPY', original: r.amount, jpy: r.amount, rate: 1, createdAt: Date.now() + n,
        category: r.category || (isIn ? '退款' : '其他'), account: acc, toAccount: '', store: r.desc, note: '刷卡明細補登', source: '刷卡明細', items: [], sub: '', trip: '', excl: '' }, false);
      n++;
    } else if (r.act === 'fix' && r.match) {
      const t = r.match;
      const upd = t.currency === 'JPY' ? { original: r.amount, jpy: r.amount } : { jpy: r.amount, rate: Math.round(r.amount / t.original * 10000) / 10000, rateEstimated: false };
      await localSaveTx(Object.assign({}, t, upd, { note: [t.note, '依刷卡明細修正金額'].filter(Boolean).join('｜') }), true);
      n++;
    }
    $('#busySub').textContent = `${n} / ${todo.length}`;
  }
  busy(false);
  toast(`✓ 完成：寫入 ${n} 筆${skipped ? `（${skipped} 筆先前已補過）` : ''}`, 3500);
  renderPage(); renderSync(); sync();
  renderReconcile();
}

// ---------- NFC 感應 IC 卡（App 版）----------
/** Suica 履歷的「利用種別」→ 類型 */
function icKind(rec) {
  const p = rec.process, t = rec.terminal;
  if ([0x02, 0x14, 0x15, 0x49].includes(p)) return 'charge';
  if ([0x46, 0x4A, 0x4B, 0x48].includes(p) || [0xC7, 0xC8].includes(t)) return 'purchase';
  if ([0x0D, 0x0F, 0x1F, 0x23].includes(p) || t === 0x05) return 'bus';
  if ([0x01, 0x03, 0x04, 0x05, 0x06, 0x07, 0x16].includes(p)) return 'transit';
  return 'other';
}
/** 讀到的原始履歷（新→舊）→ 匯入格式；金額 = 前一筆餘額 − 本筆餘額 */
function icRecordsToRows(recs) {
  const rows = [];
  for (let i = 0; i < recs.length - 1; i++) {
    const r = recs[i], older = recs[i + 1];
    const diff = older.balance - r.balance;
    if (!diff) continue;
    const k = icKind(r);
    const dir = diff < 0 ? 'in' : 'out';
    const st = (l, s2) => l || s2 ? `${l}-${s2}` : '';
    const desc = k === 'charge' ? 'チャージ' : k === 'purchase' ? '物販' : k === 'bus' ? 'バス' : k === 'transit' ? '電車' : (dir === 'in' ? '入金' : '其他');
    rows.push({
      date: r.date, desc, amount: Math.abs(diff), direction: dir,
      kind: k === 'bus' ? 'transit' : k === 'other' ? (dir === 'in' ? 'refund' : 'other') : k,
      from: k === 'transit' ? st(r.inLine, r.inStation) : '', to: k === 'transit' ? st(r.outLine, r.outStation) : '',
      balance: r.balance, category: k === 'transit' || k === 'bus' ? '交通' : k === 'purchase' ? '餐飲' : dir === 'in' && k !== 'charge' ? '退款' : k === 'charge' ? '' : '其他',
    });
  }
  return rows;
}
async function readICCard(target) {
  try {
    const d = await nativeCall('readSuica');
    const recs = d.records || [];
    if (recs.length < 2) return toast('卡片裡沒有足夠的履歷', 3500);
    const rows = icRecordsToRows(recs);
    const remembered = (S.prefs.icMap || {})[d.idm];
    S.batchTarget = target || (remembered && accMap()[remembered] ? remembered : null);
    openBatch({ docType: 'list', listType: 'ic_card', accountName: remembered || '', suggestedAccount: S.batchTarget || '', transactions: rows, idm: d.idm, fromNFC: true });
    toast(`讀到 ${rows.length} 筆（卡片最多保留最近 20 筆）`, 3000);
  } catch (e) {
    if (/cancel|取消|invalidated by user|Session invalidated/i.test(e.message)) return;
    toast('讀取失敗：' + e.message, 4500);
  }
}

// ---------- 多筆明細匯入（IC 卡履歷、信用卡明細…）----------
const KIND_LBL = { transit: '乘車', purchase: '購物', charge: '儲值', refund: '退款', income: '收入', other: '' };
function hashStr(str) { let h = 5381; for (const c of str) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h.toString(36); }
function openBatch(r, draftId) {
  S.batch = { r, draftId, edit: null };
  const target = S.batchTarget && accMap()[S.batchTarget] ? S.batchTarget : r.suggestedAccount && accMap()[r.suggestedAccount] ? r.suggestedAccount : (visibleAccounts().find(a => a.type === '電子錢包') || visibleAccounts()[0] || {}).name;
  S.batchTarget = null;
  S.batch.target = target;
  renderBatch();
}
function renderBatch() {
  const { r } = S.batch, target = S.batch.target;
  const accs = visibleAccounts();
  const hasCharge = r.transactions.some(t => t.kind === 'charge');
  const src = S.batch.src || (accs.find(a => a.type === '信用卡') || accs.find(a => a.type === '現金') || accs[0] || {}).name;
  S.batch.src = src;
  // 重複判斷：同帳戶、同日期、同金額、同方向
  const seen = {};
  r.transactions.forEach(t => {
    const type = t.kind === 'charge' ? '振替' : t.direction === 'in' ? '收入' : '支出';
    t._dup = S.txs.some(x => x.date === t.date && Math.abs((x.original || x.jpy) - t.amount) < 0.01 && x.type === type && (type === '振替' ? x.toAccount === target : x.account === target));
    const k = t.date + '|' + t.amount + '|' + t.desc + '|' + (t.balance == null ? '' : t.balance);
    seen[k] = (seen[k] || 0) + 1; t._key = k + '|' + seen[k];
  });
  const opts = (sel, list) => list.map(c => `<option ${c.name === sel ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const accOpt = sel => accs.map(a => `<option value="${esc(a.name)}" ${a.name === sel ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
  const title = r.listType === 'ic_card' ? 'IC 卡履歷' : r.listType === 'card' ? '信用卡明細' : '明細匯入';
  openSheet('detail', title, `<div class="hint" style="margin:6px 4px 12px">AI 讀到 ${r.transactions.length} 筆${r.accountName ? `（${esc(r.accountName)}）` : ''}。確認帳戶與分類，勾選要匯入的紀錄。</div>
    <div class="form-group">
      <div class="frow"><label>帳戶</label><select id="bt-acc">${accOpt(target)}</select></div>
      ${hasCharge ? `<div class="frow"><label>儲值來源</label><select id="bt-src">${accOpt(src)}</select></div>` : ''}
    </div>
    ${hasCharge ? '<div class="hint">儲值會記成「振替」：從儲值來源轉到這個帳戶，不算支出。</div>' : ''}
    <div class="form-group">${r.transactions.map((t, i) => {
      if (t._chk == null) t._chk = !t._dup;
      const ty = t.kind === 'charge' ? '振替' : t.direction === 'in' ? '收入' : '支出';
      const row = `<div class="chk batch-row ${t._dup ? 'dup' : ''} ${S.batch.edit === i ? 'editing' : ''}"><input type="checkbox" data-bi="${i}" ${t._chk ? 'checked' : ''} aria-label="選取">
      <button class="mid bt-open" data-be="${i}"><b>${esc(t.desc || t.category || KIND_LBL[t.kind])}${t.from && r.fromNFC ? ` <span class="faint" style="font-weight:500;font-size:12px">${esc(t.from)}→${esc(t.to)}</span>` : ''}</b><small>${fmtMD(t.date)}・${ty === '振替' ? '儲值／振替' : esc(t.category || '未分類')}${t.balance != null ? '・餘額 ' + yen(t.balance) : ''}${t._dup ? '・<span class="exp">可能已記過</span>' : ''}${t._edited ? '・<span style="color:var(--brand-ink)">已修改</span>' : ''}</small></button>
      <b class="num ${t.direction === 'in' ? 'inc' : ''}">${t.direction === 'in' ? '+' : '-'}${yen(t.amount)}</b>
      <button class="bt-pen" data-be="${i}" aria-label="編輯這筆">${icon('pencil')}</button></div>`;
      if (S.batch.edit !== i) return row;
      return row + `<div class="bt-edit" data-bed="${i}">
        <div class="seg" id="bte-type">${['支出', '收入', '振替'].map(x => `<button type="button" class="${x === ty ? 'on' : ''}" data-bty="${x}">${x}</button>`).join('')}</div>
        <div class="form-group" style="margin:10px 0">
          <div class="frow"><label>日期</label><input type="date" id="bte-date" value="${esc(t.date)}"></div>
          <div class="frow"><label>店家</label><input id="bte-desc" value="${esc(t.desc || '')}" placeholder="店家或說明"></div>
          <div class="frow"><label>金額</label><input id="bte-amt" inputmode="decimal" value="${esc(t.amount)}"></div>
          <div class="frow" id="bte-catRow" ${ty === '振替' ? 'style="display:none"' : ''}><label>分類</label><select id="bte-cat">${opts(t.category, cats(ty === '收入' ? '收入' : '支出'))}</select></div>
        </div>
        <div class="btn-row" style="margin:0"><button class="btn sec" id="bte-cancel" type="button">取消</button><button class="btn" id="bte-ok" type="button">${icon('check')}完成這筆</button></div>
      </div>`;
    }).join('')}</div>
    <button class="btn" id="bt-go">${icon('check')}匯入勾選的紀錄</button>
    <div class="hint" style="margin-top:10px">同一張截圖重複匯入不會產生重複資料。「可能已記過」是指這個帳戶在同一天已有相同金額的紀錄，預設不勾選。</div>`);
  $('#bt-acc').onchange = e => { S.batch.target = e.target.value; renderBatch(); };
  if ($('#bt-src')) $('#bt-src').onchange = e => { S.batch.src = e.target.value; };
  const upd = () => {
    const ck = $$('#d-body [data-bi]:checked'); const n = ck.length;
    const sum = ck.reduce((a, c) => a + Number(r.transactions[Number(c.dataset.bi)].amount || 0), 0);
    $('#bt-go').innerHTML = icon('check') + `匯入 ${n} 筆${n ? `（${yen(sum)}）` : ''}`; $('#bt-go').disabled = !n;
  };
  $$('#d-body [data-bi]').forEach(c => c.onchange = () => { r.transactions[Number(c.dataset.bi)]._chk = c.checked; upd(); }); upd();
  // 點一筆就地展開編輯
  const keepScroll = fn => { const b = $('#d-body'), y = b.scrollTop; fn(); $('#d-body').scrollTop = y; };
  $$('#d-body [data-be]').forEach(b => b.onclick = e => { e.preventDefault(); const i = Number(b.dataset.be); keepScroll(() => { S.batch.edit = S.batch.edit === i ? null : i; renderBatch(); }); });
  if (S.batch.edit != null && $('#bte-ok')) {
    const t = r.transactions[S.batch.edit];
    let ty = t.kind === 'charge' ? '振替' : t.direction === 'in' ? '收入' : '支出';
    $$('#bte-type [data-bty]').forEach(b => b.onclick = () => {
      ty = b.dataset.bty; $$('#bte-type [data-bty]').forEach(x => x.classList.toggle('on', x === b));
      $('#bte-catRow').style.display = ty === '振替' ? 'none' : '';
      if (ty !== '振替') $('#bte-cat').innerHTML = opts($('#bte-cat').value, cats(ty));
    });
    $('#bte-cancel').onclick = () => keepScroll(() => { S.batch.edit = null; renderBatch(); });
    $('#bte-ok').onclick = () => {
      const amt = parseAmt($('#bte-amt').value);
      if (!(amt > 0)) return toast('金額格式錯誤');
      if (!$('#bte-date').value) return toast('請選日期');
      Object.assign(t, { date: $('#bte-date').value, desc: $('#bte-desc').value.trim(), amount: amt, _edited: true, _chk: true });
      if (ty === '振替') Object.assign(t, { kind: 'charge', direction: 'in' });
      else { t.direction = ty === '收入' ? 'in' : 'out'; if (t.kind === 'charge') t.kind = ty === '收入' ? 'income' : 'purchase'; t.category = $('#bte-cat').value; }
      keepScroll(() => { S.batch.edit = null; renderBatch(); });
    };
  }
  $('#bt-go').onclick = runBatch;
}
async function runBatch() {
  const { r, draftId } = S.batch, target = S.batch.target, src = $('#bt-src') ? $('#bt-src').value : S.batch.src;
  const picked = $$('#d-body [data-bi]:checked').map(c => Number(c.dataset.bi));
  if (picked.some(i => r.transactions[i].kind === 'charge') && src === target) return toast('儲值來源不能跟帳戶相同');
  busy(true, '匯入中…', `0 / ${picked.length}`);
  let n = 0;
  for (const i of picked) {
    const t = r.transactions[i];
    const cat = t.kind === 'charge' ? '儲值' : t.category || (t.direction === 'in' ? '其他收入' : '其他');
    const base = { id: 'AI' + hashStr(target + '|' + t._key), date: t.date, currency: 'JPY', original: t.amount, jpy: t.amount, rate: 1, createdAt: Date.now() + n,
      source: 'AI明細', items: [], note: t.kind === 'transit' ? (t.desc.includes('→') ? t.desc : [t.desc, t.from && t.to ? `駅コード ${t.from}→${t.to}` : ''].filter(Boolean).join(' ')) : '', store: t.kind === 'transit' || t.kind === 'charge' ? '' : t.desc, sub: '', trip: '', excl: '' };
    let tx;
    if (t.kind === 'charge') tx = Object.assign(base, { type: '振替', category: cat, account: src, toAccount: target, store: '', note: t.desc });
    else if (t.direction === 'in') tx = Object.assign(base, { type: '收入', category: cat, account: target });
    else tx = Object.assign(base, { type: '支出', category: cat, account: target, sub: t.kind === 'transit' ? (/バス|bus|巴士|公車/i.test(t.desc) ? '巴士' : '電車') : '' });
    if (!S.txs.some(x => x.id === tx.id)) { await localSaveTx(tx, false); n++; }
    $('#busySub').textContent = `${n} / ${picked.length}`;
  }
  if (r.idm) { S.prefs.icMap = Object.assign({}, S.prefs.icMap, { [r.idm]: target }); await persist('prefs'); }
  if (draftId) { await DB.del('drafts', draftId); await reload(); }
  busy(false); closeSheet('detail');
  toast(`✓ 已匯入 ${n} 筆${picked.length - n ? `（${picked.length - n} 筆已存在）` : ''}`, 3500);
  renderPage(); renderSync(); sync();
  setTimeout(() => openAccount(target, 'all'), 400);
  if ($('#sh-acc').classList.contains('on')) openAccount(target, 'all');
}

// ---------- 汽車 ----------
const CAR_SUBS = [['加油', 'fuel'], ['過路費', 'road'], ['停車費', 'parking'], ['保養維修', 'wrench'], ['洗車', 'drop'], ['保險', 'shield'], ['稅金', 'receipt'], ['貸款', 'bank'], ['購車', 'car'], ['其他', 'box']];
const CAR_RE = [['加油', /加油|ガソリン|燃料|給油|油錢|gas|fuel/i], ['過路費', /過路|高速|ETC|道路料金|有料道路|NEXCO/i], ['停車費', /停車|駐車|パーキング|parking/i],
  ['保養維修', /保養|維修|車検|整備|修理|オイル|タイヤ|點檢|点検/], ['洗車', /洗車/], ['保險', /保險|保険/], ['稅金', /稅|税/], ['貸款', /貸款|ローン/], ['購車', /購車|頭期|車款|購入|納車/]];
function carGroupName(text) { const m = CAR_RE.find(([, re]) => re.test(text || '')); return m ? m[0] : ''; }
const carGroup = t => carGroupName(t.sub) || carGroupName(t.note + ' ' + t.store) || (t.sub || '其他');
const carIcon = g => icon((CAR_SUBS.find(x => x[0] === g) || [0, 'car'])[1]);
const isCarTx = t => t.type === '支出' && t.category === '汽車';
/** 車貸、購車預設不計入日常開銷 */
const defaultExcluded = t => t.category === '汽車' && /貸款|ローン|購車|頭期|車款|納車/.test((t.sub || '') + ' ' + (t.note || '') + ' ' + (t.store || ''));
const isExcluded = t => t.type !== '振替' && !t.trip && (t.excl === '1' || (t.excl !== '0' && defaultExcluded(t)));
const isDaily = t => t.type !== '振替' && !t.trip && !isExcluded(t);
/** 加油紀錄與油耗（滿油法：本次里程 − 上次里程 ÷ 本次加油量） */
function fuelLog() {
  const list = S.txs.filter(t => isCarTx(t) && carGroup(t) === '加油').map(t => ({ t, date: t.date, liters: Number(t.liters) || 0, price: Number(t.unitPrice) || (t.liters ? t.jpy / t.liters : 0), odo: Number(t.odo) || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.odo - b.odo);
  let prev = null;
  list.forEach(r => {
    r.eff = null;
    if (r.odo > 0) {
      if (prev && r.liters > 0 && r.odo > prev.odo && r.odo - prev.odo < 3000) { r.dist = r.odo - prev.odo; r.eff = Math.round(r.dist / r.liters * 10) / 10; }
      prev = r;
    }
  });
  return list;
}
function renderCar() {
  if (S.heroH) document.documentElement.style.setProperty('--hero-h', S.heroH + 'px');
  const all = S.txs.filter(isCarTx);
  const ym = cycleKey(today()), cr = cycleRange(ym), yr = today().slice(0, 4);
  const sum = arr => arr.reduce((a, t) => a + t.jpy, 0);
  $('#c-lbl').textContent = `${Number(ym.slice(5))}月汽車支出`;
  $('#c-month').textContent = yen(sum(all.filter(t => t.date >= cr.from && t.date <= cr.to)));
  $('#c-year').textContent = yen(sum(all.filter(t => t.date.startsWith(yr))));
  const log = fuelLog();
  const effs = log.filter(r => r.eff);
  const totDist = effs.reduce((a, r) => a + r.dist, 0), totL = effs.reduce((a, r) => a + r.liters, 0);
  $('#c-eff').textContent = totL ? (Math.round(totDist / totL * 10) / 10) + ' km/L' : '—';
  const lastP = log.filter(r => r.price).pop();
  $('#c-price').textContent = lastP ? '¥' + (Math.round(lastP.price * 10) / 10) + '/L' : '—';
  // 圖表
  const C = { exp: cssv('--expense'), inc: cssv('--income') };
  const lbl = arr => arr.map(r => fmtMD(r.date));
  const tk = n => n <= 6 ? [...Array(n).keys()] : [0, Math.round((n - 1) / 3), Math.round((n - 1) * 2 / 3), n - 1];
  if (effs.length >= 2) lineChart($('#ch-eff'), { height: 170, fit: true, labels: lbl(effs), ticks: tk(effs.length), tipLabel: i => effs[i].date + `・${effs[i].dist} km`, fmt: v => v + ' km/L', series: [{ name: '油耗', color: C.inc, values: effs.map(r => r.eff), dots: true, endDot: true }] });
  else $('#ch-eff').innerHTML = `<div class="empty" style="padding:22px 8px">加油時填寫「加油量」與「里程」<br>累積 3 筆以上就會畫出油耗趨勢</div>`;
  $('#c-effHint').textContent = effs.length ? `以滿油法計算：兩次加油的里程差 ÷ 本次加油量。共 ${effs.length} 筆` : '';
  const pr = log.filter(r => r.price > 0);
  if (pr.length >= 2) lineChart($('#ch-price'), { height: 150, fit: true, labels: lbl(pr), ticks: tk(pr.length), tipLabel: i => pr[i].date, fmt: v => '¥' + (Math.round(v * 10) / 10) + '/L', series: [{ name: '油價', color: C.exp, values: pr.map(r => Math.round(r.price * 10) / 10), dots: true, endDot: true }] });
  else $('#ch-price').innerHTML = `<div class="empty" style="padding:22px 8px">加油時填寫每公升油價，就會畫出油價趨勢</div>`;
  // 分類
  const range = S.carRange || 'year';
  $$('#c-range button').forEach(b => b.classList.toggle('on', b.dataset.r === range));
  const scope = range === 'year' ? all.filter(t => t.date.startsWith(yr)) : all;
  const g = {}; scope.forEach(t => { const k = carGroup(t); g[k] = (g[k] || 0) + t.jpy; });
  const rows = Object.entries(g).sort((a, b) => b[1] - a[1]); const mx = Math.max(1, ...rows.map(x => x[1])); const tot = sum(scope);
  $('#c-cats').innerHTML = rows.length ? rows.map(([k, v]) => `<div class="cbar"><div class="ico" style="background:${hashTint(k)}">${carIcon(k)}</div><div><div class="nm"><span>${esc(k)}</span><small>${Math.round(v / tot * 100)}%</small></div><div class="track"><div class="fill" style="width:${v / mx * 100}%"></div></div></div><div class="v num">${yen(v)}</div></div>`).join('') +
    `<div class="stat-row" style="margin-top:6px"><span>合計</span><b class="num">${yen(tot)}</b></div>` : '<div class="empty" style="padding:12px">還沒有汽車相關紀錄</div>';
  // 加油紀錄
  const recent = log.slice().reverse().slice(0, 12);
  $('#c-fuel').innerHTML = recent.length ? recent.map(r => `<button class="fuel-row" data-id="${esc(r.t.id)}"><div class="d">${fmtMD(r.date)}</div>
      <div><b class="num">${r.liters ? r.liters + ' L' : '—'}</b> <span class="faint">${r.price ? '@ ¥' + (Math.round(r.price * 10) / 10) : ''}</span><div class="d">${r.odo ? r.odo.toLocaleString() + ' km' : '未填里程'}・${yen(r.t.jpy)}</div></div>
      <div class="eff num">${r.eff ? r.eff : '—'}<small>${r.eff ? 'km/L' : r.odo ? '首筆' : ''}</small></div></button>`).join('')
    : '<div class="empty" style="padding:16px">還沒有加油紀錄</div>';
  $$('#c-fuel [data-id]').forEach(b => b.onclick = () => openDetail(b.dataset.id));
  const lst = all.slice(0, 30);
  $('#c-list').innerHTML = lst.length ? `<div class="tx-group">${lst.map(txRow).join('')}</div>` : `<div class="card empty"><span class="em">${icon('car')}</span>記一筆汽車花費，或拍加油收據</div>`;
  bindTx($('#c-list'));
}

// ---------- 出差（另計）----------
function renderTrips() {
  const all = S.txs.filter(t => t.trip && t.type !== '振替');
  const by = {}, un = [];
  all.forEach(t => { const r = tripOf(t); if (r) (by[r.id] = by[r.id] || []).push(t); else un.push(t); });
  const sumOf = g => { const e = g.filter(t => t.type === '支出').reduce((a, t) => a + t.jpy, 0), r = g.filter(t => t.type === '收入').reduce((a, t) => a + t.jpy, 0); return { e, r }; };
  const catsOf = g => { const m = {}; g.filter(t => t.type === '支出').forEach(t => m[t.category] = (m[t.category] || 0) + t.jpy); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  const txList = g => { const days = {}; g.slice().sort((a, b) => b.date.localeCompare(a.date)).forEach(t => (days[t.date] = days[t.date] || []).push(t));
    return Object.keys(days).sort().reverse().map(d => `<div class="tx-group"><div class="tx-day"><span>${fmtMD(d)}（${'日一二三四五六'[new Date(d + 'T12:00:00').getDay()]}）</span></div>${days[d].map(txRow).join('')}</div>`).join(''); };
  const card = (r, g) => {
    const { e, r: rb } = sumOf(g), cats = catsOf(g), net = e - rb;
    return `<div class="card trip-card" data-trip="${esc(r.id)}">
      <div class="tc-h"><div class="ico" style="background:${hashTint(r.name)}">${icon('plane')}</div><div class="mid"><b>${esc(r.name)}</b><small>${tripRange(r)}・${tripDays(r)} 天${g.length ? `・${g.length} 筆` : ''}${r.note ? '・' + esc(r.note) : ''}</small></div><button class="icon-btn sm" data-tedit="${esc(r.id)}" aria-label="編輯">${icon('pencil')}</button></div>
      <div class="tc-n"><div><small>支出</small><b class="num exp">${yen(e)}</b></div><div><small>報銷</small><b class="num inc">${yen(rb)}</b></div><div><small>${net >= 0 ? '自付／待報銷' : '報銷多出'}</small><b class="num">${yen(Math.abs(net))}</b></div></div>
      ${cats.length ? `<div class="tc-cats">${cats.map(([k, v]) => `<span>${esc(k)} ${yen(v)}</span>`).join('')}</div>` : ''}
      ${g.length ? `<details><summary>查看 ${g.length} 筆明細 ›</summary>${txList(g)}</details>` : `<div class="hint" style="margin:10px 0 0">這幾天還沒有標為出差的紀錄。記帳時打開「出差」開關，日期落在 ${tripRange(r)} 就會自動算進來。</div>`}
    </div>`;
  };
  const trips = tripsAll();
  const yr = S.prefs.tripYear || 'all';
  const years = [...new Set(trips.map(t => String(t.start).slice(0, 4)).filter(Boolean))].sort().reverse();
  const shown = trips.filter(t => yr === 'all' || String(t.start).startsWith(yr));
  const totE = shown.reduce((a, r) => a + sumOf(by[r.id] || []).e, 0), totR = shown.reduce((a, r) => a + sumOf(by[r.id] || []).r, 0);
  $('#a-trips').innerHTML = `
    <div class="trip-top"><div class="grow">${shown.length ? `${yr === 'all' ? '全部' : yr + ' 年'} ${shown.length} 趟・支出 ${yen(totE)}${totR ? '・報銷 ' + yen(totR) : ''}` : '每一趟出差分開記'}</div>
      ${years.length > 1 ? `<select class="chip-sel" id="tp-year"><option value="all">全部年份</option>${years.map(y => `<option ${y === yr ? 'selected' : ''}>${y}</option>`).join('')}</select>` : ''}
      <button class="btn sm" id="tp-add">${icon('plus')} 新增出差</button></div>
    ${un.length ? `<div class="card trip-card unassigned"><div class="tc-h"><div class="ico" style="background:var(--muted)">${icon('luggage')}</div><div class="mid"><b>未分配到出差</b><small>${un.length} 筆・支出 ${yen(sumOf(un).e)}${sumOf(un).r ? '・報銷 ' + yen(sumOf(un).r) : ''}</small></div></div>
      <div class="hint" style="margin:8px 0 0">這些紀錄有標出差，但日期不在任何一趟出差裡。可以依日期自動分成幾趟（相隔超過 2 天就分開），之後再改名字。</div>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" id="tp-auto">${icon('sparkles')} 依日期自動分組</button></div>
      <details><summary>查看 ${un.length} 筆 ›</summary>${txList(un)}</details></div>` : ''}
    ${shown.map(r => card(r, by[r.id] || [])).join('') || (un.length ? '' : `<div class="card empty"><span class="em">${icon('luggage')}</span>還沒有出差紀錄<br><small>按「新增出差」建立一趟，例如「四日市 11/11–11/13」</small></div>`)}
    <div class="hint" style="margin:4px 8px 14px">記帳時打開「出差」開關：預設依日期自動歸到那一趟，也可以直接選哪一趟。出差的支出與報銷不算進日常開銷、圖表與省錢建議。</div>`;
  bindTx($('#a-trips'));
  $('#tp-add').onclick = () => openTripEdit();
  if ($('#tp-year')) $('#tp-year').onchange = e => { S.prefs.tripYear = e.target.value; persist('prefs'); renderTrips(); };
  $$('[data-tedit]', $('#a-trips')).forEach(b => b.onclick = () => openTripEdit(b.dataset.tedit));
  if ($('#tp-auto')) $('#tp-auto').onclick = () => autoGroupTrips(un);
}
/** 未分配的出差紀錄依日期分群（間隔超過 2 天就分開），每群建一趟 */
async function autoGroupTrips(un) {
  const ds = [...new Set(un.map(t => t.date))].sort(); if (!ds.length) return;
  const gs = []; let cur = [ds[0]];
  for (let i = 1; i < ds.length; i++) {
    const gap = (new Date(ds[i] + 'T12:00:00') - new Date(cur[cur.length - 1] + 'T12:00:00')) / 864e5;
    if (gap > 2) { gs.push(cur); cur = [ds[i]]; } else cur.push(ds[i]);
  }
  gs.push(cur);
  if (!confirm(`要建立 ${gs.length} 趟出差嗎？\n\n${gs.map(g => fmtMD(g[0]) + (g.length > 1 ? '–' + fmtMD(g[g.length - 1]) : '')).join('\n')}\n\n名稱先叫「出差」，之後可以按鉛筆改成地點。`)) return;
  for (const g of gs) await saveTrip({ id: newId(), name: '出差', start: g[0], end: g[g.length - 1], note: '' });
  toast(`已建立 ${gs.length} 趟出差`); renderTrips(); renderSync(); sync();
}
function openTripEdit(id) {
  const r = id ? (S.meta.trips || []).find(x => x.id === id) : null;
  const n = r ? S.txs.filter(t => t.trip && tripOf(t) === r).length : 0;
  openSheet('trip', r ? '編輯出差' : '新增出差', `
    <div class="form-group">
      <div class="frow"><label>名稱</label><input id="tp-name" placeholder="例：四日市" value="${esc(r ? r.name : '')}"></div>
      <div class="frow"><label>開始</label><input type="date" id="tp-from" value="${r ? r.start : today()}"></div>
      <div class="frow"><label>結束</label><input type="date" id="tp-to" value="${r ? r.end || r.start : today()}"></div>
      <div class="frow"><label>備註</label><input id="tp-note" placeholder="客戶、目的…（選填）" value="${esc(r ? r.note : '')}"></div>
    </div>
    <div class="hint">日期範圍內標為「出差」的紀錄會自動算進這一趟。</div>
    <div style="display:flex;gap:10px;margin-top:14px">${r ? `<button class="btn danger" id="tp-del">刪除</button>` : ''}<button class="btn" style="flex:1" id="tp-save">儲存</button></div>`);
  setTimeout(() => { if (!r) $('#tp-name').focus(); }, 250);
  $('#tp-save').onclick = async () => {
    const name = $('#tp-name').value.trim(); let a = $('#tp-from').value, b = $('#tp-to').value || a;
    if (!name) { toast('請填名稱'); $('#tp-name').focus(); return; }
    if (!a) { toast('請選開始日'); return; }
    if (b < a) [a, b] = [b, a];
    await saveTrip({ id: r ? r.id : newId(), name, start: a, end: b, note: $('#tp-note').value.trim() });
    closeSheet('trip'); toast(r ? '已更新' : `已新增「${name}」`); renderPage(); renderSync(); sync();
  };
  if (r) $('#tp-del').onclick = async () => {
    if (!confirm(`刪除「${r.name}」？${n ? `\n裡面的 ${n} 筆紀錄仍保留出差標記，會變成依日期自動對應。` : ''}`)) return;
    await deleteTripLocal(r.id); closeSheet('trip'); toast('已刪除'); renderPage(); renderSync(); sync();
  };
}

// ---------- Money Forward ME 匯入 ----------
function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.length > 1 || r[0]);
}
async function readTextAuto(file) {
  const buf = await file.arrayBuffer();
  try { return new TextDecoder('utf-8', { fatal: true }).decode(buf).replace(/^\uFEFF/, ''); }
  catch (e) { return new TextDecoder('shift_jis').decode(buf); }
}
const nk = s => String(s || '').normalize('NFKC').trim();
function mfAccType(name) {
  const n = nk(name);
  if (/カード|card/i.test(n) && !/suica|kitaca|sapica|starbucks/i.test(n)) return '信用卡';
  if (/ポイント|point|ponta|nanaco|waon|マイル|mile/i.test(n)) return 'Point卡';
  if (/cash|現金|財布|wallet|pocket/i.test(n)) return '現金';
  if (/銀行|bank|account|richart|信金|信用金庫|口座/i.test(n)) return '銀行';
  return '電子錢包';
}
const MF_EXP = {
  '食費': (m) => m === '食料品' ? '食材/超市' : '餐飲', '日用品': (m) => m === 'おこづかい' ? '其他' : '日用品',
  '交通費': () => '交通', '交際費': () => '交際', '住宅': () => '居住', '健康・医療': () => '醫療保健', '教養・教育': () => '教育',
  '水道・光熱費': () => '水電瓦斯', '特別な支出': (m) => /家具|家電/.test(m) ? '家具家電' : '其他', '衣服・美容': () => '服飾美容',
  '趣味・娯楽': (m) => m === '旅行' ? '旅行' : '娛樂', '通信費': (m) => /サブスク/.test(m) ? '訂閱服務' : '通訊',
  '税・社会保障': () => '稅金保險', '自動車': () => '汽車', '保険': () => '稅金保險',
};
const MF_INC = (big, mid, memo) => /出差|出張/.test(memo) ? '出差報銷' : mid === '給与' || mid === '給料' ? '薪資' : /賞与|ボーナス/.test(mid) ? '獎金'
  : mid === 'ポイント' ? '點數回饋' : /返金|割引|返品/.test(mid) ? '退款' : /事業|副業/.test(mid) ? '副業' : /利息|配当/.test(mid) ? '利息/投資' : '其他收入';
function planMF(raw) {
  const head = raw[0].map(nk);
  const ix = k => head.findIndex(h => h.startsWith(k));
  const I = { calc: ix('計算対象'), date: ix('日付'), content: ix('内容'), amt: ix('金額'), acc: ix('保有金融機関'), big: ix('大項目'), mid: ix('中項目'), memo: ix('メモ'), tr: ix('振替'), id: ix('ID') };
  if (Object.values(I).some(v => v < 0)) throw new Error('這不是 Money Forward ME 的入出金明細 CSV（找不到必要欄位）');
  const rows = raw.slice(1).filter(r => r.length >= head.length - 1).map(r => ({
    calc: r[I.calc] === '1', date: nk(r[I.date]).replace(/\//g, '-'), content: nk(r[I.content]), amt: Number(nk(r[I.amt]).replace(/,/g, '')) || 0,
    acc: nk(r[I.acc]), big: nk(r[I.big]), mid: nk(r[I.mid]), memo: nk(r[I.memo]), tr: r[I.tr] === '1', id: nk(r[I.id]),
  })).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date));
  const accNames = [...new Set(rows.map(r => r.acc).filter(Boolean))];
  const EXT = '外部帳戶（未連結）';
  const find = re => accNames.find(a => re.test(a));
  const infer = (r) => {
    const c = r.content, ok = a => a && a !== r.acc ? a : null;
    return ok(/amazon/i.test(c) && find(/amazon/i)) || ok(/楽天市場|\(ラクテン|ラクテン\s*\(/.test(c) && find(/楽天市場/)) ||
      ok(/三井住友カード/.test(c) && find(/三井住友カード/)) || ok(/ラクテンカード|楽天カード/.test(c) && find(/楽天カード/)) ||
      ok(/paypay\s*カード/i.test(c) && find(/paypay\s*card|paypayカード/i)) || ok(/suica|カード モバイル/i.test(c) && find(/suica/i)) ||
      ok(/kitaca/i.test(c) && find(/kitaca/i)) || ok(/sapica/i.test(c) && find(/sapica/i)) ||
      ok(/ATM|簡易入金機/.test(c) && find(/cash|現金|pocket/i)) || ok(/通帳アプリ|ゆうちょ/.test(c) && find(/ゆ[いう]ちょ/)) || null;
  };
  const plan = { txs: [], skipped: [], accNames, extUsed: false, stat: { exp: 0, expN: 0, inc: 0, incN: 0, pair: 0, inferred: 0, ext: 0, mfExp: 0, mfInc: 0 } };
  const st = plan.stat;
  const storeOf = r => {
    const generic = /GLOBAL PASS SHOPPING|VISA国内利用|Visa国内加盟店|^-?$|^物販$|支出\(不明\)|^振込|^他行宛振込/.test(r.content);
    if (/amazon/i.test(r.acc) && !/amazon/i.test(r.content)) return { store: 'Amazon', note: r.content + (r.memo ? '｜' + r.memo : '') };
    if (/楽天市場/.test(r.acc) && !/楽天/.test(r.content)) return { store: '楽天市場', note: r.content + (r.memo ? '｜' + r.memo : '') };
    if (generic) return r.memo && r.memo.length <= 24 ? { store: r.memo, note: '' } : { store: '', note: [r.content === '-' ? '' : r.content, r.memo].filter(Boolean).join('｜') };
    return { store: r.content.replace(/^楽天SP\s*/, '').replace(/\s+\d{5,}$/, '').replace(/\s{2,}/g, ' ').slice(0, 60), note: r.memo };
  };
  // 一般收支
  rows.forEach(r => {
    if (!r.amt) return;
    if (!r.tr && !r.calc) { plan.skipped.push(r); return; }
    if (r.tr) return;
    const { store, note } = storeOf(r);
    const isTrip = r.mid === '出張' || /出差|出張/.test(r.memo);
    if (r.amt < 0) {
      let cat = (MF_EXP[r.big] || (() => '其他'))(r.mid);
      if (r.mid === '出張') cat = /トラベル|ホテル|旅館|宿/.test(r.content) ? '旅行' : /ランドリー/.test(r.memo + r.content) ? '日用品' : '其他';
      let sub = r.mid && r.mid !== r.big && r.mid !== '未分類' && r.mid !== cat ? r.mid : '';
      if (cat === '汽車') sub = carGroupName(r.mid + ' ' + r.content) || sub;
      plan.txs.push({ id: 'MF-' + r.id, date: r.date, type: '支出', category: cat, sub: r.mid === '出張' && cat === '旅行' ? '住宿' : sub, original: -r.amt, account: r.acc, store, note, source: 'Money Forward', _trip: isTrip });
      st.exp += -r.amt; st.expN++; st.mfExp += -r.amt;
    } else {
      const cat = r.big === '収入' ? MF_INC(r.big, r.mid, r.memo) : (/返品|返金/.test(r.content) ? '退款' : '其他收入');
      const sub = r.mid && !['未分類', 'その他入金'].includes(r.mid) && r.mid !== cat ? r.mid : '';
      plan.txs.push({ id: 'MF-' + r.id, date: r.date, type: '收入', category: cat, sub, original: r.amt, account: r.acc, store: '', note: [store, note].filter(Boolean).join('｜'), source: 'Money Forward', _trip: isTrip });
      st.inc += r.amt; st.incN++; st.mfInc += r.amt;
    }
  });
  // 振替：先配對，再推測對方帳戶
  const d = s => new Date(s + 'T12:00:00').getTime();
  const trs = rows.filter(r => r.tr && r.amt);
  const pos = trs.filter(r => r.amt > 0), used = new Set();
  const typeOf = n => n === EXT ? '銀行' : mfAccType(n);
  const trCat = (from, to) => {
    if (/amazon|楽天市場/i.test(to)) return '帳戶互轉';
    const ft = typeOf(from), tt = typeOf(to);
    return tt === '現金' && ft === '銀行' ? '提款' : ft === '現金' && tt === '銀行' ? '存款' : tt === '信用卡' ? '信用卡繳費' : tt === '電子錢包' ? '儲值' : '帳戶互轉';
  };
  const addTr = (id, date, from, to, amt, r) => {
    if (from === EXT || to === EXT) { plan.extUsed = true; st.ext++; }
    plan.txs.push({ id: 'MF-' + id, date, type: '振替', category: trCat(from, to), original: amt, account: from, toAccount: to, store: '', note: [r.content, r.memo].filter(Boolean).join('｜').slice(0, 120), source: 'Money Forward' });
  };
  trs.filter(r => r.amt < 0).sort((a, b) => a.date.localeCompare(b.date)).forEach(n => {
    let best = null;
    pos.forEach(p => {
      if (used.has(p) || p.acc === n.acc || p.amt !== -n.amt) return;
      const dd = Math.abs(d(p.date) - d(n.date)) / 864e5;
      if (dd <= 5 && (!best || dd < best[0])) best = [dd, p];
    });
    if (best) { used.add(best[1]); st.pair++; addTr(n.id, n.date, n.acc, best[1].acc, -n.amt, n); }
    else { const to = infer(n); if (to) st.inferred++; addTr(n.id, n.date, n.acc, to || EXT, -n.amt, n); }
  });
  pos.filter(p => !used.has(p)).forEach(p => { const from = infer(p); if (from) st.inferred++; addTr(p.id, p.date, from || EXT, p.acc, p.amt, p); });
  // 出差：MF 的「出張」分類或備註有「出差」→ 標為出差
  const tr = plan.txs.filter(t => t._trip);
  plan.tripInfo = { n: tr.length, exp: tr.filter(t => t.type === '支出').reduce((a, t) => a + t.original, 0), inc: tr.filter(t => t.type === '收入').reduce((a, t) => a + t.original, 0) };
  plan.txs.forEach(t => { t.trip = t._trip ? '1' : ''; delete t._trip; });

  plan.dateFrom = rows.reduce((a, r) => r.date < a ? r.date : a, '9999');
  plan.dateTo = rows.reduce((a, r) => r.date > a ? r.date : a, '0000');
  if (plan.extUsed) plan.accNames.push(EXT);
  return plan;
}
async function startMFImport(file) {
  if (!canOnline()) return toast('匯入需要連線 Google 試算表');
  let plan;
  try { plan = planMF(parseCSV(await readTextAuto(file))); } catch (e) { return toast('讀取失敗：' + e.message, 5000); }
  S.mfPlan = plan;
  const st = plan.stat;
  const existing = S.meta.accounts.map(a => a.name);
  const counts = {}; plan.txs.forEach(t => { counts[t.account] = (counts[t.account] || 0) + 1; if (t.toAccount) counts[t.toAccount] = (counts[t.toAccount] || 0) + 1; });
  const accRows = plan.accNames.map((n, i) => {
    const same = existing.includes(n);
    return `<div class="map-row"><div class="src">${esc(n)}<small>${counts[n] || 0} 筆</small></div>
      <select data-mfacc="${i}"><option value="__new">＋ 新增同名帳戶</option>${existing.map(e => `<option value="${esc(e)}" ${same && e === n ? 'selected' : ''}>→ ${esc(e)}</option>`).join('')}</select>
      <select data-mftype="${i}">${accountTypes().map(t => `<option ${t === (n.startsWith('外部') ? '銀行' : mfAccType(n)) ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`;
  }).join('');
  const catAgg = {}; plan.txs.filter(t => t.type !== '振替').forEach(t => { const k = t.type + '｜' + t.category; catAgg[k] = (catAgg[k] || 0) + 1; });
  closeSheet('set');
  openSheet('detail', '匯入 Money Forward ME', `<div class="hint" style="margin:6px 4px 12px">${plan.dateFrom} ~ ${plan.dateTo}・共 ${plan.txs.length} 筆</div>
    <div class="card">
      <div class="stat-row"><span>支出</span><b class="num">${st.expN} 筆・${yen(st.exp)}</b></div>
      <div class="stat-row"><span>收入</span><b class="num">${st.incN} 筆・${yen(st.inc)}</b></div>
      <div class="stat-row"><span>振替（帳戶間移動）</span><b class="num">${st.pair + st.inferred + st.ext} 筆</b></div>
      <div class="stat-row"><span>略過（MF 設為不計算）</span><b class="num">${plan.skipped.length} 筆</b></div>
      <div class="hint" style="margin:8px 0 0">支出、收入合計與 Money Forward「計算對象」一致。振替：${st.pair} 筆配對成功、${st.inferred} 筆依內容判斷對方帳戶${st.ext ? `、${st.ext} 筆對方帳戶未連結（記到「外部帳戶」）` : ''}。</div>
    </div>
    ${plan.tripInfo.n ? `<div class="set-h">出差</div><div class="form-group"><label class="chk"><input type="checkbox" id="mf-trip" checked><div class="mid"><b>標為出差（另計）</b><small>${plan.tripInfo.n} 筆・支出 ${yen(plan.tripInfo.exp)}・報銷 ${yen(plan.tripInfo.inc)}</small></div></label></div>
      <div class="hint">依 MF 的「出張」分類與備註「出差」判斷。其他紀錄可在詳情按「標為出差」。</div>` : ''}
    <div class="set-h">帳戶對應</div><div class="form-group">${accRows}</div>
    <details class="more form-group"><summary>分類對應（${Object.keys(catAgg).length} 類）</summary>${Object.entries(catAgg).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="kv"><span>${esc(k.replace('｜', ' → '))}</span><span>${v} 筆</span></div>`).join('')}
      <div class="hint" style="margin:8px 16px 12px">MF 的中項目會保留在「子分類」。</div></details>
    <button class="btn" id="mf-go">${icon('check')}開始匯入</button>
    <div class="hint" style="margin-top:10px">已匯入過的紀錄會自動略過，可以放心重複匯入新的 CSV。</div>`);
  $('#mf-go').onclick = runMFImport;
}
async function runMFImport() {
  const plan = S.mfPlan;
  const map = {}, newAccs = [];
  plan.accNames.forEach((n, i) => {
    const v = $(`[data-mfacc="${i}"]`).value;
    if (v === '__new') { map[n] = n; if (!S.meta.accounts.some(a => a.name === n)) newAccs.push({ name: n, type: $(`[data-mftype="${i}"]`).value, currency: 'JPY', initial: 0 }); }
    else map[n] = v;
  });
  const keepTrip = !$('#mf-trip') || $('#mf-trip').checked;
  const txs = plan.txs.map(t => Object.assign({}, t, { account: map[t.account] || t.account, toAccount: t.toAccount ? (map[t.toAccount] || t.toAccount) : '', trip: keepTrip ? t.trip : '' }))
    .filter(t => t.type !== '振替' || t.account !== t.toAccount);
  const need = new Set(txs.filter(t => t.type !== '振替').map(t => t.type + '|' + t.category));
  const categories = [...need].map(k => { const [ty, nm] = k.split('|'); return [ty, nm, catInfo(ty, nm).raw]; });
  busy(true, '匯入中…', `0 / ${txs.length}`);
  let added = 0, skipped = 0;
  try {
    for (let i = 0; i < txs.length; i += 400) {
      const r = await api('importBulk', i === 0 ? { accounts: newAccs, categories, txs: txs.slice(i, i + 400) } : { txs: txs.slice(i, i + 400) }, 120000);
      added += r.added; skipped += r.skipped;
      $('#busySub').textContent = `${Math.min(i + 400, txs.length)} / ${txs.length}`;
    }
    busy(false);
    await sync();
    closeSheet('detail');
    toast(`✓ 匯入 ${added} 筆${skipped ? `，略過 ${skipped} 筆已存在` : ''}`, 4000);
    openSettings(true);
    setTimeout(() => toast('MF 沒有期初餘額：請在「設定 → 帳戶」點各帳戶，輸入目前的實際餘額', 5000), 4200);
  } catch (e) { busy(false); toast('匯入失敗：' + e.message, 6000); }
}
// ---------- 帳戶 / 標籤 / 分類（手動新增）----------
function typeOptions(sel) {
  return accountTypes().map(t => `<option ${t === sel ? 'selected' : ''}>${esc(t)}</option>`).join('') + '<option value="__new">＋ 新增標籤…</option>';
}
async function addTag() {
  const name = (prompt('新增帳戶標籤名稱（例：證券、儲值卡）') || '').trim().slice(0, 20);
  if (!name) return null;
  if (!accountTypes().includes(name)) {
    S.meta.accountTypes = (S.meta.accountTypes || []).concat(name); await persist('meta');
    await DB.put('ops', { op: 'accountType', name }); await reload(); sync();
  }
  toast('✓ 已新增標籤「' + name + '」');
  return name;
}
function openAccountEditor(tag) { openSettings({ newAcc: tag || '' }); }
function changeAccType(name) { openSettings({ edit: name }); }
function renderCatMgr() {
  const ty = S.catMgrType || '支出';
  $$('#catMgrSeg button').forEach(b => b.classList.toggle('on', b.dataset.ct === ty));
  $('#catMgr').innerHTML = `<div class="cat-mgr">${cats(ty).map(c => `<span class="cm">${catInfo(ty, c.name).icon} ${esc(c.name)}<button data-cdel="${esc(c.name)}" title="刪除">${icon('x')}</button></span>`).join('')}</div>`;
  $$('[data-cdel]').forEach(b => b.onclick = () => deleteCategory(ty, b.dataset.cdel));
}
async function addCategory(type, name, icon0) {
  name = String(name || '').trim().slice(0, 20);
  if (!name) { toast('請輸入分類名稱'); return null; }
  const list = S.meta.categories[type] = (S.meta.categories[type] || DEFAULT_CATS[type]).slice();
  if (list.some(c => c.name === name)) { toast('分類已存在'); return name; }
  const c = { name, icon: glyphName(icon0, 'tag') };
  list.push(c); await persist('meta');
  await DB.put('ops', { op: 'category', category: Object.assign({ type }, c) }); await reload(); sync();
  toast(`✓ 已新增分類 ${name}`);
  return name;
}
async function deleteCategory(type, name) {
  if (cats(type).length <= 1) return toast('至少要保留一個分類');
  const n = S.txs.filter(t => t.type === type && t.category === name).length;
  if (!confirm(`刪除分類「${name}」？${n ? `\n已記錄的 ${n} 筆會保留原本的分類名稱。` : ''}`)) return;
  S.meta.categories[type] = cats(type).filter(c => c.name !== name); await persist('meta');
  await DB.put('ops', { op: 'categoryDel', category: { type, name } }); await reload(); sync();
  renderCatMgr();
}
function openCategoryEditor(type) {
  openSheet('detail', `新增${type}分類`, `<div class="form-group" style="margin-top:12px">
    <div class="frow"><label>名稱</label><input id="qc-name" placeholder="分類名稱"></div></div>
    <div class="set-h">圖示</div><div class="form-group" style="padding:10px">${iconPicker('qc-icon')}</div>
    <button class="btn" id="qc-ok">${icon('check')}新增並使用</button>`);
  bindPicker($('#sh-detail'));
  setTimeout(() => $('#qc-name').focus(), 300);
  $('#qc-ok').onclick = async () => {
    const n = await addCategory(type, $('#qc-name').value, $('#qc-icon').dataset.v);
    if (!n) return;
    closeSheet('detail');
    if (E.type === type) { E.category = n; renderCats(); itemSum(); fillSubList(); onCatChange(); }
  };
}
async function setMonthStart(v) {
  S.prefs.monthStart = Math.min(28, Math.max(1, Number(v) || 1)); await persist('prefs');
  await DB.put('ops', { op: 'settings', settings: { monthStart: S.prefs.monthStart } }); await reload();
  S.listMonth = S.anaMonth = cycleKey(today()); S.rRef = today();
  const r = cycleRange(S.listMonth);
  toast(`✓ 每月從 ${S.prefs.monthStart} 日開始・本期 ${fmtMD(r.from)}～${fmtMD(r.to)}`);
  renderPage(); sync();
}

async function calibrate(name) {
  const a = balances().list.find(x => x.name === name);
  if (!a) return;
  const v = prompt(`「${name}」現在實際的餘額是多少？${a.type === '信用卡' ? '\n（信用卡請輸入未繳金額的負數，例如 -35000）' : ''}`, String(Math.round(a.balance)));
  if (v == null) return;
  const actual = parseAmt(v);
  if (isNaN(actual)) return toast('金額格式錯誤');
  const acc = S.meta.accounts.find(x => x.name === name);
  acc.initial = Math.round(((Number(acc.initial) || 0) + actual - a.balance) * 100) / 100;
  await persist('meta');
  await DB.put('ops', { op: 'accountUpdate', account: { name, initial: acc.initial } }); await reload();
  toast(`✓ ${name} 已校正為 ${money(actual, acc.currency)}`); renderPage(); renderSync(); sync(); if ($('#sh-set').classList.contains('on')) renderAccMgr();
}

// ---------- 錯誤說明 & AI 診斷 ----------
function showAIError(msg) {
  const old = /未知的動作/.test(msg);
  const tips = old ? ['Apps Script 的程式還是舊版：「部署」→「管理部署作業」→ 編輯 →「版本：新版本」→「部署」。']
    : /Key 無效|API key/i.test(msg) ? ['到 Google AI Studio 重新複製金鑰，貼到「設定 → API Key」後儲存。']
    : /額度|quota|429/i.test(msg) ? ['免費額度每天有限（太平洋時間午夜，約日本下午 4～5 點重置）。', '常用的話，在 Google AI Studio 的 Billing 開啟付費就不會被限制。', '現在可以先改用手動輸入。']
    : /模型/.test(msg) ? ['把「設定 → 模型」清空後儲存，系統會自動找可用的模型。']
    : /逾時|無法連線/.test(msg) ? ['網路不穩或 AI 回應較慢，請再試一次。']
    : ['按下方「執行診斷」找出問題。'];
  openSheet('detail', '辨識失敗', `<div class="card"><div style="font-weight:700;margin-bottom:8px">${icon('alert', 'ii')} ${esc(msg)}</div>
    <div class="advice">${tips.map(t => `<div>・${esc(t)}</div>`).join('')}</div></div>
    <div class="btn-row"><button class="btn sec" data-e="manual">${icon('pencil')}改用手動輸入</button><button class="btn" data-e="diag">${icon('search')}執行診斷</button></div>
    <div class="hint" style="margin-top:12px">詳細錯誤會記在試算表的「錯誤紀錄」工作表。</div>`);
  $('[data-e=manual]').onclick = () => { closeSheet('detail'); if (!$('#sh-entry').classList.contains('on')) openEntry(); };
  $('[data-e=diag]').onclick = () => runDiag();
}
async function runDiag() {
  if (!canOnline()) return toast(navigator.onLine ? '請先在設定連線 Google 試算表' : '需要網路才能診斷');
  closeSheet('set');
  busy(true, '診斷中…', '檢查金鑰、可用模型並實際呼叫一次');
  let r;
  try { r = await api('testAI', {}, 120000); }
  catch (e) {
    busy(false);
    const old = /未知的動作/.test(e.message);
    return openSheet('detail', 'AI 診斷', `<div class="card"><div style="font-weight:700">${icon('xCircle', 'ii bad')} ${esc(old ? '後端是舊版程式' : e.message)}</div>
      <div class="advice" style="margin-top:6px">${old ? '請到 Apps Script 貼上新版 Code.gs，然後「部署」→「管理部署作業」→ 編輯 →「版本：新版本」→「部署」。' : '請確認設定裡的 API 網址與連線碼。'}</div></div>`);
  }
  busy(false);
  openSheet('detail', 'AI 診斷', `<div class="card" style="padding:4px 0">${r.steps.map(x => `<div class="kv"><span>${x.ok ? icon('okCircle', 'ii good') : icon('xCircle', 'ii bad')} ${esc(x.name)}</span><span style="font-weight:500">${esc(x.msg)}</span></div>`).join('')}</div>
    <div class="card"><b>${r.ok ? 'AI 連線正常，可以拍收據了' : '請依照標示紅色的說明修正後再試一次'}</b></div>`);
}

// ---------- 設定 ----------
// ---------- 設定（Apple 風格：左側選單、右側內容）----------
const SET_TITLES = { conn: '連線與同步', ai: 'AI 辨識', acc: '帳戶', cat: '記帳分類', period: '記帳區間', look: '外觀', import: '匯入資料', offline: '離線', about: '其他' };
const setWide = () => matchMedia('(min-width: 700px)').matches;
function showPane(p, title, back) {
  S.setPane = p; if (p === 'dyn') S.dynBack = back || 'acc';
  $('#set-wrap').classList.toggle('detail', !!p);
  $$('.set-pane').forEach(x => x.classList.toggle('on', x.dataset.pane === p));
  const navKey = p === 'dyn' ? S.dynBack : p;
  $$('.set-item').forEach(b => b.classList.toggle('on', b.dataset.pane === navKey));
  $('#set-title').textContent = title || SET_TITLES[p] || '';
  $('#set-back').textContent = p === 'dyn' ? '‹ ' + (SET_TITLES[S.dynBack] || '設定') : '‹ 設定';
  $('#set-panes').scrollTop = 0;
}
function showDyn(title, html, back) {
  $('#set-dyn').innerHTML = html; hydrate($('#set-dyn'));
  showPane('dyn', title, back);
}
// ---------- 外觀：主題、深淺色、液態玻璃（存在這台裝置）----------
const THEMES = [['', '深青', '#0f4c5c', '#1e6d6e'], ['forest', '森林', '#2f5d3a', '#4a7c4f'], ['indigo', '夜藍', '#2c3e8f', '#4a5bb8'], ['rose', '玫瑰', '#9b3d5a', '#c0607c'], ['amber', '琥珀', '#8a5a1f', '#b07a35'], ['graphite', '石墨', '#2b2f33', '#565d64']];
function getLook() { try { return Object.assign({ theme: '', mode: 'auto', glass: false, glassA: 45 }, JSON.parse(localStorage.getItem('kakeibo-look') || '{}')); } catch (e) { return { theme: '', mode: 'auto', glass: false, glassA: 45 }; } }
function applyLook(l) {
  l = l || getLook();
  const r = document.documentElement;
  if (l.theme) r.dataset.theme = l.theme; else delete r.dataset.theme;
  if (l.mode && l.mode !== 'auto') r.dataset.mode = l.mode; else delete r.dataset.mode;
  r.classList.toggle('glass', !!l.glass);
  const t = Math.max(0, Math.min(100, Number(l.glassA) || 0));
  r.style.setProperty('--glass-a', (100 - t * 0.85).toFixed(0) + '%');   // 表面不透明度：100%（實）→ 15%（很透明）
  r.style.setProperty('--glass-blur', (12 + t * 0.18).toFixed(0) + 'px');
  // 狀態列顏色跟著深淺色
  const dark = l.mode === 'dark' || (l.mode !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  $$('meta[name=theme-color]').forEach(m => { m.removeAttribute('media'); m.content = dark ? '#0e1615' : '#f3f1ec'; });
}
function saveLook(patch) { const l = Object.assign(getLook(), patch); try { localStorage.setItem('kakeibo-look', JSON.stringify(l)); } catch (e) {} applyLook(l); renderLook(); if (S.page === 'car' || S.page === 'ana' || S.page === 'home') renderPage(); }
function renderLook() {
  const l = getLook();
  if (!$('#lk-theme')) return;
  $('#lk-theme').innerHTML = THEMES.map(([k, n, a, b]) => `<button type="button" data-th="${k}" class="${(l.theme || '') === k ? 'on' : ''}"><span class="sw" style="background:linear-gradient(135deg,${a},${b})"></span>${n}</button>`).join('');
  $$('#lk-theme [data-th]').forEach(b => b.onclick = () => saveLook({ theme: b.dataset.th }));
  $$('#lk-mode [data-md]').forEach(b => { b.classList.toggle('on', b.dataset.md === (l.mode || 'auto')); b.onclick = () => saveLook({ mode: b.dataset.md }); });
  $('#lk-glass').checked = !!l.glass;
  $('#lk-glass').onchange = () => saveLook({ glass: $('#lk-glass').checked });
  $('#lk-glassRow').classList.toggle('hidden', !l.glass);
  $('#lk-glassA').value = l.glassA; $('#lk-glassV').textContent = l.glassA + '%';
  $('#lk-glassA').oninput = () => { const v = Number($('#lk-glassA').value); $('#lk-glassV').textContent = v + '%'; const x = Object.assign(getLook(), { glassA: v }); applyLook(x); };
  $('#lk-glassA').onchange = () => saveLook({ glassA: Number($('#lk-glassA').value) });
  const th = THEMES.find(t => t[0] === (l.theme || ''));
  if ($('#nv-look')) $('#nv-look').textContent = (th ? th[1] : '') + (l.glass ? '・玻璃' : '');
}
applyLook();
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyLook()); } catch (e) {}

function fillSetNav() {
  renderLook();
  const st = S.meta.settings;
  const nv = {
    conn: !S.conn.url ? '未連線' : navigator.onLine ? (pendingCount() ? pendingCount() + ' 筆待同步' : '已同步') : '離線',
    ai: st ? (st.provider === 'claude' ? 'Claude' : 'Gemini') + (st.hasKey ? '' : '・未設定') : '',
    acc: S.meta.accounts.length + ' 個', cat: (cats('支出').length + cats('收入').length + cats('振替').length) + ' 個',
    period: monthStartDay() === 1 ? '每月 1 日' : `每月 ${monthStartDay()} 日`, import: 'MF CSV', offline: S.prefs.queuePhotos ? '開啟' : '關閉', about: '',
  };
  Object.keys(nv).forEach(k => { const el = $('#nv-' + k); if (el) el.textContent = nv[k]; });
}
/** 可以加很多組的標籤輸入（卡號末 4 碼、關鍵字） */
function tagBox(box, vals, defs, check, ph) {
  box._vals = vals.slice();
  const draw = () => {
    box.innerHTML = box._vals.map((v, i) => `<span class="tg">${esc(v)}<button type="button" data-rm="${i}" aria-label="移除">${icon('x')}</button></span>`).join('')
      + defs.map(v => `<span class="tg def">${esc(v)}</span>`).join('')
      + `<input placeholder="${esc(ph)}" ${box.dataset.kind === 'l4' ? 'inputmode="numeric" maxlength="4"' : ''} enterkeyhint="done">`;
    const inp = $('input', box);
    const add = () => { const v0 = inp.value.trim(); if (!v0) return; const v = check(v0); if (v && !box._vals.includes(v)) { box._vals.push(v); draw(); $('input', box).focus(); } else if (v) inp.value = ''; };
    inp.onkeydown = e => { if (e.key === 'Enter' || e.key === ',' || e.key === '、') { e.preventDefault(); add(); } };
    inp.onblur = add;
    $$('[data-rm]', box).forEach(b => b.onclick = () => { box._vals.splice(Number(b.dataset.rm), 1); draw(); });
  };
  draw();
}
const tagVals = box => { const inp = $('input', box); if (inp && inp.value.trim()) inp.onblur(); return box._vals || []; };
function renderAccMgr() {
  const b = balances();
  const types = accountTypes();
  S.mgrTab = S.mgrTab && (S.mgrTab === '全部' || types.includes(S.mgrTab)) ? S.mgrTab : '全部';
  $('#accMgrTabs').innerHTML = ['全部'].concat(types).map(t => `<button class="chip ${t === S.mgrTab ? 'on' : ''}" data-mt="${esc(t)}">${t === '全部' ? '全部' : typeIcon(t, 'ii') + ' ' + esc(t)}<span class="faint" style="margin-left:4px">${t === '全部' ? b.list.length : b.list.filter(a => a.type === t).length}</span></button>`).join('');
  $$('#accMgrTabs [data-mt]').forEach(x => x.onclick = () => { S.mgrTab = x.dataset.mt; renderAccMgr(); });
  const lst = b.list.filter(a => S.mgrTab === '全部' || a.type === S.mgrTab);
  $('#acc-list').innerHTML = lst.length ? lst.map(a => `<button class="acc-row" data-acced="${esc(a.name)}"><span class="acc-ic">${typeIcon(a.type)}</span>
      <span class="nm"><b>${esc(a.name)}</b><small>${esc(a.type)}${a.currency === 'TWD' ? '・台幣' : ''}</small></span>
      <span class="num ${a.balance < 0 ? 'exp' : ''}" style="font-weight:650">${money(a.balance, a.currency)}</span><span class="chev">›</span></button>`).join('')
    : `<div class="empty" style="padding:16px">這個標籤還沒有帳戶</div>`;
  $$('#acc-list [data-acced]').forEach(x => x.onclick = () => editAccountPane(x.dataset.acced));
  const dp = $('#acc-defPay');
  if (dp) {
    const cur = defaultPayAccount('JPY');
    dp.innerHTML = visibleAccounts().map(a => `<option ${a.name === cur ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
    dp.onchange = async () => {
      S.prefs.defaultPay = dp.value; await persist('prefs');
      await DB.put('ops', { op: 'settings', settings: { defaultPay: dp.value } }); await reload(); renderSync(); sync(); toast('✓ 已設定');
    };
  }
}
function openSettings(arg) {
  $('#c-url').value = S.conn.url; $('#c-token').value = S.conn.token;
  $('#c-state').textContent = S.conn.url ? (S.lastSync ? '上次同步：' + new Date(S.lastSync).toLocaleString('zh-TW') : '尚未同步') + (S.syncErr ? '・錯誤：' + S.syncErr : '') : '在試算表選單「記帳 App → 顯示連線碼」取得連線碼。';
  const st = S.meta.settings;
  if (st) { $('#ai-prov').value = st.provider; $('#ai-model').value = st.model || ''; $('#ai-email').checked = !!st.emailReports; }
  $('#ai-state').textContent = st ? `AI Key：${st.hasKey ? '已設定' : '未設定'}・地圖 Key：${st.hasPlacesKey ? '已設定' : '未設定（改用 AI 搜尋）'}` : '連線後可設定';
  $('#p-queue').checked = !!S.prefs.queuePhotos;
  renderAccMgr();
  $('#ms-day').innerHTML = Array.from({ length: 28 }, (_, i) => `<option value="${i + 1}" ${i + 1 === monthStartDay() ? 'selected' : ''}>${i + 1} 日</option>`).join('');
  renderCatMgr(); fillSetNav();
  const wasOpen = $('#sh-set').classList.contains('on');
  openSheet('set');
  if (arg && typeof arg === 'object' && arg.edit) return editAccountPane(arg.edit);
  if (arg && typeof arg === 'object' && arg.newAcc != null) return newAccountPane(arg.newAcc);
  const pane = arg === true ? 'acc' : typeof arg === 'string' ? arg : (wasOpen ? S.setPane : null);
  if (pane && pane !== 'dyn') showPane(pane);
  else if (setWide()) showPane(S.setPane && S.setPane !== 'dyn' ? S.setPane : 'conn');
  else showPane(null);
}
// ---- 帳戶編輯（改名、標籤、餘額、刪除）
function editAccountPane(name) {
  const a = S.meta.accounts.find(x => x.name === name); if (!a) return;
  const bal = balances().list.find(x => x.name === name);
  const n = S.txs.filter(t => t.account === name || t.toAccount === name).length;
  showDyn(name, `
    <div class="form-group">
      <div class="frow"><label>名稱</label><input id="ae-name" value="${esc(a.name)}"></div>
      <div class="frow"><label>標籤</label><select id="ae-type">${typeOptions(a.type)}</select></div>
      <div class="frow"><label>幣別</label><select id="ae-cur" ${n ? 'disabled' : ''}><option value="JPY" ${a.currency !== 'TWD' ? 'selected' : ''}>日圓 JPY</option><option value="TWD" ${a.currency === 'TWD' ? 'selected' : ''}>台幣 TWD</option></select></div>
      <div class="frow"><label>目前餘額</label><input id="ae-bal" inputmode="decimal" value="${Math.round(bal.balance * 100) / 100}"></div>
    </div>
    <div id="ae-cardBox" class="${a.type === '信用卡' ? '' : 'hidden'}">
      <div class="set-h">信用卡</div>
      <div class="form-group">
        <div class="frow"><label>常見卡片</label><select id="ae-preset"><option value="">手動設定</option><option value="31|27|1">楽天カード・PayPayカード（月底結帳、翌月 27 日扣款）</option><option value="15|10|1">三井住友カード（15 日結帳、翌月 10 日扣款）</option><option value="31|26|1">三井住友カード（月底結帳、翌月 26 日扣款）</option><option value="27|27|1">エポスカード（27 日結帳、翌月 27 日扣款）</option><option value="10|2|1">イオンカード（10 日結帳、翌月 2 日扣款）</option><option value="15|10|1">JCB カード（15 日結帳、翌月 10 日扣款）</option></select></div>
        <div class="frow"><label>結帳日</label><select id="ae-close"><option value="0">未設定（用記帳區間）</option>${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}" ${closeDayOf(a) === i + 1 ? 'selected' : ''}>每月 ${i + 1} 日</option>`).join('')}<option value="31" ${closeDayOf(a) === 31 ? 'selected' : ''}>每月月底</option></select></div>
        <div class="frow"><label>扣款日</label><select id="ae-pay"><option value="0">未設定</option>${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}" ${payDayOf(a) === i + 1 ? 'selected' : ''}>${i + 1} 日</option>`).join('')}<option value="31" ${payDayOf(a) === 31 ? 'selected' : ''}>月底</option></select><select id="ae-payMon" style="flex:none;width:auto"><option value="1">翌月</option><option value="2" ${payMonOf(a) === 2 ? 'selected' : ''}>翌々月</option></select></div>
        <div class="frow"><label id="ae-limLbl">信用額度${wantsTwd(a) && a.currency === 'JPY' ? '（台幣）' : ''}</label><input id="ae-limit" inputmode="numeric" placeholder="例：${wantsTwd(a) && a.currency === 'JPY' ? '200000' : '500000'}" value="${Number(a.limit) || ''}"></div>
      </div>
      <div class="sec-note">日本的卡請設定結帳日與扣款日：首頁會顯示下一次的繳款金額（例：10 月消費在 11/27 扣款），以及可用額度＝總額度 − 還沒扣款的帳單 − 之後的分期。各家規則以卡片 App 或會員網站為準。</div>
    </div>
    <div class="set-h">收據自動對應</div>
    <div class="form-group">
      <div class="frow" id="ae-l4Row"><label>卡號末 4 碼</label><div class="tagbox" id="ae-l4" data-kind="l4"></div></div>
      <div class="frow"><label>付款方式</label><div class="tagbox" id="ae-keys" data-kind="key"></div></div>
    </div>
    <div class="sec-note">收據上印的卡號末 4 碼或付款方式（例：楽天ペイ、iD、Apple Pay）符合時，AI 辨識會自動記到這個帳戶，都可以加好幾組。${builtinKeys(a).length ? '灰色的是內建關鍵字。' : ''}</div>
    <div id="ae-twdBox" class="${(a.currency || 'JPY') === 'JPY' ? '' : 'hidden'}">
      <div class="form-group"><div class="frow"><div class="grow">台灣發行的卡<small>日幣消費旁邊備註當天匯率換算的台幣</small></div><label class="switch"><input type="checkbox" id="ae-twd" ${wantsTwd(a) ? 'checked' : ''}><span></span></label></div>
        <div class="frow" id="ae-dispRow"><label>顯示幣別</label><select id="ae-disp"><option value="">日幣（記帳用的金額）</option><option value="TWD" ${dispCur(a) === 'TWD' ? 'selected' : ''}>台幣（依消費日匯率換算）</option></select></div></div>
      <div class="sec-note">選台幣時，首頁、帳戶明細、本期已使用與額度都用台幣顯示，每筆依消費日當天匯率換算；記帳仍然用日幣。台灣的卡信用額度請填台幣。</div>
    </div>
    <div class="sec-note">改餘額會調整期初餘額，讓目前餘額等於你輸入的數字（校正）。${a.type === '信用卡' ? '信用卡請填未繳金額的負數。' : ''}${n ? '<br>這個帳戶有 ' + n + ' 筆紀錄，改名稱時紀錄會一起更新。' : ''}</div>
    <button class="btn" id="ae-save">${icon('check')}儲存</button>
    <div class="form-group" style="margin-top:16px"><button class="acc-row" id="ae-view"><span class="acc-ic">${icon('doc')}</span><span class="nm"><b>查看明細</b><small>${n} 筆紀錄</small></span><span class="chev">›</span></button></div>
    <button class="btn danger" id="ae-del" style="margin-top:8px">${icon('trash')}刪除帳戶</button>`, 'acc');
  $('#ae-type').onchange = async e => {
    if (e.target.value === '__new') { const t = await addTag(); $('#ae-type').innerHTML = typeOptions(t || a.type); }
    $('#ae-cardBox').classList.toggle('hidden', $('#ae-type').value !== '信用卡');
  };
  $('#ae-cur').onchange = () => $('#ae-twdBox').classList.toggle('hidden', $('#ae-cur').value !== 'JPY');
  tagBox($('#ae-l4'), last4Of(a), [], v => /^\d{4}$/.test(v) ? v : (toast('請輸入 4 位數字'), null), '例：1234');
  tagBox($('#ae-keys'), splitTags(a.payKeys), builtinKeys(a), v => v.slice(0, 30), '例：楽天ペイ');
  $('#ae-preset').onchange = () => { const v = $('#ae-preset').value; if (!v) return; const [c, p, m] = v.split('|'); $('#ae-close').value = c; $('#ae-pay').value = p; $('#ae-payMon').value = m; };
  const updDisp = () => { $('#ae-dispRow').classList.toggle('hidden', !$('#ae-twd').checked); $('#ae-limLbl').textContent = '信用額度' + ($('#ae-twd').checked && $('#ae-cur').value === 'JPY' ? '（台幣）' : ''); };
  $('#ae-twd').onchange = updDisp; updDisp();
  $('#ae-save').onclick = () => saveAccountEdit(name);
  $('#ae-view').onclick = () => { closeSheet('set'); setTimeout(() => openAccount(name), 150); };
  $('#ae-del').onclick = () => deleteAccountPane(name);
}
async function renameLocal(from, to) {
  S.meta.accounts.forEach(a => { if (a.name === from) a.name = to; });
  for (const t of await DB.all('tx')) {
    let ch = false;
    if (t.account === from) { t.account = to; ch = true; }
    if (t.toAccount === from) { t.toAccount = to; ch = true; }
    if (ch) await DB.put('tx', t);
  }
  Object.keys(S.prefs.lastAcc || {}).forEach(k => { if (S.prefs.lastAcc[k] === from) S.prefs.lastAcc[k] = to; });
  await persist('prefs');
}
async function saveAccountEdit(name) {
  const a = S.meta.accounts.find(x => x.name === name); if (!a) return;
  const nn = $('#ae-name').value.trim(), type = $('#ae-type').value, cur = $('#ae-cur').value;
  if (!nn) return toast('名稱不可空白');
  if (nn !== name && S.meta.accounts.some(x => x.name === nn)) return toast('已有同名帳戶');
  const actual = parseAmt($('#ae-bal').value);
  if (isNaN(actual)) return toast('餘額格式錯誤');
  const before = balances().list.find(x => x.name === name).balance;
  if (nn !== name) { await renameLocal(name, nn); await DB.put('ops', { op: 'accountRename', from: name, to: nn }); }
  a.type = type; if (!$('#ae-cur').disabled) a.currency = cur;
  if (Math.abs(actual - before) > 0.005) a.initial = Math.round(((Number(a.initial) || 0) + actual - before) * 100) / 100;
  const limit = parseAmt($('#ae-limit').value);
  if (type === '信用卡') { a.closeDay = Number($('#ae-close').value) || 0; a.limit = limit > 0 ? Math.round(limit) : 0; a.payDay = Number($('#ae-pay').value) || 0; a.payMonth = Number($('#ae-payMon').value) === 2 ? 2 : 1; }
  // 台幣換算：和預設（名稱含 Richart）一樣就不另外記
  const twdWant = a.currency === 'JPY' && $('#ae-twd').checked;
  const twdDef = a.currency === 'JPY' && /richart/i.test(nn);
  a.showTwd = twdWant === twdDef ? '' : twdWant ? '1' : '0';
  a.dispCur = twdWant && $('#ae-disp').value === 'TWD' ? 'TWD' : '';
  a.last4 = tagVals($('#ae-l4')).join(',');
  a.payKeys = tagVals($('#ae-keys')).join(',');
  S.prefs.accCur = S.prefs.accCur || {}; S.prefs.accCur[nn] = a.dispCur; persist('prefs');
  await persist('meta');
  await DB.put('ops', { op: 'accountUpdate', account: { name: nn, type: a.type, initial: a.initial, closeDay: a.closeDay || 0, limit: a.limit || 0, showTwd: a.showTwd, dispCur: a.dispCur, payDay: a.payDay || 0, payMonth: a.payMonth || 1, last4: a.last4, payKeys: a.payKeys } });
  await reload();
  toast('✓ 已儲存'); renderPage(); renderSync(); sync();
  renderAccMgr(); fillSetNav(); editAccountPane(nn);
  if (wantsTwd(a)) setTimeout(fillTwdAll, 500);
}
function deleteAccountPane(name) {
  const n = S.txs.filter(t => t.account === name || t.toAccount === name).length;
  const others = S.meta.accounts.filter(x => x.name !== name);
  showDyn('刪除「' + name + '」', n ? `
    <div class="card"><b>這個帳戶還有 ${n} 筆紀錄</b><div class="sec-note" style="margin:6px 0 0">請選擇紀錄要怎麼處理：</div></div>
    <div class="set-h" style="margin-top:6px">移到其他帳戶後刪除（建議）</div>
    <div class="form-group"><div class="frow"><label>移到</label><select id="ad-to">${others.map(x => `<option value="${esc(x.name)}">${esc(x.name)}</option>`).join('')}</select></div></div>
    <button class="btn sec" id="ad-move">移轉 ${n} 筆紀錄並刪除帳戶</button>
    <div class="set-h">連同紀錄一起刪除</div>
    <button class="btn danger" id="ad-all">${icon('trash')}刪除帳戶和 ${n} 筆紀錄</button>
    <div class="sec-note" style="margin-top:8px">振替紀錄只要有一邊是這個帳戶，就會整筆刪除。試算表上的資料也會一起刪除，無法復原。</div>`
    : `<div class="card"><b>確定刪除帳戶「${esc(name)}」？</b><div class="sec-note" style="margin:6px 0 0">這個帳戶沒有任何紀錄。</div></div><button class="btn danger" id="ad-empty">${icon('trash')}刪除帳戶</button>`, 'acc');
  const done = async (msg) => { await reload(); toast(msg); renderPage(); renderSync(); sync(); renderAccMgr(); fillSetNav(); showPane('acc'); };
  if ($('#ad-empty')) $('#ad-empty').onclick = async () => {
    S.meta.accounts = S.meta.accounts.filter(x => x.name !== name); await persist('meta');
    await DB.put('ops', { op: 'accountDelete', name }); await done('已刪除帳戶');
  };
  if ($('#ad-move')) $('#ad-move').onclick = async () => {
    const to = $('#ad-to').value; if (!to) return;
    if (!confirm(`把 ${n} 筆紀錄移到「${to}」，並刪除「${name}」？`)) return;
    for (const t of await DB.all('tx')) {
      let ch = false;
      if (t.account === name) { t.account = to; ch = true; }
      if (t.toAccount === name) { t.toAccount = to; ch = true; }
      if (ch) await DB.put('tx', t);
    }
    S.meta.accounts = S.meta.accounts.filter(x => x.name !== name); await persist('meta');
    await DB.put('ops', { op: 'accountDelete', name, moveTo: to }); await done(`✓ 已移轉到「${to}」並刪除帳戶`);
  };
  if ($('#ad-all')) $('#ad-all').onclick = async () => {
    if (!confirm(`刪除「${name}」和 ${n} 筆紀錄？試算表上的資料也會刪除，無法復原。`)) return;
    for (const t of await DB.all('tx')) if (t.account === name || t.toAccount === name) await DB.del('tx', t.id);
    S.meta.accounts = S.meta.accounts.filter(x => x.name !== name); await persist('meta');
    await DB.put('ops', { op: 'accountDelete', name, deleteTx: true }); await done('已刪除帳戶與紀錄');
  };
}
function newAccountPane(tag) {
  showDyn('新增帳戶', `<div class="form-group">
      <div class="frow"><label>名稱</label><input id="na-name" placeholder="例：樂天卡、dポイント"></div>
      <div class="frow"><label>標籤</label><select id="na-type">${typeOptions(tag || '銀行')}</select></div>
      <div class="frow"><label>幣別</label><select id="na-cur"><option value="JPY">日圓 JPY</option><option value="TWD">台幣 TWD</option></select></div>
      <div class="frow"><label>目前餘額</label><input id="na-init" type="text" inputmode="decimal" placeholder="信用卡填未繳金額的負數"></div>
    </div><div class="sec-note">Point卡請填點數換算的金額（1 點 = 1 圓就直接填點數）。</div>
    <button class="btn" id="na-add">${icon('check')}新增帳戶</button>`, 'acc');
  $('#na-type').onchange = async e => { if (e.target.value !== '__new') return; const t = await addTag(); $('#na-type').innerHTML = typeOptions(t || '銀行'); };
  $('#na-add').onclick = addAccount;
  setTimeout(() => $('#na-name').focus(), 300);
}
async function testConn() {
  S.conn = { url: $('#c-url').value.trim(), token: $('#c-token').value.trim() };
  await persist('conn');
  if (!S.conn.url) return toast('請貼上 API 網址');
  busy(true, '連線中…');
  try {
    await api('ping', {}, 30000);
    busy(false);
    await sync(true);
    try { S.reports = await api('reports'); persist('reports'); } catch (e) {}
    openSettings();
  } catch (e) { busy(false); toast('連線失敗：' + e.message, 5000); $('#c-state').textContent = '連線失敗：' + e.message; }
}
async function saveAI() {
  if (!canOnline()) return toast('需要連線才能儲存 AI 設定');
  busy(true, '儲存中…');
  try {
    const s = await api('saveSettings', { settings: { provider: $('#ai-prov').value, apiKey: $('#ai-key').value, model: $('#ai-model').value.trim(), placesKey: $('#ai-places').value, emailReports: $('#ai-email').checked } });
    S.meta.settings = s; await persist('meta');
    $('#ai-key').value = ''; $('#ai-places').value = '';
    toast('✓ 已儲存，開始測試…'); busy(false); closeSheet('set'); return runDiag();
  } catch (e) { toast(e.message, 4000); }
  busy(false);
}
async function addAccount() {
  const name = $('#na-name').value.trim();
  if (!name) return toast('請輸入帳戶名稱');
  if (S.meta.accounts.some(a => a.name === name)) return toast('名稱已存在');
  const a = { name, type: $('#na-type').value, currency: $('#na-cur').value, initial: parseAmt($('#na-init').value) || 0 };
  S.meta.accounts.push(a); await persist('meta');
  await DB.put('ops', { op: 'account', account: a }); await reload();
  $('#na-name').value = ''; $('#na-init').value = '';
  toast('✓ 已新增帳戶'); renderPage(); sync(); renderAccMgr(); fillSetNav(); showPane('acc');
}

// ---------- 事件 ----------
function bind() {
  $('#tabbar').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tab === 'add') { if (fabLong) { fabLong = false; return; } return aiMenu(); }
    go(b.dataset.tab);
  };
  bindFab(); bindSwipePages();
  $$('[data-goto]').forEach(b => b.onclick = () => go(b.dataset.goto));
  $$('[data-close]').forEach(b => b.onclick = () => closeSheet(b.dataset.close));
  ['entry', 'store', 'detail', 'set', 'acc', 'trip'].forEach(n => $('#scrim-' + n).onclick = () => closeSheet(n));
  $('#btnSettings').onclick = () => openSettings();
  $('#lnkAccMgr').onclick = () => openSettings(true);
  $('#syncPill').onclick = () => S.conn.url ? sync(true) : openSettings();
  $$('.quick button').forEach(b => b.onclick = () => {
    const q = b.dataset.q;
    if (q === 'scan') startScan();
    if (q === 'manual') openEntry();
    if (q === 'atm') openEntry({ type: '振替', category: '提款' });
    if (q === 'card') openEntry({ type: '振替', category: '信用卡繳費' });
  });
  // 記帳
  $('#e-type').onclick = e => { const b = e.target.closest('button'); if (b) setType(b.dataset.t); };
  $('#e-cur').onclick = () => setCurrency(E.currency === 'JPY' ? 'TWD' : 'JPY');
  $('#e-amount').oninput = onAmountInput;
  // 有選 10%／8% 時，點金額欄會顯示稅前金額（全選方便直接改），離開欄位後再顯示含稅總額
  $('#e-amount').onfocus = () => { if (E.type === '支出' && E.tax !== 'in' && !hasItemAmounts()) { $('#e-amount').value = E.taxBase || ''; setTimeout(() => $('#e-amount').select(), 0); } };
  $('#e-amount').onblur = () => { if (E.type === '支出' && E.tax !== 'in' && !hasItemAmounts()) applyTotals(); };
  $$('#e-tax [data-tx]').forEach(b => b.onclick = () => onTaxBtn(b.dataset.tx));
  $('#e-inst').onchange = updInst;
  $('#l-q').oninput = onSearchInput;
  $$('#l-view [data-lv]').forEach(b => b.onclick = () => { S.listView = b.dataset.lv; S.prefs.listView = S.listView; persist('prefs'); renderList(); });
  $('#l-q').onkeydown = e => { if (e.key === 'Escape') { e.stopPropagation(); $('#l-q').value = ''; onSearchInput(); $('#l-q').blur(); } if (e.key === 'Enter') $('#l-q').blur(); };
  $('#l-qx').onclick = () => { $('#l-q').value = ''; onSearchInput(); $('#l-q').focus(); };
  $('#btnSearch').onclick = focusSearch;
  $('#drill-back').onclick = drillBack;
  $('#scrim-drill').onclick = () => closeSheet('drill');
  $('#e-date').onchange = () => { updateConv(); if ($('#e-trip').checked && $('#e-tripSel').value !== '__new') fillTripSel($('#e-tripSel').value); };
  $('#e-trip').onchange = onTripChange;
  $('#e-tripSel').onchange = onTripSel;
  $('#e-daily').onchange = () => { E.dailyTouched = true; onDailyChange(); };
  $('#e-sub').oninput = onCatChange;
  $('#e-subSel').onchange = () => {
    const sel = $('#e-subSel');
    if (sel.value === '__new') { const v = askNewSub(E.category); if (v) $('#e-sub').value = v; fillSubList(); }
    else $('#e-sub').value = sel.value;
    onCatChange();
  };
  $('#e-unit').oninput = () => fuelCalc('unit'); $('#e-liters').oninput = () => fuelCalc('liters'); $('#e-odo').oninput = () => fuelCalc('odo');
  $$('[data-car]').forEach(b => b.onclick = () => openEntry({ type: '支出', category: cats('支出').some(c => c.name === '汽車') ? '汽車' : undefined, sub: b.dataset.car }));
  $('#c-range').onclick = e => { const b = e.target.closest('button'); if (!b) return; S.carRange = b.dataset.r; renderCar(); };
  $('#a-seg').onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.a === 'rep') return go('rep'); S.anaMode = b.dataset.a; renderAna(); };
  $$('[data-goana]').forEach(b => b.onclick = () => { S.anaMode = b.dataset.goana; go('ana'); });
  $('#mf-btn').onclick = () => $('#mf-file').click();
  $('#rec-btn').onclick = () => { closeSheet('set'); startReconcile(); };
  $('#f-stmt').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) onStatementFile(f); };
  $('#mf-file').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) startMFImport(f); };
  $('#e-acc').onchange = onAccChange; $('#e-to').onchange = onAccChange;
  $('#e-cam').onclick = startScan;
  $('#f-cam').onchange = onPhoto;
  $('#f-pick').onchange = onPhoto;
  $$('[data-act]').forEach(b => b.onclick = () => {
    const a = b.dataset.act;
    if (a === 'new') openEntry(); if (a === 'scan') startScan(); if (a === 'settings') openSettings();
  });
  $$('.side-nav [data-tab]').forEach(b => b.onclick = () => go(b.dataset.tab));
  // 拖曳 / 貼上收據（iPad 分割畫面、Mac）
  let dragN = 0;
  const hasFile = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
  window.addEventListener('dragenter', e => { if (!hasFile(e)) return; e.preventDefault(); dragN++; $('#dropZone').classList.add('on'); });
  window.addEventListener('dragover', e => { if (hasFile(e)) e.preventDefault(); });
  window.addEventListener('dragleave', e => { if (!hasFile(e)) return; if (--dragN <= 0) { dragN = 0; $('#dropZone').classList.remove('on'); } });
  window.addEventListener('drop', e => {
    if (!hasFile(e)) return;
    e.preventDefault(); dragN = 0; $('#dropZone').classList.remove('on');
    const fs = [...e.dataTransfer.files].filter(x => /^image\/|application\/pdf/.test(x.type));
    if (fs.length) handleReceiptFiles(fs); else toast('請拖曳收據圖片或 PDF');
  });
  document.addEventListener('paste', e => {
    const its = [...(e.clipboardData ? e.clipboardData.items : [])].filter(x => x.kind === 'file' && /^image\/|application\/pdf/.test(x.type));
    if (!its.length) return;
    e.preventDefault(); hideClipPill(); S.pickAcc = ''; handleReceiptFiles(its.map(x => x.getAsFile()));
  });
  // 鍵盤快捷鍵（Mac、iPad 外接鍵盤）
  document.addEventListener('keydown', e => {
    const open = ['store', 'detail', 'entry', 'set', 'acc', 'drill'].filter(n => $('#sh-' + n).classList.contains('on'));
    if (e.key === 'Escape') { if (open.length) { e.preventDefault(); closeSheet(open[0]); } return; }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && open[0] === 'entry') { e.preventDefault(); saveEntry(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === ',') { e.preventDefault(); openSettings(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f' && !open.length) { e.preventDefault(); focusSearch(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
    if (typing || e.metaKey || e.ctrlKey || e.altKey || open.length) return;
    const k = e.key.toLowerCase();
    if (k === '/' ) { e.preventDefault(); focusSearch(); }
    else if (k === 'n' || k === '+') { e.preventDefault(); openEntry(); }
    else if (k === 'r') { e.preventDefault(); startScan(); }
    else if (k === 's') sync(true);
    else if ('12345'.includes(k) && k) go(['home', 'list', 'ana', 'rep', 'car'][Number(k) - 1]);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const n = e.key === 'ArrowLeft' ? -1 : 1;
      if (S.page === 'list') { S.listMonth = addMonths(S.listMonth, n); renderList(); }
      if (S.page === 'ana') { S.anaMonth = addMonths(S.anaMonth, n); renderAna(); }
      if (S.page === 'rep') $(`[data-rmv="${n}"]`).click();
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') && S.page === 'list' && isWide()) {
      const rows = $$('#l-list .tx'); if (!rows.length) return;
      e.preventDefault();
      let i = rows.findIndex(b => b.dataset.id === S.selTx);
      if (e.key === 'Enter') { const t = S.txs.find(x => x.id === S.selTx); if (t) openEntry({ tx: t }); return; }
      i = Math.max(0, Math.min(rows.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)));
      openDetail(rows[i].dataset.id); rows[i].scrollIntoView({ block: 'nearest' });
    }
  });
  $('#e-addItem').onclick = () => addItemRow();
  $('#e-save').onclick = saveEntry;
  $('#e-del').onclick = async () => {
    if (!E.editId || !confirm('確定刪除這筆紀錄？')) return;
    await localDeleteTx(E.editId); closeSheet('entry'); S.selTx = null; renderPage(); renderSync(); toast('已刪除'); sync();
  };
  $('#e-storeSearch').onclick = openStoreSearch;
  $('#e-store').oninput = showStoreExtra;
  $('#e-store').onchange = () => {
    const s = (S.meta.stores || []).find(x => x.name === $('#e-store').value.trim());
    if (s) { if (!$('#e-addr').value) $('#e-addr').value = s.address || ''; if (!$('#e-phone').value) $('#e-phone').value = s.phone || ''; }
  };
  // 店家
  let sqT;
  $('#s-q').oninput = () => { clearTimeout(sqT); sqT = setTimeout(() => renderStoreLocal(), 120); };
  $('#s-q').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); searchOnline(); } };
  $('#s-near').onchange = () => { S.prefs.near = $('#s-near').checked; persist('prefs'); };
  // 明細
  $$('[data-mv]').forEach(b => b.onclick = () => { S.listMonth = addMonths(S.listMonth, Number(b.dataset.mv)); renderList(); });
  $('#l-chips').onclick = e => {
    const b = e.target.closest('.chip[data-f]'); if (!b) return;
    S.listFilter = b.dataset.f; $$('#l-chips .chip[data-f]').forEach(x => x.classList.toggle('on', x === b)); renderList();
  };
  $('#l-acc').onchange = e => { S.listAcc = e.target.value; renderList(); };
  $$('[data-amv]').forEach(b => b.onclick = () => { S.anaMonth = addMonths(S.anaMonth, Number(b.dataset.amv)); renderAna(); });
  // 報告
  $('#r-seg').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    S.rType = b.dataset.r; S.rRef = today(); $$('#r-seg button').forEach(x => x.classList.toggle('on', x === b));
    $('#r-out').innerHTML = ''; renderRep();
  };
  $$('[data-rmv]').forEach(b => b.onclick = () => {
    const n = Number(b.dataset.rmv);
    S.rRef = S.rType === 'week' ? addDays(S.rRef, 7 * n) : cycleRange(addMonths(cycleKey(S.rRef), n)).from;
    $('#r-out').innerHTML = ''; renderRep();
  });
  $('#r-gen').onclick = genReport;
  // 設定
  $('#c-test').onclick = testConn;
  $('#ai-save').onclick = saveAI;
  $('#ai-test').onclick = runDiag;
  $('#acc-new').onclick = () => newAccountPane(S.mgrTab !== '全部' ? S.mgrTab : '');
  $$('.set-item').forEach(b => b.onclick = () => showPane(b.dataset.pane));
  $('#set-back').onclick = () => S.setPane === 'dyn' ? showPane(S.dynBack) : showPane(null);
  $('#acc-edit').onclick = () => { const n = S.accView && S.accView.name; closeSheet('acc'); if (n) setTimeout(() => openSettings({ edit: n }), 200); };
  { let x0 = null; const d = $('#sh-acc');
    d.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    d.addEventListener('touchend', e => { if (x0 != null && e.changedTouches[0].clientX - x0 < -70) closeSheet('acc'); x0 = null; }, { passive: true }); }
  $('#tag-new').onclick = async () => { const t = await addTag(); if (t) { S.mgrTab = t; renderAccMgr(); } };
  $('#lnkAccAdd').onclick = () => openAccountEditor(S.accTab !== '全部' ? S.accTab : '');
  $('#ms-day').onchange = e => setMonthStart(e.target.value);
  $('#catMgrSeg').onclick = e => { const b = e.target.closest('button'); if (!b) return; S.catMgrType = b.dataset.ct; renderCatMgr(); };
  $('#nc-add').onclick = async () => { if (await addCategory(S.catMgrType || '支出', $('#nc-name').value, $('#nc-icon').dataset.v)) { $('#nc-name').value = ''; renderCatMgr(); } };
  $('#nc-pick').innerHTML = iconPicker('nc-icon'); bindPicker($('#nc-pick'));
  $('#p-queue').onchange = e => { S.prefs.queuePhotos = e.target.checked; persist('prefs'); };
  $('#o-sheet').onclick = () => S.meta.sheetUrl ? window.open(S.meta.sheetUrl, '_blank') : toast('請先連線');
  $('#o-sync').onclick = () => sync(true);
  $('#o-reset').onclick = async () => {
    if (!confirm('會刪除這支手機上的所有資料（含未同步的紀錄），試算表上的資料不受影響。確定？')) return;
    DB.db.close(); indexedDB.deleteDatabase('kakeibo'); location.reload();
  };
  window.addEventListener('online', () => { renderSync(); sync(); });
  window.addEventListener('offline', renderSync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { renderPage(); sync(); } });
  let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (S.page === 'ana' || S.page === 'list') renderPage(); }, 200); });
  setInterval(() => { if (pendingCount()) sync(); }, 5 * 60 * 1000);
}

// ---------- 啟動 ----------
async function boot() {
  hydrate();
  if (!isTouch()) {
    $$('.scan-lbl').forEach(x => x.textContent = '上傳收據／截圖');
    const q = $('.quick [data-q=scan]'); if (q) q.lastChild.textContent = '上傳辨識';
    if (!isMac) $$('.drop-hint kbd').forEach((k, i) => { if (i === 0) k.textContent = 'Ctrl'; });
  }
  await DB.open();
  for (const k of ['conn', 'prefs', 'meta', 'rates', 'reports', 'lastSync']) {
    const v = await DB.get('kv', k);
    if (v != null) S[k] = k === 'prefs' ? Object.assign(S.prefs, v) : v;
  }
  await reload();
  S.listMonth = S.anaMonth = cycleKey(today());
  bind();
  renderSync(); renderPage();
  if (!NATIVE && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  if (NATIVE) document.documentElement.classList.add('native');
  sync();
  if (!canOnline()) setTimeout(fillTwdAll, 1500);
  setTimeout(checkClipPill, 1200);
  window.addEventListener('focus', () => setTimeout(checkClipPill, 300));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(checkClipPill, 400); });
  const qs = new URLSearchParams(location.search);
  if (qs.has('new') || qs.has('scan')) { history.replaceState(null, '', location.pathname); openEntry(); if (qs.has('scan')) toast('按右上相機圖示拍收據'); }
}
boot();
