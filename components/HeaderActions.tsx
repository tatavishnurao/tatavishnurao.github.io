"use client";

import { site } from "@/content/site";

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.58-.3-5.29-1.29-5.29-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.72 5.39-5.31 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M5.36 7.84A2.34 2.34 0 1 0 5.35 3.16a2.34 2.34 0 0 0 .01 4.68ZM3.33 20.67h4.05V9.58H3.33v11.09ZM9.78 9.58h3.88v1.52h.06c.54-1.02 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.21v5.46h-4.04v-4.84c0-1.15-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92H9.78V9.58Z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M18.9 2.75h3.68l-8.04 9.19L24 21.25h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 2.75h7.59l5.24 6.93 6.07-6.93Zm-1.29 16.86h2.04L6.48 4.3H4.3l13.31 15.31Z" />
    </svg>
  )
};

function toggleTheme() {
  const root = document.documentElement;
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  root.style.colorScheme = nextTheme;
  localStorage.setItem("theme", nextTheme);
}

export function HeaderActions() {
  return (
    <div className="flex items-center gap-1 sm:gap-2 sm:border-l sm:border-soft sm:pl-5">
      {site.links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${link.label} profile`}
          title={link.label}
          className="header-icon hidden sm:inline-flex"
        >
          {socialIcons[link.label]}
        </a>
      ))}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle light and dark mode"
        title="Toggle color theme"
        className="header-icon theme-toggle"
      >
        <svg className="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <svg className="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M20.4 15.45A8.7 8.7 0 0 1 8.55 3.6 8.7 8.7 0 1 0 20.4 15.45Z" />
        </svg>
      </button>
    </div>
  );
}
