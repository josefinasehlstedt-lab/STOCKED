import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero-groceries.jpg";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Välkommen – STOCKED" }, { name: "description", content: "STOCKED hjälper dig hålla koll på matvaror, bäst före-datum och inköp." }, { property: "og:title", content: "Välkommen – STOCKED" }, { property: "og:description", content: "STOCKED hjälper dig hålla koll på matvaror, bäst före-datum och inköp." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Welcome,
});

const slides = [
  { h: "Välkommen till STOCKED", p: "Håll koll på allt i kyl, frys och skafferi – på ett ställe." },
  { h: "Scanna och spara", p: "Scanna streckkoden, kontrollera datumet och välj plats. Klart." },
  { h: "Slösa mindre", p: "Få en påminnelse ett dygn innan något går ut, och recept på det du har." },
];

function Welcome() {
  const s = useStore();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  if (s.onboarded) return <Navigate to="/hem" />;

  async function finish() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") { try { await Notification.requestPermission(); } catch {} }
    setState((st) => ({ ...st, onboarded: true }));
    nav({ to: "/hem" });
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <img src={hero} alt="Färska råvaror på ett träbord" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
      <section className="flex flex-1 flex-col items-center px-8 pb-10 pt-10 text-center" aria-roledescription="introduktion">
        <h1 className="text-2xl font-bold" aria-live="polite">{slides[i]!.h}</h1>
        <p className="mt-3 text-base text-muted-foreground">{slides[i]!.p}</p>
        <div className="mt-8 flex gap-1" role="tablist" aria-label="Introduktionssteg">
          {slides.map((_, n) => (
            <button key={n} role="tab" aria-selected={n === i} aria-label={`Steg ${n + 1} av 3`} onClick={() => setI(n)} className="grid size-8 place-items-center">
              <span className={`block size-2 rounded-full ${n === i ? "bg-primary" : "bg-input"}`} />
            </button>
          ))}
        </div>
        <button onClick={() => (i < 2 ? setI(i + 1) : finish())} className="mt-auto h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground">
          {i < 2 ? "Nästa" : "Kom igång"}
        </button>
        {i < 2 && <button onClick={finish} className="mt-3 min-h-11 text-sm font-semibold text-primary underline underline-offset-4">Hoppa över</button>}
      </section>
    </main>
  );
}
