const CATEGORIES = [
  { id: "coffee", name: "커피" },
  { id: "tea", name: "티" },
  { id: "dessert", name: "디저트" },
];

const DEFAULT_MENUS = [
  { id: 1, categoryId: "coffee", name: "아메리카노", price: 4000, description: "깔끔하고 진한 에스프레소 베이스", image: "", soldOut: false },
  { id: 2, categoryId: "coffee", name: "카페라떼", price: 4500, description: "부드러운 우유와 에스프레소의 조화", image: "", soldOut: false },
  { id: 3, categoryId: "coffee", name: "카푸치노", price: 4500, description: "풍성한 우유 거품이 특징", image: "", soldOut: false },
  { id: 4, categoryId: "tea", name: "얼그레이", price: 4000, description: "은은한 베르가못 향의 홍차", image: "", soldOut: false },
  { id: 5, categoryId: "dessert", name: "치즈케이크", price: 5500, description: "진한 크림치즈 케이크", image: "", soldOut: true },
];

const MENUS_KEY = "cafe-app:menus";
const MENUS = JSON.parse(localStorage.getItem(MENUS_KEY) || "null") || DEFAULT_MENUS;

function saveMenus() {
  localStorage.setItem(MENUS_KEY, JSON.stringify(MENUS));
}

function getMenuById(id) {
  return MENUS.find((menu) => menu.id === Number(id));
}

function getMenusByCategory(categoryId) {
  if (!categoryId) return MENUS;
  return MENUS.filter((menu) => menu.categoryId === categoryId);
}
