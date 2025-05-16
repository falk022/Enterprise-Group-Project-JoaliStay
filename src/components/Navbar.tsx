"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/index";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [homeUrl, setHomeUrl] = useState("/");
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Check if accessToken exists in localStorage
    setIsLoggedIn(!!authService.getAccessToken());
    
    // Set the home URL based on user_id
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setHomeUrl(`/home/${userId}`);
    }
    
    // Check if user should see dashboard
    const userRole = localStorage.getItem("role");
    setShowDashboard(userRole === "Admin" || userRole === "Staff");
    
    // Listen to storage changes (for multi-tab logout/login)
    const handleStorage = () => {
      setIsLoggedIn(!!authService.getAccessToken());
      const newUserId = localStorage.getItem("user_id");
      if (newUserId) {
        setHomeUrl(`/home/${newUserId}`);
      } else {
        setHomeUrl("/");
      }
      
      // Update dashboard visibility on storage change
      const userRole = localStorage.getItem("role");
      setShowDashboard(userRole === "Admin" || userRole === "Staff");
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      alert((err as any).message || "Logout failed");
    } finally {
      // Always clear session and update UI
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("role");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("hotels");
      localStorage.removeItem("Role");
      localStorage.removeItem("hasBooking");

      setIsLoggedIn(false);
      setLoading(false);
      window.location.href = "/"; // Redirect to home
    }
  };

  return (
    <nav className="fixed top-0 w-full h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <a href={homeUrl}>
          <h1 className="text-[#5B2415] text-2xl font-medium cursor-pointer">
            JoaliStay.
          </h1>
        </a>
        <div className="hidden md:flex gap-8 text-[#5B2415]">
          <a href="/" className="hover:text-opacity-80">
            Home
          </a>
          <a href="/hotels" className="hover:text-opacity-80">
            Hotels
          </a>
          <a href="/about" className="hover:text-opacity-80">
            About
          </a>
          {showDashboard && (
            <Link href="/dashboard" className="hover:text-opacity-80">
              Dashboard
            </Link>
          )}
          <Link href="/tickets" className="hover:text-opacity-80">
            Ferry & Activities
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-[#8B4513] hover:bg-[#152C5B] text-white px-6 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
            <button
              className="focus:outline-none"
              title="Go to your home page"
              onClick={() => {
                if (homeUrl !== "/") {
                  window.location.href = homeUrl;
                }
              }}
            >
              <img
                src="/images/default-avatar.jpg"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-[#8B4513] shadow-sm object-cover"
              />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-[#5B2415] hover:bg-[#152C5B] text-white px-6 py-2 rounded-lg">
              Login/Signup
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
