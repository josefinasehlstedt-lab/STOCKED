import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Refrigerator, Snowflake, Package, Plus, AlarmClock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { daysLeft, useStore, type Place } from "@/lib/store";

export const Route = createFileRoute("/hem")({
  head: () => ({ meta: [{ title: "Hem – STOCKED" }, { name: "description", content: "Överblick över kyl, frys och skafferi." }, { property: "og:title", content: "Hem – STOCKED" }, { property: "og:description", content: "Överblick över kyl, frys och skafferi." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Hem,
});

const places: { v: Place; label: string; Icon: typeof Package }[] = [
  { v: "kyl", label: "Kyl", Icon: Refrigerator }, { v: "frys", label: "Frys", Icon: Snowflake }, { v: "skafferi", label: "Skafferi", Icon: Package },
];

function Hem() {
  const s = useStore();
  const soon = s.items.filter((i) => daysLeft(i.expires) <= 3);
  return (
    <AppShell>
      <h1 className="mt-2 text-2xl font-bold leading-snug">Hej,<br /><span className="font-medium text-muted-foreground">här är din översikt</span></h1>
      <Link to="/kok" className="mt-6 flex items-center gap-4 rounded-2xl bg-secondary p-5 text-secondary-foreground">
        <AlarmClock className="size-6 shrink-0" aria-hidden />
        <span className="flex-1"><span className="block font-bold">Ät först</span><span className="text-sm">{soon.length} {soon.length === 1 ? "vara behöver" : "varor behöver"} användas snart</span></span>
        <ChevronRight className="size-5" aria-hidden />
      </Link>
      <h2 className="mt-8 mb-3 text-base font-semibold">Dina förråd</h2>
      <ul className="space-y-3">
        {places.map(({ v, label, Icon }) => {
          const n = s.items.filter((i) => i.place === v).length;
          return (
            <li key={v}>
              <Link to="/kok" search={{ plats: v }} className="flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-soft)]">
                <span className="grid size-11 place-items-center rounded-full bg-primary-foreground/15"><Icon className="size-5" aria-hidden /></span>
                <span className="flex-1"><span className="block font-semibold">{label}</span><span className="text-sm opacity-90">{n} varor</span></span>
                <ChevronRight className="size-5" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/lagg-till" className="mt-6 flex h-14 items-center justify-center gap-2 rounded-full border-2 border-primary font-semibold text-primary"><Plus className="size-5" aria-hidden />Lägg till vara manuellt</Link>
    </AppShell>
  );
}
