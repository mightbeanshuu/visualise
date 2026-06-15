# Auth setup (Supabase) — 5 minutes

The site now has a login gate: the landing page is public, but **opening any
pattern hub requires sign-in**. Login/logout events are recorded in your
database. Until you finish the steps below, the site runs in **demo mode**
(gate disabled — nothing is locked out), so it never breaks before configuration.

## 1. Create a Supabase project
1. Go to <https://supabase.com> → **New project** (free tier is fine).
2. Pick a name + database password, wait ~1 min for it to provision.

## 2. Paste your keys into `supabase-config.js`
In the dashboard: **Project Settings → API**. Copy:
- **Project URL** → `url`
- **anon / public** key (NOT `service_role`) → `anonKey`

```js
// supabase-config.js
window.SUPABASE_CONFIG = {
  url:     "https://YOUR-ref.supabase.co",
  anonKey: "eyJhbGciOi...your-anon-key..."
};
```
The anon key is meant to be public — safe to commit. Data is protected by RLS (below).

## 3. Create the `auth_events` table (stores login/logout details)
Dashboard → **SQL Editor** → run:

```sql
create table if not exists public.auth_events (
  id          bigint generated always as identity primary key,
  event       text not null check (event in ('login','logout')),
  user_id     uuid references auth.users(id) on delete cascade,
  email       text,
  path        text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

alter table public.auth_events enable row level security;

-- a signed-in user may record and read only their OWN events
create policy "insert own auth events" on public.auth_events
  for insert to authenticated with check (auth.uid() = user_id);

create policy "read own auth events" on public.auth_events
  for select to authenticated using (auth.uid() = user_id);
```

(To review activity yourself, query the table in the SQL editor — as the
project owner you bypass RLS there.)

## 4. Turn on the sign-in methods you want
Dashboard → **Authentication → Providers**:
- **Email** — on by default. For instant testing, turn **off** "Confirm email"
  (otherwise new accounts must click a confirmation link before signing in).
- **Google** (optional) — enable it and paste a Google OAuth client ID/secret.

Dashboard → **Authentication → URL Configuration**:
- **Site URL**: `https://visualise.vercel.app`
- **Redirect URLs**: add `https://visualise.vercel.app/login` (and
  `http://localhost:3000/login` if you test locally).

## 5. Deploy
Commit `supabase-config.js` with your keys and push — Vercel redeploys and the
gate goes live. Visit any hub while signed out → you're sent to `/login`.

---

### How it works (files)
- `supabase-config.js` — your project URL + anon key (fails open if placeholders remain).
- `auth.js` — loads the Supabase client, gates every hub page, shows the
  bottom-right account chip (email + Log out), logs `login`/`logout` to `auth_events`.
- `login/index.html` — email + password, magic link, and Google sign-in.
- The landing page (`/`) and `/login` are always public.
