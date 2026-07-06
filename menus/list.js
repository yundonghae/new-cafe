const { formatPrice, escapeHtml } = window.CafeUtils;
const Data = window.CafeData;

let activeCategory = "";

function renderCategoryTabs() {
  const tabs = document.getElementById("category-tabs");
  const allTab = `<button class="${activeCategory === "" ? "active" : ""}" data-id="">전체</button>`;
  const categoryTabs = Data.getCategories().map(
    (c) => `<button class="${activeCategory === c.id ? "active" : ""}" data-id="${c.id}">${c.emoji ?? ""} ${escapeHtml(c.name)}</button>`
  ).join("");
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
  const menus = Data.getMenusByCategory(activeCategory);
  grid.innerHTML = menus.map((menu) => `
    <div class="menu-card glass ${menu.soldOut ? "soldout" : ""}" onclick="location.href='detail.html?id=${menu.id}'">
      <h3>${escapeHtml(menu.name)}</h3>
      <p class="price">${formatPrice(menu.price)}</p>
      ${menu.soldOut ? "<p>품절</p>" : ""}
    </div>
  `).join("");
}

renderCategoryTabs();
renderMenuGrid();
