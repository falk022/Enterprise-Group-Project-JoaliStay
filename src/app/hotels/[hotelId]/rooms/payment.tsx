"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { orderService } from "@/services/index";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // bookingId can be passed via ?bookingId=xxx
  const bookingId = searchParams.get("bookingId");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!bookingId) {
      setError("Booking ID is missing.");
      return;
    }
    if (!cardNumber || !expiry || !cvv || !name) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      // Use the api service for payment
      await orderService.payForBooking(bookingId);
      setSuccess("Payment successful! Redirecting to home...");
      setTimeout(() => router.push("/"), 1800);
    } catch (err: any) {
      setError(err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#8B4513] text-center">
          Payment
        </h2>
        <form onSubmit={handlePay} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
              required
              placeholder="Name on card"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
              required
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                required
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                required
                maxLength={4}
                placeholder="CVV"
                inputMode="numeric"
              />
            </div>
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && (
            <div className="text-green-700 text-center">{success}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 text-white bg-[#8B4513] rounded-lg hover:bg-[#5B2415] transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
