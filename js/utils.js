const CART_KEY = "cafe-app:cart";
const ORDERS_KEY = "cafe-app:orders";

function formatPrice(amount) {
  return amount.toLocaleString("ko-KR") + "원";
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(menuId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.menuId === menuId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ menuId, quantity });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(menuId) {
  const cart = getCart().filter((item) => item.menuId !== menuId);
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}

function getOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
}

function createOrder(items) {
  const orders = getOrders();
  const order = {
    id: Date.now(),
    items,
    createdAt: new Date().toISOString(),
    status: "접수됨",
  };
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
}
