import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo placeholder - you can replace this with your uploaded logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-3xl font-bold">I360</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Inventory
            <span className="text-blue-600">360</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Asset Management for Distributed Teams
          </p>
          <p className="text-gray-500">
            Secure, minimal, and powerful inventory tracking across your
            organization
          </p>
        </div>

        {/* Get Started Button */}
        <div className="pt-8">
          <Link href="/login">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition duration-200 transform hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="pt-6 text-sm text-gray-500 space-y-2">
          <p>✓ Track assets across 12+ locations</p>
          <p>✓ Real-time updates & clean UI</p>
          <p>✓ Secure Google authentication</p>
        </div>
      </div>
    </div>
  );
}
