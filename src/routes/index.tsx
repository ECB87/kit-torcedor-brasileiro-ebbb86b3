import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, Calendar, CheckCircle2, CircleDot, Flag, Glasses, Lock, MapPin, Megaphone,
  MessageCircle, Package, Palette, PartyPopper, Scissors, ShieldCheck,
  ShoppingCart, Shirt, Sparkles, Star, Truck, Wand2, X, Zap,
} from "lucide-react";
import {
  ALERTS, CATEGORY_META, FAQS, REVIEWS, TORCEDOR_ITEMS,
  type Category, type TorcedorItem,
} from "@/lib/torcedor-data";
import kitRealImg from "@/assets/kit_torcedor_real_layout.png";
import kitBoxImg from "@/assets/kit_torcedor_box_items_white_bg.jpg";

const CHECKOUT_URL = "https://entrega.logzz.com.br/pay/memgnzpp7/vaibrasil";
const WHATSAPP_URL = "https://wa.me/5511999999999?text=Ol%C3%A1!+Tenho+d%C3%BAvidas+sobre+o+Kit+Torcedor+Brasil";

export const Route = createFileRoute("/")({
  component: Landing,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Glasses, Flag, PartyPopper, Megaphone, Palette, Calendar, Wand2, Shirt,
  CircleDot, Sparkles, Scissors, Bell,
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function Landing() {
  // ---- Countdown to Copa ----
  const copaDays = Math.max(
    0,
    Math.ceil((new Date("2026-06-11").getTime() - Date.now()) / 86400000),
  );

  // ---- Offer timer (sessionStorage) ----
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  useEffect(() => {
    const KEY = "kit_deadline";
    let deadline = Number(sessionStorage.getItem(KEY) || 0);
    if (!deadline || isNaN(deadline)) {
      deadline = Date.now() + 15 * 60 * 1000;
      sessionStorage.setItem(KEY, String(deadline));
    }
    const tick = () => {
      const left = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ---- Stock counter ----
  const initialStock = 18;
  const [itemsLeft, setItemsLeft] = useState(14);
  useEffect(() => {
    const id = setInterval(() => {
      setItemsLeft((n) => (n > 3 ? n - 1 : n));
    }, 35000);
    return () => clearInterval(id);
  }, []);
  const stockWidth = Math.max(10, (itemsLeft / initialStock) * 100);

  // ---- CEP lookup ----
  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepSuccess, setCepSuccess] = useState<string | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);
  const handleCepLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCepSuccess(null);
    setCepError(null);
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setCepError("CEP inválido — use 8 dígitos");
      return;
    }
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) setCepError("CEP não encontrado. Verifique e tente novamente.");
      else setCepSuccess(`${data.localidade} - ${data.uf}`);
    } catch {
      setCepError("Erro ao consultar. Tente novamente.");
    } finally {
      setCepLoading(false);
    }
  };

  // ---- Kit explorer ----
  const [activeCategory, setActiveCategory] = useState<"all" | Category>("all");
  const [selectedItem, setSelectedItem] = useState<TorcedorItem | null>(null);
  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? TORCEDOR_ITEMS
        : TORCEDOR_ITEMS.filter((i) => i.category === activeCategory),
    [activeCategory],
  );

  // ---- Hero media tabs ----
  const [activeMedia, setActiveMedia] = useState<"vsl" | "real" | "box">("vsl");

  // ---- FAQ ----
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // ---- Social proof ----
  const [currentAlert, setCurrentAlert] = useState<typeof ALERTS[number] | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const alertIdx = useRef(0);
  useEffect(() => {
    let hideT: ReturnType<typeof setTimeout> | undefined;
    const showNext = () => {
      const a = ALERTS[alertIdx.current % ALERTS.length];
      alertIdx.current += 1;
      setCurrentAlert(a);
      setAlertVisible(true);
      if (hideT) clearTimeout(hideT);
      hideT = setTimeout(() => setAlertVisible(false), 5500);
    };
    const first = setTimeout(showNext, 3000);
    const loop = setInterval(showNext, 14000);
    return () => {
      clearTimeout(first);
      if (hideT) clearTimeout(hideT);
      clearInterval(loop);
    };
  }, []);

  // ---- Mobile CTA bar ----
  const [showMobileCta, setShowMobileCta] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowMobileCta(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tickerItems = [
    "⚽ COPA DO MUNDO 2026 — PREPARE SUA TORCIDA!",
    "🚚 FRETE GRÁTIS PARA TODO O BRASIL",
    "🔥 OFERTA LIMITADA: 73% OFF HOJE",
    "✅ PAGAMENTO NA ENTREGA DISPONÍVEL",
  ];

  const totalSeparate = TORCEDOR_ITEMS.reduce((s, i) => s + i.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ============ SECTION 1: TICKER ============ */}
      <div className="w-full overflow-hidden bg-[#006633] text-white text-sm font-semibold">
        <div className="flex whitespace-nowrap animate-marquee py-2.5">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="px-8 inline-flex items-center gap-2">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ============ SECTION 2: HEADER ============ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#009a44] to-[#006633] grid place-items-center text-white">
              <Flag className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">
                KIT TORCEDOR BRASIL
              </div>
              <div className="text-[11px] font-semibold text-[#e6b800]">Copa 2026</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-full">
              <Lock className="w-3.5 h-3.5" /> Compra 100% Protegida
            </div>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ir para o checkout e comprar agora"
              className="inline-flex items-center gap-1.5 bg-[#006633] hover:bg-[#005528] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" /> Comprar Agora
            </a>
          </div>
        </div>
      </header>

      {/* ============ SECTION 3: HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1f0e] via-[#0a1f0e] to-slate-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #009a44 0%, transparent 40%), radial-gradient(circle at 80% 60%, #FFCC00 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-20 lg:py-20 grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#FFCC00] text-[#0a1f0e] font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-full pulse-yellow"
            >
              🏆 SUPER LANÇAMENTO · 73% OFF
            </motion.div>

            <div className="font-mono text-xs sm:text-sm bg-[#FFCC00]/10 border border-[#FFCC00]/40 text-[#FFCC00] inline-flex px-3 py-1.5 rounded-md">
              ⚽ FALTAM {copaDays} DIAS PARA A COPA DO MUNDO 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Kit Torcedor Brasil Oficial · <span className="text-[#FFCC00]">12 Itens Incríveis</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200/90 max-w-xl">
              Tudo que sua família precisa para vibrar na Copa. Chega em até 5 dias na sua casa.
            </p>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
              {[
                { e: "😊", l: "DIVERSÃO" },
                { e: "😎", l: "ESTILO" },
                { e: "👥", l: "FAMÍLIA" },
                { e: "⚡", l: "ENERGIA" },
              ].map((m) => (
                <div key={m.l} className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-2xl">{m.e}</div>
                  <div className="text-[10px] sm:text-xs font-bold tracking-wide text-slate-200 mt-1">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>

            {/* URGENCY BLOCK */}
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4 sm:p-5 space-y-4">
              {timeLeft > 0 ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-slate-200">
                    ⏰ Oferta termina em
                  </div>
                  <div className="font-mono font-extrabold text-2xl sm:text-3xl text-[#FFCC00] tabular-nums">
                    {fmtTime(timeLeft)}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-bold text-red-400">
                  ⏰ OFERTA EXPIRADA — Recarregue para verificar disponibilidade
                </div>
              )}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1.5">
                  <span>🔴 {itemsLeft} unidades restando com frete grátis</span>
                  <span className="text-[#FFCC00]">{Math.round(stockWidth)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${stockWidth}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-[#FFCC00] to-[#e6b800] rounded-full"
                  />
                </div>
              </div>
            </div>

            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Garantir meu kit oficial agora"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#e6b800] text-slate-900 font-extrabold text-base sm:text-lg px-7 py-4 rounded-xl shadow-xl shadow-yellow-500/20 transition hover:scale-[1.02] hover:shadow-yellow-500/40"
            >
              GARANTIR MEU KIT OFICIAL JÁ →
            </a>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2">
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur">
              <div className="flex gap-2 mb-3">
                {(["vsl", "real", "box"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveMedia(k)}
                    aria-label={`Ver ${k === "vsl" ? "vídeo do kit" : k === "real" ? "foto real do kit" : "embalagem"}`}
                    className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-lg transition ${
                      activeMedia === k
                        ? "bg-[#FFCC00] text-slate-900"
                        : "bg-white/10 text-slate-200 hover:bg-white/15"
                    }`}
                  >
                    {k === "vsl" ? "▶ Vídeo" : k === "real" ? "Foto Real" : "Embalagem"}
                  </button>
                ))}
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
                <AnimatePresence mode="wait">
                  {activeMedia === "vsl" ? (
                    <motion.video
                      key="vsl"
                      src="/vsl.mp4"
                      controls
                      playsInline
                      preload="metadata"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full object-cover bg-black"
                    />
                  ) : (
                    <motion.img
                      key={activeMedia}
                      src={activeMedia === "real" ? kitRealImg : kitBoxImg}
                      alt={activeMedia === "real" ? "Layout real dos 12 itens do Kit Torcedor Brasil" : "Embalagem oficial do Kit Torcedor Brasil"}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35 }}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute top-3 right-3 bg-slate-900/85 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full">
                  CAIXA OFICIAL ★★★★★
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs font-semibold text-slate-200">
                <div className="bg-white/5 rounded-md py-2">12 ITENS</div>
                <div className="bg-white/5 rounded-md py-2">FRETE GRÁTIS</div>
                <div className="bg-white/5 rounded-md py-2">ENVIO SEDEX</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: CEP CALCULATOR ============ */}
      <section className="relative -mt-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#006633] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <Truck className="w-3.5 h-3.5" /> CALCULADORA DE FRETE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 text-slate-900">
              Confira o prazo de entrega na sua casa
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Frete grátis para todo o Brasil via Sedex Expresso. Despachamos em até 24h após a confirmação.
            </p>
          </div>
          <form onSubmit={handleCepLookup} className="space-y-3">
            <label htmlFor="cep" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#006633]" /> Digite seu CEP
            </label>
            <div className="flex gap-2">
              <input
                id="cep"
                inputMode="numeric"
                maxLength={9}
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="flex-1 border-2 border-slate-200 focus:border-[#006633] outline-none rounded-lg px-4 py-3 text-base font-mono"
                aria-label="CEP"
              />
              <button
                type="submit"
                disabled={cepLoading}
                className="bg-[#006633] hover:bg-[#005528] disabled:opacity-60 text-white font-bold px-5 py-3 rounded-lg transition"
              >
                {cepLoading ? "..." : "Calcular"}
              </button>
            </div>
            {cepSuccess && (
              <div className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                ✅ Frete Grátis para {cepSuccess}! Prazo: 2 a 4 dias úteis via Sedex Expresso.
              </div>
            )}
            {cepError && (
              <div className="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4" /> {cepError}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ============ SECTION 5: KIT EXPLORER ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#006633] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            <Package className="w-3.5 h-3.5" /> 12 ITENS NO KIT
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mt-3 text-slate-900">
            O Que Tem no Kit Torcedor Brasil?
          </h2>
          <p className="text-slate-600 mt-3">
            Filtre por categoria e veja a ficha técnica completa de cada item.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(Object.keys(CATEGORY_META) as Array<"all" | Category>).map((k) => {
            const meta = CATEGORY_META[k];
            const active = activeCategory === k;
            const count = k === "all" ? TORCEDOR_ITEMS.length : TORCEDOR_ITEMS.filter((i) => i.category === k).length;
            return (
              <button
                key={k}
                onClick={() => setActiveCategory(k)}
                aria-pressed={active}
                className={`text-sm font-bold px-4 py-2 rounded-full border-2 transition ${
                  active ? "shadow-md" : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
                style={
                  active
                    ? { background: meta.bg, color: meta.color, borderColor: meta.bg }
                    : undefined
                }
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const Icon = ICONS[item.icon] ?? Sparkles;
                const meta = CATEGORY_META[item.category];
                return (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedItem(item)}
                    className={`text-left bg-white border-2 rounded-xl p-4 hover:shadow-lg transition group ${
                      selectedItem?.id === item.id ? "border-[#006633]" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 shrink-0 rounded-lg grid place-items-center"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h3>
                          <span className="text-[11px] font-bold text-slate-500 shrink-0">x{item.qty}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{item.short}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* DETAIL PANEL */}
          <div className="lg:sticky lg:top-20 self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem?.id ?? "empty"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="bg-gradient-to-br from-[#0a1f0e] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-white/10"
              >
                {selectedItem ? (
                  <>
                    <div
                      className="w-16 h-16 rounded-xl grid place-items-center mb-4"
                      style={{
                        background: CATEGORY_META[selectedItem.category].bg,
                        color: CATEGORY_META[selectedItem.category].color,
                      }}
                    >
                      {(() => {
                        const Icon = ICONS[selectedItem.icon] ?? Sparkles;
                        return <Icon className="w-8 h-8" />;
                      })()}
                    </div>
                    <div className="text-xs font-bold text-[#FFCC00] uppercase tracking-wide">
                      {CATEGORY_META[selectedItem.category].label} · x{selectedItem.qty}
                    </div>
                    <h3 className="text-xl font-extrabold mt-1">{selectedItem.name}</h3>
                    <p className="text-sm text-slate-300 mt-3">{selectedItem.full}</p>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-10 h-10 text-[#FFCC00] mb-4" />
                    <h3 className="text-xl font-extrabold">Toque em um item</h3>
                    <p className="text-sm text-slate-300 mt-2">
                      Veja a ficha técnica completa de cada produto do kit.
                    </p>
                  </>
                )}
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#e6b800] text-slate-900 font-extrabold py-3 rounded-xl transition"
                >
                  Quero os 12 Itens →
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ============ SECTION 6: BENEFITS ============ */}
      <section className="bg-emerald-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Por Que o Kit Torcedor Brasil?
            </h2>
            <p className="text-slate-600 mt-3">Pensado para a família toda vibrar junto.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, t: "Qualidade Premium", d: "Materiais resistentes e atóxicos, testados para o uso real." },
              { icon: Sparkles, t: "Diversão para Todas as Idades", d: "Itens seguros para crianças, divertidos para adultos." },
              { icon: PartyPopper, t: "Perfeito para Presentear", d: "Caixa lacrada com visual de presente — pronta pra entregar." },
              { icon: Package, t: "Kit Completo de Uma Vez", d: "Sem precisar caçar item por item: chega tudo junto." },
            ].map((b) => (
              <div key={b.t} className="bg-white rounded-2xl p-6 border border-emerald-100 hover:border-emerald-200 transition">
                <div className="w-12 h-12 rounded-lg bg-[#006633] text-white grid place-items-center mb-4">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900">{b.t}</h3>
                <p className="text-sm text-slate-600 mt-2">{b.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#006633] to-[#0a1f0e] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold">FAÇA A DIFERENÇA NA TORCIDA</h3>
              <p className="text-sm text-slate-200 mt-1">12 itens · Frete grátis · Garantia de 7 dias</p>
            </div>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFCC00] hover:bg-[#e6b800] text-slate-900 font-extrabold px-6 py-3.5 rounded-xl transition shadow-lg"
            >
              Garantir Meu Kit →
            </a>
          </div>
        </div>
      </section>

      {/* ============ SECTION 7: PRICE ANCHOR + CTA ============ */}
      <section className="bg-slate-900 text-white border-t-8 border-[#FFCC00] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-start">
          {/* LEFT: itemized */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FFCC00] bg-[#FFCC00]/10 border border-[#FFCC00]/30 px-2.5 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5" /> ANÁLISE DE PREÇO
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
              Se você comprasse separado...
            </h2>
            <p className="text-slate-300 mt-2 text-sm">Veja quanto pagaria item por item:</p>

            <ul className="mt-6 divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
              {TORCEDOR_ITEMS.map((i) => (
                <li key={i.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-200">{i.name}{i.qty > 1 ? ` (par)` : ""}</span>
                  <span className="font-mono text-slate-400">~{formatBRL(i.price)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between px-4 py-3 bg-white/5">
                <span className="font-bold text-white">Total separado:</span>
                <span className="font-mono font-extrabold text-slate-400 line-through">
                  {formatBRL(totalSeparate)}
                </span>
              </li>
            </ul>

            <div className="mt-5 rounded-xl bg-[#FFCC00] text-slate-900 p-4 font-extrabold text-center text-lg">
              No kit completo: {formatBRL(137.99)} — ECONOMIA DE {formatBRL(totalSeparate - 137.99)}
            </div>
          </div>

          {/* RIGHT: purchase card */}
          <div className="relative bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8">
            <div className="absolute -top-3 left-6 bg-[#FFCC00] text-slate-900 text-[11px] font-extrabold px-3 py-1.5 rounded-full">
              MELHOR OFERTA DO ANO ✦ LOTE PROMOCIONAL
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-slate-500 line-through text-base">De R$ 249,90</span>
              <span className="bg-red-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded">73% OFF</span>
            </div>
            <div className="mt-2 text-5xl sm:text-6xl font-extrabold text-[#006633] tracking-tight">
              R$ 137,<span className="text-3xl sm:text-4xl align-top">99</span>
            </div>
            <div className="text-sm text-slate-700 font-semibold mt-1">
              ou 12x de R$ 12,83 sem juros no cartão
            </div>

            <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
              <div className="font-extrabold">🚚 PAGAMENTO NA ENTREGA DISPONÍVEL!</div>
              <div className="text-emerald-800 mt-0.5">Pague somente quando receber o kit em casa.</div>
            </div>

            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Envio em 24h com rastreamento",
                "Embalagem lacrada de fábrica",
                "Garantia de 7 dias incondicional",
                "Frete grátis para todo o Brasil",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006633] mt-0.5 shrink-0" />
                  <span className="text-slate-700">{b}</span>
                </li>
              ))}
            </ul>

            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Quero meu kit, pagar na entrega"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#006633] hover:bg-[#005528] text-white font-extrabold text-base uppercase tracking-wide px-6 py-4 rounded-xl transition shadow-lg hover:scale-[1.01]"
            >
              Quero Meu Kit — Pagar na Entrega →
            </a>
            <div className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" /> Ambiente seguro Logzz com SSL bancário
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 8: REVIEWS ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Quem Já Comprou Recomenda!
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="text-[#FFCC00] text-lg">★★★★★</span>
            <span>4.9 · 1.247 avaliações verificadas</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  decoding="async"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">{r.city}</div>
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ Compra Verificada
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[#FFCC00] text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "text-slate-300"}`} />
                    ))}
                    <span className="text-xs text-slate-400 ml-2">{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SECTION 9: FAQ ============ */}
      <section className="bg-[#04200c] text-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Perguntas Frequentes</h2>
            <p className="text-slate-300 mt-2">Tudo que você precisa saber antes de comprar.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = faqOpenIndex === i;
              return (
                <div key={f.q} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFaqOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition"
                  >
                    <span className="font-bold text-sm sm:text-base">{f.q}</span>
                    <span className={`text-[#FFCC00] text-2xl transition-transform ${open ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-sm text-slate-200">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION 10: FOOTER ============ */}
      <footer className="bg-slate-950 text-slate-300 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-2 gap-8">
          <div>
            <div className="font-extrabold text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#FFCC00]" />
              KIT TORCEDOR BRASIL <span className="text-[#FFCC00]">★★★★★</span>
            </div>
            <p className="text-sm text-slate-400 mt-3 max-w-md">
              O kit oficial para você e sua família torcerem pelo Brasil na Copa do Mundo 2026.
              12 itens incríveis, frete grátis e pagamento na entrega.
            </p>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Todos os direitos reservados. Produto não oficial da FIFA ou CBF.
              Imagens ilustrativas com alta fidelidade ao produto real.
              {/* TODO: inserir CNPJ real */}
              <br />[CNPJ]
            </p>
          </div>
          <div className="md:text-right space-y-2 text-sm">
            <div className="flex md:justify-end items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Compra Segura</div>
            <div className="flex md:justify-end items-center gap-2"><Truck className="w-4 h-4 text-emerald-400" /> Envio em 24h</div>
            <div className="flex md:justify-end items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> Suporte WhatsApp</div>
          </div>
        </div>
      </footer>

      {/* ============ FLOATING: SOCIAL PROOF ============ */}
      <AnimatePresence>
        {alertVisible && currentAlert && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed bottom-4 left-4 z-50 max-w-xs bg-slate-900/95 backdrop-blur border border-white/10 text-white rounded-xl shadow-2xl px-4 py-3"
          >
            <div className="text-[11px] font-bold text-[#FFCC00] uppercase tracking-wider">
              ⚽ Nova compra
            </div>
            <div className="text-sm font-semibold mt-0.5">
              {currentAlert.name} ({currentAlert.city}, {currentAlert.uf})
            </div>
            <div className="text-xs text-slate-300">
              comprou {currentAlert.pack} · há {currentAlert.mins} min
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ FLOATING: WHATSAPP ============ */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com suporte no WhatsApp"
        title="Falar com suporte"
        className="fixed bottom-24 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-xl p-3.5 transition hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* ============ FLOATING: MOBILE CTA ============ */}
      <AnimatePresence>
        {showMobileCta && (
          <motion.a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#006633] text-white border-t-4 border-[#FFCC00] py-3.5 px-4 text-center font-extrabold text-base shadow-2xl"
          >
            GARANTIR MEU KIT · R$ 137,99 →
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
