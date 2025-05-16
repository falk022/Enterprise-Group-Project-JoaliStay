"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] flex flex-col items-center">
      {/* Navbar Placeholder (assume it's in layout) */}
      <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">
          Book Your Tickets
        </h1>
        <p className="text-lg text-purple-700 mb-10 text-center">
          Choose your experience and reserve your spot in paradise
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          {/* Ferry Tickets Card */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center p-8 w-full md:w-80 transition-transform hover:scale-105">
            <div className="mb-4 text-5xl text-orange-400">
              <span role="img" aria-label="ferry">
                🛳️
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Ferry Tickets
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Travel between islands with comfort and style.
            </p>
            <button
              className="bg-orange-300 hover:bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
              onClick={() => router.push("/tickets/ferry-booking")}
            >
              Purchase Tickets
            </button>
          </div>

          {/* Themepark Events Card */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center p-8 w-full md:w-80 transition-transform hover:scale-105">
            <div className="mb-4 text-5xl text-orange-400">
              <span role="img" aria-label="themepark">
                🎢
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Themepark Events
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Enjoy thrilling rides and unforgettable entertainment.
            </p>
            <button
              className="bg-orange-300 hover:bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
              onClick={() => router.push("/tickets/themepark")}
            >
              Purchase Tickets
            </button>
          </div>

          {/* Beach Events Card */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center p-8 w-full md:w-80 transition-transform hover:scale-105">
            <div className="mb-4 text-5xl text-orange-400">
              <span role="img" aria-label="beach">
                🏖️
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Beach Events
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Relax, play, and celebrate on our pristine beaches.
            </p>
            <button
              className="bg-orange-300 hover:bg-orange-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
              onClick={() => router.push("/tickets/beach-events")}
            >
              Purchase Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
