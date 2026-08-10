const combo1Image = new URL("../assets/combos/combo-1-menu.jpg", import.meta.url).href;
const combo2Image = new URL("../assets/combos/combo-2-menu.jpg", import.meta.url).href;
const combo3Image = new URL("../assets/combos/combo-3-menu.jpg", import.meta.url).href;
const combo4Image = new URL("../assets/combos/combo-4-menu.jpg", import.meta.url).href;
const combo5Image = new URL("../assets/combos/combo-5-menu.jpg", import.meta.url).href;

export type MenuCategory =
  | "coffee"
  | "milkshake"
  | "fresh"
  | "lemonades"
  | "smoothie"
  | "ice-coffee"
  | "tea"
  | "drinks"
  | "addons"
  | "pizza"
  | "burger"
  | "hot-dog"
  | "snacks"
  | "sauces"
  | "combo"
  | "sets"
  | "desserts";

export type MenuItem = {
  id: string;
  title: string;
  category: MenuCategory;
  price: number;
  description?: string;
  badge?: string;
  image?: string;
  popular?: boolean;
  isNew?: boolean;
};

export type Category = {
  id: MenuCategory;
  label: string;
  shortLabel: string;
  accent: "coffee" | "fresh" | "food" | "deal" | "basic";
};

export const categories: Category[] = [
  { id: "coffee", label: "Ыстық кофе / Hot coffee", shortLabel: "Hot coffee", accent: "coffee" },
  { id: "milkshake", label: "Милкшейк / Milkshake", shortLabel: "Milkshake", accent: "fresh" },
  { id: "fresh", label: "Фреш / Fresh", shortLabel: "Fresh", accent: "fresh" },
  { id: "lemonades", label: "Лимонадтар / Lemonades", shortLabel: "Lemonades", accent: "fresh" },
  { id: "smoothie", label: "Смузи / Smoothie", shortLabel: "Smoothie", accent: "fresh" },
  { id: "ice-coffee", label: "Мұз қосылған кофе", shortLabel: "Ice coffee", accent: "coffee" },
  { id: "tea", label: "Шай / Tea", shortLabel: "Шай", accent: "coffee" },
  { id: "drinks", label: "Сусындар / Напитки", shortLabel: "Сусындар", accent: "basic" },
  { id: "addons", label: "Қосымшалар / Добавки", shortLabel: "Қосымша", accent: "basic" },
  { id: "pizza", label: "Pizza", shortLabel: "Pizza", accent: "food" },
  { id: "burger", label: "Burger", shortLabel: "Burger", accent: "food" },
  { id: "hot-dog", label: "Hot dog", shortLabel: "Hot dog", accent: "food" },
  { id: "snacks", label: "Тіскебасар", shortLabel: "Снэк", accent: "food" },
  { id: "sauces", label: "Тұздықтар", shortLabel: "Соус", accent: "basic" },
  { id: "combo", label: "Комбо", shortLabel: "Комбо", accent: "deal" },
  { id: "desserts", label: "Мороженое", shortLabel: "Мороженое", accent: "deal" },
  { id: "sets", label: "Сеттер", shortLabel: "Сет", accent: "deal" },
];

