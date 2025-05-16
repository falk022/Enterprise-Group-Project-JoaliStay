"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import CreateServiceModal from "@/components/CreateServiceModal";
import { serviceService, organizationService } from "@/services/index";
import withAuth from "@/components/withAuth";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  orgId: number;
  organization?: { id: number; name: string };
  serviceTypeId: number;
  serviceType?: { id: number; name: string };
  imageUrl: string;
  capacity?: number;
  durationInMinutes?: number;
  createdAt?: string;
  isActive?: boolean;
};

type OrgOption = { id: number; name: string };
type ServiceTypeOption = { id: number; name: string };

const initialForm = {
  name: "",
  description: "",
  price: 0,
  orgId: 0,
  serviceTypeId: 0,
  imageUrl: "",
  capacity: 0,
  durationInMinutes: 0,
};

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState<
    ServiceTypeOption[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      const orgId = localStorage.getItem("OrgId");
      if (role === "Staff" && orgId) {
        fetchAll(Number(orgId));
      } else {
        fetchAll();
      }
    } else {
      fetchAll();
    }
  }, []);

  async function fetchAll(staffOrgId?: number) {
    setLoading(true);
    setError("");
    try {
      const [servicesRes, orgsRes, typesRes] = await Promise.all([
        staffOrgId
          ? serviceService.getAllServices({ orgId: staffOrgId })
          : serviceService.getAllServices(),
        organizationService.getAllOrganizations(),
        serviceService.getAllServiceTypes(),
      ]);
      // Map the services to ensure they match our local Service type
      setServices(
        Array.isArray(servicesRes)
          ? servicesRes.map((svc: any) => ({
              id: svc.id || 0, // Ensure id is never undefined
              name: svc.name,
              description: svc.description,
              price: svc.price,
              orgId: svc.orgId,
              organization: svc.organization,
              serviceTypeId: svc.serviceTypeId,
              serviceType: svc.serviceType,
              imageUrl: svc.imageUrl,
              capacity: svc.capacity,
              durationInMinutes: svc.durationInMinutes,
              createdAt: svc.createdAt,
              isActive: svc.isActive
            }))
          : []
      );
      setOrgOptions(
        Array.isArray(orgsRes)
          ? orgsRes.map((o: any) => ({ id: o.id, name: o.name }))
          : []
      );
      setServiceTypeOptions(
        Array.isArray(typesRes)
          ? typesRes.map((t: any) => ({ id: t.id, name: t.name }))
          : []
      );
    } catch (err) {
      setError((err as any).message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  // Further restrict services for Staff to their own org
  let filteredServices = services;
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("role");
    const orgId = localStorage.getItem("OrgId");
    if (role === "Staff" && orgId) {
      filteredServices = services.filter((svc) => String(svc.orgId) === orgId);
    }
  }
  filteredServices = filteredServices.filter((svc) => {
    const searchLower = search.toLowerCase();
    return (
      svc.name.toLowerCase().includes(searchLower) ||
      (svc.description &&
        svc.description.toLowerCase().includes(searchLower)) ||
      (svc.organization &&
        svc.organization.name.toLowerCase().includes(searchLower)) ||
      (svc.serviceType &&
        svc.serviceType.name.toLowerCase().includes(searchLower))
    );
  });

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: [
        "price",
        "orgId",
        "serviceTypeId",
        "capacity",
        "durationInMinutes",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleFormSubmit = async (formData: typeof initialForm) => {
    setFormLoading(true);
    setFormError("");
    try {
      await serviceService.createService(formData);
      setShowModal(false);
      setForm(initialForm);
      fetchAll();
    } catch (err) {
      setFormError((err as any).message || "Failed to create service");
    } finally {
      setFormLoading(false);
    }
  };

  // Determine filtered org options for the modal
  const [filteredOrgOptions, setFilteredOrgOptions] = useState<OrgOption[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      const orgId = localStorage.getItem("OrgId");
      if (role === "Staff" && orgId) {
        setFilteredOrgOptions(orgOptions.filter((o) => String(o.id) === orgId));
      } else {
        setFilteredOrgOptions(orgOptions);
      }
    } else {
      setFilteredOrgOptions(orgOptions);
    }
  }, [orgOptions]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-100 -z-10"></div>
      <div className="relative w-screen min-h-screen bg-gray-100 overflow-x-auto">
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold text-[#8B4513] mb-6">Services</h1>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 max-w-xl">
                  <input
                    type="text"
                    placeholder="Search services..."
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
                    + Add Service
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Description</th>
                        <th className="px-6 py-3 text-left">Price</th>
                        <th className="px-6 py-3 text-left">Organization</th>
                        <th className="px-6 py-3 text-left">Service Type</th>
                        <th className="px-6 py-3 text-left">Image</th>
                        <th className="px-6 py-3 text-left">Capacity</th>
                        <th className="px-6 py-3 text-left">Duration</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm text-black">
                      {filteredServices.map((svc) => (
                        <tr key={svc.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.name}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate"
                            title={svc.description}
                          >
                            {svc.description }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${svc.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.organization?.name || svc.orgId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.serviceType?.name || svc.serviceTypeId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.imageUrl ? (
                              <img
                                src={svc.imageUrl}
                                alt={svc.name}
                                className="h-12 w-20 object-cover rounded"
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.capacity ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {svc.durationInMinutes ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!svc.isActive}
                                onChange={async () => {
                                  try {
                                    setServices((prev) =>
                                      prev.map((s) =>
                                        s.id === svc.id
                                          ? { ...s, isActive: !s.isActive }
                                          : s
                                      )
                                    );
                                    await serviceService.toggleService(svc.id);
                                    fetchAll();
                                  } catch (err) {
                                    setError(
                                      (err as any).message ||
                                        "Failed to toggle service"
                                    );
                                    setServices((prev) =>
                                      prev.map((s) =>
                                        s.id === svc.id
                                          ? { ...s, isActive: !!svc.isActive }
                                          : s
                                      )
                                    );
                                  }
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all"></div>
                              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full"></div>
                            </label>
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

        {/* Modal for creating service */}
        <CreateServiceModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          error={formError}
          success={""}
          form={form}
          onFormChange={handleFormChange}
          orgOptions={filteredOrgOptions}
          serviceTypeOptions={serviceTypeOptions}
        />
      </div>
    </>
  );
}

export default withAuth(ServicesPage);
