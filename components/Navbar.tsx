"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { site } from "@/content/site";
import { HeaderActions } from "@/components/HeaderActions";

const navItems = [
  { label: "Writing", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-soft/75 bg-paper/90 backdrop-blur-xl">
      <Container className="flex flex-wrap items-center justify-between gap-x-5 gap-y-4 py-4 sm:py-5">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-[-0.035em] text-ink transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none sm:text-xl"
        >
          Vishnu <span className="text-accent">/</span> systems
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap justify-end gap-x-3 gap-y-2 font-sans text-[0.76rem] text-muted sm:gap-x-6 sm:text-[0.88rem]">
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
          <HeaderActions />
        </div>
      </Container>
    </header>
  );
}
