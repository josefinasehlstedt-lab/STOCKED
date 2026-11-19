import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Send, ShieldCheck, Leaf } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AppShell } from "@/components/AppShell";
import { askAssistant } from "@/lib/assistant.functions";

export const Route = createFileRoute("/assistent")({
  head: () => ({ meta: [{ title: "Matassistent – STOCKED" }, { name: "description", content: "Fråga om bäst före-datum, förvaring och ingredienser." }, { property: "og:title", content: "Matassistent – STOCKED" }, { property: "og:description", content: "Fråga om bäst före-datum, förvaring och ingredienser." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; content: string };
const tips = ["Kan jag äta yoghurt efter bäst före?", "Hur länge håller kokt ris i kylen?", "Vad kan ersätta ägg i bakning?"];

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  async function send(q: string) {
    const content = q.trim().slice(0, 2000);
    if (!content || busy) return;
    const next = [...msgs, { role: "user" as const, content }];
    setMsgs(next); setText(""); setBusy(true);
    try { const r = await askAssistant({ data: { messages: next } }); setMsgs([...next, { role: "assistant", content: r.text }]); }
    catch { setMsgs([...next, { role: "assistant", content: "Något gick fel. Försök igen." }]); }
    finally { setBusy(false); ta.current?.focus(); }
  }
  return (
    <AppShell title="Matassistent" back>
      <p className="-mt-3 mb-4 flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />Skriv inga personuppgifter. Bilder delas aldrig, och namn, telefonnummer och e-post tas bort innan frågan skickas.</p>
      <div role="log" aria-live="polite" className="space-y-4">
        {!msgs.length && <div className="flex flex-wrap gap-2">{tips.map((t) => <button key={t} onClick={() => send(t)} className="min-h-11 rounded-full border border-border bg-card px-4 text-left text-sm font-medium">{t}</button>)}</div>}
        {msgs.map((m, i) => m.role === "user"
          ? <p key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground"><span className="sr-only">Jag: </span>{m.content}</p>
          : <div key={i} className="flex gap-3"><span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><Leaf className="size-4" /></span><div className="prose prose-sm max-w-none pt-1 text-foreground [&_p]:my-2"><span className="sr-only">Assistent: </span><ReactMarkdown>{m.content}</ReactMarkdown></div></div>)}
        {busy && <p className="text-sm text-muted-foreground">Assistenten skriver…</p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="fixed inset-x-0 bottom-20 z-20 mx-auto flex max-w-md gap-2 bg-background px-5 py-3">
        <label htmlFor="fraga" className="sr-only">Min fråga</label>
        <textarea id="fraga" ref={ta} rows={1} value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }} placeholder="Ställ en fråga…" className="min-h-12 flex-1 resize-none rounded-2xl border border-input bg-card px-4 py-3 placeholder:text-muted-foreground" />
        <button disabled={busy} aria-label="Skicka" className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-60"><Send className="size-5" aria-hidden /></button>
      </form>
    </AppShell>
  );
}
