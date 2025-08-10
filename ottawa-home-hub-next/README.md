
# Ottawa Home Hub (Next.js App Router)

A Next.js app that integrates **Real Estate Data & Tools**, an **Ontario‑specific AI Buyer/Seller Guide (demo)**, and a **Real Estate Services marketplace** with productized **Packages**.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Tech

- Next.js 14 (App Router)
- TypeScript
- No external UI deps (pure CSS in `app/globals.css`)
- Mock data served from `/api/data`

## Where to plug real data

- **Market stats**: replace mock in `app/api/data/route.ts` with calls/cron-fed DB rows from OREB/CREA.
- **Neighbourhoods**: add ONS indicators + polygons from Open Ottawa.
- **Services**: back this with a DB and admin page to onboard vendors.
- **AI Guide**: connect to your preferred model with Ontario prompts and citation links.

## Deploy

```bash
npm run build
npm start
# or deploy to Vercel
```

## Notes

This is an MVP. Add legal pages (privacy/terms) and verify all calculations (CMHC, LTT) for production.
