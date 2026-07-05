import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#37475A] to-[#2C3E50] text-white overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl mb-4">
            Spring Sale is Here
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-200">
            Save up to 30% on electronics, wearables, and more
          </p>
          <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-8 py-3 rounded-full transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full">
        <ChevronLeft className="h-6 w-6 text-gray-900" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full">
        <ChevronRight className="h-6 w-6 text-gray-900" />
      </button>

      {/* Decorative Pattern */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
      </div>
    </div>
  );
}
