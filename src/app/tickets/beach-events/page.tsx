"use client";
import React, { useState, useEffect } from "react";
import withBookingCheck from "@/components/withBookingCheck";
import ActivityCard from "@/components/ActivityCard";
import { serviceService, orderService } from "@/services/index";
import { Service } from "@/types/types";

function BeachEventsPage() {
  const [beachEvents, setBeachEvents] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    participants: 1,
  });
  const [userLoaded, setUserLoaded] = useState(false);

  // Fetch user information from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !userLoaded) {
      try {
        const userName = localStorage.getItem("user_name");
        const userEmail =
          localStorage.getItem("email") || localStorage.getItem("user_email");

        if (userName || userEmail) {
          setForm((prev) => ({
            ...prev,
            name: userName || prev.name,
            email: userEmail || prev.email,
          }));
        }
        setUserLoaded(true);
      } catch (err) {
        console.error("Error fetching user info from localStorage:", err);
      }
    }
  }, [userLoaded]);

  // Fetch beach events on component mount
  useEffect(() => {
    async function fetchBeachEvents() {
      try {
        setLoading(true);
        // Filter services with serviceTypeId 4 (Beach Events)
        const services = await serviceService.getAllServices({ typeId: 4 });

        // Filter out inactive services
        const activeServices = Array.isArray(services)
          ? services.filter((service) => service.isActive === true)
          : [];

        console.log(
          `Found ${activeServices.length} active beach events out of ${
            Array.isArray(services) ? services.length : 0
          } total events`
        );
        setBeachEvents(activeServices);
      } catch (err) {
        console.error("Error fetching beach events:", err);
        setError("Failed to load beach events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBeachEvents();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent) {
      setError("Please select a beach event first");
      return;
    }

    if (!selectedEvent.id) {
      setError("Invalid beach event selected");
      return;
    }

    try {
      // Place a service order for this beach event with the selected quantity and date
      const result = await orderService.placeServiceOrder({
        serviceId: selectedEvent.id,
        quantity: form.participants,
        scheduledFor: form.date
          ? new Date(form.date).toISOString()
          : new Date().toISOString(),
      });

      // Redirect to payment gateway with bookingId
      if (result !== undefined) {
        window.location.href = `/payment?bookingId=${result}`;
      } else {
        setError("Failed to create booking for payment.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create booking.");
    }
  }

  function handleEventSelect(event: Service, quantity: number) {
    setSelectedEvent(event);
    setForm((prev) => ({ ...prev, participants: quantity }));
    // No need to scroll as we're using a modal popup
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Beach Events
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading beach events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : beachEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No beach events available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {beachEvents.map((event) => (
              <ActivityCard
                key={event.id}
                image={event.imageUrl || "/images/beach-event-placeholder.jpg"}
                title={event.name}
                location={event.organization?.name || ""}
                price={event.price?.toString()}
                buttonLabel="Purchase"
                showQuantity={true}
                onButtonClick={(quantity) => handleEventSelect(event, quantity)}
              />
            ))}
          </div>
        )}

        {/* Modal for booking form */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
                Book {selectedEvent.name}
              </h2>
              <p className="mb-4 text-center text-gray-600">
                {selectedEvent.description}
              </p>
              <p className="mb-4 text-center text-black">
                <span className="font-semibold">Price per person:</span> $
                {selectedEvent.price}
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 text-black"
              >
                <input type="hidden" name="name" value={form.name} />
                <input type="hidden" name="email" value={form.email} />
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700">Event Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="border rounded-lg px-4 py-2"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-gray-700">Participants:</label>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          participants: Math.max(1, prev.participants - 1),
                        }))
                      }
                      type="button"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-white text-black font-medium">
                      {form.participants}
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          participants: prev.participants + 1,
                        }))
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="font-bold text-lg text-black">
                    Total: $
                    {(Number(selectedEvent.price) * form.participants).toFixed(
                      2
                    )}
                  </span>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#5B2415] transition-colors"
                  >
                    Purchase
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withBookingCheck(BeachEventsPage);
