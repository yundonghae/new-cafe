/* ===== 관리자 메뉴 수정 ===== */
const { $, formatPrice, escapeHtml, getParam, showToast } = window.CafeUtils;
const Data = window.CafeData;

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70";

const id = getParam("id");
const menu = id ? Data.getMenuById(id) : null;
const host = $("#formHost");

if (!menu) {
  host.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon">😕</div>
      <p>수정할 메뉴를 찾을 수 없어요.</p>
      <a href="list.html" class="btn btn--primary" style="margin-top:1rem">목록으로</a>
    </div>`;
} else {
  // 템플릿 삽입
  host.appendChild($("#formTemplate").content.cloneNode(true));
  const form = $("#menuForm");

  // 카테고리 채우기
  $("#categoryId").innerHTML = Data.getCategories()
    .map(
      (c) =>
        `<option value="${c.id}" ${c.id === menu.categoryId ? "selected" : ""}>${escapeHtml(
          c.emoji + " " + c.name
        )}</option>`
    )
    .join("");

  // 기존 값 채우기
  $("#name").value = menu.name;
  $("#price").value = menu.price;
  $("#description").value = menu.description || "";
  $("#image").value = menu.image || "";
  $("#tags").value = (menu.tags || []).join(", ");
  $("#soldOut").checked = !!menu.soldOut;

  function updatePreview() {
    const cat = Data.getCategoryById($("#categoryId").value);
    $("#pvName").textContent = $("#name").value.trim() || "메뉴 이름";
    $("#pvPrice").textContent = formatPrice(Number($("#price").value) || 0);
    $("#pvCat").textContent = cat ? cat.name : "카테고리";
    $("#pvImage").src = $("#image").value.trim() || PLACEHOLDER_IMG;
    $("#pvSold").hidden = !$("#soldOut").checked;
  }

  function validate() {
    let ok = true;
    [
      ["name", (v) => v.trim().length > 0],
      ["categoryId", (v) => v.length > 0],
      ["price", (v) => v !== "" && Number(v) >= 0],
    ].forEach(([fid, test]) => {
      const el = $("#" + fid);
      const valid = test(el.value);
      el.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  updatePreview();
  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("필수 항목을 확인해 주세요.", "warning");
      return;
    }
    Data.updateMenu(menu.id, {
      name: $("#name").value.trim(),
      categoryId: $("#categoryId").value,
      price: Number($("#price").value),
      description: $("#description").value.trim(),
      image: $("#image").value.trim() || PLACEHOLDER_IMG,
      tags: $("#tags")
        .value.split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      soldOut: $("#soldOut").checked,
    });
    showToast("변경사항을 저장했어요.", "success");
    setTimeout(() => (location.href = `detail.html?id=${menu.id}`), 600);
  });

  $("#deleteBtn").addEventListener("click", () => {
    if (confirm(`'${menu.name}' 메뉴를 삭제할까요?`)) {
      Data.deleteMenu(menu.id);
      showToast("메뉴를 삭제했어요.", "success");
      location.href = "list.html";
    }
  });
}
