"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/index";

export default function InitialPasswordSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const temporaryKey = searchParams.get("code") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetInitialPassword({ email, temporaryKey, newPassword });
      setSuccess("Password has been set. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
      authService.logout();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
            Welcome!
            <br />
            Set your initial password.
          </p>
        </div>
        <div className="absolute bottom-8 left-8 text-xs opacity-50">
          &copy; {new Date().getFullYear()} Joali Maldives
        </div>
      </div>
      {/* Right Panel: Form */}
      <div className="flex flex-1 justify-center items-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-6">
            Set Your Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="temporaryKey" value={temporaryKey} />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Confirm new password"
              />
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
              {loading ? "Setting..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
