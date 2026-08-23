import Link from "next/link";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-soft/70">
      <Container className="flex flex-col gap-5 py-9 font-sans text-[0.85rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md leading-6">
          © {new Date().getFullYear()} {site.name}. Built as a public systems notebook.
        </p>
        <nav aria-label="Professional links">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            {site.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="quiet-link"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
