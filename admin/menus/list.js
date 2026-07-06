/* ===== 관리자 메뉴 목록 ===== */
const { $, $$, formatPrice, escapeHtml, showToast } = window.CafeUtils;
const Data = window.CafeData;

const state = { category: "all", keyword: "" };

/** 카테고리 필터 칩 렌더 */
function renderChips() {
  const cats = [{ id: "all", name: "전체", emoji: "🗂️" }, ...Data.getCategories()];
  $("#categoryChips").innerHTML = cats
    .map(
      (c) => `
      <button class="chip ${c.id === state.category ? "is-active" : ""}"
              data-cat="${c.id}">${c.emoji} ${escapeHtml(c.name)}</button>`
    )
    .join("");
}

/** 현재 필터에 맞는 메뉴 카드 렌더 */
function renderMenus() {
  let menus = Data.getMenusByCategory(state.category);
  if (state.keyword) {
    const kw = state.keyword.toLowerCase();
    menus = menus.filter((m) => m.name.toLowerCase().includes(kw));
  }

  $("#menuCount").textContent = `전체 ${menus.length}개`;

  const grid = $("#menuGrid");
  if (menus.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">🔍</div>
        <p>조건에 맞는 메뉴가 없어요.</p>
      </div>`;
    return;
  }

  grid.innerHTML = menus
    .map((m) => {
      const cat = Data.getCategoryById(m.categoryId);
      return `
      <article class="card menu-card">
        <a class="menu-card__thumb" href="detail.html?id=${m.id}">
          <img src="${m.image}" alt="${escapeHtml(m.name)}" loading="lazy" />
          ${m.soldOut ? `<div class="menu-card__soldout">품절</div>` : ""}
        </a>
        <div class="menu-card__body">
          <span class="menu-card__cat">${cat ? escapeHtml(cat.name) : ""}</span>
          <h3 class="menu-card__name">${escapeHtml(m.name)}</h3>
          <span class="menu-card__price">${formatPrice(m.price)}</span>
        </div>
        <div class="menu-card__actions">
          <a class="btn btn--outline btn--sm" href="edit.html?id=${m.id}">수정</a>
          <button class="btn btn--ghost btn--sm" data-delete="${m.id}">삭제</button>
        </div>
      </article>`;
    })
    .join("");
}

function render() {
  renderChips();
  renderMenus();
}

/* ===== 이벤트 ===== */
$("#categoryChips").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.category = btn.dataset.cat;
  render();
});

$("#searchInput").addEventListener("input", (e) => {
  state.keyword = e.target.value.trim();
  renderMenus();
});

$("#menuGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-delete]");
  if (!btn) return;
  const id = btn.dataset.delete;
  const menu = Data.getMenuById(id);
  if (!menu) return;
  if (confirm(`'${menu.name}' 메뉴를 삭제할까요?`)) {
    Data.deleteMenu(id);
    showToast("메뉴를 삭제했어요.", "success");
    renderMenus();
  }
});

render();
