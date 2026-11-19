import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, Refrigerator, ScanLine, ChefHat, ListChecks, MessageCircleQuestion } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { daysLeft, setState, useStore } from "@/lib/store";
import logo from "@/assets/stocked-logo.png";

export function AppShell({ title, back, children }: { title?: string; back?: boolean; children: ReactNode }) {
  const router = useRouter();
  const s = useStore();

  // Notify one day before an item expires (once per item)
  useEffect(() => {
    const due = s.items.filter((i) => daysLeft(i.expires) === 1 && !s.notified.includes(i.id));
    if (!due.length) return;
    due.forEach((i) => {
      const msg = `${i.name} går ut imorgon`;
      toast(msg, { description: "Jag använder den gärna idag eller imorgon." });
      if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification("STOCKED", { body: msg });
    });
    setState((st) => ({ ...st, notified: [...st.notified, ...due.map((d) => d.id)] }));
  }, [s.items, s.notified]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Hoppa till innehåll</a>
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-background/95 px-5 pb-3 pt-5 backdrop-blur">
        {back && (
          <button onClick={() => router.history.back()} aria-label="Tillbaka" className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-muted">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
        )}
        <Link to="/hem" aria-label="STOCKED – till startsidan"><img src={logo} alt="" width={786} height={99} className="h-5.5 w-auto max-w-full" /></Link>
        <Link to="/assistent" aria-label="Fråga matassistenten" className="ml-auto grid size-11 place-items-center rounded-full text-primary hover:bg-muted">
          <MessageCircleQuestion className="size-5" aria-hidden />
        </Link>
      </header>
      <main id="main" className="flex-1 px-5 pb-32">
        {title && <h1 className="mb-6 mt-2 font-serif text-[36px] font-semibold leading-tight text-foreground">{title}</h1>}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

const navCls = "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[12px] font-semibold text-muted-foreground";
function BottomNav() {
  const active = { className: "text-primary" };
  return (
    <nav aria-label="Huvudmeny" className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="flex items-end">
        <li className="flex flex-1"><Link to="/hem" className={navCls} activeProps={active}><Home className="size-5" aria-hidden />Hem</Link></li>
        <li className="flex flex-1"><Link to="/kok" className={navCls} activeProps={active}><Refrigerator className="size-5" aria-hidden />Mitt kök</Link></li>
        <li className="flex flex-1 justify-center">
          <Link to="/scanna" aria-label="Scanna vara" className="-mt-7 mb-2 grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] ring-4 ring-background">
            <ScanLine className="size-7" aria-hidden />
          </Link>
        </li>
        <li className="flex flex-1"><Link to="/recept" className={navCls} activeProps={active}><ChefHat className="size-5" aria-hidden />Recept</Link></li>
        <li className="flex flex-1"><Link to="/inkopslista" className={navCls} activeProps={active}><ListChecks className="size-5" aria-hidden />Inköp</Link></li>
      </ul>
    </nav>
  );
}

export function Chip({ children, tone = "beige" }: { children: ReactNode; tone?: "beige" | "warn" | "danger" }) {
  const t = { beige: "bg-secondary text-secondary-foreground", warn: "bg-warning text-warning-foreground", danger: "bg-destructive text-destructive-foreground" }[tone];
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${t}`}>{children}</span>;
}
