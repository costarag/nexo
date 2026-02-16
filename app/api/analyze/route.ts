import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Voce e o SalesFit Copilot de um CRM white-label.

MISSAO
1) Ler manifesto/playbook da empresa-base.
2) Pesquisar a empresa prospect em fontes publicas.
3) Cruzar os sinais com ICP, proposta de valor, objecoes e processo comercial.
4) Entregar recomendacao pratica.

REGRAS
- Responder em pt-BR, tom consultivo e direto.
- Nao copiar manifesto literalmente; reescrever com variacao.
- Se nao houver evidencia: "nao encontrado publicamente".
- Nao inventar dados; marcar hipoteses como "hipotese".
- Sempre citar fontes (titulo + URL).

SCORING (0-100)
- ICP Fit (25)
- Dor/Urgencia (20)
- Fit tecnico (15)
- Potencial economico (15)
- Timing (15)
- Risco execucao invertido (10)

RETORNE APENAS JSON VALIDO:
{
  "prospect_company": "",
  "manifesto_rewritten": "",
  "fit_score": 0,
  "confidence": "baixa|media|alta",
  "icp_match_reasons": ["", "", ""],
  "gaps_and_risks": ["", "", ""],
  "company_signals": {
    "segment": "",
    "business_model": "",
    "size_signal": "",
    "digital_maturity": "",
    "possible_pains": ["", ""],
    "legacy_or_stack_signals": ["", ""]
  },
  "qualification": {
    "budget_signal": "",
    "authority_signal": "",
    "need_signal": "",
    "timeline_signal": "",
    "bant_summary": ""
  },
  "discovery_questions": ["", "", "", "", ""],
  "pitch_5min": {
    "opening_30s": "",
    "problem_60s": "",
    "solution_60s": "",
    "proof_30s": "",
    "cta_30s": ""
  },
  "objection_handling": [
    {"objection": "", "response": ""},
    {"objection": "", "response": ""}
  ],
  "email_followup": {
    "subject": "",
    "body": ""
  },
  "next_best_action": "",
  "sources": [
    {"title": "", "url": ""}
  ]
}
`;

function parseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("Model did not return valid JSON");
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const baseCompany = String(body.baseCompany ?? "").trim();
    const manifesto = String(body.manifesto ?? "").trim();
    const prospect = String(body.prospect ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!baseCompany || !manifesto || !prospect) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required fields: baseCompany, manifesto, prospect",
        },
        { status: 400 }
      );
    }

    const chosenModel = String(process.env.OPENAI_MODEL ?? "").trim() || "gpt-4.1-mini";

    const userPrompt = `
Empresa-base: ${baseCompany}
Manifesto/playbook:
${manifesto}

Prospect a analisar: ${prospect}
Contexto extra: ${notes || "nenhum"}

Objetivo:
- Medir fit comercial
- Gerar discovery + pitch + objecoes
- Sugerir proximo passo
`;

    const response = await client.responses.create({
      model: chosenModel,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      tools: [{ type: "web_search_preview" }],
      temperature: 0.2,
    });

    const data = parseJson(response.output_text ?? "");

    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
