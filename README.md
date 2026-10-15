# Frames of Divine

A Next.js storefront and devotional art & frames gallery. Product, category, and brand content ships with the app, with no external service credentials required to build or deploy.

## Development

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and serve it locally with `npm start`.

## Admin Dashboard

Access the admin dashboard at `/admin` or `/admin/login`:
- **Default Username**: `admin` (or `framesofdivine`)
- **Default Password**: `framesofdivineadmin` (or `framesofdivine`)

You can also override credentials by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your environment variables.

## Deployment

Import the repository into Vercel and deploy with the default Next.js build settings. No external database credentials are required for local storage and demonstration mode.

Admin edits are stored in the current browser only. They do not sync between visitors and are not written back to the deployed source. Image files selected in the admin are resized and stored in that browser; use stable public image URLs or add permanent assets under `public/` for storefront content.
