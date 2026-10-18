---
title: Building a real-time-capable log-Mel frontend in Rust
date: 2026-07-08
description: The API and measurement choices behind a bounded batch and streaming audio feature pipeline.
tags: Rust, DSP, streaming
---

Audio models often consume stable feature sequences rather than raw waveforms. The frontend producing those features sits on every request, so its correctness, allocation behavior, and streaming boundaries matter as much as the FFT.

## The pipeline

SignalFlow-rs preprocesses WAV or raw samples to 16 kHz mono, then applies framing, a Hann window, FFT power spectrum, Mel filtering, logarithmic compression, and bounded streaming with drop metrics.

## Batch speed is not enough

A streaming frontend also needs explicit backpressure, predictable chunk handling, bounded memory, and parity with the batch implementation. Those constraints shape the public API more than the transform itself.

## Current boundary

The repository includes reusable batch and streaming extraction, cached processor paths, Criterion benchmarks, examples, and architecture notes. It describes real-time-capable feature extraction; it does not claim production real-time scheduling or microphone capture in v0.1.

The durable lesson is architectural: cache immutable transforms, keep ownership boundaries visible, and validate streaming output against a trusted batch path.

[Read the source and performance notes](https://github.com/tatavishnurao/signalflow-rs)
