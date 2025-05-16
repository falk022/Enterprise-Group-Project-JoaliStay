"use client";

import Image from "next/image";
import { useState } from "react";
import ActivityCard from "@/components/ActivityCard";
import Link from "next/link";
import Ads from "@/components/Ads";
import Map from "@/components/Map";

export default function Home() {
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState("");
  const [persons, setPersons] = useState(2);

  const ads = [
    {
      image: "/images/Advertisement.jpg",
    }  
  ];

  const maps = [
    {
      image: "/images/Map.jpg",
    }  
  ];


  return (
    <div className="relative w-full min-h-screen bg-[#F9F9F9]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#152C5B] text-4xl md:text-5xl font-bold leading-tight mb-6">
              Want To Relax During Vacation?
              <br />
              Visit Joali
            </h2>
            <p className="text-[#B0B0B0] mb-8">
              We provide what you need to enjoy holidays with your family.
              <br /> Time to create some amazing memories.
      
            </p>
            <Link href="/hotels">
            <button className="bg-[#5B2415] text-white px-8 py-3 rounded-lg">
              View Hotels
            </button>
            </Link>
          </div>
          <div className="relative">
            <div className="bg-[#C4C4C4] w-full h-[400px] rounded-[30px] overflow-hidden">
              <Image
                src="/images/hero.jpg"
                alt="Luxury accommodation"
                fill
                className="object-cover rounded-[30px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ads */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-[#152C5B] text-2xl font-medium mb-8">
            Resort Advertisement
          </h3>
          <div className="grid md:grid-cols-1 gap-6 text-[#152C5B]">
            {ads.map((ad, index) => (
              <Ads
                key={index}
                image={ad.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-[#152C5B] text-2xl font-medium mb-8">
            Resort Map
          </h3>
          <div className="grid md:grid-cols-1 gap-6 text-[#152C5B]">
            {maps.map((map, index) => (
              <Map
                key={index}
                image={map.image}
              />
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
