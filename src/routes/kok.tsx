import { createFileRoute, Link } from "@tanstack/react-router";
import { Refrigerator, Snowflake, Package, LayoutGrid, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Chip } from "@/components/AppShell";
import { daysLeft, expiryLabel, placeLabel, setState, useStore, type Place, uid } from "@/lib/store";

type Search = { plats?: Place | undefined };
export const Route = createFileRoute("/kok")({
  validateSearch: (s: Record<string, unknown>): Search => ({ plats: ["kyl", "frys", "skafferi"].includes(s["plats"] as string) ? (s["plats"] as Place) : undefined }),
  head: () => ({ meta: [{ title: "Mitt kök – STOCKED" }, { name: "description", content: "Se dina varor och vad som snart går ut." }, { property: "og:title", content: "Mitt kök – STOCKED" }, { property: "og:description", content: "Se dina varor och vad som snart går ut." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Kok,
});

const tabs = [
  { v: undefined, label: "Alla", Icon: LayoutGrid }, { v: "kyl", label: "Kyl", Icon: Refrigerator },
  { v: "frys", label: "Frys", Icon: Snowflake }, { v: "skafferi", label: "Skafferi", Icon: Package },
] as const;

function Kok() {
  const { plats } = Route.useSearch();
  const s = useStore();
  const list = s.items.filter((i) => !plats || i.place === plats).sort((a, b) => a.expires.localeCompare(b.expires));
  const soon = list.filter((i) => daysLeft(i.expires) <= 3);
  const rest = list.filter((i) => daysLeft(i.expires) > 3);

  function remove(id: string, used: boolean) {
    const it = s.items.find((i) => i.id === id)!;
    setState((st) => ({ ...st, items: st.items.filter((i) => i.id !== id), shop: used ? [...st.shop, { id: uid(), name: it.name, status: "bought" }] : st.shop }));
    toast(used ? `${it.name} markerad som använd` : `${it.name} borttagen`);
  }
  const Row = ({ i }: { i: (typeof list)[number] }) => {
    const d = daysLeft(i.expires);
    return (
      <li className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{i.name} <span className="font-normal text-muted-foreground">× {i.qty}</span></p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Chip tone={d < 0 ? "danger" : d <= 1 ? "warn" : "beige"}>{expiryLabel(d)}</Chip>{placeLabel[i.place]}
          </p>
        </div>
        <button onClick={() => remove(i.id, true)} aria-label={`Markera ${i.name} som använd`} className="grid size-11 place-items-center rounded-full text-primary hover:bg-muted"><Check className="size-5" aria-hidden /></button>
        <button onClick={() => remove(i.id, false)} aria-label={`Ta bort ${i.name}`} className="grid size-11 place-items-center rounded-full text-destructive hover:bg-muted"><Trash2 className="size-5" aria-hidden /></button>
      </li>
    );
  };
  return (
    <AppShell title="Mitt kök">
      <nav aria-label="Filtrera plats" className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5">
        {tabs.map(({ v, label, Icon }) => (
          <Link key={label} to="/kok" search={{ plats: v }} aria-current={plats === v ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold ${plats === v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            <Icon className="size-4" aria-hidden />{label}
          </Link>
        ))}
      </nav>
      {soon.length > 0 && (<section aria-labelledby="soon"><h2 id="soon" className="mb-3 font-semibold">Går snart ut</h2><ul className="mb-8 space-y-3">{soon.map((i) => <Row key={i.id} i={i} />)}</ul></section>)}
      <section aria-labelledby="all"><h2 id="all" className="mb-3 font-semibold">Övriga varor</h2>
        {rest.length ? <ul className="space-y-3">{rest.map((i) => <Row key={i.id} i={i} />)}</ul> : <p className="text-muted-foreground">Inga fler varor här.</p>}
      </section>
    </AppShell>
  );
}
