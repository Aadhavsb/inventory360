"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'sans-serif',
          backgroundColor: '#f5f0e8',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🐘</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a1a1a' }}>
            Critical error
          </h1>
          <p style={{ color: '#5C2D0E', marginBottom: '1.5rem' }}>
            A critical error occurred. Please refresh the page.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#2D5A27',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Refresh page
          </button>
        </div>
      </body>
    </html>
  );
}
