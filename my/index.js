/* ===== 고객 마이페이지 ===== */
const {
  $,
  formatPrice,
  formatDateTime,
  escapeHtml,
  getUser,
  getOrders,
  ORDER_STATUS,
  updateCartBadges,
} = window.CafeUtils;

const STAMP_GOAL = 10;
const root = $("#myRoot");

/** 주문 상태 뱃지 (orders 페이지와 동일 규칙) */
function statusBadge(status) {
  const s = ORDER_STATUS[status] || { label: status, color: "info" };
  return `<span class="status status--${s.color}">${escapeHtml(s.label)}</span>`;
}

/** 스탬프 10칸 마크업 (적립분은 ☕) */
function stampDots(count) {
  let dots = "";
  for (let i = 0; i < STAMP_GOAL; i++) {
    const filled = i < count;
    dots += `<span class="stamp ${filled ? "stamp--filled" : ""}">${filled ? "☕" : ""}</span>`;
  }
  return dots;
}

/** 주문 요약: "아메리카노 외 2건" */
function orderSummary(order) {
  const items = order.items || [];
  if (items.length === 0) return "주문";
  const more = items.length - 1;
  return more > 0 ? `${items[0].name} 외 ${more}건` : items[0].name;
}

function render() {
  const user = getUser();
  const orders = getOrders();
  const paidOrders = orders.filter((o) => o.status !== "canceled");
  const totalSpent = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const recent = orders.slice(0, 3);
  const stamp = user.stamp || 0;
  const remain = Math.max(0, STAMP_GOAL - stamp);

  root.innerHTML = `
    <section class="card profile glass">
      <div class="profile__avatar">👤</div>
      <div class="profile__text">
        <p class="profile__hello">안녕하세요,</p>
        <h2 class="profile__name">${escapeHtml(user.name)}님</h2>
      </div>
    </section>

    <section class="reward">
      <div class="card reward__tile">
        <span class="reward__label">보유 포인트</span>
        <strong class="reward__value">${(user.point || 0).toLocaleString("ko-KR")}<em>P</em></strong>
      </div>
      <div class="card reward__tile">
        <span class="reward__label">스탬프</span>
        <strong class="reward__value">${stamp}<em>/ ${STAMP_GOAL}</em></strong>
      </div>
    </section>

    <section class="card stamp-card">
      <div class="stamp-card__head">
        <span class="stamp-card__title">☕ 스탬프 적립</span>
        <span class="stamp-card__hint">${
          remain > 0 ? `${remain}개 더 모으면 무료 음료!` : "무료 음료 쿠폰 발급 가능!"
        }</span>
      </div>
      <div class="stamp-grid">${stampDots(stamp)}</div>
    </section>

    <section class="stats">
      <div class="card stat">
        <span class="stat__value">${paidOrders.length}</span>
        <span class="stat__label">총 주문</span>
      </div>
      <div class="card stat">
        <span class="stat__value">${formatPrice(totalSpent)}</span>
        <span class="stat__label">총 결제 금액</span>
      </div>
    </section>

    <section class="recent">
      <div class="recent__head">
        <h3>최근 주문</h3>
        <a class="recent__more" href="../orders/list.html">전체 보기 →</a>
      </div>
      ${
        recent.length === 0
          ? `<div class="empty-state"><div class="empty-state__icon">🧾</div><p>아직 주문 내역이 없어요.</p></div>`
          : `<div class="recent__list">${recent
              .map(
                (o) => `
        <a class="card recent-item" href="../orders/detail.html?id=${encodeURIComponent(o.id)}">
          <div class="recent-item__info">
            <span class="recent-item__summary">${escapeHtml(orderSummary(o))}</span>
            <span class="recent-item__date">${formatDateTime(o.createdAt)}</span>
          </div>
          <div class="recent-item__right">
            ${statusBadge(o.status)}
            <span class="recent-item__total">${formatPrice(o.total)}</span>
          </div>
        </a>`
              )
              .join("")}</div>`
      }
    </section>

    <nav class="my-nav">
      <a class="btn btn--outline btn--block" href="../menus/list.html">메뉴 보기</a>
      <a class="btn btn--outline btn--block" href="../basket/list.html">장바구니</a>
      <a class="btn btn--outline btn--block" href="../orders/list.html">주문 내역</a>
    </nav>
  `;
}

render();
updateCartBadges();
