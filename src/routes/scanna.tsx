import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, Keyboard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ItemForm } from "@/components/ItemForm";

export const Route = createFileRoute("/scanna")({
  head: () => ({ meta: [{ title: "Scanna vara – STOCKED" }, { name: "description", content: "Scanna streckkoden och kontrollera bäst före-datumet." }, { property: "og:title", content: "Scanna vara – STOCKED" }, { property: "og:description", content: "Scanna streckkoden och kontrollera bäst före-datumet." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Scanna,
});

type Product = { name?: string; brand?: string; barcode: string; image?: string };

async function lookup(code: string): Promise<Product> {
  try {
    const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,brands,image_small_url`);
    const j = await r.json();
    return { barcode: code, name: j.product?.product_name, brand: j.product?.brands?.split(",")[0], image: j.product?.image_small_url };
  } catch { return { barcode: code }; }
}

function Scanna() {
  const [product, setProduct] = useState<Product | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Rikta kameran mot streckkoden.");
  const [torch, setTorch] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (product) return;
    let stop = false;
    const BD = (window as any).BarcodeDetector;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (video.current) { video.current.srcObject = stream; await video.current.play(); }
        if (!BD) { setStatus("Min webbläsare kan inte läsa streckkoder automatiskt. Skriv in numret nedan."); return; }
        const det = new BD({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
        while (!stop) {
          const r = video.current ? await det.detect(video.current).catch(() => []) : [];
          if (r[0]) { setStatus("Streckkod hittad."); setProduct(await lookup(r[0].rawValue)); break; }
          await new Promise((res) => setTimeout(res, 300));
        }
      } catch { setStatus("Kameran är inte tillgänglig. Skriv in streckkoden nedan."); }
    })();
    return () => { stop = true; streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, [product]);

  async function toggleTorch() {
    const t = streamRef.current?.getVideoTracks()[0];
    try { await t?.applyConstraints({ advanced: [{ torch: !torch } as any] }); setTorch(!torch); } catch { setStatus("Blixt stöds inte på den här enheten."); }
  }

  if (product)
    return (
      <AppShell title="Lägg till vara" back>
        <p className="mb-6 text-sm text-muted-foreground">Steg 2 av 2 · Kontrollera uppgifterna och rätta datumet vid behov.</p>
        <button onClick={() => setProduct(null)} className="mb-4 min-h-11 text-sm font-semibold text-primary underline underline-offset-4">Scanna igen</button>
        <ItemForm initial={product} />
      </AppShell>
    );

  return (
    <AppShell title="Scanna vara" back>
      <p className="mb-4 text-sm text-muted-foreground">Steg 1 av 2</p>
      <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl bg-foreground">
        <video ref={video} muted playsInline aria-label="Kameravy" className="size-full object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-10 rounded-2xl border-4 border-primary-foreground/80" />
      </div>
      <p role="status" className="mt-4 text-center text-sm">{status}</p>
      <div className="mt-4 flex justify-center">
        <button onClick={toggleTorch} aria-pressed={torch} className="flex min-h-11 items-center gap-2 rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground"><Zap className="size-4" aria-hidden />Blixt</button>
      </div>
      <form onSubmit={async (e) => { e.preventDefault(); if (/^\d{6,14}$/.test(code)) setProduct(await lookup(code)); else setStatus("Streckkoden ska vara 6–14 siffror."); }} className="mt-8">
        <label htmlFor="code" className="mb-2 flex items-center gap-2 text-sm font-semibold"><Keyboard className="size-4" aria-hidden />Skriv in streckkod</label>
        <div className="flex gap-2">
          <input id="code" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="h-12 flex-1 rounded-xl border border-input bg-card px-4" />
          <button className="h-12 rounded-xl bg-primary px-5 font-semibold text-primary-foreground">Sök</button>
        </div>
      </form>
    </AppShell>
  );
}
