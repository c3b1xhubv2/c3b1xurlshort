# SHORT/LINK — URL Shortener

A clean, minimal URL shortener built with **Next.js 14** and **Vercel KV**. Deploy to Vercel in minutes using your own domain.

---

## Features

- ✅ Shorten any URL instantly
- ✅ Custom slugs (e.g. `yourdomain.com/my-link`)
- ✅ Click tracking
- ✅ Recent links dashboard
- ✅ Serverless — no server to manage
- ✅ Persistent storage with Vercel KV (Redis)

---

## Deploy to Vercel (Step by Step)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
gh repo create url-shortener --public --push
# or manually push to your GitHub
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New Project"**
3. Select your GitHub repository
4. Click **"Deploy"** (it will fail first — that's OK, we need to add KV next)

### Step 3 — Create Vercel KV (Redis Database)

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **"Create Database"**
3. Choose **KV** (Redis)
4. Name it anything (e.g. `url-shortener-kv`)
5. Click **"Create"**
6. Click **"Connect to Project"** to link it to your project
7. This will automatically add `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` to your project's env vars

### Step 4 — Redeploy

Go to your project's **Deployments** tab and click **"Redeploy"** on the latest deployment. It should now work!

### Step 5 — Add Your Custom Domain (Optional)

1. Go to your project's **Settings → Domains**
2. Add your domain (e.g. `s.yourdomain.com`)
3. Add the DNS records Vercel shows you (usually a CNAME)
4. Wait a few minutes for DNS to propagate

Done! Your short link service is live at your custom domain.

---

## Local Development

```bash
npm install

# You need Vercel KV credentials. Link your project:
npx vercel link
npx vercel env pull .env.local

# Start dev server
npm run dev
```

Visit `http://localhost:3000`

---

## Environment Variables

These are automatically set when you connect Vercel KV:

| Variable | Description |
|----------|-------------|
| `KV_URL` | Redis connection URL |
| `KV_REST_API_URL` | REST API endpoint |
| `KV_REST_API_TOKEN` | Auth token |
| `KV_REST_API_READ_ONLY_TOKEN` | Read-only token |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Vercel KV (Redis via Upstash)
- **Hosting**: Vercel (serverless)
- **Fonts**: Syne + DM Mono

---

## Customization

- Change the site name/branding in `app/layout.tsx` and `app/page.tsx`
- Adjust slug length in `lib/kv.ts` (currently 6 chars)
- Add password protection or admin panel as needed
