/* ===== 고객 메뉴 상세 ===== */
const { getMenuById } = window.CafeData;
const { formatPrice, escapeHtml, getParam, addToCart, showToast } = window.CafeUtils;

let quantity = 1;

function renderMenuDetail() {
  const menu = getMenuById(getParam("id"));
  const el = document.getElementById("menu-detail");

  if (!menu) {
    el.innerHTML = "<p>메뉴를 찾을 수 없습니다.</p>";
    return;
  }

  el.innerHTML = `
    <h2>${escapeHtml(menu.name)}</h2>
    <p class="price">${formatPrice(menu.price)}</p>
    <p>${escapeHtml(menu.description || "")}</p>
    <div class="quantity">
      <button type="button" id="qty-minus">-</button>
      <span id="qty-value">${quantity}</span>
      <button type="button" id="qty-plus">+</button>
    </div>
    <button type="button" class="add-to-cart-btn" id="add-btn" ${menu.soldOut ? "disabled" : ""}>
      ${menu.soldOut ? "품절" : "장바구니 담기"}
    </button>
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
