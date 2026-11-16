import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ItemForm } from "@/components/ItemForm";
export const Route = createFileRoute("/lagg-till")({
  head: () => ({ meta: [{ title: "Lägg till vara – STOCKED" }, { name: "description", content: "Lägg till en vara manuellt." }, { property: "og:title", content: "Lägg till vara – STOCKED" }, { property: "og:description", content: "Lägg till en vara manuellt." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <AppShell title="Lägg till vara" back><ItemForm /></AppShell>,
});
