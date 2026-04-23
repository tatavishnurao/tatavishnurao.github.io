type QuoteBlockProps = {
  quote: string;
  attribution: string;
};

export function QuoteBlock({ quote, attribution }: QuoteBlockProps) {
  return (
    <figure className="mt-12 max-w-[37rem] border-l border-accent/40 py-2 pl-6 sm:pl-7">
      <blockquote className="font-serif text-[1.36rem] leading-[1.48] tracking-[-0.025em] text-ink/88 sm:text-[1.5rem]">
        “{quote}”
      </blockquote>
      <figcaption className="mt-4 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted/90">
        {attribution}
      </figcaption>
    </figure>
  );
}
