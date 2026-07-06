/* ============================================
   ☕ 카페 앱 - 공통 유틸리티
   포맷 · 장바구니 · 주문 · 토스트 · DOM 헬퍼
   data.js 의 CafeData / STORAGE_KEYS 에 의존한다.
   ============================================ */

const KEYS = window.CafeData.STORAGE_KEYS;

/* ============================================
   포맷
   ============================================ */

/** 3,000원 형태의 통화 문자열 */
function formatPrice(value) {
  return (Number(value) || 0).toLocaleString("ko-KR") + "원";
}

/** 2026. 07. 06 형태의 날짜 */
function formatDate(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** 2026. 07. 06 14:30 형태의 날짜+시간 */
function formatDateTime(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d)) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(d)} ${hh}:${mm}`;
}

/* ============================================
   DOM 헬퍼
   ============================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** 위험 문자 이스케이프 (사용자 입력 렌더 시) */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

/** URL 쿼리 파라미터 값 */
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

/* ============================================
   토스트
   ============================================ */

function showToast(message, type = "default", duration = 2200) {
  let container = $(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (type !== "default" ? ` toast--${type}` : "");
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity .3s, transform .3s";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================
   장바구니
   구조: [{ menuId, qty }]
   ============================================ */

function getCart() {
  return JSON.parse(localStorage.getItem(KEYS.CART)) || [];
}

function saveCart(cart) {
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  updateCartBadges();
}

function addToCart(menuId, qty = 1) {
  const cart = getCart();
  const item = cart.find((i) => i.menuId === menuId);
  if (item) {
    item.qty += qty;
  } else {
    cart.push({ menuId, qty });
  }
  saveCart(cart);
  return cart;
}

function updateCartQty(menuId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.menuId === menuId);
  if (!item) return cart;
  item.qty = Math.max(1, qty);
  saveCart(cart);
  return cart;
}

function removeFromCart(menuId) {
  const cart = getCart().filter((i) => i.menuId !== menuId);
  saveCart(cart);
  return cart;
}

function clearCart() {
  localStorage.removeItem(KEYS.CART);
  updateCartBadges();
}

/** 장바구니 총 수량 */
function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

/** 메뉴 정보를 조인한 상세 라인 + 합계 반환 */
function getCartDetail() {
  const items = getCart()
    .map((i) => {
      const menu = window.CafeData.getMenuById(i.menuId);
      if (!menu) return null;
      return { ...i, menu, lineTotal: menu.price * i.qty };
    })
    .filter(Boolean);
  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, total, count: items.reduce((s, i) => s + i.qty, 0) };
}

/** [data-cart-badge] 요소에 현재 수량을 반영 */
function updateCartBadges() {
  const count = getCartCount();
  $$("[data-cart-badge]").forEach((el) => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

/* ============================================
   주문
   구조: { id, items:[{menuId,name,price,qty}], total,
           status, createdAt }
   status: pending | making | done | canceled
   ============================================ */

const ORDER_STATUS = {
  pending: { label: "접수 대기", color: "warning" },
  making: { label: "제조 중", color: "info" },
  done: { label: "완료", color: "success" },
  canceled: { label: "취소됨", color: "danger" },
};

function getOrders() {
  return JSON.parse(localStorage.getItem(KEYS.ORDERS)) || [];
}

function saveOrders(orders) {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

function getOrderById(id) {
  return getOrders().find((o) => o.id === id) || null;
}

/** 현재 장바구니를 주문으로 확정. 성공 시 주문 객체 반환, 빈 카트면 null */
function checkout() {
  const { items, total } = getCartDetail();
  if (items.length === 0) return null;
  const order = {
    id: "o-" + Date.now().toString(36),
    items: items.map((i) => ({
      menuId: i.menuId,
      name: i.menu.name,
      price: i.menu.price,
      qty: i.qty,
    })),
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  clearCart();
  return order;
}

/** 주문 상태 변경 (관리자) */
function updateOrderStatus(id, status) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  saveOrders(orders);
  return order;
}

/* ============================================
   사용자
   ============================================ */

function getUser() {
  return JSON.parse(localStorage.getItem(KEYS.USER)) || { name: "손님", point: 0, stamp: 0 };
}

/* ============================================
   수량 스텝퍼 (재사용 컴포넌트 마크업)
   호출: qtyStepperHtml(menuId, qty)
   ============================================ */

function qtyStepperHtml(id, qty) {
  return `
    <div class="qty-stepper" data-qty-stepper="${id}">
      <button class="qty-stepper__btn" data-qty-dec aria-label="수량 감소">−</button>
      <span class="qty-stepper__value" data-qty-value>${qty}</span>
      <button class="qty-stepper__btn" data-qty-inc aria-label="수량 증가">+</button>
    </div>`;
}

/* ============================================
   전역 노출
   ============================================ */

window.CafeUtils = {
  // 포맷
  formatPrice,
  formatDate,
  formatDateTime,
  // DOM
  $,
  $$,
  escapeHtml,
  getParam,
  // 토스트
  showToast,
  // 장바구니
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  getCartCount,
  getCartDetail,
  updateCartBadges,
  // 주문
  ORDER_STATUS,
  getOrders,
  getOrderById,
  checkout,
  updateOrderStatus,
  // 사용자
  getUser,
  // 컴포넌트
  qtyStepperHtml,
};

// 페이지 로드 시 배지 동기화
document.addEventListener("DOMContentLoaded", updateCartBadges);
