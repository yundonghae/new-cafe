/* ===== 관리자 메뉴 추가 ===== */
const { $, formatPrice, escapeHtml, showToast } = window.CafeUtils;
const Data = window.CafeData;

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70";

const form = $("#menuForm");

/** 카테고리 셀렉트 채우기 */
function fillCategories(selectedId) {
  const cats = Data.getCategories();
  $("#categoryId").innerHTML =
    `<option value="" disabled ${selectedId ? "" : "selected"}>선택하세요</option>` +
    cats
      .map(
        (c) =>
          `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${escapeHtml(
            c.emoji + " " + c.name
          )}</option>`
      )
      .join("");
}

/** 입력값 → 미리보기 반영 */
function updatePreview() {
  const name = $("#name").value.trim() || "메뉴 이름";
  const price = Number($("#price").value) || 0;
  const catId = $("#categoryId").value;
  const cat = Data.getCategoryById(catId);
  const img = $("#image").value.trim() || PLACEHOLDER_IMG;
  const sold = $("#soldOut").checked;

  $("#pvName").textContent = name;
  $("#pvPrice").textContent = formatPrice(price);
  $("#pvCat").textContent = cat ? cat.name : "카테고리";
  $("#pvImage").src = img;
  $("#pvSold").hidden = !sold;
}

/** 태그 문자열 → 배열 */
function parseTags(str) {
  return str
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** 필수값 검증. 유효하면 true */
function validate() {
  let ok = true;
  [
    ["name", (v) => v.trim().length > 0],
    ["categoryId", (v) => v.length > 0],
    ["price", (v) => v !== "" && Number(v) >= 0],
  ].forEach(([id, test]) => {
    const el = $("#" + id);
    const valid = test(el.value);
    el.classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  return ok;
}

/* ===== 초기화 ===== */
fillCategories(null);
$("#pvImage").src = PLACEHOLDER_IMG;
form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) {
    showToast("필수 항목을 입력해 주세요.", "warning");
    return;
  }
  const menu = Data.createMenu({
    name: $("#name").value.trim(),
    categoryId: $("#categoryId").value,
    price: Number($("#price").value),
    description: $("#description").value.trim(),
    image: $("#image").value.trim() || PLACEHOLDER_IMG,
    tags: parseTags($("#tags").value),
    soldOut: $("#soldOut").checked,
  });
  showToast(`'${menu.name}' 메뉴를 등록했어요.`, "success");
  setTimeout(() => (location.href = "list.html"), 600);
});
