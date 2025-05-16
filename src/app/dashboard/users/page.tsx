"use client";

import React from "react";
import SideBar from "@/components/SideBar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userService } from "@/services/index";
import withAuth from "@/components/withAuth";

type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  createdAt?: string;
  isActive: boolean;
  userType?: number;
  staffRole?: string;
};

function UsersPage() {
  const router = useRouter();
  // Role-based access control is now handled by the withAuth HOC

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError((err as any).message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar Section  */}
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">All Users</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Users"
                className="border px-4 py-2 rounded-md w-full md:w-64 text-black"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border px-4 py-2 rounded-md w-full md:w-48 text-gray-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            {loading ? (
              <div className="text-center text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Created At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) => {
                        // Exclude staff: userType === 1 or has staffRole
                        if (user.userType === 1 || user.staffRole) return false;
                        const matchesSearch =
                          user.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          user.email
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          user.id
                            .toString()
                            .includes(search.toLowerCase());
                        const matchesStatus =
                          statusFilter === "all" ||
                          (statusFilter === "active" && user.isActive) ||
                          (statusFilter === "inactive" && !user.isActive);
                        return matchesSearch && matchesStatus;
                      })
                      .map((user: User, index: number) => (
                        <tr key={user.id || index} className="border-b">
                          <td className="py-4 text-black font-medium">
                            {user.id}
                          </td>
                          <td className="py-4 text-black font-medium">
                            {user.name}
                          </td>
                          <td className="py-4 text-black">{user.email}</td>
                          <td className="py-4 text-black">
                            {user.phoneNumber || user.phone || "-"}
                          </td>
                          <td className="py-4 text-black">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleString()
                              : "-"}
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-[15px] text-white text-xs ${
                                user.isActive ? "bg-green-600" : "bg-red-400"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={user.isActive}
                                  onChange={async () => {
                                    try {
                                      await userService.toggleUser(user.email);
                                      setUsers((users) =>
                                        users.map((u) =>
                                          u.id === user.id
                                            ? { ...u, isActive: !u.isActive }
                                            : u
                                        )
                                      );
                                    } catch (err) {
                                      alert("Failed to toggle user");
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(UsersPage);
