"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LOGO_OPTIONS, slugify } from "@/app/lib/white-label";

type AnalyzeResponse = {
  prospect_company?: string;
  fit_score?: number;
  confidence?: string;
  next_best_action?: string;
  discovery_questions?: string[];
  pitch_5min?: {
    opening_30s?: string;
  };
  sources?: Array<{ title?: string; url?: string }>;
};

type WorkbenchProps = {
  tenantName: string;
  tenantLogo: string;
  showBuilder: boolean;
};

const DEFAULT_MANIFESTO =
  "Somos uma empresa de AI aplicada que entrega solucoes em producao em poucas semanas, com foco em integracao real, ROI rapido e transferencia de conhecimento.";

export default function SalesfitWorkbench({ tenantName, tenantLogo, showBuilder }: WorkbenchProps) {
  const router = useRouter();
  const [baseCompany, setBaseCompany] = useState(tenantName);
  const [manifesto, setManifesto] = useState(DEFAULT_MANIFESTO);
  const [prospect, setProspect] = useState("Aramis");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const [wlName, setWlName] = useState("Nexo");
  const [wlLogo, setWlLogo] = useState(LOGO_OPTIONS[0]);
  const [randomizing, setRandomizing] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const safeLogo = useMemo(() => {
    if (tenantLogo.startsWith("data:image/")) return tenantLogo;
    return LOGO_OPTIONS.includes(tenantLogo) ? tenantLogo : LOGO_OPTIONS[0];
  }, [tenantLogo]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCompany, manifesto, prospect, notes }),
      });

      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error ?? "Erro ao analisar prospect");
      setResult(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function handleRandomBrand() {
    setRandomizing(true);
    try {
      const response = await fetch("/api/brand-suggest", { method: "POST" });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error("Falha ao gerar marca");
      setWlName(String(json.data.companyName ?? "Nexo"));
      setWlLogo(String(json.data.logo ?? LOGO_OPTIONS[0]));
    } catch {
      setError("Nao foi possivel gerar marca aleatoria agora.");
    } finally {
      setRandomizing(false);
    }
  }

  function createWhiteLabelPage() {
    const company = wlName.trim() || "Nexo";
    const slug = slugify(company) || `tenant-${Date.now()}`;
    const params = new URLSearchParams({ empresa: company });

    if (wlLogo.startsWith("data:image/")) {
      const logoKey = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(logoKey, wlLogo);
      params.set("logoKey", logoKey);
    } else {
      params.set("logo", wlLogo);
    }

    router.push(`/wl/${slug}?${params.toString()}`);
    setIsBuilderOpen(false);
  }

  function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Envie um arquivo de imagem valido (PNG, JPG, SVG). ");
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("Imagem muito grande. Use ate 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      if (!dataUrl.startsWith("data:image/")) {
        setUploadError("Nao foi possivel ler essa imagem.");
        return;
      }
      setWlLogo(dataUrl);
    };
    reader.onerror = () => setUploadError("Falha no upload da imagem.");
    reader.readAsDataURL(file);
  }

  return (
    <main className="app-shell">
      <header className="header">
        <div className="brand">
          <img src={safeLogo} alt="Logo da empresa" />
          <div>
            <p className="brand-title">{tenantName}</p>
            <p className="brand-sub">Plataforma de IA para qualificacao e pitch comercial</p>
          </div>
        </div>
        {showBuilder ? (
          <button type="button" className="pill action-pill" onClick={() => setIsBuilderOpen(true)}>
            Crie sua IA de Vendas
          </button>
        ) : null}
      </header>

      <section className="layout-grid">
        <article className="card stack">
          <h1>Cruze manifesto comercial com sinais publicos</h1>
          <p className="muted">
            Use esta workspace para gerar discovery, pitch e proximo passo com base no perfil do
            prospect e no seu playbook.
          </p>

          <form onSubmit={onSubmit} className="stack">
            <label className="field">
              <span className="label">Empresa-base</span>
              <input
                value={baseCompany}
                onChange={(event) => setBaseCompany(event.target.value)}
                placeholder="Nome da empresa-base"
                required
              />
            </label>

            <label className="field">
              <span className="label">Manifesto / playbook</span>
              <textarea
                value={manifesto}
                onChange={(event) => setManifesto(event.target.value)}
                rows={7}
                placeholder="Cole seu manifesto aqui"
                required
              />
            </label>

            <label className="field">
              <span className="label">Prospect</span>
              <input
                value={prospect}
                onChange={(event) => setProspect(event.target.value)}
                placeholder="Empresa prospect"
                required
              />
            </label>

            <label className="field">
              <span className="label">Contexto extra (opcional)</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Ex.: foco em discovery para varejo"
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Analisando..." : "Analisar prospect"}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </form>
        </article>

        <aside className="card stack">
          <h2>Como usar no comercial</h2>
          <ul className="list muted">
            <li>Preencha manifesto e empresa prospect.</li>
            <li>Rode a analise para receber fit score e perguntas de discovery.</li>
            <li>Use o pitch de 30s e o proximo passo na call real.</li>
          </ul>
          <p className="tiny muted">
            Dica: inicie com um prospect por vez e compare respostas para refinar seu manifesto.
          </p>
        </aside>
      </section>

      {showBuilder && isBuilderOpen ? (
        <div className="modal-backdrop" onClick={() => setIsBuilderOpen(false)}>
          <section className="modal-card stack" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Crie sua IA de Vendas</h2>
              <button type="button" className="close-button" onClick={() => setIsBuilderOpen(false)}>
                Fechar
              </button>
            </div>

            <p className="muted">
              Escolha o nome e o logo da empresa, ou use <strong>Aleatorio</strong> para a IA
              sugerir.
            </p>

            <div className="layout-grid compact-grid">
              <label className="field">
                <span className="label">Nome da empresa</span>
                <input
                  value={wlName}
                  onChange={(event) => setWlName(event.target.value)}
                  placeholder="Ex.: VentoCRM"
                />
              </label>

              <label className="field">
                <span className="label">Logo</span>
                <select value={wlLogo} onChange={(event) => setWlLogo(event.target.value)}>
                  {LOGO_OPTIONS.map((logoPath) => (
                    <option key={logoPath} value={logoPath}>
                      {logoPath.replace("/", "")}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span className="label">Upload de logo (opcional)</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
            {uploadError ? <p className="error">{uploadError}</p> : null}

            <div className="logo-preview-row">
              <img src={wlLogo} alt="Preview do logo" className="logo-preview" />
              <div className="inline-actions">
                <button type="button" onClick={handleRandomBrand} disabled={randomizing}>
                  {randomizing ? "Gerando marca..." : "Aleatorio (IA)"}
                </button>
                <button type="button" onClick={createWhiteLabelPage}>
                  Gerar nova pagina
                </button>
              </div>
            </div>

            <p className="tiny muted">
              Sem persistencia: a nova pagina replica a estrutura original em uma URL unica.
            </p>
          </section>
        </div>
      ) : null}

      {result ? (
        <section className="card stack">
          <h2>Resultado da analise</h2>
          <div className="kpi-row">
            <div className="kpi-card">
              <p className="kpi-label">Prospect</p>
              <p className="kpi-value">{result.prospect_company || "-"}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Fit score</p>
              <p className="kpi-value">{result.fit_score ?? "-"}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Confianca</p>
              <p className="kpi-value">{result.confidence || "-"}</p>
            </div>
          </div>

          <p>
            <strong>Proximo passo:</strong> {result.next_best_action}
          </p>

          <div className="stack">
            <strong>Abertura de pitch (30s)</strong>
            <p className="muted">{result.pitch_5min?.opening_30s}</p>
          </div>

          <div className="stack">
            <strong>Perguntas de discovery</strong>
            <ul className="list">
              {(result.discovery_questions ?? []).map((question, index) => (
                <li key={`${question}-${index}`}>{question}</li>
              ))}
            </ul>
          </div>

          <div className="stack">
            <strong>Fontes</strong>
            <div className="source-list">
              {(result.sources ?? []).map((source, index) => (
                <div key={`${source.url ?? source.title}-${index}`}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title || source.url}
                    </a>
                  ) : (
                    <span>{source.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <details>
            <summary>JSON completo</summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </section>
      ) : null}
    </main>
  );
}
