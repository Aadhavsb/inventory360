import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-wildlife-cream flex items-center justify-center font-wildlife p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🦁</div>
        <h1 className="text-2xl font-bold text-wildlife-black mb-2">Page not found</h1>
        <p className="text-wildlife-brown-dark mb-6">
          This page does not exist or has been moved.
        </p>
        <Link href="/" className="btn-wildlife px-6 py-3">
          Back to home
        </Link>
      </div>
    </div>
  );
}
