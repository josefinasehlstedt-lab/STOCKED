import { createFileRoute, notFound } from "@tanstack/react-router";
import { Check, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { hasAt, recipes } from "@/lib/recipes";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/recept/$id")({
  loader: ({ params }) => { const r = recipes.find((x) => x.id === params.id); if (!r) throw notFound(); return r; },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? "Recept"} – STOCKED` }, { name: "description", content: "Ingredienser och gör så här." }, { property: "og:title", content: `${loaderData?.title ?? "Recept"} – STOCKED` }, { property: "og:description", content: "Ingredienser och gör så här." }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] }),
  component: Detail,
});

function Detail() {
  const r = Route.useLoaderData();
  const s = useStore();
  const names = s.items.map((i) => i.name);
  const have = r.ingredients.filter((i) => hasAt(i, names));
  const missing = r.ingredients.filter((i) => !hasAt(i, names));
  const addMissing = () => {
    setState((st) => ({ ...st, shop: [...st.shop, ...missing.filter((m) => !st.shop.some((x) => x.name === m && x.status === "buy")).map((m) => ({ id: uid(), name: m, status: "buy" as const }))] }));
    toast.success("Lagt till i inköpslistan");
  };
  return (
    <AppShell title={r.title} back>
      <img src={r.image} alt={`Tillagad ${r.title}`} width={1024} height={768} className="-mx-5 -mt-4 mb-4 aspect-[4/3] w-[calc(100%+2.5rem)] max-w-none object-cover" />
      <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" aria-hidden />{r.time} · {r.category}</p>
      <section aria-labelledby="h"><h2 id="h" className="mb-3 font-semibold">Du har hemma</h2>
        <ul className="mb-6 space-y-2">{have.map((i) => <li key={i} className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-secondary-foreground"><Check className="size-4" aria-hidden />{i}</li>)}{!have.length && <li className="text-muted-foreground">Inget ännu.</li>}</ul></section>
      <section aria-labelledby="m"><h2 id="m" className="mb-3 font-semibold">Saknas</h2>
        <ul className="mb-4 space-y-2">{missing.map((i) => <li key={i} className="rounded-xl border border-border bg-card px-4 py-3">{i}</li>)}{!missing.length && <li className="text-muted-foreground">Du har allt!</li>}</ul>
        {missing.length > 0 && <button onClick={addMissing} className="mb-8 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-primary font-semibold text-primary"><Plus className="size-4" aria-hidden />Lägg saknade i inköpslistan</button>}</section>
      <section aria-labelledby="g"><h2 id="g" className="mb-3 font-serif text-2xl font-semibold">Gör så här</h2>
        <ol className="space-y-4">{r.steps.map((st, n) => <li key={n} className="flex gap-4"><span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{n + 1}</span><p className="pt-1">{st}</p></li>)}</ol></section>
    </AppShell>
  );
}
