# Spirits Finder Dashboard

Next.js (App Router) + React 19 SPA for monitoring spirit anomalies in Tokyo with FSD structure, TanStack Query, Zod, and SCSS modules.

## Requirements
- Node.js 18+ (project Dockerfile uses Node 20)
- npm

## Local development
```bash
npm install
npm run dev
```
App will be available at http://localhost:3000

## Useful scripts
- `npm run dev` — start dev server with HMR
- `npm run lint` — lint source
- `npm run build` — production build
- `npm run start` — start production server (requires `npm run build`)

## Docker / Docker Compose
Запустить в прод-режиме одной командой:
```bash
docker compose up
# http://localhost:3000
```

### Notes
- Telemetry is disabled in containers via `NEXT_TELEMETRY_DISABLED=1`.
- Adjust `docker-compose.yml` env vars if you need custom settings.
