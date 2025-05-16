"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsArrowLeftShort } from "react-icons/bs";
import { MdHome } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { CgOrganisation } from "react-icons/cg";
import { GrUserWorker } from "react-icons/gr";
import { PiGearSix } from "react-icons/pi";
import { LiaNetworkWiredSolid } from "react-icons/lia";
import { HiOutlineDatabase } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { authService } from "@/services/index";

export default function SideBar() {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [staffRole, setStaffRole] = useState<string | null>(null);
  const [homeUrl, setHomeUrl] = useState("/");
  const router = useRouter();

  // Fetch role from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setOrgId(localStorage.getItem("OrgId"));
      setStaffRole(localStorage.getItem("staffRole"));

      // Set the home URL based on user_id
      const userId = localStorage.getItem("user_id");
      if (userId) {
        setHomeUrl(`/home/${userId}`);
      }
    }
  }, []);

  return (
    <div className="flex">
      {/* Sidebar section start*/}
      <section
        className={`bg-white text-black h-screen p-5 pt-8 ${
          open ? "w-72" : "w-20"
        } duration-300 relative`}
      >
        <BsArrowLeftShort
          className={`bg-green-700 text-white text-3xl rounded-full absolute -right-3 top-9 border border-blue-400 cursor-pointer ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex">
          {/* <h1 className='bg-green-600 text-4xl rounded font-bold'>JoaliStay</h1> */}

          <Link href="/">
            <MdHome
              className={`text-4xl cursor-pointer block float-left mr-2 duration-500 ${
                open && "rotate-[360deg]"
              }`}
            />
          </Link>

          <a
            href={homeUrl}
            className={`hover:text-opacity-80  text-4xl rounded font-bold block float-left duration-300 ${
              !open && "scale-0"
            }`}
          >
            JoaliStay
          </a>
        </div>

        <ul className="pt-10">
          {/* Hide Users for Staff and Customer, but always show for Admin */}
          {(staffRole === "Admin" ||
            (role !== "Staff" && role !== "Customer")) && (
            <Link href="/dashboard/users">
              <li
                className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}
              >
                {" "}
                <FiUsers className="text-2xl block float-left mt-3" />
                <span
                  className={`text-base font-medium mt-3  flex-1 duration-200 ${
                    !open && "hidden"
                  }`}
                >
                  Users
                </span>
              </li>
            </Link>
          )}
          {/* Hide Staffs for Staff and Customer, but always show for Admin */}
          {(staffRole === "Admin" ||
            staffRole === "Manager" ||
            (role !== "Staff" && role !== "Customer")) && (
            <Link href="/dashboard/staffs">
              <li
                className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}
              >
                {" "}
                <GrUserWorker className="text-2xl block float-left mt-3" />
                <span
                  className={`text-base font-medium mt-3  flex-1 duration-200 ${
                    !open && "hidden"
                  }`}
                >
                  Staffs
                </span>
              </li>
            </Link>
          )}
          {/* Hide Organizations for Staff and Customer, but always show for Admin */}
          {(staffRole === "Admin" ||
            (role !== "Staff" && role !== "Customer")) && (
            <Link href="/dashboard/organizations">
              <li
                className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}
              >
                {" "}
                <CgOrganisation className="text-2xl block float-left mt-3" />
                <span
                  className={`text-base font-medium mt-3  flex-1 duration-200 ${
                    !open && "hidden"
                  }`}
                >
                  Organizations
                </span>
              </li>
            </Link>
          )}
          {/* Hide Service Types for Staff and Customer, but always show for Admin */}
          {(staffRole === "Admin" ||
            (role !== "Staff" && role !== "Customer")) && (
            <Link href="/dashboard/service-types">
              <li
                className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}
              >
                {" "}
                <PiGearSix className="text-2xl block float-left mt-3" />
                <span
                  className={`text-base font-medium mt-3  flex-1 duration-200 ${
                    !open && "hidden"
                  }`}
                >
                  Service Types
                </span>
              </li>
            </Link>
          )}
          {/* Hide Services for Staff and Customer, but always show for Admin */}
          {(staffRole === "Admin" ||
            (role !== "Customer" && staffRole !== "Staff")) && (
            <Link href="/dashboard/services">
              <li
                className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}
              >
                {" "}
                <LiaNetworkWiredSolid className="text-2xl block float-left mt-3" />
                <span
                  className={`text-base font-medium mt-3  flex-1 duration-200 ${
                    !open && "hidden"
                  }`}
                >
                  Services
                </span>
              </li>
            </Link>
          )}
          {/* Hide Staff Home for Staff and Customer, but always show for Admin */}

          <Link href="/dashboard/manage-bookings">
            <li
              className={`text-gray-700 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md `}
            >
              {" "}
              <HiOutlineDatabase className="text-2xl block float-left mt-3" />
              <span
                className={`text-base font-medium mt-3  flex-1 duration-200 ${
                  !open && "hidden"
                }`}
              >
                Manage Bookings
              </span>
            </li>
          </Link>
        </ul>

        {/* Logout button at the bottom */}
        <div className="absolute bottom-0 w-full">
          <button
            onClick={async () => {
              try {
                await authService.logout();
                router.push("/");
              } catch (error) {
                console.error("Logout failed:", error);
                router.push("/");
              }
            }}
            className={`w-[250px] text-red-600 text-base flex items-center gap-x-4 cursor-pointer p-2 hover:bg-red-50 rounded-md`}
          >
            <BiLogOut className="text-2xl block float-left" />
            <span
              className={`text-base font-medium flex-1 duration-200 ${
                !open && "hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </section>
      {/* Sidebar section end*/}
    </div>
  );
}
