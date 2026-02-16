# Nexo

Aplicacao web em PT-BR para times comerciais que querem cruzar o playbook de vendas da empresa com sinais publicos de um prospect.

Proposta: transformar pesquisa comercial + qualificacao em um fluxo pratico com IA, gerando discovery, pitch e proximo passo acionavel.

Projeto com UI premium, estrutura pronta para white-label e geracao de novas paginas de marca sem persistencia.

## Stack

- Next.js 15 (App Router) + TypeScript
- CSS global customizado (tokens e layout responsivo)
- OpenAI SDK (`openai`)
- Bun (dev/build local)

## O que voce encontra no app

- Workspace comercial para:
  - inserir empresa-base e manifesto/playbook
  - pesquisar e analisar prospect com IA
  - receber fit score, perguntas de discovery, pitch e fontes
- Modal `Crie sua IA de Vendas` para gerar nova pagina com:
  - nome da empresa
  - selecao de logo predefinido ou upload de imagem
  - opcao `Aleatorio (IA)` para sugerir marca
- Pagina dinamica em `/wl/[slug]` com mesma estrutura da original (sem banco)

## AI-driven Product Engineering

Este projeto foi evoluido com abordagem de Product Engineering apoiada por IA: sair rapido de ideia para MVP funcional, iterar UX e manter caminho de deploy simples.

- Ferramenta: `OpenCode`
- Modelo: `GPT-5.3` (`openai/gpt-5.3-codex`)
- Papel da IA: acelerar estrutura de app, API routes, fluxo de marca dinamica e refinos de UX/UI

Objetivo: demonstrar velocidade de construcao com foco em produto real, experiencia comercial e base pronta para white-label no Brasil.

## Executar localmente

1. Instale dependencias:

```bash
bun install
```

2. Crie/atualize `.env.local`:

```bash
OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-4.1-mini
```

3. Rode o projeto:

```bash
bun run dev
```

Abra `http://localhost:3000`.

## Scripts

- `bun run dev` inicia ambiente local
- `bun run build` gera build de producao
- `bun run start` sobe a build local

## Deploy na Vercel

- Suba o projeto para GitHub
- Importe na Vercel
- Configure variaveis de ambiente:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL` (opcional)
- Deploy

## Publicacao no GitHub

Como este repositorio pode ser publico:

- nao commitar `.env.local`
- nao expor chave no client-side
- manter segredos apenas em variaveis da Vercel/GitHub

## Observacao

As analises de fit comercial sao apoio a decisao de vendas e nao substituem discovery real com o cliente.
