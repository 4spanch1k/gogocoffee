import { useEffect, useMemo, useState } from "react";
import { Instagram, Minus, Plus, Search, Send, ShoppingBag, X } from "lucide-react";
import { categories, menu, type MenuCategory, type MenuItem } from "./data/menu";

type TabId = "popular" | MenuCategory;
type Language = "ru" | "kk";
type Cart = Record<string, number>;

const WHATSAPP_NUMBER = "77711857998";
const INSTAGRAM_URL = "https://www.instagram.com/gogo.coffee.kzo/";
const CART_STORAGE_KEY = "gogo-coffee-cart";
const price = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;
const menuCopy = {
  ru: { add: "Добавить", remove: "Убрать", catalog: "Каталог", menu: "Меню и цены", positions: "поз.", search: "Поиск по меню", popular: "Популярное", cart: "Корзина", empty: "Пока пусто", total: "Итого", perUnit: "за шт.", orderWhatsApp: "Заказать в WhatsApp", showWaiter: "Показать заказ официанту", orderForWaiter: "Покажите этот заказ официанту", close: "Закрыть", emptyCart: "Добавьте позицию из меню — здесь появится сумма и кнопка заказа.", nothingFound: "Ничего не найдено. Попробуйте другое название.", heroKicker: "Кофе · бургеры · пицца · напитки", heroTitle: "Выберите любимое. Закажите за минуту.", heroText: "Соберите корзину, проверьте цены и отправьте готовый заказ в WhatsApp.", newMenu: "Новое меню", browseMenu: "Меню по разделам", menuUpdate: "Обновление меню", newCombo: "Новое комбо" },
  kk: { add: "Қосу", remove: "Алу", catalog: "Каталог", menu: "Мәзір және бағалар", positions: "орын", search: "Мәзірден іздеу", popular: "Танымал", cart: "Себет", empty: "Әзірге бос", total: "Барлығы", perUnit: "дана үшін", orderWhatsApp: "WhatsApp арқылы тапсырыс беру", showWaiter: "Тапсырысты даяшыға көрсету", orderForWaiter: "Осы тапсырысты даяшыға көрсетіңіз", close: "Жабу", emptyCart: "Мәзірден позиция қосыңыз — мұнда сома мен тапсырыс батырмасы пайда болады.", nothingFound: "Ештеңе табылмады. Басқа атауды іздеп көріңіз.", heroKicker: "Кофе · бургерлер · пицца · сусындар", heroTitle: "Өзіңізге ұнайтынын таңдаңыз. Бір минутта тапсырыс беріңіз.", heroText: "Себетке қосыңыз, бағаларды тексеріңіз және дайын тапсырысты WhatsApp-қа жіберіңіз.", newMenu: "Жаңа мәзір", browseMenu: "Бөлімдер бойынша мәзір", menuUpdate: "Мәзір жаңартуы", newCombo: "Жаңа комбо" },
} as const;
const categoryCopy: Record<MenuCategory, Record<Language, { label: string; shortLabel: string }>> = {
  coffee: { ru: { label: "Горячий кофе", shortLabel: "Кофе" }, kk: { label: "Ыстық кофе", shortLabel: "Кофе" } },
  milkshake: { ru: { label: "Милкшейки", shortLabel: "Милкшейки" }, kk: { label: "Милкшейк", shortLabel: "Милкшейк" } },
  fresh: { ru: { label: "Фреш", shortLabel: "Фреш" }, kk: { label: "Фреш", shortLabel: "Фреш" } },
  lemonades: { ru: { label: "Лимонады", shortLabel: "Лимонады" }, kk: { label: "Лимонадтар", shortLabel: "Лимонад" } },
  smoothie: { ru: { label: "Смузи", shortLabel: "Смузи" }, kk: { label: "Смузи", shortLabel: "Смузи" } },
  "ice-coffee": { ru: { label: "Холодный кофе", shortLabel: "Айс-кофе" }, kk: { label: "Мұз қосылған кофе", shortLabel: "Айс-кофе" } },
  tea: { ru: { label: "Чай", shortLabel: "Чай" }, kk: { label: "Шай", shortLabel: "Шай" } },
  drinks: { ru: { label: "Напитки", shortLabel: "Напитки" }, kk: { label: "Сусындар", shortLabel: "Сусындар" } },
  addons: { ru: { label: "Добавки", shortLabel: "Добавки" }, kk: { label: "Қосымшалар", shortLabel: "Қосымша" } },
  pizza: { ru: { label: "Пицца", shortLabel: "Пицца" }, kk: { label: "Пицца", shortLabel: "Пицца" } },
  burger: { ru: { label: "Бургеры", shortLabel: "Бургер" }, kk: { label: "Бургерлер", shortLabel: "Бургер" } },
  "hot-dog": { ru: { label: "Хот-доги", shortLabel: "Хот-дог" }, kk: { label: "Хот-догтар", shortLabel: "Хот-дог" } },
  snacks: { ru: { label: "Закуски", shortLabel: "Закуски" }, kk: { label: "Тіскебасар", shortLabel: "Снэк" } },
  sauces: { ru: { label: "Соусы", shortLabel: "Соусы" }, kk: { label: "Тұздықтар", shortLabel: "Соус" } },
  combo: { ru: { label: "Комбо", shortLabel: "Комбо" }, kk: { label: "Комбо", shortLabel: "Комбо" } },
  sets: { ru: { label: "Сеты", shortLabel: "Сеты" }, kk: { label: "Сеттер", shortLabel: "Сет" } },
};
const itemCopy: Record<string, Partial<Record<Language, string>>> = {
  espresso: { ru: "Эспрессо", kk: "Эспрессо" }, "americano-03": { ru: "Американо 0.3", kk: "Американо 0.3" }, "americano-04": { ru: "Американо 0.4", kk: "Американо 0.4" }, "flat-white": { ru: "Флэт уайт", kk: "Флэт уайт" },
  "cappuccino-03": { ru: "Капучино 0.3", kk: "Капучино 0.3" }, "cappuccino-04": { ru: "Капучино 0.4", kk: "Капучино 0.4" }, "latte-03": { ru: "Латте 0.3", kk: "Латте 0.3" }, "latte-04": { ru: "Латте 0.4", kk: "Латте 0.4" }, raf: { ru: "Раф", kk: "Раф" }, mochaccino: { ru: "Моккачино", kk: "Моккачино" }, "hot-chocolate": { ru: "Горячий шоколад", kk: "Ыстық шоколад" },
  "milkshake-strawberry": { ru: "Клубника", kk: "Құлпынай" }, "milkshake-banana": { ru: "Банан", kk: "Банан" }, "milkshake-oreo": { ru: "Орео", kk: "Орео" }, "milkshake-caramel": { ru: "Карамель", kk: "Карамель" }, "milkshake-chocolate": { ru: "Шоколад", kk: "Шоколад" },
  "fresh-orange": { ru: "Апельсин", kk: "Апельсин" }, "fresh-apple": { ru: "Яблоко", kk: "Алма" },
  "lemonade-classic": { ru: "Классический", kk: "Классикалық" }, "lemonade-kiwi-lime": { ru: "Киви-лайм", kk: "Киви-лайм" }, "lemonade-mango-passion": { ru: "Манго-маракуйя", kk: "Манго-маракуйя" }, "lemonade-berry-mojito": { ru: "Ягодный мохито", kk: "Жидекті мохито" }, "lemonade-pomegranate": { ru: "Гранатовый", kk: "Анар" }, "lemonade-citrus": { ru: "Цитрус", kk: "Цитрус" }, "lemonade-tropical": { ru: "Тропический", kk: "Тропикалық" }, "lemonade-strawberry-pineapple": { ru: "Клубника-ананас", kk: "Құлпынай-ананас" }, "lemonade-mojito": { ru: "Мохито", kk: "Мохито" }, "lemonade-pineapple-mango": { ru: "Ананас-манго", kk: "Ананас-манго" }, "lemonade-raspberry-orange": { ru: "Малина-апельсин", kk: "Таңқурай-апельсин" },
  "smoothie-fruit": { ru: "Фруктовый", kk: "Жемісті" }, "smoothie-berry": { ru: "Ягодный", kk: "Жидекті" }, "smoothie-strawberry-banana": { ru: "Клубника-банан", kk: "Құлпынай-банан" }, "smoothie-apple-banana-kiwi": { ru: "Яблоко-банан-киви", kk: "Алма-банан-киви" },
  "ice-americano": { ru: "Айс американо", kk: "Мұзды американо" }, "ice-latte": { ru: "Айс латте", kk: "Мұзды латте" }, "ice-cappuccino": { ru: "Айс капучино", kk: "Мұзды капучино" }, glasse: { ru: "Гляссе", kk: "Гляссе" }, frappe: { ru: "Фраппе", kk: "Фраппе" }, "oreo-frappe": { ru: "Орео фраппе", kk: "Орео фраппе" }, "ice-matcha-mango": { ru: "Айс матча манго", kk: "Мұзды матча манго" }, "ice-matcha-strawberry": { ru: "Айс матча клубника", kk: "Мұзды матча құлпынай" },
  "tea-black": { ru: "Чёрный чай", kk: "Қара шай" }, "tea-green": { ru: "Зелёный чай", kk: "Жасыл шай" }, "tea-jasmine": { ru: "Жасминовый чай", kk: "Жасмин шай" }, "tea-milk": { ru: "Чай с молоком", kk: "Сүтті шай" }, "tea-tary": { ru: "Чай с просом", kk: "Тары шай" }, "tea-tashkent": { ru: "Ташкентский чай", kk: "Ташкент шай" }, "tea-moroccan": { ru: "Марокканский чай", kk: "Мароккан шай" }, "tea-fruit": { ru: "Фруктовый чай", kk: "Жемісті шай" }, "tea-raspberry-ginger": { ru: "Малина-имбирь", kk: "Таңқурай-зімбір" }, "tea-berry": { ru: "Ягодный чай", kk: "Жидекті шай" },
  "coca-cola": { ru: "Coca-Cola", kk: "Coca-Cola" }, fanta: { ru: "Fanta", kk: "Fanta" }, sprite: { ru: "Sprite", kk: "Sprite" }, bonaqua: { ru: "BonAqua", kk: "BonAqua" }, juice: { ru: "Сок", kk: "Шырын" }, syrup: { ru: "Сироп", kk: "Сироп" }, honey: { ru: "Мёд", kk: "Бал" }, lemon: { ru: "Лимон", kk: "Лимон" }, milk: { ru: "Молоко", kk: "Сүт" },
  "pizza-margarita": { ru: "Пицца Маргарита", kk: "Маргарита пиццасы" }, "pizza-pepperoni": { ru: "Пицца Пепперони", kk: "Пепперони пиццасы" }, "pizza-gogo": { ru: "Пицца GoGo", kk: "GoGo пиццасы" }, "pizza-bbq": { ru: "Пицца BBQ", kk: "BBQ пиццасы" }, "pizza-chicken-mushroom": { ru: "Пицца с курицей и грибами", kk: "Тауық пен саңырауқұлақ пиццасы" }, "pizza-bolognese": { ru: "Пицца Болоньезе", kk: "Болоньезе пиццасы" }, "pizza-four-seasons": { ru: "Пицца 4 сезона", kk: "4 мезгіл пиццасы" }, "pizza-sweet": { ru: "Сладкая пицца", kk: "Тәтті пицца" },
  "burger-gogo": { ru: "GoGo Бургер", kk: "GoGo Бургер" }, "burger-sweet": { ru: "Сладкий бургер", kk: "Тәтті бургер" }, "hot-dog": { ru: "Хот-дог", kk: "Хот-дог" }, fries: { ru: "Фри", kk: "Фри" }, "fries-sausage": { ru: "Фри с сосисками", kk: "Шұжық қосылған фри" }, "fries-chicken": { ru: "Фри с курицей", kk: "Тауық қосылған фри" }, "potato-balls": { ru: "Картофельные шарики", kk: "Картоп шариктері" }, "cheese-sticks": { ru: "Сырные палочки, 5 шт.", kk: "Ірімшік таяқшалары, 5 дана" }, nuggets: { ru: "Наггетсы, 7 шт.", kk: "Наггетсы, 7 дана" },
  "sauce-cheese": { ru: "Сырный", kk: "Ірімшікті" }, "sauce-ketchup": { ru: "Кетчуп", kk: "Кетчуп" }, "sauce-bbq": { ru: "BBQ", kk: "BBQ" }, "sauce-garlic": { ru: "Чесночный", kk: "Сарымсақты" },
  "combo-1": { ru: "КОМБО 1", kk: "КОМБО 1" }, "combo-2": { ru: "КОМБО 2", kk: "КОМБО 2" }, "combo-3": { ru: "КОМБО 3", kk: "КОМБО 3" }, "combo-4": { ru: "КОМБО 4", kk: "КОМБО 4" }, "combo-5": { ru: "КОМБО 5", kk: "КОМБО 5" }, "combo-6": { ru: "КОМБО 6", kk: "КОМБО 6" }, "combo-7": { ru: "КОМБО 7", kk: "КОМБО 7" }, "combo-8": { ru: "КОМБО 8", kk: "КОМБО 8" }, "set-1": { ru: "СЕТ 1", kk: "СЕТ 1" }, "set-2": { ru: "СЕТ 2", kk: "СЕТ 2" },
};
const itemDescriptions: Record<string, Record<Language, string>> = {
  raf: { ru: "Мягкий, тёплый и с особенным вкусом.", kk: "Жұмсақ, жылы және ерекше дәм." },
  "combo-1": { ru: "Фри с сосиской + лимонад", kk: "Шұжық қосылған фри + лимонад" }, "combo-2": { ru: "Фри с курицей + лимонад", kk: "Тауық қосылған фри + лимонад" }, "combo-3": { ru: "Фри + бургер + лимонад", kk: "Фри + бургер + лимонад" }, "combo-4": { ru: "Мороженое: клубника и банан + коктейль", kk: "Құлпынай мен банан балмұздағы + коктейль" }, "combo-5": { ru: "Мороженое с ананасом + коктейль", kk: "Ананас қосылған балмұздақ + коктейль" }, "combo-6": { ru: "Мороженое с манго + коктейль", kk: "Манго қосылған балмұздақ + коктейль" }, "combo-7": { ru: "Сладкий бургер + кофе 0.3", kk: "Тәтті бургер + кофе 0.3" }, "combo-8": { ru: "GoGo Burger + фри + кола / спрайт / фанта", kk: "GoGo Burger + фри + кола / спрайт / фанта" }, "set-1": { ru: "2 пиццы + картофельные шарики + 7 наггетсов + 4 лимонада", kk: "2 пицца + картоп шариктері + 7 наггетс + 4 лимонад" }, "set-2": { ru: "Пицца + 5 сырных палочек + 2 лимонада", kk: "Пицца + 5 ірімшік таяқшасы + 2 лимонад" },
};
const titleFor = (item: MenuItem, language: Language) => itemCopy[item.id]?.[language] ?? item.title;
const descriptionFor = (item: MenuItem, language: Language) => itemDescriptions[item.id]?.[language] ?? item.description;
const espressoMenuImage = new URL("./assets/menu/espresso-cutout.png", import.meta.url).href;
const americanoMenuImage = new URL("./assets/menu/americano-cutout.png", import.meta.url).href;
const latteMenuImage = new URL("./assets/menu/latte-cutout.png", import.meta.url).href;
const flatWhiteMenuImage = new URL("./assets/menu/flat-white-cutout.png", import.meta.url).href;
const cappuccinoMenuImage = new URL("./assets/menu/cappuccino-cutout.png", import.meta.url).href;
const mochaMenuImage = new URL("./assets/menu/mocha-cutout.png", import.meta.url).href;
const icedCoffeeMenuImage = new URL("./assets/menu/iced-coffee-cutout.png", import.meta.url).href;
const icedLatteMenuImage = new URL("./assets/menu/iced-latte.png", import.meta.url).href;
const icedCappuccinoMenuImage = new URL("./assets/menu/iced-cappuccino-cutout.png", import.meta.url).href;
const glasseMenuImage = new URL("./assets/menu/glasse-cutout.png", import.meta.url).href;
const teaMenuImage = new URL("./assets/menu/tea-cutout.png", import.meta.url).href;
const greenTeaMenuImage = new URL("./assets/menu/green-tea-cutout.png", import.meta.url).href;
const jasmineTeaMenuImage = new URL("./assets/menu/jasmine-tea-cutout.png", import.meta.url).href;
const fruitTeaMenuImage = new URL("./assets/menu/fruit-tea-cutout.png", import.meta.url).href;
const raspberryTeaMenuImage = new URL("./assets/menu/raspberry-tea-cutout.png", import.meta.url).href;
const lemonadeMenuImage = new URL("./assets/menu/lemonade-cutout.png", import.meta.url).href;
const milkshakeMenuImage = new URL("./assets/menu/milkshake-cutout.png", import.meta.url).href;
const strawberryMilkshakeMenuImage = new URL("./assets/menu/strawberry-milkshake-cutout.png", import.meta.url).href;
const bananaMilkshakeMenuImage = new URL("./assets/menu/banana-milkshake-cutout.png", import.meta.url).href;
const oreoMilkshakeMenuImage = new URL("./assets/menu/oreo-milkshake-cutout.png", import.meta.url).href;
const caramelMilkshakeMenuImage = new URL("./assets/menu/caramel-milkshake-cutout.png", import.meta.url).href;
const orangeJuiceMenuImage = new URL("./assets/menu/orange-juice-cutout.png", import.meta.url).href;
const appleFreshMenuImage = new URL("./assets/menu/fresh-apple-cutout.png", import.meta.url).href;
const smoothieMenuImage = new URL("./assets/menu/smoothie-cutout.png", import.meta.url).href;
const berrySmoothieMenuImage = new URL("./assets/menu/smoothie-berry-cutout.png", import.meta.url).href;
const kiwiLimeLemonadeMenuImage = new URL("./assets/menu/lemonade-kiwi-lime-cutout.png", import.meta.url).href;
const colaMenuImage = new URL("./assets/menu/cola-cutout.png", import.meta.url).href;
const fantaMenuImage = new URL("./assets/menu/fanta-cutout.png", import.meta.url).href;
const spriteMenuImage = new URL("./assets/menu/sprite-cutout.png", import.meta.url).href;
const waterMenuImage = new URL("./assets/menu/water-cutout.png", import.meta.url).href;
const syrupMenuImage = new URL("./assets/menu/syrup.png", import.meta.url).href;
const honeyMenuImage = new URL("./assets/menu/honey-cutout.png", import.meta.url).href;
const lemonMenuImage = new URL("./assets/menu/lemon-cutout.png", import.meta.url).href;
const milkMenuImage = new URL("./assets/menu/milk-cutout.png", import.meta.url).href;
const pizzaMenuImage = new URL("./assets/menu/pizza-cutout.png", import.meta.url).href;
const burgerMenuImage = new URL("./assets/menu/burger-cutout.png", import.meta.url).href;
const hotDogMenuImage = new URL("./assets/menu/hot-dog-cutout.png", import.meta.url).href;
const friesMenuImage = new URL("./assets/menu/fries-cutout.png", import.meta.url).href;
const nuggetsMenuImage = new URL("./assets/menu/nuggets-cutout.png", import.meta.url).href;
const sauceMenuImage = new URL("./assets/menu/sauce-cutout.png", import.meta.url).href;
const ketchupSauceMenuImage = new URL("./assets/menu/sauce-ketchup-cutout.png", import.meta.url).href;
const bbqSauceMenuImage = new URL("./assets/menu/sauce-bbq-cutout.png", import.meta.url).href;
const garlicSauceMenuImage = new URL("./assets/menu/sauce-garlic-cutout.png", import.meta.url).href;
const potatoBallsMenuImage = new URL("./assets/menu/potato-balls-cutout.png", import.meta.url).href;
const cheeseSticksMenuImage = new URL("./assets/menu/cheese-sticks-cutout.png", import.meta.url).href;
const pizzaMargheritaMenuImage = new URL("./assets/menu/pizza-margherita-cutout.png", import.meta.url).href;
const pizzaChickenMenuImage = new URL("./assets/menu/pizza-chicken-cutout.png", import.meta.url).href;
const pizzaFourSeasonsMenuImage = new URL("./assets/menu/pizza-four-seasons-cutout.png", import.meta.url).href;

