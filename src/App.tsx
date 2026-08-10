import { useEffect, useMemo, useState } from "react";
import { Instagram, Minus, Plus, Search, Send, ShoppingBag, X } from "lucide-react";
import { categories, menu, type MenuCategory, type MenuItem } from "./data/menu";

type TabId = "popular" | "new" | "all" | MenuCategory;
type Cart = Record<string, number>;

const WHATSAPP_NUMBER = "77711857998";
const INSTAGRAM_URL = "https://www.instagram.com/gogo.coffee.kzo/";
const CART_STORAGE_KEY = "gogo-coffee-cart";
const price = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;
const categoryMeta = new Map(categories.map((category) => [category.id, category]));

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "popular", label: "Популярное" },
  { id: "new", label: "Новое" },
  { id: "all", label: "Всё меню" },
  ...categories.map((category) => ({ id: category.id, label: category.shortLabel })),
];

const featuredItems = menu.filter((item) => item.category === "combo" && item.isNew);
const imageScaleClass = (item: MenuItem) => (item.id === "combo-4" || item.id === "combo-5" ? "scale-[0.82]" : item.id === "combo-3" ? "scale-[0.9]" : "scale-100");

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

  const whatsappText = useMemo(() => {
    const lines = cartLines
      .map(
        (line, index) =>
          `${index + 1}. ${line.item.title} × ${line.quantity} — ${price(line.item.price * line.quantity)}`,
      )
      .join("\n");
    return `Здравствуйте! Хочу заказать в GO GO COFFEE:\n\n${lines}\n\nИтого: ${price(cartTotal)}`;
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

  const scrollToMenu = (tab?: TabId) => {
    if (tab) {
      setQuery("");
      setActiveTab(tab);
    }
    window.setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

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
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-lg text-milk/80 transition-colors hover:bg-white/10 hover:text-milk active:translate-y-px"
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
              <span>{cartCount || "Корзина"}</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="border-b border-espresso/15 bg-milk">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-cacao">Кофе · бургеры · пицца · напитки</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Выберите любимое. Закажите за минуту.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-espresso/70">
                Соберите корзину, проверьте цены и отправьте готовый заказ в WhatsApp.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToMenu("new")}
                  className="rounded-lg bg-espresso px-5 py-3 text-sm font-semibold text-milk transition-colors hover:bg-cacao active:translate-y-px"
                >
                  Новое меню
                </button>
                <button
                  onClick={() => scrollToMenu("all")}
                  className="rounded-lg border border-espresso/25 px-5 py-3 text-sm font-semibold transition-colors hover:bg-crema active:translate-y-px"
                >
                  Все цены
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl border-b border-espresso/15 px-4 py-7 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-cacao">Обновление меню</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Новые комбо</h2>
            </div>
            <button onClick={() => scrollToMenu("new")} className="text-sm font-semibold underline underline-offset-4">
              Смотреть всё
            </button>
          </div>
          <div className="hide-scrollbar mt-5 flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {featuredItems.map((item) => (
              <FeaturedItem
                key={item.id}
                item={item}
                quantity={cart[item.id] ?? 0}
                onChange={changeQuantity}
              />
            ))}
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-28 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:pb-10">
          <section id="menu" className="min-w-0 scroll-mt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cacao">Каталог</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Меню и цены</h2>
              </div>
              <span className="text-sm text-espresso/60">{visibleItems.length} поз.</span>
            </div>

            <div className="sticky top-0 z-20 -mx-4 mt-5 border-y border-espresso/15 bg-crema px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-t">
              <label className="relative block">
                <span className="sr-only">Поиск по меню</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-espresso/50" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 w-full rounded-md border border-espresso/20 bg-milk pl-10 pr-3 text-sm outline-none focus:border-cacao focus:ring-2 focus:ring-cacao/15"
                />
              </label>
              <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors active:translate-y-px ${
                        isActive ? "bg-espresso text-milk" : "bg-milk text-espresso/70 hover:bg-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              {groupedItems.length === 0 ? (
                <p className="border-y border-espresso/15 py-8 text-sm text-espresso/65">Ничего не найдено. Попробуйте другое название.</p>
              ) : (
                groupedItems.map((group) => (
                  <section key={group.category.id} className="mb-9 scroll-mt-28">
                    <div className="mb-3 flex items-baseline justify-between border-b border-espresso/20 pb-3">
                      <h3 className="text-lg font-semibold">{group.category.label}</h3>
                      <span className="text-sm text-espresso/55">{group.items.length}</span>
                    </div>
                    <div className={group.category.accent === "deal" ? "grid gap-4 sm:grid-cols-2" : "divide-y divide-espresso/15"}>
                      {group.items.map((item) => (
                        <MenuItemRow
                          key={item.id}
                          item={item}
                          quantity={cart[item.id] ?? 0}
                          onChange={changeQuantity}
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
            />
          </aside>
        </div>
      </main>

      <button
        onClick={scrollToCart}
        className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-lg bg-espresso px-4 py-3 text-sm font-semibold text-milk shadow-soft active:translate-y-px lg:hidden"
      >
        <span className="inline-flex items-center gap-2"><ShoppingBag size={18} /> Корзина</span>
        <span>{cartCount ? `${cartCount} · ${price(cartTotal)}` : "Пусто"}</span>
      </button>

      {isWaiterOpen && <WaiterModal lines={cartLines} total={cartTotal} onClose={() => setIsWaiterOpen(false)} />}
    </div>
  );
}

function FeaturedItem({
  item,
  quantity,
  onChange,
}: {
  item: MenuItem;
  quantity: number;
  onChange: (id: string, delta: number) => void;
}) {
  return (
    <article className="w-[220px] shrink-0 snap-start overflow-hidden bg-espresso text-milk lg:w-auto">
      {item.image && (
        <div className="flex h-40 items-end justify-center px-3 pt-3">
          <img src={item.image} alt={`Фото ${item.title}`} className={`h-full w-full object-contain ${imageScaleClass(item)}`} loading="lazy" />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{item.title}</h3>
          <span className="text-sm font-semibold text-citrus">{price(item.price)}</span>
        </div>
        <p className="mt-1 min-h-10 text-xs leading-5 text-milk/70">{item.description}</p>
        <CompactControl item={item} quantity={quantity} onChange={onChange} dark />
      </div>
    </article>
  );
}

function MenuItemRow({
  item,
  quantity,
  onChange,
}: {
  item: MenuItem;
  quantity: number;
  onChange: (id: string, delta: number) => void;
}) {
  const isDeal = item.category === "combo" || item.category === "sets" || item.category === "desserts";

  return (
    <article className={isDeal ? "overflow-hidden border border-espresso/15 bg-milk" : "flex items-center gap-3 py-4"}>
      {isDeal && item.image && (
        <div className="flex h-48 items-end justify-center bg-crema px-4 pt-4">
          <img src={item.image} alt={`Фото ${item.title}`} className={`h-full w-full object-contain ${imageScaleClass(item)}`} loading="lazy" />
        </div>
      )}
      <div className={isDeal ? "p-4" : "min-w-0 flex-1"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-semibold leading-snug">{item.title}</h4>
            {item.description && <p className="mt-1 text-sm leading-5 text-espresso/65">{item.description}</p>}
          </div>
          <p className="shrink-0 text-base font-semibold">{price(item.price)}</p>
        </div>
        <CompactControl item={item} quantity={quantity} onChange={onChange} />
      </div>
    </article>
  );
}

function CompactControl({ item, quantity, dark, onChange }: { item: MenuItem; quantity: number; dark?: boolean; onChange: (id: string, delta: number) => void }) {
  if (quantity > 0) {
    return (
      <div className={`mt-3 inline-flex items-center overflow-hidden rounded-md border ${dark ? "border-white/20" : "border-espresso/20"}`}>
        <button onClick={() => onChange(item.id, -1)} className={`grid h-9 w-9 place-items-center ${dark ? "hover:bg-cacao" : "hover:bg-crema"} active:translate-y-px`} aria-label={`Убрать ${item.title}`}><Minus size={16} /></button>
        <span className="grid h-9 min-w-9 place-items-center text-sm font-semibold">{quantity}</span>
        <button onClick={() => onChange(item.id, 1)} className={`grid h-9 w-9 place-items-center ${dark ? "bg-citrus text-espresso hover:bg-[#f1b91c]" : "bg-espresso text-milk hover:bg-cacao"} active:translate-y-px`} aria-label={`Добавить ${item.title}`}><Plus size={16} /></button>
      </div>
    );
  }

  return <button onClick={() => onChange(item.id, 1)} className={`mt-3 rounded-md px-3 py-2 text-sm font-semibold active:translate-y-px ${dark ? "bg-citrus text-espresso hover:bg-[#f1b91c]" : "bg-espresso text-milk hover:bg-cacao"}`}>Добавить</button>;
}

function CartPanel({ lines, total, whatsappUrl, onChange, onShowWaiter }: { lines: Array<{ item: MenuItem; quantity: number }>; total: number; whatsappUrl: string; onChange: (id: string, delta: number) => void; onShowWaiter: () => void }) {
  return (
    <div className="border-y border-espresso/20 py-5 lg:border lg:bg-milk lg:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold">Корзина</h2>
        <span className="text-sm text-espresso/60">{lines.length ? `${lines.length} поз.` : "Пока пусто"}</span>
      </div>
      {lines.length === 0 ? <p className="mt-4 text-sm leading-6 text-espresso/65">Добавьте позицию из меню — здесь появится сумма и кнопка заказа.</p> : (
        <div className="mt-4 divide-y divide-espresso/15 border-y border-espresso/15">
          {lines.map((line) => (
            <div key={line.item.id} className="py-3">
              <div className="flex justify-between gap-3"><p className="font-medium leading-snug">{line.item.title}</p><p className="shrink-0 font-semibold">{price(line.item.price * line.quantity)}</p></div>
              <div className="mt-2 flex items-center justify-between"><span className="text-sm text-espresso/60">{price(line.item.price)} за шт.</span><CompactControl item={line.item} quantity={line.quantity} onChange={onChange} /></div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-baseline justify-between"><span className="text-sm text-espresso/65">Итого</span><strong className="text-2xl font-semibold">{price(total)}</strong></div>
      <div className="mt-5 grid gap-2">
        <a href={lines.length ? whatsappUrl : undefined} target="_blank" rel="noreferrer" aria-disabled={!lines.length} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${lines.length ? "bg-espresso text-milk hover:bg-cacao active:translate-y-px" : "pointer-events-none bg-espresso/10 text-espresso/40"}`}><Send size={17} /> Заказать в WhatsApp</a>
        <button onClick={onShowWaiter} disabled={!lines.length} className="rounded-lg border border-espresso/25 px-4 py-3 text-sm font-semibold transition-colors hover:bg-crema disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-px">Показать заказ официанту</button>
      </div>
    </div>
  );
}

function WaiterModal({ lines, total, onClose }: { lines: Array<{ item: MenuItem; quantity: number }>; total: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-espresso/55 p-4 sm:items-center sm:justify-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-md bg-milk p-5 shadow-soft" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-cacao">GO GO COFFEE</p><h2 className="mt-1 text-xl font-semibold">Покажите этот заказ официанту</h2></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-crema active:translate-y-px" aria-label="Закрыть"><X size={18} /></button></div>
        <div className="mt-5 divide-y divide-espresso/15 border-y border-espresso/15">{lines.map((line) => <div key={line.item.id} className="flex justify-between gap-4 py-3 text-sm"><span>{line.item.title} × {line.quantity}</span><strong>{price(line.item.price * line.quantity)}</strong></div>)}</div>
        <div className="mt-5 flex justify-between text-lg font-semibold"><span>Итого</span><span>{price(total)}</span></div>
      </div>
    </div>
  );
}

export default App;
