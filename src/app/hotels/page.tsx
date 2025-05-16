"use client";
import ActivityCard from "@/components/ActivityCard";

import { organizationService } from "@/services/index";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Organization = {
  id: number;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  parentOrganizationId?: number | null;
  parentOrganization?: any | null;
  type: number;
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      setError("");
      try {
        const data = await organizationService.getAllOrganizations(1); // orgType 1
        setHotels(data);
        if (typeof window !== "undefined") {
          localStorage.setItem("hotels", JSON.stringify(data));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load hotels");
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#5B2415] mb-2">
          Our Hotels
        </h1>
        <p className="text-lg text-center text-[#8B4513] mb-10">
          Choose from a variety of luxury hotels for your perfect stay
        </p>
        {loading ? (
          <div className="text-center text-gray-500">Loading hotels...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : hotels.length === 0 ? (
          <div className="text-center text-gray-500">No hotels found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {hotels.map((hotel) => (
              <ActivityCard
                key={hotel.id}
                image={hotel.logoUrl || ""}
                title={hotel.name}
                location={hotel.country || hotel.address || ""}
                buttonLabel="Book Hotel"
                onButtonClick={() => router.push(`/hotels/${hotel.id}/rooms`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
