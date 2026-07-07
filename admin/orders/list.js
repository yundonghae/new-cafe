/* ===== 관리자 주문 목록 ===== */
const { $, $$, formatPrice, formatDateTime, escapeHtml, showToast, ORDER_STATUS, getOrders, updateOrderStatus } =
  window.CafeUtils;

const state = { status: "all" };

function summarizeItems(items) {
  const first = items[0];
  const rest = items.length - 1;
  return rest > 0 ? `${first.name} 외 ${rest}건` : first.name;
}

function renderChips() {
  const chips = [
    { id: "all", label: "전체" },
    ...Object.entries(ORDER_STATUS).map(([id, s]) => ({ id, label: s.label })),
  ];
  $("#statusChips").innerHTML = chips
    .map(
      (c) => `<button class="chip ${c.id === state.status ? "is-active" : ""}" data-status="${c.id}">${escapeHtml(c.label)}</button>`
    )
    .join("");
}

function renderOrders() {
  const orders = getOrders().filter((o) => state.status === "all" || o.status === state.status);
  $("#orderCount").textContent = `전체 ${orders.length}건`;

  const root = $("#orderList");
  if (orders.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🧾</div>
        <p>해당하는 주문이 없어요.</p>
      </div>`;
    return;
  }

  root.innerHTML = orders
    .map((o) => {
      const options = Object.entries(ORDER_STATUS)
        .map(([id, s]) => `<option value="${id}" ${id === o.status ? "selected" : ""}>${escapeHtml(s.label)}</option>`)
        .join("");
      return `
      <article class="card order-row">
        <a class="order-row__main" href="detail.html?id=${o.id}">
          <span class="order-row__id">${escapeHtml(o.id)}</span>
          <span class="order-row__summary">${escapeHtml(summarizeItems(o.items))}</span>
          <span class="order-row__time">${formatDateTime(o.createdAt)}</span>
        </a>
        <span class="order-row__total">${formatPrice(o.total)}</span>
        <select class="select order-row__status" data-status-select="${o.id}">${options}</select>
      </article>`;
    })
    .join("");
}

function render() {
  renderChips();
  renderOrders();
}

$("#statusChips").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-status]");
  if (!btn) return;
  state.status = btn.dataset.status;
  render();
});

$("#orderList").addEventListener("change", (e) => {
  const select = e.target.closest("[data-status-select]");
  if (!select) return;
  updateOrderStatus(select.dataset.statusSelect, select.value);
  showToast("주문 상태를 변경했어요.", "success");
  renderOrders();
});

render();
