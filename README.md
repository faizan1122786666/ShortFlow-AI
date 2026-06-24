# ShortFlow AI

Local-first SaaS for scheduling and publishing short-form vertical videos to **YouTube Shorts** and **TikTok**, with AI-generated metadata powered by **Gemini** and automated publishing via **n8n**.

## Features

- Upload vertical videos to Supabase Storage
- Schedule publishing by date and time
- AI-generated titles, descriptions, and hashtags (Gemini)
- Multi-platform publishing (YouTube Shorts, TikTok)
- n8n workflow automation
- Dark mode dashboard UI
- Supabase Auth with protected routes

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI | Google Gemini API |
| Automation | n8n |
| Containers | Docker Compose |

## Folder Structure

```
ShortFlowAI/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── upload/
│   │   │   ├── scheduled/
│   │   │   ├── published/
│   │   │   ├── settings/
│   │   │   ├── accounts/
│   │   │   └── layout.tsx
│   │   ├── api/                  # API routes
│   │   │   ├── upload/
│   │   │   ├── generate/
│   │   │   ├── publish/
│   │   │   └── videos/
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Navbar, Sidebar
│   │   ├── video-upload-form.tsx
│   │   ├── video-table.tsx
│   │   ├── ai-generator.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── supabase/             # Client, server, admin, middleware
│   │   └── utils.ts
│   ├── services/
│   │   ├── gemini/               # AI metadata generation
│   │   ├── youtube/              # YouTube adapter
│   │   ├── tiktok/               # TikTok adapter
│   │   ├── n8n/                  # n8n webhook integration
│   │   └── platforms/            # Platform adapter registry
│   ├── types/
│   └── middleware.ts
├── supabase/
│   └── schema.sql                # Database schema + RLS + storage
├── n8n/
│   └── workflows/                # Importable n8n workflows
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

## Installation

### Prerequisites

- Node.js 20+
- npm
- Supabase project ([supabase.com](https://supabase.com))
- Gemini API key ([Google AI Studio](https://aistudio.google.com))
- n8n running locally at `http://localhost:5678`

### 1. Clone and install

```bash
cd ShortFlowAI
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `N8N_WEBHOOK_URL` | n8n webhook URL (default: `http://localhost:5678/webhook/video-publish`) |

### 3. Supabase setup

1. Create a new Supabase project
2. Open **SQL Editor** and run `supabase/schema.sql`
3. Verify the `videos` storage bucket was created
4. Enable Email auth under **Authentication → Providers**

### 4. n8n setup

1. Ensure n8n is running at `http://localhost:5678`
2. Import workflows from `n8n/workflows/`:
   - `video-publish.json` — receives publish requests
   - `scheduled-publisher.json` — checks due videos every minute
   - `error-handler.json` — captures and records failures
3. Activate all workflows
4. Set n8n environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SHORTFLOW_APP_URL` (e.g. `http://localhost:3000`)

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Local Development Guide

```bash
# Development server
npm run dev

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

### Video flow

```
Upload → Supabase Storage → Database metadata → AI generation → Schedule → n8n webhook → Platform APIs → Status update
```

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/upload` | Upload video file + metadata |
| POST | `/api/generate` | Generate AI title/description/hashtags |
| POST | `/api/publish` | Schedule/trigger publish via n8n |
| GET | `/api/videos` | List user videos (optional `?status=`) |
| PATCH | `/api/videos/:id` | Update video metadata |
| DELETE | `/api/videos/:id` | Delete video |

## Deployment

### Docker Compose

```bash
docker compose up --build
```

Services:
- **app** — Next.js on port 3000
- **n8n** — Automation on port 5678

### Vercel (frontend + API)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Supabase

Use hosted Supabase for production database, auth, and storage. Run `supabase/schema.sql` against your production project.

## Platform Connections

Connect YouTube and TikTok accounts under **Accounts** in the dashboard. Paste OAuth access tokens for each platform. Tokens are stored securely in Supabase with RLS policies.

## License

MIT