const menuImageByCategory: Partial<Record<MenuCategory, string>> = {
  coffee: latteMenuImage,
  "ice-coffee": icedCoffeeMenuImage,
  tea: teaMenuImage,
  milkshake: milkshakeMenuImage,
  fresh: orangeJuiceMenuImage,
  lemonades: lemonadeMenuImage,
  smoothie: smoothieMenuImage,
  drinks: colaMenuImage,
  pizza: pizzaMenuImage,
  burger: burgerMenuImage,
  "hot-dog": hotDogMenuImage,
  snacks: friesMenuImage,
  sauces: sauceMenuImage,
};

const menuImageByItemId: Record<string, string> = {
  espresso: espressoMenuImage,
  "americano-03": americanoMenuImage,
  "americano-04": americanoMenuImage,
  "flat-white": flatWhiteMenuImage,
  "cappuccino-03": cappuccinoMenuImage,
  "cappuccino-04": cappuccinoMenuImage,
  "latte-03": latteMenuImage,
  "latte-04": latteMenuImage,
  raf: latteMenuImage,
  mochaccino: mochaMenuImage,
  "hot-chocolate": mochaMenuImage,
  "milkshake-strawberry": strawberryMilkshakeMenuImage,
  "milkshake-banana": bananaMilkshakeMenuImage,
  "milkshake-oreo": oreoMilkshakeMenuImage,
  "milkshake-caramel": caramelMilkshakeMenuImage,
  "milkshake-chocolate": milkshakeMenuImage,
  "fresh-orange": orangeJuiceMenuImage,
  "fresh-apple": appleFreshMenuImage,
  "lemonade-classic": lemonadeMenuImage,
  "lemonade-kiwi-lime": kiwiLimeLemonadeMenuImage,
  "lemonade-mango-passion": orangeJuiceMenuImage,
  "lemonade-berry-mojito": berrySmoothieMenuImage,
  "lemonade-pomegranate": strawberryMilkshakeMenuImage,
  "lemonade-citrus": lemonadeMenuImage,
  "lemonade-tropical": smoothieMenuImage,
  "lemonade-strawberry-pineapple": strawberryMilkshakeMenuImage,
  "lemonade-mojito": kiwiLimeLemonadeMenuImage,
  "lemonade-pineapple-mango": orangeJuiceMenuImage,
  "lemonade-raspberry-orange": berrySmoothieMenuImage,
  "smoothie-fruit": smoothieMenuImage,
  "smoothie-berry": berrySmoothieMenuImage,
  "smoothie-strawberry-banana": strawberryMilkshakeMenuImage,
  "smoothie-apple-banana-kiwi": bananaMilkshakeMenuImage,
  "ice-americano": icedCoffeeMenuImage,
  "ice-latte": icedLatteMenuImage,
  "ice-cappuccino": icedCappuccinoMenuImage,
  glasse: glasseMenuImage,
  frappe: milkshakeMenuImage,
  "oreo-frappe": oreoMilkshakeMenuImage,
  "ice-matcha-mango": smoothieMenuImage,
  "ice-matcha-strawberry": smoothieMenuImage,
  "tea-green": greenTeaMenuImage,
  "tea-jasmine": jasmineTeaMenuImage,
  "tea-milk": teaMenuImage,
  "tea-moroccan": greenTeaMenuImage,
  "tea-fruit": fruitTeaMenuImage,
  "tea-raspberry-ginger": raspberryTeaMenuImage,
  "tea-berry": raspberryTeaMenuImage,
  "coca-cola": colaMenuImage,
  fanta: fantaMenuImage,
  sprite: spriteMenuImage,
  bonaqua: waterMenuImage,
  juice: orangeJuiceMenuImage,
  syrup: syrupMenuImage,
  honey: honeyMenuImage,
  lemon: lemonMenuImage,
  milk: milkMenuImage,
  "pizza-margarita": pizzaMargheritaMenuImage,
  "pizza-pepperoni": pizzaMenuImage,
  "pizza-gogo": pizzaChickenMenuImage,
  "pizza-bbq": pizzaChickenMenuImage,
  "pizza-chicken-mushroom": pizzaChickenMenuImage,
  "pizza-bolognese": pizzaMenuImage,
  "pizza-four-seasons": pizzaFourSeasonsMenuImage,
  "pizza-sweet": pizzaMenuImage,
  "burger-gogo": burgerMenuImage,
  "burger-sweet": burgerMenuImage,
  fries: friesMenuImage,
  "fries-sausage": hotDogMenuImage,
  "fries-chicken": nuggetsMenuImage,
  "potato-balls": potatoBallsMenuImage,
  "cheese-sticks": cheeseSticksMenuImage,
  nuggets: nuggetsMenuImage,
  "sauce-cheese": sauceMenuImage,
  "sauce-ketchup": ketchupSauceMenuImage,
  "sauce-bbq": bbqSauceMenuImage,
  "sauce-garlic": garlicSauceMenuImage,
};

