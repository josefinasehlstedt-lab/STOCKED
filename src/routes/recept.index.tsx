import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Clock, ChevronRight, UtensilsCrossed, Leaf, Fish, Coffee, Soup } from "lucide-react";
import { AppShell, Chip } from "@/components/AppShell";
import { categories, hasAt, recipes } from "@/lib/recipes";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/recept/")({
  head: () => ({ meta: [{ title: "Recept – STOCKED" }, { name: "description", content: "Receptförslag utifrån det du redan har hemma." }, { property: "og:title", content: "Recept – STOCKED" }, { property: "og:description", content: "Receptförslag utifrån det du redan har hemma." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Recept,
});
const icons: Record<string, typeof Leaf> = { Alla: UtensilsCrossed, Vardag: Soup, Vegetariskt: Leaf, Fisk: Fish, Frukost: Coffee };

function Recept() {
  const s = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Alla");
  const names = s.items.map((i) => i.name);
  const list = recipes
    .filter((r) => (cat === "Alla" || r.category === cat) && r.title.toLowerCase().includes(q.toLowerCase()))
    .map((r) => ({ r, have: r.ingredients.filter((i) => hasAt(i, names)).length }))
    .sort((a, b) => b.have - a.have);
  return (
    <AppShell title="Recept">
      <label htmlFor="q" className="sr-only">Sök recept</label>
      <div className="relative"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input id="q" type="search" placeholder="Sök recept" value={q} onChange={(e) => setQ(e.target.value)} className="h-12 w-full rounded-full border border-input bg-card pl-12 pr-4 placeholder:text-muted-foreground" /></div>
      <div role="group" aria-label="Kategorier" className="-mx-5 my-5 flex gap-2 overflow-x-auto px-5">
        {categories.map((c) => { const I = icons[c] ?? UtensilsCrossed; return (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}><I className="size-4" aria-hidden />{c}</button>
        ); })}
      </div>
      <ul className="space-y-3" aria-live="polite">
        {list.map(({ r, have }) => (
          <li key={r.id}><Link to="/recept/$id" params={{ id: r.id }} className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-sm">
            <img src={r.image} alt="" width={1024} height={768} loading="lazy" className="size-20 shrink-0 rounded-xl object-cover" />
            <div className="flex-1"><p className="font-serif text-xl font-semibold">{r.title}</p>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Chip>{have}/{r.ingredients.length} hemma</Chip><Clock className="size-4" aria-hidden />{r.time}</p></div>
            <ChevronRight className="size-5" aria-hidden /></Link></li>
        ))}
        {!list.length && <li className="text-muted-foreground">Inga recept matchar din sökning.</li>}
      </ul>
    </AppShell>
  );
}
