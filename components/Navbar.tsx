"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

const navItems = [
  { label: "Projects", href: "/projects" },
  {
    label: "CV",
    href: "https://drive.google.com/file/d/1T2nPi8wvv5wAATE4LXng1yLRR18GDPbt/view?usp=sharing"
  },
  { label: "Blog", href: "/blog" },
  { label: "Publications", href: "/publications" }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-soft/70 bg-paper/55">
      <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-baseline sm:justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-medium tracking-[-0.035em] text-ink transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-sans text-[0.88rem] text-muted sm:gap-x-7">
            {navItems.map((item) => {
              const isActive =
                item.href.startsWith("/") &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`quiet-link border-b pb-1 ${
                      isActive
                        ? "border-accent/45 text-ink"
                        : "border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