const menuImageFor = (item: MenuItem) => menuImageByItemId[item.id] ?? menuImageByCategory[item.category];

const tabs: TabId[] = ["popular", ...categories.filter((category) => category.id !== "combo").map((category) => category.id)];

const featuredItems = menu.filter((item) => item.category === "combo" && item.isNew);
const imageScaleClass = (item: MenuItem) => (item.id === "combo-7" || item.id === "combo-8" ? "scale-[0.82]" : item.id === "combo-3" ? "scale-[0.9]" : "scale-100");

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("coffee");
  const [language, setLanguage] = useState<Language>("ru");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Cart>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "{}") as Cart;
    } catch {
      return {};
    }
  });
  const [isWaiterOpen, setIsWaiterOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const item = menu.find((menuItem) => menuItem.id === id);
          return item && quantity > 0 ? { item, quantity } : null;
        })
        .filter((line): line is { item: MenuItem; quantity: number } => Boolean(line)),
    [cart],
  );

  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartLines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return menu.filter((item) => {
      if (item.category === "combo") return false;
      const matchesTab = normalizedQuery
        ? true
        : activeTab === "popular"
          ? item.popular
          : item.category === activeTab;
      const haystack = `${titleFor(item, "ru")} ${titleFor(item, "kk")} ${descriptionFor(item, "ru") ?? ""} ${descriptionFor(item, "kk") ?? ""} ${categoryCopy[item.category].ru.label} ${categoryCopy[item.category].kk.label}`.toLowerCase();
      return matchesTab && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeTab, query]);

  const groupedItems = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: visibleItems.filter((item) => item.category === category.id),
        }))
        .filter((group) => group.items.length > 0),
    [visibleItems],
  );

  const whatsappText = useMemo(() => {
    const lines = cartLines
      .map(
        (line, index) =>
          `${index + 1}. ${titleFor(line.item, language)} × ${line.quantity} — ${price(line.item.price * line.quantity)}`,
      )
      .join("\n");
    return `Здравствуйте! Хочу заказать в GO GO COFFEE:\n\n${lines}\n\nИтого: ${price(cartTotal)}`;
  }, [cartLines, cartTotal, language]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: nextQuantity };
    });
  };

  const scrollToMenu = (tab?: TabId) => {
    if (tab) {
      setQuery("");
      setActiveTab(tab);
    }
    window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const scrollToNewCombos = () => document.getElementById("new-combo")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const scrollToCart = () => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-crema text-espresso">
      <header className="border-b border-espresso/15 bg-espresso text-milk">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="leading-none" aria-label="GO GO COFFEE — в начало">
            <span className="block text-lg font-semibold tracking-[0.08em]">GO GO</span>
            <span className="block text-[0.68rem] tracking-[0.22em] text-citrus">COFFEE</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-milk/25 p-0.5 text-xs font-semibold">
              {(["ru", "kk"] as Language[]).map((locale) => (
                <button key={locale} onClick={() => setLanguage(locale)} className={`rounded px-2 py-1 transition-colors ${language === locale ? "bg-milk text-espresso" : "text-milk/75 hover:text-milk"}`} aria-pressed={language === locale}>
                  {locale === "ru" ? "РУ" : "ҚАЗ"}
                </button>
              ))}
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-lg text-milk/80 transition-colors hover:bg-cacao hover:text-milk active:translate-y-px"
              aria-label="Instagram GO GO COFFEE"
            >
              <Instagram size={19} />
            </a>
            <button
              onClick={scrollToCart}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-citrus px-3 text-sm font-semibold text-espresso transition-colors hover:bg-[#f1b91c] active:translate-y-px"
              aria-label="Открыть корзину"
            >
              <ShoppingBag size={18} />
              <span>{cartCount || menuCopy[language].cart}</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="border-b border-espresso/15 bg-milk">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-cacao">{menuCopy[language].heroKicker}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{menuCopy[language].heroTitle}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-espresso/70">
                {menuCopy[language].heroText}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={scrollToNewCombos}
                  className="rounded-lg bg-espresso px-5 py-3 text-sm font-semibold text-milk transition-colors hover:bg-cacao active:translate-y-px"
                >
                  {menuCopy[language].newMenu}
                </button>
                <button
                  onClick={() => scrollToMenu("coffee")}
                  className="rounded-lg border border-espresso/25 px-5 py-3 text-sm font-semibold transition-colors hover:bg-crema active:translate-y-px"
                >
                  {menuCopy[language].browseMenu}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="new-combo" className="mx-auto max-w-6xl scroll-mt-4 border-b border-espresso/15 px-4 py-7 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-cacao">{menuCopy[language].menuUpdate}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{menuCopy[language].newCombo}</h2>
            </div>
            <span className="text-sm text-espresso/60">8 {menuCopy[language].positions}</span>
          </div>
          <div className="hide-scrollbar mt-5 flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {featuredItems.map((item) => (
              <FeaturedItem
                key={item.id}
                item={item}
                quantity={cart[item.id] ?? 0}
                onChange={changeQuantity}
                language={language}
              />
            ))}
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-28 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:pb-10">
          <section id="menu" className="min-w-0 scroll-mt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cacao">{menuCopy[language].catalog}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{menuCopy[language].menu}</h2>
              </div>
              <span className="text-sm text-espresso/60">{visibleItems.length} {menuCopy[language].positions}</span>
            </div>

            <div className="sticky top-0 z-20 -mx-4 mt-5 border-y border-espresso/15 bg-crema px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-t">
              <label className="relative block">
                <span className="sr-only">{menuCopy[language].search}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-espresso/50" size={18} />
                <input
                  id="menu-search"
                  name="menu-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={menuCopy[language].search}
                  className="h-11 w-full rounded-md border border-espresso/20 bg-milk pl-10 pr-3 text-sm outline-none focus:border-cacao focus:ring-2 focus:ring-cacao/15"
                />
              </label>
              <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors active:translate-y-px ${
                        isActive ? "bg-espresso text-milk" : "bg-milk text-espresso/70 hover:bg-white"
                      }`}
                    >
                      {tab === "popular" ? menuCopy[language].popular : categoryCopy[tab][language].shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              {groupedItems.length === 0 ? (
                <p className="border-y border-espresso/15 py-8 text-sm text-espresso/65">{menuCopy[language].nothingFound}</p>
              ) : (
                groupedItems.map((group) => (
                  <section key={group.category.id} className="mb-9 scroll-mt-28">
                    <div className="mb-3 flex items-center justify-between gap-4 border-b border-espresso/20 pb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{categoryCopy[group.category.id][language].label}</h3>
                        <span className="text-sm text-espresso/55">{group.items.length} {menuCopy[language].positions}</span>
                      </div>
                    </div>
                    <div className={group.category.accent === "deal" ? "grid gap-4 sm:grid-cols-2" : "divide-y divide-espresso/15"}>
                      {group.items.map((item) => (
                        <MenuItemRow
                          key={item.id}
                          item={item}
                          quantity={cart[item.id] ?? 0}
                          onChange={changeQuantity}
                          language={language}
                        />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </section>

          <aside id="cart" className="scroll-mt-24 lg:sticky lg:top-6 lg:self-start">
            <CartPanel
              lines={cartLines}
              total={cartTotal}
              whatsappUrl={whatsappUrl}
              onChange={changeQuantity}
              onShowWaiter={() => setIsWaiterOpen(true)}
              language={language}
            />
          </aside>
        </div>
      </main>

      <button
        onClick={scrollToCart}
        className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-lg bg-espresso px-4 py-3 text-sm font-semibold text-milk shadow-soft active:translate-y-px lg:hidden"
      >
        <span className="inline-flex items-center gap-2"><ShoppingBag size={18} /> {menuCopy[language].cart}</span>
        <span>{cartCount ? `${cartCount} · ${price(cartTotal)}` : menuCopy[language].empty}</span>
      </button>

      {isWaiterOpen && <WaiterModal lines={cartLines} total={cartTotal} onClose={() => setIsWaiterOpen(false)} language={language} />}
    </div>
  );
}

function FeaturedItem({
  item,
  quantity,
  onChange,
  language,
}: {
  item: MenuItem;
  quantity: number;
  onChange: (id: string, delta: number) => void;
  language: Language;
}) {
  return (
    <article className="w-[220px] shrink-0 snap-start overflow-hidden bg-espresso text-milk lg:w-auto">
      {item.image && (
        <div className="flex h-40 items-end justify-center px-3 pt-3">
          <img src={item.image} alt={`Фото ${titleFor(item, language)}`} className={`h-full w-full object-contain ${imageScaleClass(item)} ${item.id === "combo-1" ? "-translate-x-2" : ""}`} loading="lazy" />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{titleFor(item, language)}</h3>
          <span className="text-sm font-semibold text-citrus">{price(item.price)}</span>
        </div>
        <p className="mt-1 min-h-10 text-xs leading-5 text-milk/70">{descriptionFor(item, language)}</p>
        <CompactControl item={item} quantity={quantity} onChange={onChange} dark language={language} />
      </div>
    </article>
  );
}

function MenuItemRow({
  item,
  quantity,
  onChange,
  language,
}: {
  item: MenuItem;
  quantity: number;
  onChange: (id: string, delta: number) => void;
  language: Language;
}) {
  const isDeal = item.category === "combo" || item.category === "sets";
  const itemImage = isDeal ? undefined : menuImageFor(item);

  return (
    <article className={isDeal ? "overflow-hidden border border-espresso/15 bg-milk" : "flex items-center gap-3 py-4"}>
      {isDeal && item.image && (
        <div className="flex h-48 items-end justify-center bg-crema px-4 pt-4">
          <img src={item.image} alt={`Фото ${titleFor(item, language)}`} className={`h-full w-full object-contain ${imageScaleClass(item)}`} loading="lazy" />
        </div>
      )}
      {itemImage && (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
          <img src={itemImage} alt={`Фото ${titleFor(item, language)}`} className="max-h-full max-w-full object-contain" loading="lazy" />
        </div>
      )}
      <div className={isDeal ? "p-4" : "min-w-0 flex-1"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-semibold leading-snug">{titleFor(item, language)}</h4>
            {descriptionFor(item, language) && <p className="mt-1 text-sm leading-5 text-espresso/65">{descriptionFor(item, language)}</p>}
          </div>
          <p className="shrink-0 text-base font-semibold">{price(item.price)}</p>
        </div>
        <CompactControl item={item} quantity={quantity} onChange={onChange} language={language} />
      </div>
    </article>
  );
}

function CompactControl({ item, quantity, dark, onChange, language }: { item: MenuItem; quantity: number; dark?: boolean; onChange: (id: string, delta: number) => void; language: Language }) {
  if (quantity > 0) {
    return (
      <div className={`mt-3 inline-flex items-center overflow-hidden rounded-md border ${dark ? "border-white/20" : "border-espresso/20"}`}>
        <button onClick={() => onChange(item.id, -1)} className={`grid h-9 w-9 place-items-center ${dark ? "hover:bg-cacao" : "hover:bg-crema"} active:translate-y-px`} aria-label={`${menuCopy[language].remove} ${titleFor(item, language)}`}><Minus size={16} /></button>
        <span className="grid h-9 min-w-9 place-items-center text-sm font-semibold">{quantity}</span>
        <button onClick={() => onChange(item.id, 1)} className={`grid h-9 w-9 place-items-center ${dark ? "bg-citrus text-espresso hover:bg-[#f1b91c]" : "bg-espresso text-milk hover:bg-cacao"} active:translate-y-px`} aria-label={`${menuCopy[language].add} ${titleFor(item, language)}`}><Plus size={16} /></button>
      </div>
    );
  }

  return <button onClick={() => onChange(item.id, 1)} className={`mt-3 rounded-md px-3 py-2 text-sm font-semibold active:translate-y-px ${dark ? "bg-citrus text-espresso hover:bg-[#f1b91c]" : "bg-espresso text-milk hover:bg-cacao"}`}>{menuCopy[language].add}</button>;
}

function CartPanel({ lines, total, whatsappUrl, onChange, onShowWaiter, language }: { lines: Array<{ item: MenuItem; quantity: number }>; total: number; whatsappUrl: string; onChange: (id: string, delta: number) => void; onShowWaiter: () => void; language: Language }) {
  return (
    <div className="border-y border-espresso/20 py-5 lg:border lg:bg-milk lg:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold">{menuCopy[language].cart}</h2>
        <span className="text-sm text-espresso/60">{lines.length ? `${lines.length} ${menuCopy[language].positions}` : menuCopy[language].empty}</span>
      </div>
      {lines.length === 0 ? <p className="mt-4 text-sm leading-6 text-espresso/65">{menuCopy[language].emptyCart}</p> : (
        <div className="mt-4 divide-y divide-espresso/15 border-y border-espresso/15">
          {lines.map((line) => (
            <div key={line.item.id} className="py-3">
              <div className="flex justify-between gap-3"><p className="font-medium leading-snug">{titleFor(line.item, language)}</p><p className="shrink-0 font-semibold">{price(line.item.price * line.quantity)}</p></div>
              <div className="mt-2 flex items-center justify-between"><span className="text-sm text-espresso/60">{price(line.item.price)} {menuCopy[language].perUnit}</span><CompactControl item={line.item} quantity={line.quantity} onChange={onChange} language={language} /></div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-baseline justify-between"><span className="text-sm text-espresso/65">{menuCopy[language].total}</span><strong className="text-2xl font-semibold">{price(total)}</strong></div>
      <div className="mt-5 grid gap-2">
        <a href={lines.length ? whatsappUrl : undefined} target="_blank" rel="noreferrer" aria-disabled={!lines.length} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${lines.length ? "bg-espresso text-milk hover:bg-cacao active:translate-y-px" : "pointer-events-none bg-espresso/10 text-espresso/40"}`}><Send size={17} /> {menuCopy[language].orderWhatsApp}</a>
        <button onClick={onShowWaiter} disabled={!lines.length} className="rounded-lg border border-espresso/25 px-4 py-3 text-sm font-semibold transition-colors hover:bg-crema disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-px">{menuCopy[language].showWaiter}</button>
      </div>
    </div>
  );
}

function WaiterModal({ lines, total, onClose, language }: { lines: Array<{ item: MenuItem; quantity: number }>; total: number; onClose: () => void; language: Language }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-espresso/55 p-4 sm:items-center sm:justify-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-md bg-milk p-5 shadow-soft" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-cacao">GO GO COFFEE</p><h2 className="mt-1 text-xl font-semibold">{menuCopy[language].orderForWaiter}</h2></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-crema active:translate-y-px" aria-label={menuCopy[language].close}><X size={18} /></button></div>
        <div className="mt-5 divide-y divide-espresso/15 border-y border-espresso/15">{lines.map((line) => <div key={line.item.id} className="flex justify-between gap-4 py-3 text-sm"><span>{titleFor(line.item, language)} × {line.quantity}</span><strong>{price(line.item.price * line.quantity)}</strong></div>)}</div>
        <div className="mt-5 flex justify-between text-lg font-semibold"><span>{menuCopy[language].total}</span><span>{price(total)}</span></div>
      </div>
    </div>
  );
}

export default App;
