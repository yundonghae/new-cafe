/* ============================================
   ☕ 카페 앱 - 메뉴 / 카테고리 데이터
   localStorage 를 단일 데이터 소스로 사용.
   최초 실행 시 아래 시드 데이터로 초기화된다.
   ============================================ */

const CATEGORIES = [
  { id: "coffee", name: "커피", emoji: "☕" },
  { id: "latte", name: "라떼", emoji: "🥛" },
  { id: "tea", name: "티", emoji: "🍵" },
  { id: "ade", name: "에이드", emoji: "🥤" },
  { id: "dessert", name: "디저트", emoji: "🍰" },
];

const SEED_MENUS = [
  {
    id: "m-americano",
    name: "아메리카노",
    categoryId: "coffee",
    price: 4000,
    description: "깊고 진한 에스프레소에 물을 더한 클래식 커피.",
    image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=600&q=70",
    tags: ["베스트", "HOT/ICE"],
    soldOut: false,
  },
  {
    id: "m-espresso",
    name: "에스프레소",
    categoryId: "coffee",
    price: 3500,
    description: "원두 본연의 향미를 가장 진하게 즐기는 한 잔.",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=70",
    tags: ["HOT"],
    soldOut: false,
  },
  {
    id: "m-cafelatte",
    name: "카페라떼",
    categoryId: "latte",
    price: 4500,
    description: "부드러운 스팀 밀크와 에스프레소의 완벽한 조화.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=70",
    tags: ["베스트", "HOT/ICE"],
    soldOut: false,
  },
  {
    id: "m-vanillalatte",
    name: "바닐라라떼",
    categoryId: "latte",
    price: 5000,
    description: "은은한 바닐라 향이 감도는 달콤한 라떼.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=70",
    tags: ["HOT/ICE"],
    soldOut: false,
  },
  {
    id: "m-greentea",
    name: "녹차",
    categoryId: "tea",
    price: 4500,
    description: "맑고 깔끔한 향의 프리미엄 녹차.",
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&q=70",
    tags: ["HOT/ICE"],
    soldOut: false,
  },
  {
    id: "m-chamomile",
    name: "캐모마일",
    categoryId: "tea",
    price: 4500,
    description: "잠들기 좋은 편안한 허브 티.",
    image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=600&q=70",
    tags: ["HOT"],
    soldOut: false,
  },
  {
    id: "m-lemonade",
    name: "레몬에이드",
    categoryId: "ade",
    price: 5500,
    description: "상큼한 레몬과 탄산의 시원한 청량감.",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=70",
    tags: ["ICE", "시즌"],
    soldOut: false,
  },
  {
    id: "m-grapefruitade",
    name: "자몽에이드",
    categoryId: "ade",
    price: 5800,
    description: "쌉쌀달콤한 자몽 과육이 가득한 에이드.",
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314a?w=600&q=70",
    tags: ["ICE"],
    soldOut: true,
  },
  {
    id: "m-cheesecake",
    name: "뉴욕 치즈케이크",
    categoryId: "dessert",
    price: 6500,
    description: "진한 크림치즈의 부드러운 클래식 케이크.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=70",
    tags: ["베스트"],
    soldOut: false,
  },
  {
    id: "m-croissant",
    name: "크루아상",
    categoryId: "dessert",
    price: 3800,
    description: "겹겹이 살아있는 결의 버터 크루아상.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=70",
    tags: [],
    soldOut: false,
  },
];

/* ============================================
   저장소 키 & 초기화
   ============================================ */

const STORAGE_KEYS = {
  MENUS: "cafe.menus",
  CATEGORIES: "cafe.categories",
  CART: "cafe.cart",
  ORDERS: "cafe.orders",
  USER: "cafe.user",
};

/** 최초 1회 시드 데이터를 localStorage 에 심는다. */
function seedData() {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MENUS)) {
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(SEED_MENUS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({ name: "손님", point: 1200, stamp: 4 })
    );
  }
}

// 스크립트 로드 즉시 초기화
seedData();

/* ============================================
   메뉴 / 카테고리 조회 (읽기)
   ============================================ */

function getCategories() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
}

function getMenus() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENUS)) || [];
}

function getMenuById(id) {
  return getMenus().find((m) => m.id === id) || null;
}

function getMenusByCategory(categoryId) {
  if (!categoryId || categoryId === "all") return getMenus();
  return getMenus().filter((m) => m.categoryId === categoryId);
}

function getCategoryById(id) {
  return getCategories().find((c) => c.id === id) || null;
}

/* ============================================
   메뉴 CRUD (관리자용, 쓰기)
   ============================================ */

function saveMenus(menus) {
  localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
}

function createMenu(menu) {
  const menus = getMenus();
  const newMenu = {
    id: "m-" + Date.now().toString(36),
    tags: [],
    soldOut: false,
    ...menu,
    price: Number(menu.price) || 0,
  };
  menus.push(newMenu);
  saveMenus(menus);
  return newMenu;
}

function updateMenu(id, patch) {
  const menus = getMenus();
  const idx = menus.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  menus[idx] = { ...menus[idx], ...patch, id };
  if (patch.price !== undefined) menus[idx].price = Number(patch.price) || 0;
  saveMenus(menus);
  return menus[idx];
}

function deleteMenu(id) {
  const menus = getMenus().filter((m) => m.id !== id);
  saveMenus(menus);
}

// 전역 노출 (모듈 번들러 없이 script 태그로 로드)
window.CafeData = {
  STORAGE_KEYS,
  getCategories,
  getMenus,
  getMenuById,
  getMenusByCategory,
  getCategoryById,
  createMenu,
  updateMenu,
  deleteMenu,
  saveMenus,
};
