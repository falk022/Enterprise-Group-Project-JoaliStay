"use client";
import React from "react";
import ActivityCard from "@/components/ActivityCard";
import { useEffect, useState } from "react";
import { serviceService, orderService } from "@/services/index";
import withBookingCheck from "@/components/withBookingCheck";

function ThemeParkActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    serviceService
      .getAllServices({ typeId: 2 })
      .then((data: any) => {
        // Filter out inactive services
        const activeServices = Array.isArray(data)
          ? data.filter((service) => service.isActive === true)
          : [];

        console.log(
          `Found ${activeServices.length} active theme park activities out of ${
            Array.isArray(data) ? data.length : 0
          } total activities`
        );
        setActivities(activeServices);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(
          err?.message || "Failed to fetch activities. Please try again later."
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#5B2415] mb-2">
          Theme Park Activities
        </h1>
        <p className="text-lg text-center text-[#8B4513] mb-10">
          Discover and book your favorite theme park adventures
        </p>
        {loading ? (
          <div className="text-center text-[#8B4513] text-lg">
            Loading activities...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-[#8B4513] text-lg">
            No activities found for this theme park.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {activities.map((activity, idx) => (
              <ActivityCard
                key={activity.id || idx}
                image={activity.imageUrl}
                title={activity.name}
                location={
                  activity.location ||
                  activity.serviceType?.name ||
                  "Theme Park"
                }
                price={activity.price?.toString()}
                buttonLabel="Purchase"
                showQuantity={true}
                onButtonClick={async (quantity) => {
                  try {
                    // Place a service order for this activity with the selected quantity
                    const bookingId = await orderService.placeServiceOrder({
                      serviceId: activity.id,
                      quantity: quantity,
                      scheduledFor: new Date().toISOString(), // or allow user to pick
                    });
                    // Redirect to payment gateway with bookingId
                    if (bookingId) {
                      window.location.href = `/payment?bookingId=${bookingId}`;
                    } else {
                      alert("Failed to create booking for payment.");
                    }
                  } catch (err: any) {
                    alert(err.message || "Failed to create booking.");
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withBookingCheck(ThemeParkActivitiesPage);
