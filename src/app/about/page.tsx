import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e5d3c2] pb-20">
      {/* Hero Section */}

      <section className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden shadow-xl">
        <Image
          src="/images/about-img.jpg"
          alt="Joali Maldives Resort Hero"
          layout="fill"
          objectFit="cover"
          className="brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/80 via-transparent to-transparent" />
        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-wide">
            Joali Maldives
          </h1>
          <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto drop-shadow-md">
            Where luxury meets paradise. Experience the art of fine living in
            the heart of the Maldives.
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-4xl mx-auto mt-16 px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#8B4513] mb-4">
            A Symphony of Luxury & Nature
          </h2>
          <p className="text-lg text-gray-800 mb-4">
            At Joali Maldives, every moment is curated for indulgence. Our
            resort blends world-class hospitality, stunning architecture, and
            the vibrant beauty of the Indian Ocean. Whether you seek adventure,
            relaxation, or romance, Joali is your canvas for unforgettable
            memories.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li>Private overwater & beach villas</li>
            <li>Michelin-starred dining experiences</li>
            <li>Exclusive spa & wellness sanctuary</li>
            <li>Eco-conscious luxury & sustainability</li>
          </ul>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg border border-[#e5d3c2]">
          <Image
            src="/images/spa.jpg"
            alt="Woman drinking tea in a bathrobe"
            width={520}
            height={340}
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-5xl mx-auto mt-20 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#8B4513] mb-8 text-center">
          Discover Our World
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-md border border-[#e5d3c2]">
            <Image
              src="/images/go-cart.jpg"
              alt="Activities at Joali Maldives"
              width={400}
              height={260}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md border border-[#e5d3c2]">
            <Image
              src="/images/water-slide.png"
              alt="Water Slide at Joali Maldives"
              width={400}
              height={260}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-md border border-[#e5d3c2]">
            <Image
              src="/images/hero.jpg"
              alt="Resort Overview"
              width={400}
              height={260}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
