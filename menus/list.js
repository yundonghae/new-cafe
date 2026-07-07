<<<<<<< HEAD
/* ===== 고객 메뉴 목록 ===== */
const { getCategories, getMenusByCategory } = window.CafeData;
const { formatPrice, escapeHtml } = window.CafeUtils;
=======
const { formatPrice, escapeHtml } = window.CafeUtils;
const Data = window.CafeData;
>>>>>>> origin/10-메인페이지-꾸미기

let activeCategory = "";

function renderCategoryTabs() {
  const tabs = document.getElementById("category-tabs");
  const allTab = `<button class="${activeCategory === "" ? "active" : ""}" data-id="">전체</button>`;
<<<<<<< HEAD
  const categoryTabs = getCategories()
    .map(
      (c) =>
        `<button class="${activeCategory === c.id ? "active" : ""}" data-id="${c.id}">${escapeHtml(c.name)}</button>`
    )
    .join("");
=======
  const categoryTabs = Data.getCategories().map(
    (c) => `<button class="${activeCategory === c.id ? "active" : ""}" data-id="${c.id}">${c.emoji ?? ""} ${escapeHtml(c.name)}</button>`
  ).join("");
>>>>>>> origin/10-메인페이지-꾸미기
  tabs.innerHTML = allTab + categoryTabs;

  tabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.id;
      renderCategoryTabs();
      renderMenuGrid();
    });
  });
}

function renderMenuGrid() {
  const grid = document.getElementById("menu-grid");
<<<<<<< HEAD
  const menus = getMenusByCategory(activeCategory);
  grid.innerHTML = menus
    .map(
      (menu) => `
    <div class="menu-card glass ${menu.soldOut ? "soldout" : ""}" onclick="location.href='detail.html?id=${menu.id}'">
      <img class="menu-thumb" src="${escapeHtml(menu.image || "")}" alt="${escapeHtml(menu.name)}" loading="lazy">
=======
  const menus = Data.getMenusByCategory(activeCategory);
  grid.innerHTML = menus.map((menu) => `
    <div class="menu-card glass ${menu.soldOut ? "soldout" : ""}" onclick="location.href='detail.html?id=${menu.id}'">
      <img class="menu-card__thumb" src="${menu.image}" alt="${escapeHtml(menu.name)}" loading="lazy" />
>>>>>>> origin/10-메인페이지-꾸미기
      <h3>${escapeHtml(menu.name)}</h3>
      <p class="price">${formatPrice(menu.price)}</p>
      ${menu.soldOut ? "<p>품절</p>" : ""}
    </div>
  `
    )
    .join("");
}

renderCategoryTabs();
renderMenuGrid();
