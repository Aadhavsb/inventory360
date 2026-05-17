"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-wildlife-cream flex items-center justify-center font-wildlife p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🐻</div>
        <h1 className="text-2xl font-bold text-wildlife-black mb-2">Something went wrong</h1>
        <p className="text-wildlife-brown-dark mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-wildlife px-6 py-3">
          Try again
        </button>
      </div>
    </div>
  );
}
