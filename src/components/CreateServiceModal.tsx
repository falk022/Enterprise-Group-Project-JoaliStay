"use client";

import React from "react";

interface CreateServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
  loading: boolean;
  error: string;
  success: string;
  form: any;
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  orgOptions: { id: number; name: string }[];
  serviceTypeOptions: { id: number; name: string }[];
}

export default function CreateServiceModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  success,
  form,
  onFormChange,
  orgOptions,
  serviceTypeOptions,
}: CreateServiceModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-4xl relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4 text-center text-[#8B4513]">
          Create Service
        </h2>
        <form
          className="flex flex-wrap gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm text-gray-600 mb-1">Service Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onFormChange}
              placeholder="Service Name"
              required
              className="border px-3 py-2 rounded text-black"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm text-gray-600 mb-1">Organization</label>
            <select
              name="orgId"
              value={form.orgId}
              onChange={onFormChange}
              className="border px-3 py-2 rounded text-black"
              required
            >
              <option value={0}>Select organization</option>
              {orgOptions.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm text-gray-600 mb-1">Service Type</label>
            <select
              name="serviceTypeId"
              value={form.serviceTypeId}
              onChange={onFormChange}
              className="border px-3 py-2 rounded text-black"
              required
            >
              <option value={0}>Select service type</option>
              {serviceTypeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder="Description"
              required
              className="border px-3 py-2 rounded resize-none min-h-[60px] text-black"
              rows={2}
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full">
            <div className="flex flex-col flex-1 min-w-[100px]">
              <label className="text-sm text-gray-600 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={onFormChange}
                placeholder="Price"
                min={0}
                step={0.01}
                required
                className="border px-3 py-2 rounded text-black"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-[100px]">
              <label className="text-sm text-gray-600 mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={onFormChange}
                placeholder="Capacity"
                min={0}
                className="border px-3 py-2 rounded text-black"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-[120px]">
              <label className="text-sm text-gray-600 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                name="durationInMinutes"
                value={form.durationInMinutes}
                onChange={onFormChange}
                placeholder="Duration"
                min={0}
                className="border px-3 py-2 rounded text-black"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-sm text-gray-600 mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={onFormChange}
                placeholder="Image URL"
                className="border px-3 py-2 rounded text-black"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-center text-sm w-full">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-700 text-center text-sm w-full">
              {success}
            </div>
          )}

          <div className="w-full text-right mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-[#8B4513] rounded hover:bg-[#5B2415] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
