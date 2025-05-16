"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { organizationService, userService } from "@/services/index";
import withAuth from "@/components/withAuth";

type Staff = {
  id: number;
  name: string;
  email: string;
  staffRole?: string;
  createdAt?: string;
  isActive: boolean;
  orgId: number;
};

function StaffsPage() {
  const router = useRouter();
  // Role-based access control is now handled by the withAuth HOC

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgNames, setOrgNames] = useState<{ [orgId: number]: string }>({});

  // User role and org ID state
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userOrgId, setUserOrgId] = useState<number | null>(null);

  // Promotion modal state
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedRole, setSelectedRole] = useState<number>(0); // Default to Admin
  const [promotionLoading, setPromotionLoading] = useState(false);
  // Search state
  const [search, setSearch] = useState("");

  // Filtered staff list based on search
  const filteredStaffs = staffs.filter((staff) => {
    // Ensure orgId is never null/undefined before toString
    const safeOrgId = staff.orgId ?? "";
    const orgName = orgNames[safeOrgId] || safeOrgId.toString();
    const searchLower = search.toLowerCase();
    return (
      staff.name.toLowerCase().includes(searchLower) ||
      staff.email.toLowerCase().includes(searchLower) ||
      orgName.toLowerCase().includes(searchLower) ||
      staff.id.toString().includes(searchLower)
    );
  });

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    orgId: string;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    orgId: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [promotionError, setPromotionError] = useState("");
  const [orgOptions, setOrgOptions] = useState<{ id: number; name: string }[]>(
    []
  );

  // Fetch organizations for dropdown when modal opens
  useEffect(() => {
    if (showModal) {
      organizationService.getAllOrganizations().then((orgs: any) => {
        // If user is a manager, filter to only show their organization
        if (userRole === "Manager" && userOrgId) {
          const managerOrg = Array.isArray(orgs)
            ? orgs.filter((o: any) => o.id === userOrgId)
            : [];
          setOrgOptions(
            managerOrg.map((o: any) => ({ id: o.id, name: o.name }))
          );

          // Pre-select the manager's organization and disable changing it
          setForm((prevForm) => ({
            ...prevForm,
            orgId: userOrgId.toString(),
          }));
        } else {
          // For admins, show all organizations
          setOrgOptions(
            Array.isArray(orgs)
              ? orgs.map((o: any) => ({ id: o.id, name: o.name }))
              : []
          );
        }
      });
    }
  }, [showModal, userRole, userOrgId]);

  // Helper to fetch all organizations at once
  const fetchAllOrganizations = async () => {
    try {
      const orgs = await organizationService.getAllOrganizations();
      if (Array.isArray(orgs)) {
        const orgMap: { [orgId: number]: string } = {};
        orgs.forEach((org: any) => {
          if (org.id) {
            orgMap[org.id] = org.name || `Org ${org.id}`;
          }
        });
        setOrgNames(orgMap);
      }
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    }
  };

  // Top-level fetchStaffs so it can be called from anywhere
  async function fetchStaffs() {
    setLoading(true);
    setError("");
    try {
      // Assume API endpoint: /api/User/AllStaffs or filter AllUsers by role (userType === staff)
      const data = await userService.getAllUsers();
      // Filter for staff (userType === 1 or staffRole is 0, 1, or 2)
      let filtered = Array.isArray(data)
        ? data
            .filter((u: any) => {
              // Only include users with valid staffRole values (0, 1, 2)
              return (
                u.userType === 1 ||
                (u.staffRole !== undefined &&
                  u.staffRole !== null &&
                  [0, 1, 2].includes(u.staffRole))
              );
            })
            .map((user: any) => {
              // Convert numeric staffRole to string representation
              let roleString = "Staff";
              if (user.staffRole === 0) {
                roleString = "Admin";
              } else if (user.staffRole === 1) {
                roleString = "Manager";
              } else if (user.staffRole === 2) {
                roleString = "Staff";
              }

              return {
                id: user.id,
                name: user.name,
                email: user.email,
                staffRole: roleString,
                createdAt: user.createdAt,
                isActive: user.isActive,
                orgId: user.orgId || 0, // Map organizationId to orgId
              };
            })
        : [];

      // If user is a Manager, strictly filter staff by the manager's organization ID
      // This is critical to prevent managers from seeing staff from other organizations
      if (userRole === "Manager" && userOrgId) {
        console.log(`Filtering staffs for manager with orgId: ${userOrgId}`);
        filtered = filtered.filter((staff) => {
          const match = staff.orgId === userOrgId;
          if (!match) {
            console.log(
              `Filtered out staff ${staff.name} with orgId ${staff.orgId}`
            );
          }
          return match;
        });
      }

      setStaffs(filtered);
    } catch (err) {
      setError((err as any).message || "Failed to fetch staffs");
    } finally {
      setLoading(false);
    }
  }

  // Get user role and org ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get role from staffRole or decode from JWT token
      const role = localStorage.getItem("staffRole");
      setUserRole(role);

      // Get organization ID
      const orgIdStr = localStorage.getItem("OrgId");
      if (orgIdStr) {
        try {
          const orgId = parseInt(orgIdStr, 10);
          setUserOrgId(orgId);
          console.log("Setting user org ID:", orgId);
        } catch (e) {
          console.error("Invalid OrgId in localStorage:", orgIdStr);
        }
      } else {
        console.warn("No organization ID found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    // Fetch all organizations first, then fetch staffs
    fetchAllOrganizations().then(() => {
      fetchStaffs();
    });
  }, [userRole, userOrgId]);

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
            Manage Staffs
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search staffs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#8B4513] text-black"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  + New Staff
                </button>
              </div>
            </div>

            {/* Promotion Modal */}
            {showPromotionModal && selectedStaff && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    onClick={() => {
                      setShowPromotionModal(false);
                      setSelectedStaff(null);
                      setPromotionError("");
                    }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-[#8B4513] text-center">
                    Promote Staff
                  </h2>
                  {promotionError && (
                    <div className="text-red-600 mb-4 text-center">
                      {promotionError}
                    </div>
                  )}
                  <div className="mb-4 text-center">
                    <p className="text-black mb-2">Promoting staff member:</p>
                    <p className="font-semibold text-lg text-black">
                      {selectedStaff.name}
                    </p>
                    <p className="text-black">{selectedStaff.email}</p>
                    <p className="mt-2 text-black">
                      Current Role:{" "}
                      <span className="font-medium">
                        {selectedStaff.staffRole || "Staff"}
                      </span>
                    </p>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setPromotionError("");
                      setPromotionLoading(true);
                      try {
                        await userService.setStaffRole(
                          selectedStaff.email,
                          selectedRole
                        );

                        // Update the staff role in the local state
                        setStaffs((prevStaffs) =>
                          prevStaffs.map((staff) =>
                            staff.id === selectedStaff.id
                              ? {
                                  ...staff,
                                  staffRole:
                                    selectedRole === 0
                                      ? "Admin"
                                      : selectedRole === 1
                                      ? "Manager"
                                      : "Staff",
                                }
                              : staff
                          )
                        );

                        setShowPromotionModal(false);
                        setSelectedStaff(null);
                      } catch (err: any) {
                        setPromotionError(
                          err.message || "Failed to promote staff"
                        );
                      } finally {
                        setPromotionLoading(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        className="block mb-2 font-semibold"
                        htmlFor="role-select"
                      >
                        Select New Role
                      </label>
                      <select
                        id="role-select"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-black"
                        value={selectedRole}
                        onChange={(e) =>
                          setSelectedRole(Number(e.target.value))
                        }
                      >
                        <option value={0}>Admin</option>
                        <option value={1}>Manager</option>
                        <option value={2}>Staff</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#8B4513] text-white py-2 rounded font-semibold hover:bg-[#6a3210] transition"
                      disabled={promotionLoading}
                    >
                      {promotionLoading ? "Promoting..." : "Promote Staff"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* New Staff Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full relative">
                  <button
                    className="absolute top-3 right-3 text-black hover:text-gray-700"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-[#8B4513] text-center">
                    Add New Staff
                  </h2>
                  {formError && (
                    <div className="text-red-600 mb-2 text-center">
                      {formError}
                    </div>
                  )}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setFormError("");
                      setFormLoading(true);
                      try {
                        // Create staff data object
                        const staffData = {
                          name: form.name,
                          email: form.email,
                          phoneNumber: form.phoneNumber,
                        };

                        // Only add orgId if it's not 0 (None)
                        if (form.orgId !== "0") {
                          Object.assign(staffData, {
                            orgId: Number(form.orgId),
                          });
                        }

                        await userService.createStaff(staffData);
                        setShowModal(false);
                        setForm({
                          name: "",
                          email: "",
                          phoneNumber: "",
                          orgId: "",
                        });
                        fetchStaffs();
                      } catch (err: any) {
                        setFormError(err.message || "Failed to create staff");
                      } finally {
                        setFormLoading(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        className="block mb-1 font-semibold text-gray-500"
                        htmlFor="staff-name"
                      >
                        Name
                      </label>
                      <input
                        id="staff-name"
                        type="text"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-black"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-gray-500"
                        htmlFor="staff-email"
                      >
                        Email
                      </label>
                      <input
                        id="staff-email"
                        type="email"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-gray-500"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-gray-500"
                        htmlFor="staff-phone"
                      >
                        Phone Number
                      </label>
                      <input
                        id="staff-phone"
                        type="tel"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-gray-500"
                        value={form.phoneNumber}
                        onChange={(e) =>
                          setForm({ ...form, phoneNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-gray-500"
                        htmlFor="staff-org"
                      >
                        Organization
                      </label>
                      <select
                        id="staff-org"
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring text-gray-500"
                        value={form.orgId}
                        onChange={(e) =>
                          setForm({ ...form, orgId: e.target.value })
                        }
                        required
                        disabled={userRole === "Manager"} // Disable for managers
                      >
                        <option value="" disabled>
                          Select organization
                        </option>
                        <option value="0">None</option>
                        {orgOptions.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#8B4513] text-white py-2 rounded font-semibold hover:bg-[#6a3210] transition"
                      disabled={formLoading}
                    >
                      {formLoading ? "Adding..." : "Add Staff"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center text-black">Loading staffs...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Organization</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Created At</th>
                      <th className="pb-3">Status</th>
                      {userRole !== "Manager" && (
                        <th className="pb-3">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaffs.map((staff: Staff, idx: number) => {
                      return (
                        <tr key={staff.id || idx} className="border-b">
                          <td className="py-4 text-black font-medium">
                            {staff.id}
                          </td>
                          <td className="py-4 text-black font-medium">
                            {orgNames[staff.orgId] || staff.orgId}
                          </td>
                          <td className="py-4 text-black font-medium">
                            {staff.name}
                          </td>
                          <td className="py-4 text-black">{staff.email}</td>
                          <td className="py-4 text-black">{staff.staffRole}</td>
                          <td
                            className="py-4 text-black"
                            data-raw-date={staff.createdAt ?? ""}
                          >
                            {/* DEBUG: Hydration - server/client date match check */}
                            {staff.createdAt &&
                            !isNaN(Date.parse(staff.createdAt))
                              ? new Date(staff.createdAt)
                                  .toISOString()
                                  .replace("T", " ")
                                  .slice(0, 16)
                              : staff.createdAt
                              ? staff.createdAt
                              : "-"}
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-[15px] text-white text-xs ${
                                staff.isActive ? "bg-green-600" : "bg-red-400"
                              }`}
                            >
                              {staff.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          {userRole !== "Manager" && (
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                {/* Toggle Switch */}
                                {!(
                                  staff.name &&
                                  staff.name.toLowerCase() === "admin"
                                ) && (
                                  <div className="flex gap-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={staff.isActive}
                                        onChange={async () => {
                                          try {
                                            await userService.toggleUser(
                                              staff.email
                                            );
                                            setStaffs((staffs) =>
                                              staffs.map((s) =>
                                                s.id === staff.id
                                                  ? {
                                                      ...s,
                                                      isActive: !s.isActive,
                                                    }
                                                  : s
                                              )
                                            );
                                          } catch (err) {
                                            alert("Failed to toggle staff");
                                          }
                                        }}
                                        className="sr-only peer"
                                      />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all text-black"></div>
                                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full"></div>
                                    </label>

                                    <button
                                      onClick={() => {
                                        setSelectedStaff(staff);
                                        setShowPromotionModal(true);

                                        // Set initial role based on current role
                                        if (staff.staffRole === "Admin") {
                                          setSelectedRole(0);
                                        } else if (
                                          staff.staffRole === "Manager"
                                        ) {
                                          setSelectedRole(1);
                                        } else {
                                          setSelectedRole(2);
                                        }
                                      }}
                                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                                    >
                                      Promote
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(StaffsPage);
