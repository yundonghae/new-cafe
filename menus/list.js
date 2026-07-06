/* ===== 고객 메뉴 목록 ===== */
const { getCategories, getMenusByCategory } = window.CafeData;
const { formatPrice, escapeHtml, updateCartBadges } = window.CafeUtils;

let activeCategory = "";

/** 카테고리 탭 렌더 ("" = 전체) */
function renderCategoryTabs() {
  const tabs = document.getElementById("category-tabs");
  const allTab = `<button class="${activeCategory === "" ? "active" : ""}" data-id="">전체</button>`;
  const categoryTabs = getCategories()
    .map(
      (c) =>
        `<button class="${activeCategory === c.id ? "active" : ""}" data-id="${c.id}">${escapeHtml(
          c.emoji + " " + c.name
        )}</button>`
    )
    .join("");
  tabs.innerHTML = allTab + categoryTabs;

  tabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.id;
      renderCategoryTabs();
      renderMenuGrid();
    });
  });
}

/** 메뉴 카드 그리드 렌더 */
function renderMenuGrid() {
  const grid = document.getElementById("menu-grid");
  const menus = getMenusByCategory(activeCategory);

  if (menus.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">🍃</div>
        <p>준비된 메뉴가 없어요.</p>
      </div>`;
    return;
  }

  grid.innerHTML = menus
    .map(
      (menu) => `
    <a class="menu-card card ${menu.soldOut ? "soldout" : ""}" href="detail.html?id=${menu.id}">
      <div class="menu-card__thumb">
        <img src="${menu.image}" alt="${escapeHtml(menu.name)}" loading="lazy" />
        ${menu.soldOut ? `<span class="menu-card__soldout">품절</span>` : ""}
      </div>
      <div class="menu-card__body">
        <h3>${escapeHtml(menu.name)}</h3>
        <p class="price">${formatPrice(menu.price)}</p>
      </div>
    </a>`
    )
    .join("");
}

renderCategoryTabs();
renderMenuGrid();
updateCartBadges();
