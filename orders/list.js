/* ===== 고객 주문 내역 목록 ===== */
const { $, formatPrice, formatDateTime, escapeHtml, getOrders, ORDER_STATUS } =
  window.CafeUtils;

const root = $("#ordersRoot");

/** 주문 1건의 상태 뱃지 마크업 */
function statusBadge(status) {
  const s = ORDER_STATUS[status] || { label: status, color: "info" };
  return `<span class="status status--${s.color}">${escapeHtml(s.label)}</span>`;
}

/** 주문 아이템 라인 마크업 */
function itemLines(items) {
  return items
    .map(
      (it) => `
      <div class="order-line">
        <span class="order-line__name">${escapeHtml(it.name)}<span class="qty">× ${it.qty}</span></span>
        <span class="order-line__price">${formatPrice(it.price * it.qty)}</span>
      </div>`
    )
    .join("");
}

/** 전체 렌더 */
function render() {
  const orders = getOrders(); // 최신순 (checkout 시 unshift)

  if (orders.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🧾</div>
        <p>아직 주문 내역이 없어요.</p>
        <a href="../menus/list.html" class="btn btn--primary" style="margin-top:1rem">메뉴 보러가기</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="orders-list">
      ${orders
        .map(
          (o) => `
        <article class="card order-card">
          <div class="order-card__top">
            <div class="order-card__meta">
              <span class="order-card__no">주문 ${escapeHtml(o.id)}</span>
              <span class="order-card__date">${formatDateTime(o.createdAt)}</span>
            </div>
            ${statusBadge(o.status)}
          </div>
          <div class="order-card__items">${itemLines(o.items)}</div>
          <div class="order-card__foot">
            <span class="label">결제 금액</span>
            <span class="order-card__total">${formatPrice(o.total)}</span>
          </div>
        </article>`
        )
        .join("")}
    </div>`;
}

render();
