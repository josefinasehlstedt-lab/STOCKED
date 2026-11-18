import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChefHat,
  ChevronRight,
  Home,
  ListChecks,
  MessageCircleQuestion,
  Refrigerator,
  ScanLine,
  Search,
  Send,
} from "lucide-react";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

/** true when the wall is shown in "all on one screen" size – screens then drop extra rows */
const CompactCtx = createContext(false);
const isCompact = () => useContext(CompactCtx);

export const Route = createFileRoute("/wireframes")({
  head: () => ({
    meta: [
      { title: "Wireframes – STOCKED" },
      { name: "description", content: "Gråskiss av alla skärmar i STOCKED: välkomstguide, hem, kök, scanna, recept och inköpslista." },
      { property: "og:title", content: "Wireframes – STOCKED" },
      { property: "og:description", content: "Gråskiss av alla skärmar i STOCKED." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Wireframes,
});

/* ---------- wireframe primitives (grayscale, token-based) ---------- */

const SOLID = "bg-foreground text-background";
const SOFT = "bg-muted";

function Line({ w = "w-full", h = "h-3", tone = "mid" }: { w?: string; h?: string; tone?: "mid" | "soft" | "dark" }) {
  const t = { mid: "bg-muted-foreground/35", soft: "bg-muted-foreground/18", dark: "bg-foreground/80" }[tone];
  return <span aria-hidden className={`block rounded-full ${h} ${w} ${t}`} />;
}

function ImgBox({ className = "", label }: { className?: string; label?: string }) {
  return (
    <div aria-hidden className={`relative overflow-hidden rounded-xl border border-border ${SOFT} ${className}`}>
      <svg className="absolute inset-0 size-full text-muted-foreground/30" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {label && <span className="absolute inset-x-0 bottom-1 text-center text-[10px] font-semibold text-muted-foreground">{label}</span>}
    </div>
  );
}

function Field({ label, hint }: { label: string; hint?: string | undefined }) {
  return (
    <div>
      <Line w="w-28" h="h-2.5" tone="soft" />
      <span className="sr-only">{label}</span>
      <div className="mt-2 h-9 rounded-lg border border-input bg-card" />
      {hint && <Line w="w-40" h="h-2" tone="soft" />}
    </div>
  );
}

function Pill({ children, filled = false }: { children: ReactNode; filled?: boolean }) {
  return (
    <span className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold ${filled ? SOLID : `${SOFT} text-muted-foreground`}`}>
      {children}
    </span>
  );
}

function Btn({ children, filled = true, full = true }: { children: ReactNode; filled?: boolean; full?: boolean }) {
  return (
    <span className={`flex h-10 items-center justify-center gap-2 rounded-full text-[11px] font-semibold ${full ? "w-full" : "px-5"} ${filled ? SOLID : "border-2 border-foreground text-foreground"}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-3 ${className}`}>{children}</div>;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

/* ---------- phone chrome ---------- */

function Frame({ title, path, active, back, w = 300, h = 520, children }: { title: string; path: string; active?: string | undefined; back?: boolean; w?: number; h?: number; children: ReactNode }) {
  return (
    <article className="flex flex-col items-center">
      <div className="overflow-hidden rounded-[28px] border-2 border-foreground/80 bg-background shadow-[0_10px_30px_-18px_oklch(0_0_0/40%)]" style={{ width: w }}>
        <div className="flex h-11 items-center gap-2 border-b border-border px-3">
          {back ? (
            <span aria-hidden className="grid size-7 place-items-center rounded-full text-foreground"><ArrowLeft className="size-4" /></span>
          ) : (
            <span aria-hidden className="size-7 rounded-md border border-border bg-muted" />
          )}
          <span aria-hidden className="ml-1 h-4 w-16 rounded-sm bg-foreground/75" />
          <span aria-hidden className="ml-auto grid size-7 place-items-center rounded-full text-foreground"><MessageCircleQuestion className="size-4" /></span>
        </div>
        <div className="overflow-hidden px-3 py-3" style={{ height: h }}>{children}</div>
        <div className="flex h-14 items-center border-t border-border px-1">
          <NavTab icon={Home} label="Hem" on={active === "hem"} />
          <NavTab icon={Refrigerator} label="Kök" on={active === "kok"} />
          <span className="flex flex-1 justify-center">
            <span aria-hidden className="-mt-6 grid size-12 place-items-center rounded-full bg-foreground text-background ring-4 ring-background">
              <ScanLine className="size-5" />
            </span>
          </span>
          <NavTab icon={ChefHat} label="Recept" on={active === "recept"} />
          <NavTab icon={ListChecks} label="Inköp" on={active === "inkop"} />
        </div>
      </div>
      <p className="mt-3 text-center">
        <span className="block text-sm font-bold text-foreground">{title}</span>
        <span className="block font-mono text-[11px] text-muted-foreground">{path}</span>
      </p>
    </article>
  );
}

function NavTab({ icon: Icon, label, on }: { icon: typeof Home; label: string; on?: boolean }) {
  return (
    <span className={`flex flex-1 flex-col items-center gap-1 py-1 ${on ? "text-foreground" : "text-muted-foreground/60"}`}>
      <Icon className="size-4" aria-hidden />
      <span aria-hidden className={`h-1.5 w-8 rounded-full ${on ? "bg-foreground/70" : "bg-muted-foreground/25"}`} />
    </span>
  );
}

/* ---------- screens ---------- */

function WIntro() {
  return (
    <div className="flex h-full flex-col">
      <ImgBox className="h-28 w-full rounded-2xl" />
      <h3 className="mt-4 text-center text-base font-bold text-foreground">Välkommen till STOCKED</h3>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">Håll koll på allt i kyl, frys och skafferi – på ett ställe.</p>
      <span aria-hidden className="mt-4 flex justify-center gap-1">
        <span className="size-1.5 rounded-full bg-foreground" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
        <span className="size-1.5 rounded-full bg-muted-foreground/30" />
      </span>
      <span className="mt-auto"><Btn>Kom igång</Btn></span>
      <span className="mt-2 block text-center text-[10px] font-semibold text-muted-foreground underline">Hoppa över</span>
    </div>
  );
}

function WHem() {
  return (
    <div className="flex h-full flex-col">
      <h3 className="text-lg font-bold leading-tight text-foreground">Hej,<br /><span className="text-[13px] font-medium text-muted-foreground">här är din översikt</span></h3>
      <Card className="mt-3 flex items-center gap-3">
        <span aria-hidden className="size-5 rounded-full bg-muted-foreground/30" />
        <span className="flex-1"><Line w="w-20" h="h-2.5" tone="dark" /><Line w="w-32" h="h-2" tone="soft" /></span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden />
      </Card>
      <SectionTitle>Dina förråd</SectionTitle>
      {["Kyl", "Frys", "Skafferi"].map((p) => (
        <Card key={p} className="mb-2 flex items-center gap-3">
          <span aria-hidden className="grid size-7 place-items-center rounded-full bg-foreground/80 text-background text-[9px] font-bold">{p[0]}</span>
          <span className="flex-1"><Line w="w-16" h="h-2.5" tone="dark" /><Line w="w-10" h="h-2" tone="soft" /></span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" aria-hidden />
        </Card>
      ))}
      <span className="mt-auto"><Btn filled={false}>+ Lägg till vara manuellt</Btn></span>
    </div>
  );
}

function WKok() {
  const c = isCompact();
  return (
    <div className="flex h-full flex-col">
      <h3 className="font-serif text-2xl font-semibold text-foreground">Ditt kök</h3>
      <span aria-hidden className="-mx-3 mt-3 flex gap-1.5 overflow-hidden px-3">
        <Pill filled>Alla</Pill><Pill>Kyl</Pill><Pill>Frys</Pill><Pill>Skafferi</Pill>
      </span>
      <SectionTitle>Går snart ut</SectionTitle>
      <Card className="mb-2 flex items-center gap-2">
        <span className="flex-1"><Line w="w-24" h="h-2.5" tone="dark" /><span className="mt-1.5 flex gap-1"><Pill>1 dag kvar</Pill><Line w="w-8" h="h-2" tone="soft" /></span></span>
        <span aria-hidden className="size-6 rounded-full border border-border" />
        <span aria-hidden className="size-6 rounded-full border border-border" />
      </Card>
      {!c && (
        <Card className="mb-2 flex items-center gap-2">
          <span className="flex-1"><Line w="w-20" h="h-2.5" tone="dark" /><span className="mt-1.5 flex gap-1"><Pill>2 dagar kvar</Pill><Line w="w-10" h="h-2" tone="soft" /></span></span>
          <span aria-hidden className="size-6 rounded-full border border-border" />
          <span aria-hidden className="size-6 rounded-full border border-border" />
        </Card>
      )}
      <SectionTitle>Övriga varor</SectionTitle>
      {(c ? [0] : [0, 1, 2]).map((n) => (
        <Card key={n} className="mb-2 flex items-center gap-2">
          <span className="flex-1"><Line w="w-28" h="h-2.5" tone="dark" /><span className="mt-1.5 flex gap-1"><Pill>14 dagar kvar</Pill><Line w="w-12" h="h-2" tone="soft" /></span></span>
          <span aria-hidden className="size-6 rounded-full border border-border" />
          <span aria-hidden className="size-6 rounded-full border border-border" />
        </Card>
      ))}
    </div>
  );
}

function WScanna() {
  return (
    <div className="flex h-full flex-col">
      <h3 className="font-serif text-2xl font-semibold text-foreground">Scanna vara</h3>
      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">Steg 1 av 2</p>
      <div aria-hidden className="relative mx-auto mt-3 aspect-square w-44 overflow-hidden rounded-2xl border-2 border-foreground/70 bg-muted">
        <svg className="absolute inset-0 size-full text-muted-foreground/25" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute inset-6 rounded-xl border-2 border-background" />
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">Rikta kameran mot streckkoden.</p>
      <span aria-hidden className="mt-2 flex justify-center"><Pill>Blixt</Pill></span>
      <div className="mt-auto"><Field label="Skriv in streckkod" /></div>
      <span className="mt-2 flex justify-center"><Btn filled full={false}>Sök</Btn></span>
    </div>
  );
}

function WAddItem() {
  const c = isCompact();
  return (
    <div className="flex h-full flex-col">
      <h3 className="font-serif text-2xl font-semibold text-foreground">Lägg till vara</h3>
      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">Steg 2 av 2 · Kontrollera uppgifterna</p>
      <div className="mt-3 space-y-3">
        <Field label="Vara" />
        {!c && <Field label="Märke" />}
        <Field label="Bäst före-datum" hint={c ? undefined : "Kontrollera datumet"} />
      </div>
      <SectionTitle>Plats</SectionTitle>
      <span aria-hidden className="grid grid-cols-3 gap-1.5">
        <span className="flex h-8 items-center justify-center rounded-lg text-[10px] font-semibold text-background" style={{ background: "var(--color-foreground)" }}>Kyl</span>
        <span className="flex h-8 items-center justify-center rounded-lg border border-input text-[10px] font-semibold text-muted-foreground">Frys</span>
        <span className="flex h-8 items-center justify-center rounded-lg border border-input text-[10px] font-semibold text-muted-foreground">Skafferi</span>
      </span>
      <SectionTitle>Antal</SectionTitle>
      <span aria-hidden className="flex h-8 items-center justify-between rounded-lg border border-input bg-card px-1">
        <span className="grid size-6 place-items-center rounded text-[12px] text-muted-foreground">–</span>
        <span className="text-[11px] font-bold text-foreground">1</span>
        <span className="grid size-6 place-items-center rounded text-[12px] text-muted-foreground">+</span>
      </span>
      <span className="mt-auto"><Btn>Lägg till vara</Btn></span>
    </div>
  );
}

function WRecept() {
  return (
    <div className="flex h-full flex-col">
      <h3 className="font-serif text-2xl font-semibold text-foreground">Recept</h3>
      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" aria-hidden />
        <span aria-hidden className="block h-9 rounded-full border border-input bg-card" />
        <span className="sr-only">Sök recept</span>
      </div>
      <span aria-hidden className="-mx-3 mt-3 flex gap-1.5 overflow-hidden px-3">
        <Pill filled>Alla</Pill><Pill>Vardag</Pill><Pill>Vegetariskt</Pill><Pill>Fisk</Pill>
      </span>
      <span aria-hidden className="mt-4 block space-y-2">
        {[0, 1, 2].map((n) => (
          <span key={n} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2">
            <ImgBox className="size-14 shrink-0 rounded-lg" />
            <span className="flex-1"><Line w="w-28" h="h-3" tone="dark" /><span className="mt-1.5 flex gap-1"><Pill>3/6 hemma</Pill><Line w="w-8" h="h-2" tone="soft" /></span></span>
          </span>
        ))}
      </span>
    </div>
  );
}

function WReceptDetail() {
  return (
    <div className="flex h-full flex-col">
      <ImgBox className="h-28 w-full rounded-xl" label="bild" />
      <h3 className="mt-2 font-serif text-xl font-semibold text-foreground">Pasta med tomat</h3>
      <p className="mt-1 text-[10px] text-muted-foreground">25 min · Vardag</p>
      <SectionTitle>Du har hemma</SectionTitle>
      {[0, 1].map((n) => (
        <Card key={n} className={`mb-1.5 ${SOFT} flex items-center gap-2 py-1.5`}>
          <span aria-hidden className="size-3 rounded-full border border-muted-foreground/50" />
          <Line w="w-24" h="h-2" tone="mid" />
        </Card>
      ))}
      <SectionTitle>Saknas</SectionTitle>
      {[0, 1].map((n) => (
        <Card key={n} className="mb-1.5 flex items-center gap-2 py-1.5">
          <span aria-hidden className="size-3 rounded-full border border-input" />
          <Line w="w-20" h="h-2" tone="mid" />
        </Card>
      ))}
      <Btn filled={false}>+ Lägg saknade i listan</Btn>
      <SectionTitle>Gör så här</SectionTitle>
      {[1, 2].map((n) => (
        <span key={n} className="flex items-start gap-2">
          <span aria-hidden className="grid size-4 shrink-0 place-items-center rounded-full text-[8px] font-bold text-background" style={{ background: "var(--color-foreground)" }}>{n}</span>
          <span className="flex-1 space-y-1"><Line w="w-full" h="h-2" tone="mid" /><Line w="w-3/4" h="h-2" tone="soft" /></span>
        </span>
      ))}
    </div>
  );
}

function WInkop() {
  return (
    <div className="flex h-full flex-col">
      <h3 className="font-serif text-2xl font-semibold text-foreground">Inköpslista</h3>
      <div className="mt-3"><Field label="Lägg till vara" /></div>
      <SectionTitle>Att köpa</SectionTitle>
      {[0, 1].map((n) => (
        <Card key={n} className="mb-1.5 flex items-center gap-2 py-1.5">
          <span aria-hidden className="size-3.5 rounded border border-input" />
          <Line w="w-24" h="h-2" tone="mid" />
          <span aria-hidden className="ml-auto size-5 rounded-full border border-border" />
        </Card>
      ))}
      <SectionTitle>Köpt</SectionTitle>
      {[0].map((n) => (
        <Card key={n} className={`mb-1.5 flex items-center gap-2 py-1.5 ${SOFT}`}>
          <span aria-hidden className="flex-1"><Line w="w-20" h="h-2" tone="soft" /></span>
          <span aria-hidden className="size-5 rounded-full border border-border" />
        </Card>
      ))}
      <SectionTitle>Handla igen</SectionTitle>
      <span aria-hidden className="flex gap-1.5"><Pill>+ Mjölk</Pill><Pill>+ Ägg</Pill></span>
    </div>
  );
}

function WAssistent() {
  return (
    <div className="flex h-full flex-col">
      <h3 className="font-serif text-2xl font-semibold text-foreground">Matassistent</h3>
      <Card className={`mt-2 ${SOFT} p-2`}>
        <span aria-hidden className="flex items-start gap-1.5">
          <span className="mt-0.5 size-3 shrink-0 rounded-full bg-muted-foreground/40" />
          <span className="flex-1 space-y-1"><Line w="w-full" h="h-2" tone="mid" /><Line w="w-2/3" h="h-2" tone="soft" /></span>
        </span>
      </Card>
      <span aria-hidden className="mt-3 flex flex-wrap gap-1.5">
        <Pill>Kan jag äta yoghurt efter bäst före?</Pill>
        <Pill>Hur länge håller kokt ris?</Pill>
      </span>
      <span aria-hidden className="mt-auto flex justify-end">
        <span className="max-w-[80%] rounded-2xl px-3 py-2 text-[10px] text-background" style={{ background: "var(--color-foreground)" }}>Min fråga här</span>
      </span>
      <span aria-hidden className="mt-2 flex gap-1.5">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[8px] font-bold text-muted-foreground">AI</span>
        <span className="flex-1 space-y-1 pt-1"><Line w="w-full" h="h-2" tone="mid" /><Line w="w-full" h="h-2" tone="soft" /><Line w="w-1/2" h="h-2" tone="soft" /></span>
      </span>
      <span aria-hidden className="mt-3 flex items-center gap-1.5">
        <span className="h-9 flex-1 rounded-xl border border-input bg-card" />
        <span className="grid size-9 place-items-center rounded-full text-background" style={{ background: "var(--color-foreground)" }}><Send className="size-4" /></span>
      </span>
    </div>
  );
}

/* ---------- page ---------- */

const screens = [
  { title: "Välkomstguide", path: "/", el: <WIntro /> },
  { title: "Hem", path: "/hem", active: "hem", el: <WHem /> },
  { title: "Mitt kök", path: "/kok", active: "kok", el: <WKok /> },
  { title: "Scanna vara – steg 1", path: "/scanna", el: <WScanna /> },
  { title: "Lägg till vara – steg 2", path: "/scanna · /lagg-till", el: <WAddItem /> },
  { title: "Recept", path: "/recept", active: "recept", el: <WRecept /> },
  { title: "Recept – detaljer", path: "/recept/$id", el: <WReceptDetail /> },
  { title: "Inköpslista", path: "/inkopslista", active: "inkop", el: <WInkop /> },
  { title: "Matassistent", path: "/assistent", el: <WAssistent /> },
];

function Wireframes() {
  const [big, setBig] = useState(false);
  const fw = big ? 300 : 212;
  const fh = big ? 520 : 400;
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Wireframes · gråskiss</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold text-foreground">STOCKED – alla skärmar</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Layout och flöde i grått, utan bilder och färger. Så här ser varje sida ut från välkomstguiden till matassistenten.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setBig((v) => !v)}
            aria-pressed={big}
            className="flex h-11 items-center gap-2 rounded-full border-2 border-foreground px-5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            {big ? "Alla på en gång" : "Förstora"}
          </button>
          <Link to="/hem" className="flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90">
            Öppna appen
          </Link>
        </div>
      </header>
      <CompactCtx.Provider value={!big}>
        <div className={`grid justify-items-center gap-x-8 gap-y-12 sm:grid-cols-2 ${big ? "xl:grid-cols-3" : "xl:grid-cols-5"}`}>
          {screens.map((s) => (
            <Frame key={s.title} title={s.title} path={s.path} active={s.active} w={fw} h={fh} back={["/ (steg 2)", "/scanna", "/scanna · /lagg-till", "/recept/$id", "/assistent"].includes(s.path)}>
              {s.el}
            </Frame>
          ))}
        </div>
      </CompactCtx.Provider>
      <p className="mt-12 text-center text-xs text-muted-foreground">
        Wireframes visar plats för innehåll och navigation – inte den slutliga designen.
      </p>
    </div>
  );
}
