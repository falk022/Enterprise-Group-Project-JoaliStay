"use client";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#ffffff] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h4 className="text-[#152C5B] text-2xl font-medium mb-4">
              JoaliStay.
            </h4>
            <p className="text-[#000000] mb-6">
              We create unforgettable experiences and turn your vacation dreams
              into reality.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-[#152C5B] hover:bg-[#5B2415] p-2 rounded-full transition-colors"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-[#152C5B] hover:bg-[#5B2415] p-2 rounded-full transition-colors"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-[#152C5B] hover:bg-[#5B2415] p-2 rounded-full transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-[#152C5B] hover:bg-[#5B2415] p-2 rounded-full transition-colors"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-[#152C5B] text-lg font-medium mb-4">
              Quick Links
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[#152C5B] hover:text-[#5B2415] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/hotels"
                  className="text-[#152C5B] hover:text-[#5B2415] transition-colors"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link

                  href="/about"
                  className="text-[#152C5B] hover:text-[#5B2415] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/tickets"
                  className="text-[#152C5B] hover:text-[#5B2415] transition-colors"
                >
                  Ferry & Activities
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-[#152C5B] text-lg font-medium mb-4">
              Contact Info
            </h5>
            <ul className="space-y-3 text-[#152C5B]">
              <li>Raa Atoll, Maldives</li>
              <li>Phone: +960 658-6666</li>
              <li>Email: info@joalistay.com</li>
              <li>Hours: 24/7</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-[#152C5B] text-lg font-medium mb-4">
              Newsletter
            </h5>
            <p className="text-[#152C5B] mb-4">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#2A2A2A] text-gray-400 px-4 py-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-[#ECAF9E]"
              />
              <button className="bg-[#152C5B] hover:bg-[#5B2415] px-4 py-2 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p> {new Date().getFullYear()} JoaliStay. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="hover:text-[#152C5B] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#152C5B] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-[#152C5B] transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
