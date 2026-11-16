import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, RotateCcw, Trash2, ShoppingBasket, CheckCircle2, Repeat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { setState, uid, useStore, type ShopItem } from "@/lib/store";

export const Route = createFileRoute("/inkopslista")({
  head: () => ({ meta: [{ title: "Inköpslista – STOCKED" }, { name: "description", content: "Att köpa, köpt och handla igen." }, { property: "og:title", content: "Inköpslista – STOCKED" }, { property: "og:description", content: "Att köpa, köpt och handla igen." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Shop,
});

function Shop() {
  const s = useStore();
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const upd = (id: string, status: ShopItem["status"]) => setState((st) => ({ ...st, shop: st.shop.map((x) => (x.id === id ? { ...x, status } : x)) }));
  const del = (id: string) => setState((st) => ({ ...st, shop: st.shop.filter((x) => x.id !== id) }));
  const buy = s.shop.filter((x) => x.status === "buy");
  const bought = s.shop.filter((x) => x.status === "bought");
  const again = [...new Set(s.items.filter((i) => i.qty <= 1).map((i) => i.name))].filter((n) => !buy.some((b) => b.name === n));
  return (
    <AppShell title="Inköpslista">
      <form onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n) return setErr("Skriv en vara."); setErr(""); setState((st) => ({ ...st, shop: [...st.shop, { id: uid(), name: n.slice(0, 60), status: "buy" }] })); setName(""); }} noValidate>
        <label htmlFor="ny" className="mb-2 block text-sm font-semibold">Lägg till vara</label>
        <div className="flex gap-2"><input id="ny" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!err} aria-describedby={err ? "ny-err" : undefined} className="h-12 flex-1 rounded-xl border border-input bg-card px-4" />
          <button aria-label="Lägg till" className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Plus className="size-5" aria-hidden /></button></div>
        {err && <p id="ny-err" className="mt-2 text-sm font-medium text-destructive">{err}</p>}
      </form>
      <Section title="Att köpa" Icon={ShoppingBasket}>
        {buy.map((x) => (<li key={x.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 pl-4 shadow-sm">
          <input id={`c-${x.id}`} type="checkbox" onChange={() => upd(x.id, "bought")} className="size-5 accent-[var(--primary)]" />
          <label htmlFor={`c-${x.id}`} className="flex-1 py-2">{x.name}</label>
          <button onClick={() => del(x.id)} aria-label={`Ta bort ${x.name}`} className="grid size-11 place-items-center rounded-full text-destructive hover:bg-muted"><Trash2 className="size-4" aria-hidden /></button></li>))}
        {!buy.length && <li className="text-muted-foreground">Listan är tom.</li>}
      </Section>
      <Section title="Köpt" Icon={CheckCircle2}>
        {bought.map((x) => (<li key={x.id} className="flex items-center gap-3 rounded-2xl bg-muted p-3 pl-4">
          <span className="flex-1 text-muted-foreground line-through">{x.name}</span>
          <button onClick={() => upd(x.id, "buy")} aria-label={`Köp ${x.name} igen`} className="grid size-11 place-items-center rounded-full text-primary hover:bg-background"><RotateCcw className="size-4" aria-hidden /></button></li>))}
        {!bought.length && <li className="text-muted-foreground">Inget köpt ännu.</li>}
      </Section>
      <Section title="Handla igen" Icon={Repeat}>
        {again.map((n) => (<li key={n}><button onClick={() => setState((st) => ({ ...st, shop: [...st.shop, { id: uid(), name: n, status: "buy" }] }))} className="flex min-h-11 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-semibold text-secondary-foreground"><Plus className="size-4" aria-hidden />{n}</button></li>))}
        {!again.length && <li className="text-muted-foreground">Förslag dyker upp när något börjar ta slut.</li>}
      </Section>
    </AppShell>
  );
}
function Section({ title, Icon, children }: { title: string; Icon: typeof Plus; children: React.ReactNode }) {
  return <section className="mt-8"><h2 className="mb-3 flex items-center gap-2 font-semibold"><Icon className="size-5 text-primary" aria-hidden />{title}</h2><ul className="flex flex-wrap gap-2 [&>li]:basis-full [&>li:has(>button:only-child)]:basis-auto">{children}</ul></section>;
}
