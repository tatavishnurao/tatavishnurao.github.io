export const projects = [
  {
    title: "LatentPagedAttention-rs",
    href: "https://github.com/tatavishnurao/LatentPagedAttention-rs",
    description: "Rust and cuTile experiments for paged latent-KV attention on an RTX 4060.",
    result: "16× smaller KV representation · 37 validation tests",
    tags: ["Rust", "cuTile", "GPU inference"],
    aim: "Built CPU references, paged memory primitives, direct latent attention kernels, and parity tests to measure the real memory–latency trade-off."
  },
  {
    title: "SignalFlow-rs",
    href: "https://github.com/tatavishnurao/signalflow-rs",
    description: "A real-time log-Mel audio frontend written in Rust.",
    result: "0.364 ms per 100 ms audio · 136 tests · 275× real time",
    tags: ["Rust", "DSP", "Streaming"],
    aim: "Turns PCM audio into stable batch and streaming log-Mel features with bounded backpressure and a cached extraction path."
  },
  {
    title: "RealKV-Serve",
    href: "https://github.com/tatavishnurao/RealKV-Serve",
    description: "An experimental inference path for learned KV subspaces.",
    result: "4× KV reduction at rank 16 · fixed-basis decode",
    tags: ["Inference", "KV cache", "PyTorch"],
    aim: "Compares baseline, SVD, head-pruned, and fixed-basis decode paths while tracking latency, reconstruction error, and token-level divergence."
  },
  {
    title: "SochDB memory benchmarks",
    href: "https://github.com/tatavishnurao/sochdb-benchmarks",
    description: "Reproducible evaluation infrastructure for long-term conversational memory.",
    result: "1,986 LoCoMo questions · held-out 1,020/966 split",
    tags: ["Retrieval", "Evaluation", "Agent memory"],
    aim: "Separates retrieval quality from answer generation, measures oracle ceilings, and exposes where multi-hop memory retrieval actually fails."
  },
  {
    title: "DubPatch",
    href: "https://github.com/tatavishnurao/DubPatch",
    description: "A fidelity QA loop for dubbing English video into Indic languages.",
    result: "Shortlisted among 200 Sarvam Epoch builders",
    tags: ["Speech", "Multilingual AI", "Evaluation"],
    aim: "Aligns source and dubbed transcripts, identifies segment-level errors, and regenerates only the affected audio blocks."
  }
];
