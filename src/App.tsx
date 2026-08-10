import { AnimatePresence, motion } from "framer-motion";
import {
  Coffee,
  CupSoda,
  Instagram,
  Minus,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, menu, type MenuCategory, type MenuItem } from "./data/menu";

type TabId = "popular" | "new" | "all" | MenuCategory;
type Cart = Record<string, number>;

const WHATSAPP_NUMBER = "77711857998";
const INSTAGRAM_URL = "https://www.instagram.com/gogo.coffee.kzo/";
const CART_STORAGE_KEY = "gogo-coffee-cart";

const price = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;

const categoryMeta = new Map(categories.map((category) => [category.id, category]));
const featuredComboIds = new Set(["combo-1", "combo-2"]);
const featuredCombos = menu.filter((item) => featuredComboIds.has(item.id));

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "popular", label: "Танымал" },
  { id: "new", label: "Новое" },
  { id: "all", label: "Барлығы" },
  ...categories.map((category) => ({ id: category.id, label: category.shortLabel })),
];

const accentClasses = {
  coffee: "border-cacao/20 bg-[#fff8ee]",
  fresh: "border-sage/20 bg-[#f2f8ee]",
  food: "border-citrus/25 bg-[#fff7e3]",
  deal: "border-berry/25 bg-[#fff0f3]",
  basic: "border-espresso/10 bg-white",
};

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("popular");
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
      const category = categoryMeta.get(item.category);
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "popular" ? item.popular : activeTab === "new" ? item.isNew : item.category === activeTab);
      const haystack = `${item.title} ${item.description ?? ""} ${category?.label ?? ""}`.toLowerCase();
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

  const showPopularSection = !query.trim() && (activeTab === "popular" || activeTab === "all");
  const groupsToRender = activeTab === "popular" && showPopularSection ? [] : groupedItems;

  const whatsappText = useMemo(() => {
    const lines = cartLines
      .map(
        (line, index) =>
          `${index + 1}. ${line.item.title} x${line.quantity} — ${price(line.item.price * line.quantity)}`,
      )
      .join("\n");

    return `Сәлеметсіз бе! Мен GO GO COFFEE сайтынан тапсырыс бергім келеді:\n\n${lines}\n\nЖалпы: ${price(
      cartTotal,
    )}`;
  }, [cartLines, cartTotal]);

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

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openNewMenu = () => {
    setQuery("");
    setActiveTab("new");
    scrollToMenu();
  };

  const scrollToCart = () => {
    document.getElementById("cart")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-crema text-espresso">
      <header className="relative overflow-hidden bg-espresso text-milk">
        <div className="absolute inset-0 opacity-35 [background:radial-gradient(circle_at_25%_20%,#e6a100_0,transparent_28%),radial-gradient(circle_at_82%_15%,#b72d4c_0,transparent_22%),linear-gradient(135deg,#201713,#5e3d2e_55%,#201713)]" />
        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-citrus">GO GO</p>
            <p className="text-xl font-black leading-none">COFFEE</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <button
              onClick={scrollToCart}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-citrus text-espresso transition hover:bg-[#f1b91c]"
              aria-label="Корзина"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-berry px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        <section className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-14">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-milk/90">
              <Sparkles size={16} className="text-citrus" />
              Premium coffee & food
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] sm:text-6xl">
              GO GO COFFEE
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-milk/86 sm:text-lg">
              Авторлық кофе, салқын лимонадтар, пицца және комбо — бәрі бір жерде.
            </p>
            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <button
                onClick={scrollToMenu}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-citrus px-6 py-3 text-sm font-bold text-espresso shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f2ba22]"
              >
                <Coffee size={18} />
                Мәзірді көру
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-milk transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Send size={18} />
                WhatsApp арқылы байланысу
              </a>
            </div>
          </motion.div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pb-16">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-citrus" />
            <h2 className="text-2xl font-black text-milk sm:text-3xl">Бүгінгі хиттер</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredCombos.map((item, index) => (
              <FeaturedComboCard
                key={item.id}
                item={item}
                index={index}
                quantity={cart[item.id] ?? 0}
                onChange={changeQuantity}
              />
            ))}
          </div>
        </section>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 pt-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:items-start lg:pb-8">
        <section id="menu" className="min-w-0 scroll-mt-4">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="mb-5 overflow-hidden rounded-3xl bg-espresso px-5 py-5 text-milk shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-citrus">Обновление меню</p>
              <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">5 комбо и 3 новых мороженых</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-milk/75">Свежие позиции и цены — как в новом меню GO GO COFFEE.</p>
            </div>
            <button
              onClick={openNewMenu}
              className="mt-4 inline-flex shrink-0 items-center justify-center rounded-full bg-citrus px-5 py-3 text-sm font-black text-espresso transition hover:-translate-y-0.5 hover:bg-[#f2ba22] sm:mt-0"
            >
              Смотреть новое
            </button>
          </motion.section>
          <div className="sticky top-0 z-30 -mx-4 border-b border-espresso/10 bg-crema/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:pt-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-espresso/45" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Мәзірден іздеу..."
                className="h-12 w-full rounded-full border border-espresso/10 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-espresso/40 focus:border-cacao/40 focus:ring-4 focus:ring-cacao/10"
              />
            </div>
            <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-espresso text-milk shadow-soft"
                        : "border border-espresso/10 bg-white text-espresso/70 hover:border-espresso/25"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {showPopularSection && (
            <section className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-berry" />
                <h2 className="text-lg font-black sm:text-2xl">Танымал</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {menu
                  .filter((item) => item.popular && !featuredComboIds.has(item.id))
                  .slice(0, 6)
                  .map((item, index) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      index={index}
                      quantity={cart[item.id] ?? 0}
                      onChange={changeQuantity}
                      compact
                    />
                  ))}
              </div>
            </section>
          )}

          <div className="mt-7 space-y-8">
            {groupsToRender.length === 0 && !showPopularSection ? (
              <div className="rounded-2xl border border-espresso/10 bg-white p-8 text-center text-espresso/60">
                Ештеңе табылмады
              </div>
            ) : (
              groupsToRender.map((group) => (
                <section key={group.category.id} className="scroll-mt-28">
                  <div className="mb-3 flex items-center gap-2">
                    <CategoryIcon category={group.category.id} />
                    <h2 className="text-lg font-black sm:text-2xl">{group.category.label}</h2>
                  </div>
                  <div
                    className={`grid gap-3 ${
                      group.category.accent === "deal" ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"
                    }`}
                  >
                    {group.items.map((item, index) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        index={index}
                        quantity={cart[item.id] ?? 0}
                        onChange={changeQuantity}
                        compact={group.category.accent !== "deal"}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </section>

        <aside id="cart" className="scroll-mt-24 lg:sticky lg:top-6">
          <CartPanel
            lines={cartLines}
            total={cartTotal}
            whatsappUrl={whatsappUrl}
            onChange={changeQuantity}
            onShowWaiter={() => setIsWaiterOpen(true)}
          />
        </aside>
      </main>

      <button
        onClick={scrollToCart}
        className="fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-between rounded-full bg-espresso px-5 py-3 text-sm font-black text-milk shadow-soft lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <ShoppingBag size={18} />
          Корзина
        </span>
        <span>{cartCount ? `${cartCount} · ${price(cartTotal)}` : "0 ₸"}</span>
      </button>

      <AnimatePresence>
        {isWaiterOpen && (
          <WaiterModal lines={cartLines} total={cartTotal} onClose={() => setIsWaiterOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryIcon({ category }: { category: MenuCategory }) {
  if (category === "coffee" || category === "ice-coffee" || category === "tea") {
    return <Coffee size={20} className="text-cacao" />;
  }
  if (category === "lemonades" || category === "fresh" || category === "smoothie" || category === "milkshake") {
    return <CupSoda size={20} className="text-sage" />;
  }
  return <Utensils size={20} className="text-berry" />;
}

function FeaturedComboCard({
  item,
  index,
  quantity,
  onChange,
}: {
  item: MenuItem;
  index: number;
  quantity: number;
  onChange: (id: string, delta: number) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const details = item.description?.split(" + ") ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.08, duration: 0.5 }}
      className="overflow-hidden rounded-[28px] border border-white/15 bg-milk text-espresso shadow-soft"
    >
      {item.image && !imageFailed && (
        <div className="relative aspect-[16/11] overflow-hidden bg-black md:aspect-[16/10]">
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-contain"
            loading={index === 0 ? "eager" : "lazy"}
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div className="flex min-h-[280px] flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex rounded-full bg-berry px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
              {item.badge ?? "Хит"}
            </span>
            <span className="shrink-0 rounded-full bg-espresso px-3 py-1 text-sm font-black text-milk">
              {price(item.price)}
            </span>
          </div>
          <h3 className="mt-5 text-4xl font-black leading-none sm:text-5xl lg:text-4xl">{item.title}</h3>
          {details.length > 0 && (
            <div className="mt-5 grid gap-2 text-base font-bold text-espresso/76">
              {details.map((detail) => (
                <div key={detail} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-citrus" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          {quantity > 0 ? (
            <div className="inline-flex w-full items-center justify-between rounded-full border border-espresso/10 bg-white p-1.5">
              <button
                onClick={() => onChange(item.id, -1)}
                className="grid h-11 w-11 place-items-center rounded-full bg-crema text-espresso transition hover:bg-citrus/35"
                aria-label={`Уменьшить ${item.title}`}
              >
                <Minus size={18} />
              </button>
              <span className="grid min-w-12 place-items-center text-base font-black">{quantity}</span>
              <button
                onClick={() => onChange(item.id, 1)}
                className="grid h-11 w-11 place-items-center rounded-full bg-espresso text-milk transition hover:bg-cacao"
                aria-label={`Добавить ${item.title}`}
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onChange(item.id, 1)}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-espresso px-5 text-base font-black text-milk transition hover:bg-cacao"
            >
              <Plus size={19} />
              Себетке қосу
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function MenuCard({
  item,
  index,
  quantity,
  onChange,
  compact,
}: {
  item: MenuItem;
  index: number;
  quantity: number;
  onChange: (id: string, delta: number) => void;
  compact?: boolean;
}) {
  const category = categoryMeta.get(item.category);
  const isDeal = item.category === "combo" || item.category === "sets";
  const accent = category ? accentClasses[category.accent] : accentClasses.basic;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.025, 0.18), duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={`flex min-h-[126px] flex-col justify-between rounded-2xl border p-4 shadow-[0_10px_24px_rgba(32,23,19,0.06)] ${accent} ${
        isDeal ? "min-h-[168px] border-berry/30" : ""
      }`}
    >
      {item.image && !imageFailed && (
        <div className={`mb-3 overflow-hidden rounded-xl ${isDeal ? "h-40 bg-black sm:h-44" : "h-36 bg-crema sm:h-40"}`}>
          <img
            src={item.image}
            alt={item.title}
            className={`h-full w-full ${isDeal ? "object-contain" : "object-cover"}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className={`${compact ? "text-[15px]" : "text-lg"} font-black leading-snug`}>{item.title}</h3>
          <p className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-sm font-black text-espresso shadow-sm">
            {price(item.price)}
          </p>
        </div>
        {(item.description || item.badge) && (
          <div className="mt-2 space-y-2">
            {item.badge && (
              <span className="inline-flex rounded-full bg-berry px-2.5 py-1 text-xs font-bold text-white">
                {item.badge}
              </span>
            )}
            {item.description && <p className="text-sm leading-5 text-espresso/65">{item.description}</p>}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        {quantity > 0 ? (
          <div className="inline-flex items-center rounded-full border border-espresso/10 bg-white p-1">
            <button
              onClick={() => onChange(item.id, -1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-crema text-espresso transition hover:bg-citrus/35"
              aria-label={`Уменьшить ${item.title}`}
            >
              <Minus size={17} />
            </button>
            <span className="grid min-w-9 place-items-center text-sm font-black">{quantity}</span>
            <button
              onClick={() => onChange(item.id, 1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-milk transition hover:bg-cacao"
              aria-label={`Добавить ${item.title}`}
            >
              <Plus size={17} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onChange(item.id, 1)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-espresso px-4 text-sm font-bold text-milk transition hover:bg-cacao"
          >
            <Plus size={17} />
            Қосу
          </button>
        )}
      </div>
    </motion.article>
  );
}

function CartPanel({
  lines,
  total,
  whatsappUrl,
  onChange,
  onShowWaiter,
}: {
  lines: Array<{ item: MenuItem; quantity: number }>;
  total: number;
  whatsappUrl: string;
  onChange: (id: string, delta: number) => void;
  onShowWaiter: () => void;
}) {
  return (
    <div className="rounded-3xl border border-espresso/10 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-berry">Тапсырыс</p>
          <h2 className="mt-1 text-2xl font-black">Корзина</h2>
        </div>
        <ShoppingBag className="text-cacao" size={26} />
      </div>

      {lines.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-crema p-5 text-sm leading-6 text-espresso/65">
          Мәзірден ұнаған позицияларды қосыңыз.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {lines.map((line) => (
            <div key={line.item.id} className="rounded-2xl border border-espresso/10 p-3">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-bold leading-snug">{line.item.title}</p>
                  <p className="mt-1 text-sm text-espresso/55">
                    {line.quantity} x {price(line.item.price)}
                  </p>
                </div>
                <p className="shrink-0 font-black">{price(line.item.price * line.quantity)}</p>
              </div>
              <div className="mt-3 inline-flex items-center rounded-full bg-crema p-1">
                <button
                  onClick={() => onChange(line.item.id, -1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white"
                  aria-label={`Уменьшить ${line.item.title}`}
                >
                  <Minus size={16} />
                </button>
                <span className="grid min-w-8 place-items-center text-sm font-black">{line.quantity}</span>
                <button
                  onClick={() => onChange(line.item.id, 1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-espresso text-milk"
                  aria-label={`Добавить ${line.item.title}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-espresso/10 pt-4">
        <span className="font-bold text-espresso/65">Жалпы</span>
        <span className="text-2xl font-black">{price(total)}</span>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          onClick={onShowWaiter}
          disabled={lines.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-citrus px-4 py-3 text-sm font-black text-espresso transition hover:bg-[#f0b51b] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Sparkles size={17} />
          Официантқа көрсету
        </button>
        <a
          href={lines.length ? whatsappUrl : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={lines.length === 0}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${
            lines.length
              ? "bg-berry text-white hover:bg-[#a42743]"
              : "pointer-events-none bg-espresso/10 text-espresso/35"
          }`}
        >
          <Send size={17} />
          WhatsApp-қа жіберу
        </a>
      </div>
    </div>
  );
}

function WaiterModal({
  lines,
  total,
  onClose,
}: {
  lines: Array<{ item: MenuItem; quantity: number }>;
  total: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-end bg-espresso/55 p-3 sm:place-items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-berry">GO GO COFFEE</p>
            <h2 className="mt-1 text-2xl font-black">Официантқа көрсету</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-crema"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {lines.map((line, index) => (
            <div key={line.item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {index + 1}. {line.item.title} x{line.quantity}
              </span>
              <strong>{price(line.item.price * line.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-espresso/10 pt-4 text-lg font-black">
          <span>Жалпы</span>
          <span>{price(total)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default App;
