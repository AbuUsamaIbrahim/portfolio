# mahadihasan — portfolio

Architecture case studies for a lead software engineer. Astro + Tailwind + MDX, statically
generated, zero client JS beyond a small scroll-reveal observer.

## Local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve the built output
```

## Content

Case studies live in `src/content/case-studies/*.mdx`. Frontmatter is schema-validated in
`src/content.config.ts` — the build fails if a required field is missing or malformed.

To add one:

1. Create `src/content/case-studies/<slug>.mdx`.
2. Fill the frontmatter (`index`, `title`, `facts`, `decisions`, `diagram`, ...).
3. Reference `<Diagram />` in the body where the architecture diagram should appear.
4. Add a matching diagram component under `src/components/diagrams/` and register it in
   `src/pages/work/[...slug].astro`.

Set `draft: true` to keep one out of the build.

## Deploying to Cloudflare Pages (free)

One-time setup — the account steps are yours to do:

1. Push this repo to GitHub (see below).
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy. You get `<project>.pages.dev`, free SSL and a global CDN.
6. Update `site` in `astro.config.mjs` to the real URL so the sitemap is correct, then push.

Every push to the default branch redeploys automatically. Pull requests get preview URLs.

Node version is pinned in `.node-version`.

### Custom domain (optional, ~$10/yr)

Cloudflare Dashboard → your Pages project → **Custom domains** → add the domain. If the domain is
registered with Cloudflare the DNS is configured for you; otherwise point the CNAME at the
`pages.dev` hostname.

## Push to GitHub

```bash
git remote add origin git@github.com:<you>/portfolio.git
git branch -M main
git push -u origin main
```
