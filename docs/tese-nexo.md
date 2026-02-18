# Tese — Nexo

## Problema

Equipes comerciais perdem horas pesquisando prospects manualmente, qualificam de forma inconsistente e entram em calls sem um pitch calibrado ao perfil da empresa. O resultado: ciclos longos, baixa taxa de conversão e dependência total do talento individual do vendedor — sem processo escalável.

O problema se intensifica em PMEs e startups B2B, onde não há equipe de Sales Ops dedicada para construir e manter playbooks de qualificação atualizados.

## Ideia

Transformar o playbook comercial da empresa em um motor de qualificação e geração de pitch via IA.

Dado o manifesto da empresa e o nome do prospect, o sistema faz a pesquisa pública, calcula o fit score e gera perguntas de descoberta + abertura de 30 segundos — tudo calibrado ao contexto real do cliente.

O insight central: não precisa de CRM complexo, banco de dados ou login. A IA já sabe o suficiente sobre o prospect se tiver o playbook certo como contexto.

## Produto

SaaS web stateless (sem login, sem banco de dados). Workspace único:

1. Vendedor insere o manifesto/playbook da própria empresa
2. Insere o nome do prospect (empresa-alvo)
3. IA retorna:
   - **Fit Score** (0–100) com justificativa
   - **Sinais BANT** (Budget, Authority, Need, Timeline)
   - **5 perguntas de descoberta** calibradas ao perfil
   - **Pitch de 30 segundos** personalizado
   - **Template de follow-up** por e-mail
   - **Próximo passo** acionável

**White-label sem fricção**: qualquer empresa gera URL personalizada `/wl/[slug]` com logo próprio — sem banco, sem auth. O slug é gerado via IA ou definido manualmente.

Modelo de deploy: stateless em Vercel, custo zero de infraestrutura além da API da OpenAI.

## Modelo de Negócio

White-label sem fricção como vetor de distribuição viral — cada empresa que cria sua URL carrega a marca Nexo para parceiros e prospects.

| Canal | Modelo |
|-------|--------|
| Self-serve | Chave de API por empresa (Vercel env vars), sem contrato |
| SaaS B2B | Plano por usuário (R$49–149/mês), billing mensal |
| Licenciamento | Integração para plataformas de sales enablement e consultorias |
| Expansão | Módulo de playbook colaborativo + histórico de qualificações |

**Saída estratégica**: aquisição por plataforma de CRM (HubSpot, Salesforce, RD Station), sales intelligence (ZoomInfo, Apollo) ou consultoria de sales enablement.
