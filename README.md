# Sacred Tamil Gallery

A Next.js storefront and devotional art gallery. Product, category, and brand content ships with the app, with no external service credentials required to build or deploy.

## Development

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and serve it locally with `npm start`.

## Deployment

Import the repository into Vercel and deploy with the default Next.js build settings. No environment variables are required.

Admin edits are stored in the current browser only. They do not sync between visitors and are not written back to the deployed source. Image files selected in the admin are resized and stored in that browser; use stable public image URLs or add permanent assets under `public/` for storefront content.
