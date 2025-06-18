"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-wildlife-ivory font-wildlife">
        <div className="text-center">
          <div className="text-6xl mb-4">🐻</div>
          <div className="text-wildlife-green font-semibold">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (session) {
    router.push('/inventory');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wildlife-ivory via-white to-wildlife-beige flex flex-col items-center justify-center p-8 font-wildlife">
      {/* Wildlife background elements */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-16 left-16 text-8xl">🌿</div>
        <div className="absolute top-40 right-20 text-6xl">🦎</div>
        <div className="absolute bottom-40 left-20 text-7xl">🌳</div>
        <div className="absolute bottom-16 right-16 text-5xl">🍃</div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Wildlife SOS Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-wildlife-black rounded-full flex items-center justify-center shadow-wildlife">
                <div className="text-white text-4xl">🐻</div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-wildlife-green rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">SOS</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="h-px bg-wildlife-green flex-1"></div>
              <span className="text-wildlife-green font-semibold text-sm tracking-wider">WILDLIFE SOS</span>
              <div className="h-px bg-wildlife-green flex-1"></div>
            </div>
            
            <h1 className="text-3xl font-bold text-wildlife-black">
              Welcome to Inventory<span className="text-wildlife-green">360</span>
            </h1>
            
            <p className="text-wildlife-brown">
              Conservation Asset Management Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-wildlife border border-wildlife-green/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-wildlife-black mb-2">
              Ranger Access Portal
            </h2>
            <p className="text-sm text-wildlife-brown">
              Sign in to manage conservation assets
            </p>
          </div>

          <button
            className="group relative w-full bg-wildlife-green hover:bg-wildlife-green-dark text-white font-semibold py-4 px-6 rounded-2xl shadow-wildlife transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
            onClick={() => signIn('google', { callbackUrl: '/inventory' })}
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-wildlife-green-light to-wildlife-green opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity"></div>
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-wildlife-brown/70">
              Secure authentication for Wildlife SOS team members
            </p>
          </div>
        </div>

        {/* Conservation mission statement */}
        <div className="mt-8 text-center">
          <div className="bg-wildlife-green/10 rounded-2xl p-4 border border-wildlife-green/20">
            <div className="text-2xl mb-2">🌍</div>
            <p className="text-sm text-wildlife-brown italic">
              "Together, we protect and preserve wildlife for future generations"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
