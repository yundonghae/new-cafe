/* ===== 관리자 메뉴 상세 ===== */
const { $, formatPrice, escapeHtml, getParam, showToast } = window.CafeUtils;
const Data = window.CafeData;

const id = getParam("id");
const menu = id ? Data.getMenuById(id) : null;
const root = $("#detailRoot");

if (!menu) {
  root.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon">😕</div>
      <p>메뉴를 찾을 수 없어요.</p>
      <a href="list.html" class="btn btn--primary" style="margin-top:1rem">목록으로</a>
    </div>`;
} else {
  const cat = Data.getCategoryById(menu.categoryId);
  const tags = (menu.tags || [])
    .map((t) => `<span class="badge">${escapeHtml(t)}</span>`)
    .join("");

  root.innerHTML = `
    <div class="detail">
      <div class="detail__media">
        <img src="${menu.image}" alt="${escapeHtml(menu.name)}" />
        ${menu.soldOut ? `<div class="detail__soldout">품절</div>` : ""}
      </div>
      <div class="detail__info">
        <span class="detail__cat">${cat ? escapeHtml(cat.name) : ""}</span>
        <h1 class="detail__name">${escapeHtml(menu.name)}</h1>
        <div class="detail__price">${formatPrice(menu.price)}</div>
        <p class="detail__desc">${escapeHtml(menu.description || "")}</p>
        ${tags ? `<div class="detail__tags">${tags}</div>` : ""}
        <dl class="detail__meta">
          <dt>메뉴 ID</dt><dd>${escapeHtml(menu.id)}</dd>
          <dt>카테고리</dt><dd>${cat ? escapeHtml(cat.name) : "-"}</dd>
          <dt>판매 상태</dt><dd>${menu.soldOut ? "품절" : "판매 중"}</dd>
        </dl>
        <div class="detail__actions">
          <a href="edit.html?id=${menu.id}" class="btn btn--primary">수정하기</a>
          <button class="btn btn--outline" data-toggle-sold>
            ${menu.soldOut ? "판매 재개" : "품절 처리"}
          </button>
          <button class="btn btn--ghost" data-delete>삭제</button>
        </div>
      </div>
    </div>`;

  root.querySelector("[data-toggle-sold]").addEventListener("click", () => {
    Data.updateMenu(menu.id, { soldOut: !menu.soldOut });
    showToast(menu.soldOut ? "판매를 재개했어요." : "품절 처리했어요.", "success");
    location.reload();
  });

  root.querySelector("[data-delete]").addEventListener("click", () => {
    if (confirm(`'${menu.name}' 메뉴를 삭제할까요?`)) {
      Data.deleteMenu(menu.id);
      showToast("메뉴를 삭제했어요.", "success");
      location.href = "list.html";
    }
  });
}
