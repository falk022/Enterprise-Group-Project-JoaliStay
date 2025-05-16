"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import CreateOrganizationModal from "@/components/CreateOrganizationModal";
import { organizationService } from "@/services/index";
import withAuth from "@/components/withAuth";

const orgTypes = [
  { value: 0, label: "Other" },
  { value: 1, label: "Hotel" },
  { value: 2, label: "Restaurant" },
  { value: 3, label: "Ferry" },
  { value: 4, label: "Park" },
  { value: 5, label: "Events" },
];

type Organization = {
  id: number;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  parentOrganizationId?: number | null;
  parentOrganization?: any | null;
  orgType: number;
};

function OrganizationsPage() {
  const router = useRouter();
  // Role-based access control is now handled by the withAuth HOC

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const initialFormState = {
    name: "",
    registrationNumber: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    website: "",
    logoUrl: "",
    orgType: 1,
    initialManager: "",
  };
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Search state
    const [search, setSearch] = useState("");
  
    // Filtered organization list based on search
    const filteredOrgs = orgs.filter((org) => {
      
      const searchLower = search.toLowerCase();
      return (
        org.name.toLowerCase().includes(searchLower) ||
        org.email.toLowerCase().includes(searchLower) ||
        org.country.toLowerCase().includes(searchLower) ||
        org.id.toString().includes(searchLower)
      );
    });

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true);
      setError("");
      try {
        const data = await organizationService.getAllOrganizations();
        // Normalize: always use orgType in frontend
        setOrgs(data.map((org: any) => ({ ...org, orgType: org.type })));
      } catch (err: any) {
        setError(err.message || "Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "orgType" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (formData: typeof initialFormState) => {
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      // Ensure orgType is always a number
      const cleanFormData = { ...formData, orgType: Number(formData.orgType) };
      await organizationService.createOrganization(cleanFormData);
      setFormSuccess("Organization created successfully!");
      setForm(initialFormState);
      setShowModal(false);
      const orgData = await organizationService.getAllOrganizations();
      setOrgs(orgData.map((org: any) => ({ ...org, orgType: org.type })));
    } catch (err: any) {
      setFormError(err.message || "Failed to create organization");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Organizations
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search organizations..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none text-black focus:border-[#8B4513]"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  + Create
                </button>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-black">
                Organization List
              </h2>
              {loading ? (
                <div className="text-center text-gray-500">
                  Loading organizations...
                </div>
              ) : error ? (
                <div className="text-center text-red-600">{error}</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Created</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrgs.map((org, idx) => (
                      <tr key={org.id || idx} className="border-b">
                        <td className="py-4 text-black">{org.id || idx}</td>
                        <td className="py-4 text-black font-medium flex items-center gap-2">
                          {org.logoUrl && (
                            <img
                              src={org.logoUrl}
                              alt="logo"
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          )}
                          {org.name}
                        </td>
                        <td className="py-4 text-black">
                          {orgTypes.find((t) => t.value === Number(org.orgType))
                            ?.label || "Other"}
                        </td>
                        <td className="py-4 text-black">{org.email}</td>
                        <td className="py-4 text-black">{org.phone}</td>
                        <td className="py-4 text-black">{org.country}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-[15px] text-white text-xs ${
                              org.isActive ? "bg-green-600" : "bg-gray-400"
                            }`}
                          >
                            {org.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 text-black">
                          {org.createdAt
                            ? new Date(org.createdAt).toISOString().slice(0, 10)
                            : "-"}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={org.isActive}
                                onChange={async () => {
                                  try {
                                    await organizationService.toggleOrganization(
                                      org.id
                                    );
                                    setOrgs((orgs) =>
                                      orgs.map((o) =>
                                        o.id === org.id
                                          ? { ...o, isActive: !o.isActive }
                                          : o
                                      )
                                    );
                                  } catch (err) {
                                    alert("Failed to toggle organization");
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all text-black"></div>
                              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full"></div>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <CreateOrganizationModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleFormSubmit}
            loading={formLoading}
            error={formError}
            success={formSuccess}
            form={{ ...form }}
            onFormChange={handleFormChange}
          />
        </div>
        <CreateOrganizationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          error={formError}
          success={formSuccess}
          form={{ ...form }}
          onFormChange={handleFormChange}
        />
      </div>
    </div>
  );
}

export default withAuth(OrganizationsPage);
