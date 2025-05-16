"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  hasAccess,
  setRouter,
  redirectUnauthorized,
} from "@/utils/axiosInstace";

const AuthCheckingLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
      <p className="text-gray-600">Checking authorization...</p>
    </div>
  </div>
);

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      // @ts-ignore - NextRouter vs AppRouter type mismatch, but functionality is the same
      setRouter(router);
    }, [router]);

    useEffect(() => {
      setIsAuthorized(null);

      // Check if user is authenticated and has access to this route
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          // No token, redirect to login
          router.replace("/login");
          return;
        }

        // Check role-based access for current path
        if (!hasAccess(pathname || "")) {
          redirectUnauthorized(pathname || "");
          return;
        }

        // Small delay to ensure authorization check is complete
        const timer = setTimeout(() => {
          setIsAuthorized(true);
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [pathname, router]);

    if (isAuthorized === null) {
      return <AuthCheckingLoader />;
    }
    return <Component {...props} />;
  };
}
