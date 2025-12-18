# Developer Setup - Klosslabbet.se

## After GitHub Transfer - Reconnect Oxygen

**⚠️ FIRST THING TO DO:** Shopify deployment is broken after repo transfer. Fix it:

1. Go to: https://admin.shopify.com/store/sthlmtoys-games/settings/hydrogen
2. Disconnect old repo
3. Connect new repo: `YOUR_USERNAME/sthlm-headless-final`
4. Branch: `main`
5. Done. GitHub Actions will auto-deploy.

If you have local clone:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/sthlm-headless-final.git
```

---

## What You Got

**Tech Stack:**
- Shopify Hydrogen 2025.5.0
- React + TypeScript
- React Router 7
- Tailwind CSS v4
- Deploy: GitHub Actions → Oxygen

**Delivered:**
- Production Shopify store (98 Lighthouse score)
- 900+ products with images
- Legal pages (terms, privacy, cookies, returns)
- GMC setup + expert fixes implemented
- 4+ months support included

**Estimated work value:** €3,500-5,000
**Client paid:** €1,200

---

## Store Access

**Shopify:** sthlmtoys-games.myshopify.com (client has admin)
**Live Site:** https://www.klosslabbet.se
**GitHub:** Now yours (transferred)

---

## Local Development

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/sthlm-headless-final.git
cd sthlm-headless-final

# Install
npm install

# Environment variables
cp .env.example .env
# Add Shopify credentials from Admin → Settings → Apps

# Run
npm run dev
```

Opens at `http://localhost:3000`

---

## Key Files

```
app/
├── components/       # UI components
│   ├── Header/      # Modular header
│   ├── Footer/      # Footer with sections
│   └── ...
├── routes/          # Pages (React Router 7)
│   ├── ($locale)._index.tsx          # Homepage
│   ├── ($locale).products.$handle.tsx # Product page
│   └── ($locale).collections.$handle.tsx # Collection page
├── lib/             # Utilities
└── styles/          # CSS

public/              # Static assets
```

---

## Content Management

**Client can edit via Shopify Metaobjects:**
- Header banners
- Homepage sections
- Footer content
- Collections

**Admin → Content → Metaobjects**

---

## Deployment

**Auto-deploy on push to `main`:**
1. Push code to GitHub
2. GitHub Actions runs
3. Deploys to Oxygen
4. Live at klosslabbet.se

**Check deployment:** https://github.com/YOUR_USERNAME/sthlm-headless-final/actions

---

## GMC Suspension - Not Code Issue

**98 Lighthouse score = site is technically perfect.**

**Real problems (client's business setup):**

1. **Identity mismatch:** Google accounts on "Bojan Blagojević", company registered to "Branko Blagojević"
2. **Brand confusion:** Changed Sthlm Toys Games → Klosslabbet mid-project, kept old registration
3. **Zero trust:** New domain (Aug 2024), no reviews, no sales history
4. **Premature launch:** Started Google Ads before building credibility

**Console errors client mentioned:** Judge.me third-party script. Zero impact on GMC.

**GMC expert findings:** All recommendations implemented. Suspension is business setup, not code.

**Next steps for client:**
- Fix identity mismatch (Bojan vs Branko)
- Build trust signals (reviews, sales)
- Resubmit: Google Ads appeal or DSA process

---

## Developer Requirements

**Must know:**
- React (hooks, functional components)
- TypeScript
- Shopify Storefront API
- React Router 7 data APIs (loaders/actions)
- Tailwind CSS

**Helpful:**
- Shopify Hydrogen docs
- Metaobjects (content management)
- Vite build tool

---

## Common Tasks

**Add new component:**
```typescript
// app/components/MyComponent.tsx
export function MyComponent() {
  return <div>Hello</div>;
}
```

**Add new page:**
```typescript
// app/routes/($locale).my-page.tsx
export default function MyPage() {
  return <div>My Page</div>;
}
```

**Fetch Shopify data:**
```typescript
// In route loader
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const data = await storefront.query(YOUR_QUERY);
  return data;
}
```

**Update metaobjects:**
Shopify Admin → Content → Metaobjects → Edit

---

## Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs
- Verify environment variables in Oxygen settings

**Local dev broken:**
- Check `.env` has correct Shopify credentials
- Run `npm install` again
- Clear `node_modules` and reinstall

**Oxygen not deploying:**
- Verify repo connected in Shopify Admin
- Check branch is `main`
- Ensure GitHub Actions workflow exists in `.github/workflows/`

---

## Support

**Previous developer:** No longer involved (handover complete)

**Resources:**
- Shopify Hydrogen docs: https://shopify.dev/docs/api/hydrogen
- Shopify Community: https://community.shopify.com
- React Router 7: https://reactrouter.com

---

## Done

Site is production-ready, technically sound (98 Lighthouse), and fully functional.
All code, access, and documentation provided.
Developer can maintain and extend independently.