export const menu: MenuItem[] = [
  { id: "espresso", title: "Эспрессо", category: "coffee", price: 690 },
  { id: "americano-03", title: "Американо 0.3", category: "coffee", price: 790 },
  { id: "americano-04", title: "Американо 0.4", category: "coffee", price: 990 },
  { id: "flat-white", title: "Флэт Уайт", category: "coffee", price: 990 },
  { id: "cappuccino-03", title: "Капучино 0.3", category: "coffee", price: 990 },
  { id: "cappuccino-04", title: "Капучино 0.4", category: "coffee", price: 1090 },
  { id: "latte-03", title: "Латте 0.3", category: "coffee", price: 1090 },
  { id: "latte-04", title: "Латте 0.4", category: "coffee", price: 1190, popular: true },
  {
    id: "raf",
    title: "Раф",
    category: "coffee",
    price: 1290,
    description: "Жұмсақ, жылы және ерекше дәм.",
    badge: "Күннің хош иісі",
    popular: true,
  },
  { id: "mochaccino", title: "Моккачино", category: "coffee", price: 1190 },
  { id: "hot-chocolate", title: "Горячий шоколад", category: "coffee", price: 1090 },

  { id: "milkshake-strawberry", title: "Құлпынай", category: "milkshake", price: 1490 },
  { id: "milkshake-banana", title: "Банан", category: "milkshake", price: 1490 },
  { id: "milkshake-oreo", title: "Орео", category: "milkshake", price: 1490 },
  { id: "milkshake-caramel", title: "Карамель", category: "milkshake", price: 1490 },
  { id: "milkshake-chocolate", title: "Шоколад", category: "milkshake", price: 1490 },

  { id: "fresh-orange", title: "Апельсин", category: "fresh", price: 1990 },
  { id: "fresh-apple", title: "Алма", category: "fresh", price: 1990 },

  { id: "lemonade-classic", title: "Классический", category: "lemonades", price: 1390 },
  { id: "lemonade-kiwi-lime", title: "Киви-лайм", category: "lemonades", price: 1390 },
  {
    id: "lemonade-mango-passion",
    title: "Манго-маракуйя",
    category: "lemonades",
    price: 1390,
  },
  { id: "lemonade-berry-mojito", title: "Ягодный мохито", category: "lemonades", price: 1390 },
  { id: "lemonade-pomegranate", title: "Гранатовый", category: "lemonades", price: 1390 },
  { id: "lemonade-citrus", title: "Цитрус", category: "lemonades", price: 1390 },
  { id: "lemonade-tropical", title: "Тропический", category: "lemonades", price: 1390 },
  {
    id: "lemonade-strawberry-pineapple",
    title: "Клубника-ананас",
    category: "lemonades",
    price: 1390,
  },
  { id: "lemonade-mojito", title: "Мохито", category: "lemonades", price: 1390 },
  { id: "lemonade-pineapple-mango", title: "Ананас-манго", category: "lemonades", price: 1390 },
  { id: "lemonade-raspberry-orange", title: "Малина-апельсин", category: "lemonades", price: 1390 },

  { id: "smoothie-fruit", title: "Фруктовый", category: "smoothie", price: 1590 },
  { id: "smoothie-berry", title: "Ягодный", category: "smoothie", price: 1590 },
  { id: "smoothie-strawberry-banana", title: "Құлпынай-банан", category: "smoothie", price: 1590 },
  { id: "smoothie-apple-banana-kiwi", title: "Алма-банан-киви", category: "smoothie", price: 1590 },

  { id: "ice-americano", title: "Ice americano / Айс американо", category: "ice-coffee", price: 1290 },
  { id: "ice-latte", title: "Ice latte / Айс латте", category: "ice-coffee", price: 1290 },
  { id: "ice-cappuccino", title: "Ice Cappuccino / Айс капучино", category: "ice-coffee", price: 1290 },
  { id: "glasse", title: "Glasse / Гляссе", category: "ice-coffee", price: 1290 },
  { id: "frappe", title: "Frappe / Фраппе", category: "ice-coffee", price: 1290 },
  { id: "oreo-frappe", title: "Oreo Frappe", category: "ice-coffee", price: 1390 },
  { id: "ice-matcha-mango", title: "Ice matcha mango", category: "ice-coffee", price: 1800 },
  { id: "ice-matcha-strawberry", title: "Ice матча құлпынай / Ice матча клубника", category: "ice-coffee", price: 1700 },

  { id: "tea-black", title: "Қара шай", category: "tea", price: 750 },
  { id: "tea-green", title: "Жасыл шай", category: "tea", price: 750 },
  { id: "tea-jasmine", title: "Жасмин шай", category: "tea", price: 750 },
  { id: "tea-milk", title: "Сүтті шай", category: "tea", price: 800 },
  { id: "tea-tary", title: "Тары шай", category: "tea", price: 950 },
  { id: "tea-tashkent", title: "Ташкент шай", category: "tea", price: 950 },
  { id: "tea-moroccan", title: "Мароккан шай", category: "tea", price: 950 },
  { id: "tea-fruit", title: "Фруктовый шай", category: "tea", price: 950 },
  { id: "tea-raspberry-ginger", title: "Малина-имбирь", category: "tea", price: 950 },
  { id: "tea-berry", title: "Ягодный шай", category: "tea", price: 950 },

  { id: "coca-cola", title: "Coca-Cola", category: "drinks", price: 700 },
  { id: "fanta", title: "Fanta", category: "drinks", price: 700 },
  { id: "sprite", title: "Sprite", category: "drinks", price: 700 },
  { id: "bonaqua", title: "BonAqua", category: "drinks", price: 550 },
  { id: "juice", title: "Сок", category: "drinks", price: 400 },

  { id: "syrup", title: "Сироп", category: "addons", price: 150 },
  { id: "honey", title: "Бал", category: "addons", price: 150 },
  { id: "lemon", title: "Лимон", category: "addons", price: 150 },
  { id: "milk", title: "Сүт", category: "addons", price: 250 },

  { id: "pizza-margarita", title: "Пицца Маргарита", category: "pizza", price: 2690 },
  { id: "pizza-pepperoni", title: "Пицца Пепперони", category: "pizza", price: 2990, popular: true },
  { id: "pizza-gogo", title: "Пицца GoGo", category: "pizza", price: 2890 },
  { id: "pizza-bbq", title: "Пицца BBQ", category: "pizza", price: 2890 },
  { id: "pizza-chicken-mushroom", title: "Пицца тауық пен саңырауқұлақ", category: "pizza", price: 2890 },
  { id: "pizza-bolognese", title: "Пицца Болоньезе", category: "pizza", price: 2890 },
  { id: "pizza-four-seasons", title: "Пицца 4 маусым", category: "pizza", price: 2990 },
  { id: "pizza-sweet", title: "Тәтті пицца", category: "pizza", price: 2890 },

  { id: "burger-gogo", title: "GoGo Burger", category: "burger", price: 1690, popular: true },
  { id: "burger-sweet", title: "Тәтті Бургер", category: "burger", price: 1890 },
  { id: "hot-dog", title: "Хот-дог", category: "hot-dog", price: 1190 },

  { id: "fries", title: "Фри", category: "snacks", price: 690 },
  { id: "fries-sausage", title: "Фри шұжықтармен", category: "snacks", price: 1190 },
  { id: "fries-chicken", title: "Фри тауықпен", category: "snacks", price: 1990 },
  { id: "potato-balls", title: "Картоп шариктері", category: "snacks", price: 1090 },
  { id: "cheese-sticks", title: "Ірімшік таяқшалары 5шт", category: "snacks", price: 1390 },
  { id: "nuggets", title: "Наггетсы 7шт", category: "snacks", price: 1890 },

  { id: "sauce-cheese", title: "Ірімшікті", category: "sauces", price: 250 },
  { id: "sauce-ketchup", title: "Кетчуп", category: "sauces", price: 250 },
  { id: "sauce-bbq", title: "BBQ", category: "sauces", price: 250 },
  { id: "sauce-garlic", title: "Сарымсақты", category: "sauces", price: 250 },

  {
    id: "combo-1",
    title: "КОМБО 1",
    category: "combo",
    price: 1990,
    description: "Фри с сосиской + Лимонад",
    badge: "Новое",
    image: combo1Image,
    popular: true,
    isNew: true,
  },
  {
    id: "combo-2",
    title: "КОМБО 2",
    category: "combo",
    price: 2390,
    description: "Фри с курицей + Лимонад",
    badge: "Новое",
    image: combo2Image,
    popular: true,
    isNew: true,
  },
  {
    id: "combo-3",
    title: "КОМБО 3",
    category: "combo",
    price: 2800,
    description: "Фри + Бургер + Лимонад",
    badge: "Новое",
    image: combo3Image,
    isNew: true,
  },
  {
    id: "combo-4",
    title: "КОМБО 4",
    category: "combo",
    price: 2390,
    description: "Сладкий бургер + Кофе 0.3",
    badge: "Новое",
    image: combo4Image,
    isNew: true,
  },
  {
    id: "combo-5",
    title: "КОМБО 5",
    category: "combo",
    price: 2800,
    description: "GoGo Burger + Фри + Кола",
    badge: "Новое",
    image: combo5Image,
    isNew: true,
  },
  {
    id: "ice-cream-strawberry-banana",
    title: "Мороженое: клубника и банан",
    category: "desserts",
    price: 2290,
    description: "+ Коктейль",
    badge: "Новое",
    isNew: true,
  },
  {
    id: "ice-cream-pineapple",
    title: "Мороженое с ананасом",
    category: "desserts",
    price: 2290,
    description: "+ Коктейль",
    badge: "Новое",
    isNew: true,
  },
  {
    id: "ice-cream-mango",
    title: "Мороженое с манго",
    category: "desserts",
    price: 2290,
    description: "+ Коктейль",
    badge: "Новое",
    isNew: true,
  },
  {
    id: "set-1",
    title: "СЕТ 1",
    category: "sets",
    price: 12990,
    description: "Пицца 2шт + Картоп шариктері + Наггетсы 7шт + Лимонад 4шт",
    badge: "Компанияға",
  },
  {
    id: "set-2",
    title: "СЕТ 2",
    category: "sets",
    price: 6290,
    description: "Пицца 1шт + Ірімшік таяқшалары 5шт + Лимонад 2шт",
    badge: "Компанияға",
  },
];
