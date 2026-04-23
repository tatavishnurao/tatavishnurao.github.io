"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export function Footer() {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <footer className="mt-24 border-t border-soft/70">
      <Container className="flex flex-col gap-5 py-9 font-sans text-[0.85rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md leading-6">
          © {new Date().getFullYear()} {site.name}. Notes, research, and
          occasional fragments.
        </p>
        <nav aria-label="Professional links">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            {site.links.map((link) => (
              <li key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className="quiet-link peer"
                  aria-describedby={link.value ? "gmail-tooltip" : undefined}
                >
                  {link.label}
                </Link>
                {link.value ? (
                  <span
                    id="gmail-tooltip"
                    role="tooltip"
                    className="absolute bottom-full left-1/2 z-10 mb-3 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-xl border border-soft bg-paper px-3 py-2 text-xs text-ink opacity-0 shadow-[0_12px_30px_rgba(38,35,31,0.1)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <span>{link.value}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(link.value)}
                      className="rounded-lg border border-soft bg-white/70 px-2 py-1 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent/70 hover:text-ink focus-visible:border-accent/70 focus-visible:text-ink focus-visible:outline-none"
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
