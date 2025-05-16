import axios from "axios";
import { NextRouter } from "next/router";

export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  STAFF = "Staff",
  CUSTOMER = "Customer",
}

export const routeAccess = {
  dashboard: [UserRole.ADMIN, UserRole.STAFF, UserRole.MANAGER],
  "dashboard/staffs": [UserRole.ADMIN, UserRole.MANAGER],
  "dashboard/manage-bookings": [
    UserRole.ADMIN,
    UserRole.STAFF,
    UserRole.MANAGER,
  ],
  "dashboard/organizations": [UserRole.ADMIN],
  "dashboard/services": [UserRole.ADMIN, UserRole.MANAGER],
  "dashboard/service-types": [UserRole.ADMIN],
  "dashboard/users": [UserRole.ADMIN],
};

// Global router reference - will be set by the auth provider
let router: NextRouter | null = null;

// Function to set router from components
export const setRouter = (nextRouter: NextRouter) => {
  router = nextRouter;
};

// Function to check if user has access to a route
export const hasAccess = (path: string): boolean => {
  if (typeof window === "undefined") return true; // Server-side, allow access

  // Get user role from localStorage
  const staffRole = localStorage.getItem("staffRole") as UserRole;
  const role = localStorage.getItem("role") as UserRole;
  // Check if path requires specific roles
  for (const [route, allowedRoles] of Object.entries(routeAccess)) {
    if (
      path.includes(route) &&
      !allowedRoles.includes(role) &&
      !allowedRoles.includes(staffRole)
    ) {
      return false;
    }
  }

  return true;
};

// Function to redirect unauthorized users
export const redirectUnauthorized = (path: string): void => {
  if (typeof window === "undefined" || !router) return;

  const userId = localStorage.getItem("user_id");

  if (!hasAccess(path)) {
    // Redirect to unauthorized page with explanation
    router.replace("/unauthorized");
  } else if (!userId) {
    // No user ID, redirect to login
    router.replace("/login");
  }
};

const axiosInstance = axios.create({
  baseURL: "http://144.91.126.109:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear tokens and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (router) {
          router.replace("/login");
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
