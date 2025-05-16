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

  // Booking/order details
  const [order, setOrder] = useState<any | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  React.useEffect(() => {
    if (!bookingId) return;
    setOrderLoading(true);
    orderService
      .getMyServiceOrders()
      .then((orders: any[]) => {
        const found = orders.find(
          (o: any) => String(o.id) === String(bookingId)
        );
        setOrder(found || null);
        setOrderLoading(false);
      })
      .catch(() => setOrderLoading(false));
  }, [bookingId]);

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
      // Send bookingId to payment endpoint
      // Use the api service for payment
      await orderService.payForBooking(bookingId);

      // Get user ID from localStorage for redirection
      const userId =
        typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

      setSuccess("Payment successful! Redirecting to homepage");

      // Redirect to user's home page if we have their ID, otherwise to main page
      setTimeout(() => {
        if (userId) {
          router.push(`/home/${userId}`);
        } else {
          router.push("/");
        }
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7f0] via-[#f6e9da] to-[#e9d0b8] py-12 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row shadow-none border-none">
        {/* Payment Summary Section */}
        <div className="md:w-1/2 flex flex-col justify-center items-center p-12 bg-gradient-to-br from-[#f6e9da] to-[#ecd3b6] border-b md:border-b-0 md:border-r border-[#ecd3b6] min-h-[500px]">
          <img
            src="/images/payment.png"
            alt="Payment"
            className="w-44 h-44 object-contain mb-8 drop-shadow-lg"
          />
          <div className="text-4xl font-extrabold text-[#8B4513] mb-2 tracking-tight">
            Complete Your Payment
          </div>
          <div className="text-[#7c4d1e] text-lg mb-6 text-center max-w-xs">
            Secure payment for your booking. We use encrypted transactions for
            your safety.
          </div>
          <div className="w-full flex flex-col gap-2 px-0 py-0">
            <div className="flex justify-between text-[#8B4513] font-semibold text-lg">
              <span>Booking ID</span>
              <span>{bookingId || "-"}</span>
            </div>
            {/* Add more booking details here if available */}
            <div className="flex justify-between text-[#8B4513] text-lg">
              <span>Amount Due</span>
              <span className="font-bold text-2xl">
                {orderLoading ? (
                  <span className="animate-pulse text-[#c2a46a]">
                    Loading...
                  </span>
                ) : order && order.service ? (
                  <>${order.quantity * order.service.price}</>
                ) : (
                  "$0"
                )}
              </span>
            </div>
          </div>
        </div>
        {/* Payment Form Section */}
        <div className="md:w-1/2 flex flex-col justify-center gap-8 px-8 py-16 bg-white/40 min-h-[500px]">
          <h2 className="text-2xl font-bold mb-6 text-[#8B4513] text-center">
            Card Details
          </h2>
          <form onSubmit={handlePay} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#8B4513]">
                Cardholder Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ecd3b6] bg-white/80 focus:ring-2 focus:ring-[#8B4513] focus:outline-none text-black shadow-sm transition"
                required
                placeholder="Name on card"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#8B4513]">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#ecd3b6] bg-white/80 focus:ring-2 focus:ring-[#8B4513] focus:outline-none text-black shadow-sm transition"
                required
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-[#8B4513]">
                  Expiry
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#ecd3b6] bg-white/80 focus:ring-2 focus:ring-[#8B4513] focus:outline-none text-black shadow-sm transition"
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-[#8B4513]">
                  CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#ecd3b6] bg-white/80 focus:ring-2 focus:ring-[#8B4513] focus:outline-none text-black shadow-sm transition"
                  required
                  maxLength={4}
                  placeholder="CVV"
                  inputMode="numeric"
                />
              </div>
            </div>
            {/* Animated error/success messages */}
            <div className="h-8">
              {error && (
                <div className="animate-fadeIn text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded-lg py-2 px-3 shadow-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="animate-fadeIn text-green-700 text-center font-semibold bg-green-50 border border-green-200 rounded-lg py-2 px-3 shadow-sm">
                  {success}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 text-xl font-bold rounded-2xl bg-gradient-to-r from-[#8B4513] to-[#d9a066] text-white shadow-lg hover:from-[#5B2415] hover:to-[#b97c2a] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              ) : (
                <span>Pay</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
