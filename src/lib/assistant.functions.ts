import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Strip personal data before anything is sent to the AI.
function scrub(t: string) {
  return t
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[e-post]")
    .replace(/\b(19|20)?\d{6}[-+]?\d{4}\b/g, "[personnummer]")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, "[telefon]");
}

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) })).max(30) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6.1-sol",
        instructions:
          "Du är STOCKEDs matassistent. Svara kort, vänligt och på svenska om bäst före-datum, hållbarhet, förvaring och ingredienser. Påminn om att 'bäst före' ofta går att lukta och smaka på, men 'sista förbrukningsdag' ska följas. Be aldrig om personuppgifter eller bilder.",
        input: data.messages.map((m) => ({ role: m.role, content: scrub(m.content) })),
      });
      const out = (res as any).output ?? [];
      const text = out.flatMap((o: any) => o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("\n");
      return { text: text || "Jag kunde inte svara just nu." };
    } catch (e) {
      if (e instanceof GatewayError) return { text: "Assistenten är inte tillgänglig just nu. Försök igen om en stund." };
      throw e;
    }
  });
