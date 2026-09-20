# Rebuild plan

## Current architecture

- The repository currently contains a Next.js App Router site written in TypeScript.
- Styling is primarily in `app/globals.css` with Tailwind configured through PostCSS.
- Content is stored in `content/site.ts`, `content/projects.ts`, `content/research.ts`, `content/publications.ts`, and Markdown notes under `content/notes/`.
- Existing assets include `public/images/profile.jpg`, `public/images/profile.svg`, project architecture SVGs under `public/images/projects/`, and `public/files/cv.pdf`.
- Existing deployment uses GitHub Actions to install Node dependencies, run `npm run build`, and publish `./out` to GitHub Pages.

## What will be removed or reduced

- The public site will no longer depend on Next.js, React, TypeScript, Tailwind, command palette UI, PDF embedding, or client-side routing.
- The homepage will remove the modern portfolio shell: sticky header emphasis, dark-mode state machinery, project card archive styling, GitHub heatmap UI, large viewer overlays, and framework-driven page composition.
- No generated marketing sections, skill ratings, testimonials, animations, or SaaS-style CTAs will be added.

## What will be retained

- Real project metadata from the existing content files and verified GitHub READMEs.
- Existing profile image and project architecture diagrams.
- Existing resume PDF.
- Existing note topics and source Markdown files.
- Existing verified links: GitHub, LinkedIn, X, email, resume, and project repositories.
- Old source files may remain in the repository as source/archive material, but the deployed site will be plain static HTML/CSS.

## New information architecture

```text
index.html
style.css

assets/
  profile/
  projects/
  resume.pdf

projects/
  index.html
research/
  index.html
writing/
  index.html
resume/
  index.html
```

Homepage order:

1. name, one-line tagline, compact profile image, plain text links
2. chronological current-work narrative
3. bio
4. selected research
5. featured work
6. featured writing
7. pet projects
8. research
9. engineering notes
10. misc
11. small footer

## Expected file changes

- Create/replace `index.html` and `style.css` as the deployed site.
- Create static subpages in `projects/`, `research/`, `writing/`, and `resume/`.
- Copy required public assets into `assets/profile/`, `assets/projects/`, and `assets/resume.pdf`.
- Simplify `.github/workflows/deploy.yml` to publish the static repository content without Node build steps.
- Add `.nojekyll` for GitHub Pages.
