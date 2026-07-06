const { formatPrice, escapeHtml } = window.CafeUtils;
const Data = window.CafeData;

function renderCategories() {
  const grid = document.getElementById("category-grid");
  grid.innerHTML = Data.getCategories().map((c) => `
    <a class="category-card card" href="menus/list.html">
      <span class="category-card__emoji">${c.emoji ?? "☕"}</span>
      <span>${escapeHtml(c.name)}</span>
    </a>
  `).join("");
}

function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  const menus = Data.getMenus()
    .filter((m) => m.tags?.includes("베스트"))
    .slice(0, 4);

  grid.innerHTML = menus.map((menu) => `
    <div class="menu-card glass ${menu.soldOut ? "soldout" : ""}" onclick="location.href='menus/detail.html?id=${menu.id}'">
      <h3>${escapeHtml(menu.name)}</h3>
      <p class="price">${formatPrice(menu.price)}</p>
      ${menu.soldOut ? "<p>품절</p>" : ""}
    </div>
  `).join("");
}

renderCategories();
renderFeatured();
