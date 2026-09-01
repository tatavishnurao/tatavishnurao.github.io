import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <Container className="archive-shell py-10 sm:py-16">
      <div className="archive-grid">
        <aside className="archive-rail" aria-label="Archive label">
          <span>VISHNU RAO</span><span>AI SYSTEMS</span><span>2026</span>
        </aside>

        <div className="archive-content">
          <section className="archive-intro grid gap-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
            <figure className="archive-portrait">
              <div className="overflow-hidden border border-soft bg-panel p-2">
                <Image
                  src={site.profileImage}
                  alt={`Portrait of ${site.name}`}
                  width={880}
                  height={1320}
                  priority
                  className="aspect-[2/3] w-full object-cover object-top"
                />
              </div>
              <figcaption><span>VISHNU RAO</span><span>FIG.01 / 2026</span></figcaption>
            </figure>

            <div>
              <p className="eyebrow">@tatavishnurao · CS undergraduate · building AI systems</p>
              <h1 className="display-heading mt-5 max-w-3xl text-[2.25rem] leading-[1.04] sm:text-[3.35rem]">
            {site.homeHeading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
              </h1>
              <div className="body-copy mt-6 max-w-[43rem] text-[0.98rem] sm:text-[1rem]">
            {site.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="archive-links mt-5"><Link href="/projects">projects</Link><Link href="/blog">writing</Link><Link href="/about">about</Link></div>
            </div>
          </section>

          <section className="archive-index" aria-labelledby="index-heading">
            <p id="index-heading" className="eyebrow">INDEX</p>
            <div className="index-rows">
              <Link href="/projects"><span>projects</span><span>shipped systems and experiments</span><b>06</b></Link>
              <Link href="/blog"><span>writing</span><span>technical breakdowns and field notes</span><b>03</b></Link>
              <Link href="/publications"><span>research</span><span>papers, implementations, and reading</span><b>—</b></Link>
              <Link href="/about"><span>about</span><span>the person behind the measurements</span><b>01</b></Link>
            </div>
          </section>

          <section className="archive-feature grid gap-4 md:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.75fr)]">
            <Link href="/projects" className="feature-panel card-link">
              <div className="feature-image"><Image src="/images/projects/latent-paged-attention.svg" alt="Latent paged attention system design" width={900} height={500} /></div>
              <p className="feature-caption">LATENTPAGEDATTENTION-RS · RUST / CUTILE / GPU</p>
              <h2>Making the KV cache smaller without pretending memory is free.</h2>
            </Link>
            <a href="https://github.com/tatavishnurao" target="_blank" rel="noreferrer" className="github-panel">
              <p className="feature-caption">GITHUB · @TATAVISHNURAO</p>
              <div className="contribution-grid" aria-hidden="true">{Array.from({length: 84}, (_, i) => <i key={i} style={{opacity: [0.18,0.32,0.48,0.7,0.9][(i * 7 + 3) % 5]}} />)}</div>
              <div className="github-stats"><span>systems research</span><span>→ profile</span></div>
            </a>
          </section>

          <p className="archive-closing">This is where I keep the work that survives contact with a benchmark. <Link href="/blog">Read the notes →</Link></p>
        </div>
      </div>
    </Container>
  );
}
