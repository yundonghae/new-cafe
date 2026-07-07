/* ===== 관리자 대시보드 ===== */
const { $, formatPrice, formatDateTime, escapeHtml, ORDER_STATUS, getOrders } = window.CafeUtils;
const Data = window.CafeData;

function isToday(iso) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function renderStats() {
  const menus = Data.getMenus();
  const orders = getOrders();
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const todaySales = orders
    .filter((o) => o.status !== "canceled" && isToday(o.createdAt))
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "오늘 매출", value: formatPrice(todaySales), emoji: "💰" },
    { label: "대기 중인 주문", value: `${pendingCount}건`, emoji: "🧾" },
    { label: "전체 메뉴", value: `${menus.length}개`, emoji: "📋" },
    { label: "품절 메뉴", value: `${menus.filter((m) => m.soldOut).length}개`, emoji: "🚫" },
  ];

  $("#statGrid").innerHTML = stats
    .map(
      (s) => `
    <div class="card stat-card">
      <span class="stat-card__emoji">${s.emoji}</span>
      <div>
        <p class="stat-card__label">${s.label}</p>
        <p class="stat-card__value">${s.value}</p>
      </div>
    </div>`
    )
    .join("");
}

function renderRecentOrders() {
  const orders = getOrders().slice(0, 5);
  const root = $("#recentOrders");

  if (orders.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🧾</div>
        <p>아직 주문이 없어요.</p>
      </div>`;
    return;
  }

  root.innerHTML = orders
    .map((o) => {
      const status = ORDER_STATUS[o.status] ?? ORDER_STATUS.pending;
      return `
      <a class="card order-row" href="orders/detail.html?id=${o.id}">
        <span class="order-row__id">${escapeHtml(o.id)}</span>
        <span class="order-row__time">${formatDateTime(o.createdAt)}</span>
        <span class="order-row__total">${formatPrice(o.total)}</span>
        <span class="badge badge--${status.color}">${status.label}</span>
      </a>`;
    })
    .join("");
}

renderStats();
renderRecentOrders();
