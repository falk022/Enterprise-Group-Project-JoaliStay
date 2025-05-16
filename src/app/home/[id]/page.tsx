"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

import { orderService, serviceService } from "@/services/index";
import { ServiceType } from "@/types/types";

export default function UserHomePage() {
  const { id } = useParams();
  const [name, setName] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("user_name");
      setName(storedName || "User");
    }

    // Fetch user orders
    setLoading(true);
    setError(null);
    orderService
      .getMyServiceOrders()
      .then((data: any[]) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err?.message || "Failed to fetch your bookings.");
        setLoading(false);
      });

    // Fetch service types
    setServiceTypesLoading(true);
    serviceService
      .getAllServiceTypes()
      .then((data: ServiceType[]) => {
        setServiceTypes(Array.isArray(data) ? data : []);
        setServiceTypesLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch service types:", err);
        setServiceTypesLoading(false);
      });
  }, []);

  // Group bookings by service type
  const bookingsByType = serviceTypes.reduce((acc, serviceType) => {
    // Skip service types without an ID
    if (serviceType.id === undefined) return acc;
    
    acc[serviceType.id] = {
      serviceType,
      bookings: orders.filter(
        (order) => order.service?.serviceTypeId === serviceType.id
      ),
    };
    return acc;
  }, {} as Record<number, { serviceType: ServiceType; bookings: any[] }>);

  // Default placeholder image for services
  const defaultPlaceholder = "/images/service-placeholder.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-8">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5B2415] mb-6">
          Welcome, {name}!
        </h1>
        <div className="w-full max-w-5xl mx-auto">
          {loading || serviceTypesLoading ? (
            <div className="text-center text-[#8B4513]">
              Loading your bookings...
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              {/* Dynamically render sections for each service type */}
              {Object.values(bookingsByType).map(
                ({ serviceType, bookings }) =>
                  bookings.length > 0 && (
                    <div key={serviceType.id} className="mb-10">
                      <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">
                        Your {serviceType.name} Bookings
                      </h2>
                      <div className="flex flex-row gap-6 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-[#d9a066] scrollbar-track-[#f8f3f1]">
                        {bookings.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white rounded-xl shadow p-4 flex gap-4 min-w-[350px]"
                          >
                            <div className="relative w-32 h-24 flex-shrink-0">
                              <img
                                src={
                                  order.service?.imageUrl || defaultPlaceholder
                                }
                                alt={order.service?.name || serviceType.name}
                                className="object-cover w-full h-full rounded-lg"
                              />
                            </div>
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <h3 className="text-lg font-bold text-[#5B2415] mb-1">
                                  {order.service?.name || serviceType.name}
                                </h3>
                                {serviceType.id !== 1 && (
                                  <p className="text-sm text-[#8B4513] mb-1">
                                    {serviceType.id === 3
                                      ? order.service?.organization?.name
                                      : order.service?.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 mt-2">
                                <div>Booking ID: {order.id}</div>
                                <div>
                                  {order.quantity}{" "}
                                  {order.quantity === 1 ? "Item" : "Items"}
                                </div>
                                <div>
                                  {serviceType.id === 3
                                    ? "Travel Date: "
                                    : "Booked For: "}
                                  {order.scheduledFor
                                    ? serviceType.id === 3 ||
                                      serviceType.id === 4
                                      ? new Date(
                                          order.scheduledFor
                                        ).toLocaleDateString()
                                      : new Date(
                                          order.scheduledFor
                                        ).toLocaleString()
                                    : "-"}
                                </div>
                                <div>
                                  Status:{" "}
                                  {[
                                    "Pending Payment",
                                    "Paid",
                                    "Cancelled",
                                    "Completed",
                                  ][order.status] || "Unknown"}
                                </div>
                                {order.status === 0 && (
                                  <button
                                    className="mt-2 px-4 py-2 bg-gradient-to-r from-[#8B4513] to-[#d9a066] text-white rounded-lg font-semibold shadow hover:from-[#5B2415] hover:to-[#b97c2a] transition"
                                    onClick={() => {
                                      window.location.href = `/payment?bookingId=${order.id}`;
                                    }}
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}

              {orders.length === 0 && (
                <div className="text-center text-[#8B4513] p-8 bg-white rounded-xl shadow">
                  <h3 className="text-xl font-semibold mb-2">
                    No Bookings Found
                  </h3>
                  <p>
                    You haven't made any bookings yet. Explore our services to
                    get started!
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <a
                      href="/hotels"
                      className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#5B2415] transition"
                    >
                      Book a Room
                    </a>
                    <a
                      href="/tickets"
                      className="px-4 py-2 bg-[#d9a066] text-white rounded-lg hover:bg-[#b97c2a] transition"
                    >
                      Explore Activities
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
