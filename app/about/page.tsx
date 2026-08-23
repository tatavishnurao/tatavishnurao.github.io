import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "About",
  description: "About Vishnu Vardhan Rao and his work in AI infrastructure."
};

export default function AboutPage() {
  return (
    <Container className="pt-12 sm:pt-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-between">
        <article>
          <p className="eyebrow">About</p>
          <h1 className="display-heading mt-4 text-[2.8rem] sm:text-[4.5rem]">I learn by building the mechanism.</h1>
          <div className="body-copy mt-8 text-[1.04rem]">
            <p>I’m Vishnu Vardhan Rao, a computer science student and systems-oriented AI engineer based in Hyderabad, India. I’m interested in the layer where model architecture meets hardware: inference engines, GPU kernels, memory systems, and distributed execution.</p>
            <p>My projects usually begin with a concrete constraint. Why does a smaller KV cache fail to improve latency? Why does multi-hop memory retrieval collapse before other categories? What does a real-time feature pipeline need beyond a fast FFT? I build references, optimized paths, tests, and benchmarks until the failure mode becomes legible.</p>
            <p>I publish those investigations here because engineering knowledge compounds when the measurements, mistakes, and trade-offs remain visible—not only the final demo.</p>
          </div>

          <section className="mt-12 border-t border-soft pt-8">
            <h2 className="font-serif text-2xl font-semibold tracking-[-0.035em]">Current directions</h2>
            <ul className="mt-5 space-y-3 text-[0.98rem] leading-7 text-muted">
              <li><strong className="text-ink">Inference:</strong> KV-cache compression, attention kernels, and serving efficiency.</li>
              <li><strong className="text-ink">Memory:</strong> retrieval evaluation and long-context agent infrastructure.</li>
              <li><strong className="text-ink">Systems:</strong> Rust, CUDA, distributed systems, and performance measurement.</li>
            </ul>
          </section>
        </article>

        <aside>
          <div className="overflow-hidden rounded-2xl border border-soft bg-panel">
            <Image src="/images/profile.jpg" alt="Vishnu Vardhan Rao" width={880} height={1320} className="aspect-[2/3] w-full object-cover grayscale-[0.15]" priority />
          </div>
          <p className="mt-4 font-mono text-[0.67rem] leading-5 text-muted">B.Tech CSE · Anurag University · Class of 2027</p>
        </aside>
      </div>
    </Container>
  );
}
