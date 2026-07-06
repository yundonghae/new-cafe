/* ===== 고객 장바구니 ===== */
const {
  $,
  formatPrice,
  escapeHtml,
  qtyStepperHtml,
  getCartDetail,
  updateCartQty,
  removeFromCart,
  clearCart,
  checkout,
  showToast,
  updateCartBadges,
} = window.CafeUtils;

const root = $("#basketRoot");
const clearBtn = $("#clearBtn");

/** 장바구니 전체 렌더 */
function render() {
  const { items, total, count } = getCartDetail();
  clearBtn.hidden = items.length === 0;

  if (items.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🛒</div>
        <p>장바구니가 비어 있어요.</p>
        <a href="../menus/list.html" class="btn btn--primary" style="margin-top:1rem">메뉴 보러가기</a>
      </div>`;
    return;
  }

  const rows = items
    .map(
      (i) => `
    <article class="card cart-item" data-id="${i.menuId}">
      <img class="cart-item__thumb" src="${i.menu.image}" alt="${escapeHtml(i.menu.name)}" />
      <div class="cart-item__info">
        <span class="cart-item__name">${escapeHtml(i.menu.name)}</span>
        <span class="cart-item__unit">${formatPrice(i.menu.price)}</span>
        ${qtyStepperHtml(i.menuId, i.qty)}
      </div>
      <div class="cart-item__right">
        <span class="cart-item__line">${formatPrice(i.lineTotal)}</span>
        <button class="cart-item__remove" data-remove="${i.menuId}">삭제</button>
      </div>
    </article>`
    )
    .join("");

  root.innerHTML = `
    <div class="cart-list">${rows}</div>
    <section class="card cart-summary">
      <div class="cart-summary__row">
        <span>총 수량</span><span>${count}개</span>
      </div>
      <div class="cart-summary__row cart-summary__row--total">
        <span>결제 금액</span><span class="amount">${formatPrice(total)}</span>
      </div>
      <button class="btn btn--primary btn--block btn--lg" id="checkoutBtn">주문하기</button>
    </section>`;
}

/** 주문 완료 화면 */
function renderDone(order) {
  clearBtn.hidden = true;
  root.innerHTML = `
    <div class="order-done">
      <div class="order-done__icon">✅</div>
      <h2 class="order-done__title">주문이 접수됐어요!</h2>
      <p class="text-muted">맛있게 준비해 드릴게요.</p>
      <div class="order-done__no">주문번호 ${escapeHtml(order.id)}</div>
      <div class="order-done__actions">
        <a href="../menus/list.html" class="btn btn--outline">메뉴 더 보기</a>
        <a href="../orders/list.html" class="btn btn--primary">주문 내역</a>
      </div>
    </div>`;
}

/* ===== 이벤트 (위임) ===== */
root.addEventListener("click", (e) => {
  // 수량 증감
  const stepper = e.target.closest(".qty-stepper");
  if (stepper) {
    const id = stepper.dataset.qtyStepper;
    const cur = getCartDetail().items.find((i) => i.menuId === id);
    if (!cur) return;
    if (e.target.closest("[data-qty-inc]")) updateCartQty(id, cur.qty + 1);
    else if (e.target.closest("[data-qty-dec]")) updateCartQty(id, cur.qty - 1);
    else return;
    render();
    return;
  }

  // 개별 삭제
  const rm = e.target.closest("[data-remove]");
  if (rm) {
    removeFromCart(rm.dataset.remove);
    showToast("장바구니에서 뺐어요.");
    render();
    return;
  }

  // 주문하기
  if (e.target.closest("#checkoutBtn")) {
    const order = checkout();
    if (!order) {
      showToast("장바구니가 비어 있어요.", "warning");
      return;
    }
    showToast("주문이 접수됐어요!", "success");
    renderDone(order);
  }
});

// 전체 비우기
clearBtn.addEventListener("click", () => {
  if (confirm("장바구니를 모두 비울까요?")) {
    clearCart();
    showToast("장바구니를 비웠어요.");
    render();
  }
});

render();
updateCartBadges();
