"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Get the user ID for redirection
    const userId = localStorage.getItem("user_id");
    const redirectPath = userId ? `/home/${userId}` : "/login";

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push(redirectPath);
    }, 5000);

    // Clean up timers
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <p className="text-gray-600 mb-6">
          You will be redirected to the home page in <span className="font-bold">{countdown}</span> seconds.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-md hover:bg-[#A0522D] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
