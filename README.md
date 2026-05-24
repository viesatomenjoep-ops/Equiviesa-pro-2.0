# 🐴 EquiManager — Stable Horse Manager

Production-ready stable management app built with **Next.js 14**, **Supabase**, **Vercel**, and **Cloudinary**.
Languages: 🇧🇪 Nederlands · 🇬🇧 English · 🇪🇸 Español

---

## Features

| Module | Features |
|---|---|
| **Horses** | Full profiles, photos (Cloudinary), chip/passport, health status |
| **Grooms** | Profiles, assigned horses, rooster, shifts, performance |
| **Health** | Hooves, deworming, GastroGuard, NSAID, supplements, vaccinations, dental, history |
| **Finance** | Income/expenses, categories, transactions, receipts (Cloudinary) |
| **Schedule** | Weekly roster, task management, recurring tasks |
| **Documents** | Upload & link to horse/groom (Cloudinary) |
| **i18n** | NL / EN / ES with live language switcher |
| **Auth** | Supabase Auth (email + SSO ready), role-based (owner/manager/vet/groom) |
| **Multi-tenant** | Per-stable data isolation via RLS |

---

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste & run `supabase/schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API
4. Enable **Email Auth** in Authentication → Providers

---

## 2. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Create an **unsigned upload preset** called `equimanager_unsigned`
   - Settings → Upload → Add upload preset → Signing mode: Unsigned
3. Copy your **Cloud name**, **API key**, **API secret**

---

## 3. Local Development

```bash
# Clone & install
git clone https://github.com/youruser/equimanager.git
cd equimanager
npm install

# Configure environment
cp .env.example .env.local
# Fill in all values in .env.local

# Run dev server
npm run dev
# → http://localhost:3000
```

---

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Set environment variables (or use Vercel dashboard)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET

# Deploy to production
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard for automatic deployments.

---

## 5. Deploy to Antigravity / Custom Host

```bash
npm run build
npm start
```

Set all environment variables from `.env.example` in your hosting platform.
The app runs on port 3000 by default. Use a reverse proxy (nginx/caddy) for custom domains.

---

## 6. First Launch

1. Go to `/login` and create your account via Supabase Auth dashboard
2. Insert your stable into the `stables` table in Supabase
3. Link your profile: update `profiles` → set `stable_id` and `role = 'owner'`
4. Start adding horses, grooms, and health records!

---

## Tech Stack

```
Frontend:  Next.js 14 (Pages Router) + React 18 + Tailwind CSS 3
Database:  Supabase (PostgreSQL + RLS + Auth)
Media:     Cloudinary (photos, documents, receipts)
Deploy:    Vercel (recommended) or any Node.js host
i18n:      Custom React context (NL / EN / ES)
Forms:     react-hook-form
Charts:    Recharts
Icons:     Lucide React
```

---

## Project Structure

```
equimanager/
├── supabase/schema.sql      # Full DB schema — run this first
├── lib/
│   ├── supabase.js          # Supabase client + all API helpers
│   └── cloudinary.js        # Cloudinary client + upload helpers
├── contexts/I18nContext.jsx # Language context + useI18n hook
├── locales/
│   ├── en.json              # English translations
│   ├── es.json              # Spanish translations
│   └── nl.json              # Dutch translations
├── components/
│   └── Layout.jsx           # Sidebar + hamburger + language selector
├── styles/globals.css       # Tailwind + design system
├── pages/
│   ├── index.jsx            # Dashboard
│   ├── login.jsx            # Auth page
│   ├── horses/              # Horse management
│   ├── grooms/              # Groom management
│   ├── health/              # All health modules
│   ├── finance/             # Finance overview
│   ├── schedule/            # Roster & tasks
│   └── api/                 # API routes (upload, etc.)
├── .env.example             # All required env vars
├── vercel.json              # Vercel deployment config
└── tailwind.config.js       # Design tokens & theme
```

---

## Mobile & Accessibility

- All interactive elements minimum **52px** height (touch-friendly)
- Hamburger menu on mobile, persistent sidebar on desktop
- Font size minimum 16px for readability in stable environments
- Works offline-capable with proper PWA setup (add `next-pwa`)
- Language selector always visible on both mobile and desktop

---

## License

MIT — build freely, launch commercially.
