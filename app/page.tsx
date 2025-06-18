import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Wildlife SOS Inventory360 - Conservation Asset Management",
  description: "Welcome to Inventory360, the comprehensive asset management system for Wildlife SOS rescue centers. Track medical supplies, equipment, and resources for wildlife conservation across India.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wildlife-ivory via-wildlife-beige to-wildlife-tan flex flex-col items-center justify-center p-8 font-wildlife">
      {/* Wildlife pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-24 h-24">
          <div className="relative w-full h-full">
            <Image
              src="/download (2).jpg"
              alt="Wildlife SOS Logo"
              fill
              className="object-contain rounded-full"
            />
          </div>
        </div>
        <div className="absolute top-32 right-32 text-6xl">🌿</div>
        <div className="absolute bottom-32 left-32 text-7xl">🦌</div>
        <div className="absolute bottom-20 right-20 text-8xl">🌳</div>
      </div>

      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        {/* Logo placeholder with bear silhouette */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-32 h-32 bg-wildlife-black rounded-full flex items-center justify-center shadow-wildlife overflow-hidden">
              <div className="w-full h-full relative">
                <Image
                  src="/download (2).jpg"
                  alt="Wildlife SOS Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-wildlife-green rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">360</span>
            </div>
          </div>
        </div>

        {/* Wildlife SOS Branding */}
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="h-px bg-wildlife-green flex-1"></div>
            <span className="text-wildlife-green font-semibold tracking-wider">
              WILDLIFE SOS
            </span>
            <div className="h-px bg-wildlife-green flex-1"></div>
          </div>

          <h1 className="text-6xl font-bold text-wildlife-black tracking-tight">
            Inventory
            <span className="text-wildlife-green">360</span>
          </h1>

          <p className="text-2xl text-wildlife-brown font-medium">
            Conservation Asset Management System
          </p>

          <p className="text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            Secure inventory tracking for wildlife conservation across our rescue
            centers and field operations
          </p>
        </div>

        {/* Conservation Stats */}
        <div className="grid grid-cols-3 gap-6 my-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-wildlife border border-wildlife-green/20">
            <div className="text-2xl font-bold text-wildlife-green">12+</div>
            <div className="text-sm text-wildlife-brown">Centers</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-wildlife border border-wildlife-green/20">
            <div className="text-2xl font-bold text-wildlife-green">1000+</div>
            <div className="text-sm text-wildlife-brown">Assets</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-wildlife border border-wildlife-green/20">
            <div className="text-2xl font-bold text-wildlife-green">24/7</div>
            <div className="text-sm text-wildlife-brown">Tracking</div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="pt-8">
          <Link href="/login">
            <button className="group relative w-full max-w-md mx-auto bg-wildlife-green hover:bg-wildlife-green-dark text-white font-bold py-6 px-12 rounded-2xl shadow-wildlife transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <span className="flex items-center justify-center space-x-3">
                <span>🚀</span>
                <span>Begin Conservation Mission</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-wildlife-green-light to-wildlife-green opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity"></div>
            </button>
          </Link>
        </div>

        {/* Features with wildlife theme */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-center space-x-2 text-wildlife-brown">
            <span>🔒</span>
            <span>Secure Google Authentication</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-wildlife-brown">
            <span>⚡</span>
            <span>Real-time Asset Updates</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-wildlife-brown">
            <span>🌍</span>
            <span>Multi-location Support</span>
          </div>
        </div>

        {/* Wildlife conservation message */}
        <div className="pt-6 text-xs text-wildlife-brown/70 italic">
          &ldquo;Every asset tracked helps us save more wildlife&rdquo; - Wildlife SOS Team
        </div>
      </div>
    </div>
  );
}
