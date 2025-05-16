"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { orderService } from "@/services/index";
import Image from "next/image";

export default function BookingScreen({
  room,
  hotelId,
}: {
  room: any;
  hotelId: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const nights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  }, [checkIn, checkOut]);

  const router = useRouter();

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      setError("Please select a valid date range (at least one night).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bookingId = await orderService.placeServiceOrder({
        serviceId: room.id,
        quantity: nights,
        scheduledFor: checkIn || new Date().toISOString(),
      });
      if (bookingId) {
        router.push(`/payment?bookingId=${bookingId}`)
      } else {
        setError("Booking successful, but no booking ID returned.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to place booking");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Image Gallery & Details */}
        <div className="lg:col-span-2">
          {/* Single Large Image */}
          <div className="relative w-full min-h-[320px] lg:min-h-[420px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={room.imageUrl || "/images/room-placeholder.jpg"}
              alt={room.name}
              fill
              className="object-cover object-center rounded-2xl"
              priority
            />
          </div>
          {/* Room Title & Meta */}
          <div className="mb-2 flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-[#2f1d0e]">{room.name}</h1>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-[#ecd3b6] mt-6 mb-4">
            <span className="pb-3 px-1 text-[#8B4513] font-medium border-b-2 border-transparent"></span>
          </div>
          {/* Overview Section */}
          <div className="mb-8">
            <div className="text-[#7c4d1e] text-base mb-4 italic">
              {room.description}
            </div>
          </div>
        </div>
        {/* Right: Booking Box */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-24 w-full">
            <div className="bg-white rounded-2xl border border-[#ecd3b6] shadow-xl p-6 flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#8B4513]">
                  ${room.price}
                </span>
                <span className="text-base text-gray-500">/ night</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#8B4513] mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#ecd3b6] bg-[#faf7f2] focus:ring-2 focus:ring-[#8B4513] focus:outline-none text-black"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#8B4513] mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#ecd3b6] bg-[#faf7f2] focus:ring-2 focus:ring-[#8B4513] focus:outline-none text-black"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-base text-[#8B4513] mt-2">
                <span>Nights</span>
                <span>{nights}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-[#8B4513] border-t pt-2">
                <span>Total</span>
                <span>${nights * (room.price || 0)}</span>
              </div>
              {error && (
                <div className="animate-fadeIn text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded-lg py-2 px-3 shadow-sm">
                  {error}
                </div>
              )}
              <button
                onClick={handleBook}
                className="w-full py-3 text-xl font-bold rounded-xl bg-gradient-to-r from-[#8B4513] to-[#d9a066] text-white shadow-lg hover:from-[#5B2415] hover:to-[#b97c2a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Booking...</span>
                ) : (
                  <span>Book Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
