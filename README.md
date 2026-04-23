# Tata Vishnu Rao Academic Portfolio

Minimal academic/research portfolio site for `tatavishnu.github.io`, built with Next.js App Router, TypeScript, and Tailwind CSS. The site is designed for GitHub Pages user-site deployment at the repository root, not under a project subpath.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Static Build

```bash
npm run build
```

Next.js writes the static export to `out/`.

## GitHub Pages Deployment

This repository includes `.github/workflows/deploy.yml`. On pushes to `main`, GitHub Actions will:

1. Install dependencies with `npm ci`.
2. Build the static site with `npm run build`.
3. Upload the `out/` directory.
4. Deploy to GitHub Pages.

In the GitHub repository settings, set Pages to deploy from GitHub Actions.

## Root Site Configuration

This is configured for the GitHub Pages user site `tatavishnu.github.io`.

- No `basePath` is configured.
- No `assetPrefix` is configured.
- Internal routes use root paths like `/blog` and `/publications`.
- Public assets use root-safe paths like `/files/cv.pdf` when used directly.

## Editing Content

- Site identity and links: `content/site.ts`
- Blog archive and post bodies: `content/blog.ts`
- Publications and working papers: `content/publications.ts`
- Profile image: replace `public/images/profile.svg` or update `profileImage` in `content/site.ts`
- CV link: update the `CV` entry in `components/Navbar.tsx`

## Project Structure

```text
app/
  blog/
  publications/
  globals.css
  layout.tsx
  page.tsx
components/
content/
lib/
public/
  files/
  images/
```
