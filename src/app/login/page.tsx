"use client";
import Link from "next/link";
import React, { useState } from "react";
import { authService } from "@/services/index";
import { useRouter } from "next/navigation";
import { API_KEY } from "@/types/types";

export default function login_page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      console.log("Login attempt with:", { email, password: "***" });
      const data = await authService.login({
        email,
        password,
        apiKey: API_KEY,
      });
      console.log("Login response:", data);
      // Check for initial password setup redirect
      if (data.message === "RedirectToInitialPasswordPage" && data.data) {
        const { email, code } = data.data;
        router.push(
          `/initial-password-setup?email=${encodeURIComponent(
            email
          )}&code=${encodeURIComponent(code)}`
        );
        return;
      }
      setSuccess(data.message || "Login successful!");
      // The token and user info are now stored by the AuthService
      // Let's get the user ID for redirection
      const userInfo = authService.getUserInfoFromToken();
      console.log("User info from token:", userInfo);

      // Check if we have user info for redirection
      if (userInfo && userInfo.userId) {
        // Check user role for appropriate redirection
        const role = userInfo.role;
        const staffRole = userInfo.staffRole;
        
        // Redirect staff, managers, and admins to the manage-bookings page
        if (role === "Staff" || role === "Manager" || role === "Admin" || 
            staffRole === "Staff" || staffRole === "Manager" || staffRole === "Admin") {
          router.push("/dashboard/manage-bookings");
        } else {
          // Regular customers go to their home page
          router.push(`/home/${userInfo.userId}`);
        }
      } else {
        // No user info available, redirect to home page
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel: Brand */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#8B4513] to-[#5B2415] text-white p-12 relative">
        <div className="absolute top-8 left-8 text-3xl font-extrabold tracking-wide opacity-30 select-none">
          JoaliStay
        </div>
        <div className="z-10">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            JoaliStay
          </h1>
          <p className="text-xl font-medium mb-8 opacity-90">
            Welcome back!
            <br />
            Sign in to your account.
          </p>
          {/* Optionally add an illustration or logo here */}
        </div>
        <div className="absolute bottom-8 left-8 text-xs opacity-50">
          &copy; {new Date().getFullYear()} Joali Maldives
        </div>
      </div>
      {/* Right Panel: Form */}
      <div className="flex flex-1 justify-center items-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                placeholder="Enter your Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                placeholder="Enter your password"
              />
            </div>
            {error && <div className="text-red-600 text-center">{error}</div>}
            {success && (
              <div className="text-green-700 text-center">{success}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white bg-[#8B4513] rounded-lg hover:bg-[#5B2415] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex flex-col items-center mt-6">
            <div className="w-full flex items-center mb-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <Link href="/register" className="w-full">
              <button className="w-full py-2 text-white bg-[#5B2415] rounded-lg hover:bg-blue-600 transition mb-2">
                Don't have an account? Create one
              </button>
            </Link>
            <Link href="/">
              <span className="text-sm text-center text-gray-900 pt-2 cursor-pointer hover:underline">
                Back To Home Page
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
