"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { serviceService } from "@/services/index";
import withAuth from "@/components/withAuth";
import { ServiceType } from "@/types/types";

function ServiceTypesPage() {
  const router = useRouter();
  // Role-based access control is now handled by the withAuth HOC

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all service types
  async function fetchServiceTypes() {
    setLoading(true);
    setError("");
    try {
      const data = await serviceService.getAllServiceTypes();
      setServiceTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError((err as any).message || "Failed to fetch service types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  // Filtered list based on search
  const filteredServiceTypes = serviceTypes.filter((type) => {
    const searchLower = search.toLowerCase();
    return (
      type.name.toLowerCase().includes(searchLower) ||
      type.description.toLowerCase().includes(searchLower)
    );
  });

  // Handle form changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await serviceService.createServiceType({
        name: form.name,
        description: form.description,
      });
      setShowModal(false);
      setForm({ name: "", description: "" });
      fetchServiceTypes();
    } catch (err) {
      setFormError((err as any).message || "Failed to create service type");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
            Service Types
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-xl">
                <input
                  type="text"
                  placeholder="Search service types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#8B4513] text-black"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#8B4513] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A0522D] transition"
                >
                  + Add Service Type
                </button>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-black">
                    {filteredServiceTypes.map((type) => (
                      <tr key={type.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {type.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {type.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {type.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal for creating service type */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#8B4513]">
              Add Service Type
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:border-[#8B4513] text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:border-[#8B4513] text-black"
                  required
                />
              </div>
              {formError && (
                <div className="text-red-500 text-sm">{formError}</div>
              )}
              <button
                type="submit"
                className="bg-[#8B4513] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A0522D] transition w-full disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? "Creating..." : "Create Service Type"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(ServiceTypesPage);
