/**
 * HeartLineMark — the HEARTLAND wordmark icon.
 * Soft hand-drawn heart silhouette with a subtle ECG trace.
 * Zero deps, safe in any React renderer (Next, Astro islands, Remix).
 */
export function HeartLineMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 28 C 6 20 3 12 8 7 C 12 3 16 5 18 8 C 20 5 24 3 28 7 C 33 12 30 20 18 28 Z" />
      <path d="M5 17 H 12 L 14 12 L 16 22 L 18 17 H 24" strokeWidth="1.4" />
    </svg>
  );
}
