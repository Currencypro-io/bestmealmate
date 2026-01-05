# Best Meal Mate - Project Context

## Project Overview
Best Meal Mate is an AI-powered meal planning assistant built with Next.js 16 (App Router).

**Live Site:** https://bestmealmate.com

## Tech Stack
- **Framework:** Next.js 16.1.1 (App Router)
- **React:** 19.2.3
- **Styling:** Tailwind CSS v4
- **TypeScript:** v5
- **Testing:** Playwright (E2E)

## Key Configurations

### Google AdSense
- **Publisher ID:** `ca-pub-6442421268022178`
- **Script Location:** `app/layout.tsx` (via `next/script`)
- **ads.txt:** `public/ads.txt`

### SEO Files
- `public/robots.txt` - Crawler permissions
- `public/ads.txt` - AdSense publisher verification

### Content Security Policy
CSP headers are configured in `next.config.ts` to allow:
- Google AdSense scripts (`pagead2.googlesyndication.com`)
- Google Ad services (`googleads.g.doubleclick.net`, `adservice.google.com`)
- Google Analytics (`www.google-analytics.com`)

## Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx playwright test  # Run E2E tests
```

## Testing
Playwright tests verify:
- AdSense script is present in page HTML
- `ads.txt` returns correct content
- `robots.txt` is accessible
- CSP headers allow AdSense domains

## Deployment
Deployed on Vercel. Push to main branch triggers automatic deployment.

## Troubleshooting

### AdSense Verification Failed
1. Check `https://bestmealmate.com/ads.txt` returns publisher ID
2. Check browser console for CSP errors
3. Run `npx playwright test` against live site
4. Wait 24-48 hours after deployment for Google to re-crawl
