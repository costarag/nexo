# Nexo
> AI-powered sales qualification for B2B teams

[![Live](https://img.shields.io/badge/Live-nexo--tan.vercel.app-black?style=flat-square)](https://nexo-tan.vercel.app/) ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

![Nexo screenshot](https://api.microlink.io/?url=https%3A%2F%2Fnexo-tan.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url)

**→ Live at [nexo-tan.vercel.app](https://nexo-tan.vercel.app/)**

---

## The Problem

B2B sales teams waste hours manually researching prospects, qualify inconsistently across reps, and walk into discovery calls with generic pitches. Without a scalable process, conversion depends entirely on individual talent — not repeatable systems.

## The Solution

Nexo turns your company's sales playbook into an AI qualification engine. Paste your manifesto and a prospect's name — the AI researches them publicly, scores the fit, and generates tailored discovery questions, a 30-second pitch, and a follow-up email. Stateless by design: no login, no database, instant value.

## Key Features

- **Fit Score (0–100)** with justification based on your playbook
- **BANT signals** (Budget, Authority, Need, Timeline) extracted from public data
- **5 discovery questions** calibrated to the prospect's profile
- **30-second pitch** personalized to their context
- **Follow-up email template** ready to send
- **White-label URLs** — generate `/wl/[slug]` pages with your own branding, no backend required

## Business Model

White-label as a viral distribution vector: every company that creates a branded URL carries Nexo to partners and prospects.

| Channel | Model |
|---------|-------|
| Self-serve | API key per company, zero contract |
| SaaS B2B | Per-user subscription (R$49–149/mo) |
| Licensing | Sales enablement platforms & consultancies |

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| AI | OpenAI `web_search_preview` |
| Language | TypeScript |
| Runtime | Bun |
| Styling | Custom CSS (design tokens, responsive) |
| Hosting | Vercel (stateless, zero infra cost) |

## Running Locally

```bash
bun install
cp .env.example .env.local  # add your OPENAI_API_KEY
bun dev
```

Open `http://localhost:3000`.

---

*Bootstrapped with AI coding assistants in hours, not weeks.*
