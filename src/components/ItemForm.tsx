import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Refrigerator, Snowflake, Package } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { setState, uid, type Place } from "@/lib/store";

const places: { v: Place; label: string; Icon: typeof Package }[] = [
  { v: "kyl", label: "Kyl", Icon: Refrigerator },
  { v: "frys", label: "Frys", Icon: Snowflake },
  { v: "skafferi", label: "Skafferi", Icon: Package },
];

export function ItemForm({ initial }: { initial?: { name?: string | undefined; brand?: string | undefined; barcode?: string | undefined; image?: string | undefined } }) {
  const nav = useNavigate();
  const id = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [expires, setExpires] = useState("");
  const [place, setPlace] = useState<Place>("kyl");
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<{ name?: string; expires?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (!name.trim()) er.name = "Skriv vad varan heter.";
    if (name.length > 80) er.name = "Namnet får vara högst 80 tecken.";
    if (!expires) er.expires = "Välj ett bäst före-datum.";
    setErrors(er);
    if (Object.keys(er).length) { document.getElementById(er.name ? `${id}-name` : `${id}-exp`)?.focus(); return; }
    setState((s) => ({ ...s, items: [...s.items, { id: uid(), name: name.trim(), brand: brand.trim() || undefined, place, qty, expires, barcode: initial?.barcode }] }));
    toast.success(`${name.trim()} har lagts till i ${place}en`);
    nav({ to: "/kok" });
  }
  const input = "h-12 w-full rounded-xl border border-input bg-card px-4 text-base";
  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {initial?.image && (
        <div className="flex items-center gap-4 rounded-2xl bg-card p-4">
          <img src={initial.image} alt="" className="size-20 rounded-xl object-contain" />
          <div><p className="font-bold">{name}</p>{brand && <p className="text-sm text-muted-foreground">{brand}</p>}</div>
        </div>
      )}
      <div>
        <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-semibold">Vara <span aria-hidden>*</span></label>
        <input id={`${id}-name`} className={input} value={name} onChange={(e) => setName(e.target.value)} required aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} autoComplete="off" />
        {errors.name && <p id={`${id}-name-err`} className="mt-2 text-sm font-medium text-destructive">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={`${id}-brand`} className="mb-2 block text-sm font-semibold">Märke (valfritt)</label>
        <input id={`${id}-brand`} className={input} value={brand} onChange={(e) => setBrand(e.target.value)} autoComplete="off" />
      </div>
      <div>
        <label htmlFor={`${id}-exp`} className="mb-2 block text-sm font-semibold">Bäst före-datum <span aria-hidden>*</span></label>
        <p id={`${id}-exp-hint`} className="mb-2 text-sm text-muted-foreground">Kontrollera datumet – det kan vara tryckt på olika sätt.</p>
        <input id={`${id}-exp`} type="date" className={input} value={expires} onChange={(e) => setExpires(e.target.value)} required aria-invalid={!!errors.expires} aria-describedby={`${id}-exp-hint${errors.expires ? ` ${id}-exp-err` : ""}`} />
        {errors.expires && <p id={`${id}-exp-err`} className="mt-2 text-sm font-medium text-destructive">{errors.expires}</p>}
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Plats</legend>
        <div className="grid grid-cols-3 gap-2">
          {places.map(({ v, label, Icon }) => (
            <label key={v} className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ring ${place === v ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`}>
              <input type="radio" name="place" value={v} checked={place === v} onChange={() => setPlace(v)} className="sr-only" />
              <Icon className="size-4" aria-hidden />{label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <span id={`${id}-qty`} className="mb-2 block text-sm font-semibold">Antal</span>
        <div role="group" aria-labelledby={`${id}-qty`} className="flex h-12 items-center overflow-hidden rounded-xl border border-input bg-card">
          <button type="button" aria-label="Minska antal" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-14 place-items-center hover:bg-muted"><Minus className="size-4" aria-hidden /></button>
          <output aria-live="polite" className="flex-1 text-center font-semibold">{qty}</output>
          <button type="button" aria-label="Öka antal" onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-full w-14 place-items-center hover:bg-muted"><Plus className="size-4" aria-hidden /></button>
        </div>
      </div>
      <button className="h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground">Lägg till vara</button>
    </form>
  );
}
