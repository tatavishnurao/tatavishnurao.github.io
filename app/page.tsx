import Image from "next/image";
import { Container } from "@/components/Container";
import { QuoteBlock } from "@/components/QuoteBlock";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <Container className="pt-12 sm:pt-16">
      <section className="grid gap-11 lg:grid-cols-[minmax(0,40rem)_248px] lg:items-start lg:justify-between">
        <div>
          <h1 className="display-heading max-w-2xl text-[1.55rem] leading-[1.02] tracking-[-0.03em] sm:text-[1.9rem]">
            {site.homeHeading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="body-copy mt-5 max-w-[39rem]">
            {site.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <QuoteBlock quote={site.quote.text} attribution={site.quote.author} />

          <div className="body-copy mt-8 max-w-[39rem]">
            <p>{site.closing}</p>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[232px] pt-1 sm:max-w-[248px] lg:mt-10">
          <div className="overflow-hidden rounded-[1.25rem] border border-soft/90 bg-white/45 shadow-[0_18px_44px_rgba(36,33,29,0.075)]">
            <Image
              src={site.profileImage}
              alt={`Portrait of ${site.name}`}
              width={880}
              height={1320}
              priority
              className="aspect-[2/3] w-full object-cover sepia-[0.08]"
            />
          </div>
          <figcaption className="sr-only">Portrait of {site.name}</figcaption>
        </figure>
      </section>
    </Container>
  );
}
