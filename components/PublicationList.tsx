import Link from "next/link";
import type { Publication } from "@/content/publications";

type PublicationListProps = {
  publications: Publication[];
};

export function PublicationList({ publications }: PublicationListProps) {
  if (publications.length === 0) {
    return (
      <section className="mt-12 rounded-2xl border border-soft/80 bg-white/40 px-6 py-7">
        <p className="font-sans text-[0.92rem] leading-7 text-muted">
          No publications or working papers have been posted yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-14 divide-y divide-soft/75">
      {publications.map((publication) => (
        <article key={publication.title} className="py-9 first:pt-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="max-w-2xl font-serif text-[1.38rem] font-semibold leading-8 tracking-[-0.025em] text-ink">
              {publication.title}
            </h2>
            <p className="font-sans text-[0.84rem] text-muted">{publication.year}</p>
          </div>
          <p className="mt-2 font-sans text-[0.9rem] leading-6 text-muted">
            {publication.authors}
          </p>
          <p className="mt-1 font-sans text-[0.9rem] leading-6 text-accent">
            {publication.venue}
          </p>
          <p className="mt-5 max-w-3xl text-[1rem] leading-[1.82] text-ink/80">
            {publication.abstract}
          </p>
          {publication.links.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-4 font-sans text-[0.88rem]">
              {publication.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted underline decoration-soft underline-offset-4 transition-colors hover:text-ink focus:text-ink focus:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
