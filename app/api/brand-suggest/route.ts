import { NextResponse } from "next/server";
import OpenAI from "openai";
import { LOGO_OPTIONS, fallbackBrandSuggestion } from "@/app/lib/white-label";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("Invalid JSON");
  }
}

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: true, data: fallbackBrandSuggestion() });
    }

    const model = String(process.env.OPENAI_MODEL ?? "").trim() || "gpt-4.1-mini";
    const logos = LOGO_OPTIONS.join(", ");

    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "Voce cria sugestoes de marca para um CRM white-label. Retorne apenas JSON valido sem markdown.",
        },
        {
          role: "user",
          content: `Escolha um nome de empresa SaaS B2B em PT-BR ou neutro, curto e memoravel, e escolha exatamente um logo da lista permitida.\nLista de logos permitidos: ${logos}\nFormato de saida: {"companyName":"...","logo":"..."}`,
        },
      ],
      temperature: 0.9,
    });

    const parsed = safeParse(response.output_text ?? "");
    const companyName = String(parsed.companyName ?? "").trim();
    const logo = String(parsed.logo ?? "").trim();

    if (!companyName || !LOGO_OPTIONS.includes(logo)) {
      return NextResponse.json({ ok: true, data: fallbackBrandSuggestion() });
    }

    return NextResponse.json({ ok: true, data: { companyName, logo } });
  } catch {
    return NextResponse.json({ ok: true, data: fallbackBrandSuggestion() });
  }
}
