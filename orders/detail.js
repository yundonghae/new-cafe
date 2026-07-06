const { $, formatPrice, formatDateTime, escapeHtml, getParam, ORDER_STATUS, getOrderById } = window.CafeUtils;

const root = $("#orderDetailRoot");

function render() {
  const order = getOrderById(getParam("id"));

  if (!order) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🧾</div>
        <p>주문을 찾을 수 없어요.</p>
        <a href="list.html" class="btn btn--primary" style="margin-top:1rem">주문 내역으로</a>
      </div>`;
    return;
  }

  const status = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;

  const rows = order.items
    .map(
      (item) => `
    <article class="card order-line">
      <div class="order-line__info">
        <span class="order-line__name">${escapeHtml(item.name)}</span>
        <span class="order-line__unit">${formatPrice(item.price)} × ${item.qty}개</span>
      </div>
      <span class="order-line__amount">${formatPrice(item.price * item.qty)}</span>
    </article>`
    )
    .join("");

  root.innerHTML = `
    <section class="order-summary card">
      <div class="order-summary__row">
        <span>주문번호</span><span>${escapeHtml(order.id)}</span>
      </div>
      <div class="order-summary__row">
        <span>주문일시</span><span>${formatDateTime(order.createdAt)}</span>
      </div>
      <div class="order-summary__row">
        <span>상태</span><span class="badge badge--${status.color}">${status.label}</span>
      </div>
    </section>

    <div class="order-line-list">${rows}</div>

    <section class="card order-total">
      <span>총 금액</span>
      <span class="amount">${formatPrice(order.total)}</span>
    </section>`;
}

render();
