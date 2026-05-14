# Buka Baker x Cafe Goosie — Interactive Site

This project is a static interactive site (site_app.html) to collect interest for a popup event. It includes a small serverless handler at `api/submit-interest.js` which is intended to insert submissions into Supabase.

Quickstart

1. Create a Supabase project and copy the SUPABASE_URL and a SERVICE_ROLE_KEY.
2. Create the `submissions` table using the SQL in `db/001_create_submissions.sql`.
3. Set environment variables in your hosting platform (Vercel/Netlify):
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
4. Deploy the site (recommended: Vercel or Netlify). Ensure serverless functions are supported.

Files of interest

- site_app.html — frontend with GSAP animations and theme toggle
- api/submit-interest.js — serverless handler that inserts into Supabase
- db/001_create_submissions.sql — SQL migration for the submissions table
- .env.example — example env vars

Security notes

- Never commit real secrets. Use platform env vars for service role keys.
- For production, prefer using RLS and a narrow service role or dedicated insert-only function.