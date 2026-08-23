export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "latent-paged-attention-rtx-4060",
    title: "Latent paged attention on a laptop GPU",
    date: "2026-08-20",
    excerpt: "What a 16× smaller KV representation costs when the benchmark includes the reconstruction and paging path.",
    body: `The attractive story behind latent KV is simple: store a low-rank representation instead of the full key and value tensors. The engineering story is less convenient. Smaller storage does not automatically produce a faster decode path.

## The constraint

Autoregressive decoding repeatedly reads a growing KV cache. That makes decode increasingly memory-bandwidth-bound, especially when concurrency and context length rise. Compressing the cache attacks the right resource, but it can expose a new compute and data-movement bottleneck.

## What I built

LatentPagedAttention-rs contains NumPy references, a Rust paged-memory model, and cuTile kernels for lookup, writes, full-KV attention, and direct latent attention. Every optimized path is checked against a simpler reference before it is timed.

## What the numbers said

The model-shaped benchmark produced a 16× cache reduction, but latent reads remained about 32.6% slower than full-KV reads in the measured implementation. That is not a failed result. It locates the next problem: fuse more of the reconstruction and attention path, reduce launch overhead, and ensure fewer bytes cross the expensive boundaries.

> Memory reduction is a mechanism. End-to-end decode latency is the outcome.

The repository includes deterministic validation, environment capture, and the benchmark artifacts behind these numbers. [View the implementation](https://github.com/tatavishnurao/LatentPagedAttention-rs).`
  },
  {
    slug: "why-multi-hop-memory-retrieval-fails",
    title: "Why multi-hop memory retrieval fails first",
    date: "2026-08-10",
    excerpt: "A retrieval audit across 1,986 LoCoMo questions, and why a high oracle ceiling changes the optimization target.",
    body: `A memory system can look strong overall while failing precisely on the questions that require it to connect events. Multi-hop questions are where ranking quality, evidence coverage, and context assembly collide.

## Separate retrieval from generation

I evaluated retrieval independently before asking a language model to answer. This matters: otherwise a capable model can hide missing evidence, while a weak answer model can make good retrieval look broken.

The test set contains 966 questions, separated from 1,020 development questions with zero overlap. At a candidate pool of 200, the legal oracle ceiling exceeded 99% Hit@5 and 97% Recall@5. The evidence usually existed in the pool. Selection was the bottleneck.

## The uncomfortable category

Cross-encoder reranking substantially improved the overall result, yet multi-hop retrieval remained the weakest category. A single relevance score tends to prefer individually plausible memories. Multi-hop questions need complementary evidence: one memory establishes an entity or event and another completes the relation.

## What I would optimize next

The next useful mechanism is not simply a larger top-k. It is coverage-aware selection: retrieve broadly, identify the implied sub-questions, then select a compact set whose evidence is jointly sufficient. The evaluation must continue reporting category-level recall so an overall average cannot hide the failure mode.

[Explore the benchmark repository](https://github.com/tatavishnurao/sochdb-benchmarks).`
  },
  {
    slug: "real-time-log-mel-rust",
    title: "Building a real-time log-Mel frontend in Rust",
    date: "2026-07-08",
    excerpt: "From audio frames to bounded streaming features at roughly 275× real-time throughput.",
    body: `Audio models do not consume a waveform directly in many production pipelines. They consume a stable sequence of features, and the frontend that produces those features sits on every request.

## The pipeline

SignalFlow-rs implements framing, windowing, FFT, Mel filtering, and logarithmic compression for 16 kHz mono audio. A 100 ms input produces eight frames with forty Mel bins under the default configuration.

## Batch speed is not enough

A streaming frontend also needs bounded memory, explicit backpressure, predictable chunk handling, and parity with the batch implementation. Those constraints shaped the public API more than the FFT itself.

## Result

The cached release path processes 100 ms of audio in 0.364 ms on the measured machine—about 275× real time. The project includes 136 tests, streaming metrics, zero-drop demonstrations, and separate cached and uncached benchmarks.

The useful lesson was architectural: cache immutable transforms, keep ownership boundaries obvious, and validate streaming output against a trusted batch path.

[Read the source and performance notes](https://github.com/tatavishnurao/signalflow-rs).`
  }
];
