import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="pt-20">
      <h1 className="text-3xl font-semibold tracking-[-0.03em]">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl leading-8 text-ink/80">
        The note or page you are looking for is not available. It may have been
        moved, renamed, or left as a future placeholder.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block font-sans text-sm text-accent underline"
      >
        Return home
      </Link>
    </Container>
  );
}
