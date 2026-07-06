/* ===== 고객 메뉴 상세 ===== */
const { getMenuById } = window.CafeData;
const { formatPrice, escapeHtml, getParam, addToCart, showToast } = window.CafeUtils;

let quantity = 1;

function renderMenuDetail() {
  const menu = getMenuById(getParam("id"));
  const el = document.getElementById("menu-detail");

  if (!menu) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">😕</div>
        <p>메뉴를 찾을 수 없습니다.</p>
        <a href="list.html" class="btn btn--primary" style="margin-top:1rem">메뉴로</a>
      </div>`;
    return;
  }

  const tags = (menu.tags || [])
    .map((t) => `<span class="badge">${escapeHtml(t)}</span>`)
    .join("");

  el.innerHTML = `
    <div class="detail-media">
      <img src="${menu.image}" alt="${escapeHtml(menu.name)}" />
      ${menu.soldOut ? `<span class="detail-soldout">품절</span>` : ""}
    </div>
    <div class="detail-info">
      <h2>${escapeHtml(menu.name)}</h2>
      <p class="price">${formatPrice(menu.price)}</p>
      <p class="desc">${escapeHtml(menu.description || "")}</p>
      ${tags ? `<div class="detail-tags">${tags}</div>` : ""}
      <div class="quantity">
        <button type="button" id="qty-minus" aria-label="수량 감소">−</button>
        <span id="qty-value">${quantity}</span>
        <button type="button" id="qty-plus" aria-label="수량 증가">+</button>
      </div>
      <button type="button" class="btn btn--primary btn--block add-to-cart-btn" id="add-btn" ${
        menu.soldOut ? "disabled" : ""
      }>
        ${menu.soldOut ? "품절" : "장바구니 담기"}
      </button>
    </div>
  `;

  if (menu.soldOut) return;

  document.getElementById("qty-minus").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    document.getElementById("qty-value").textContent = quantity;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    quantity += 1;
    document.getElementById("qty-value").textContent = quantity;
  });
  document.getElementById("add-btn").addEventListener("click", () => {
    addToCart(menu.id, quantity);
    showToast(`${menu.name} ${quantity}개를 장바구니에 담았어요.`, "success");
  });
}

renderMenuDetail();
