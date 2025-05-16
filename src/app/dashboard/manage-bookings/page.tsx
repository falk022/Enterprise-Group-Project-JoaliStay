"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { orderService, userService } from "@/services/index";
import withAuth from "@/components/withAuth";
import { format } from "date-fns";

// Order status options
const ORDER_STATUS: { [key: number]: { label: string; color: string } } = {
  0: { label: "Pending", color: "bg-yellow-500" },
  1: { label: "Confirmed", color: "bg-green-500" },
  2: { label: "Cancelled", color: "bg-red-500" },
  3: { label: "Completed", color: "bg-blue-500" },
};

type ServiceOrder = {
  id: number;
  serviceId: number;
  service: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    organization: {
      id: number;
      name: string;
    };
  };
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  orgId: number;
  organization: {
    id: number;
    name: string;
  };
  quantity: number;
  createdAt: string;
  scheduledFor: string;
  orderType: number;
  status: number;
};

function StaffHomePage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userOrgId, setUserOrgId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateLoading, setUpdateLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [userMap, setUserMap] = useState<{[key: number]: {name: string, email: string}}>({});

  // Get user's organization ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const orgIdStr = localStorage.getItem("OrgId");
      if (orgIdStr) {
        try {
          setUserOrgId(parseInt(orgIdStr, 10));
        } catch (e) {
          console.error("Invalid OrgId in localStorage:", orgIdStr);
        }
      }
    }
  }, []);

  // Fetch orders when organization ID is available
  useEffect(() => {
    if (userOrgId) {
      fetchOrders();
    }
  }, [userOrgId, statusFilter]);

  // Fetch orders for the staff's organization
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const filters: any = { orgId: userOrgId };

      // Add status filter if selected
      if (statusFilter !== null) {
        filters.status = statusFilter;
      }

      const data = await orderService.getAllServiceOrders(filters);
      const ordersData = Array.isArray(data) ? data : [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      
      // Collect unique user IDs from orders
      const userIds = [...new Set(ordersData.map(order => order.userId))];
      
      // Fetch user details for each unique user ID
      try {
        const users = await userService.getAllUsers();
        const userMapping: {[key: number]: {name: string, email: string}} = {};
        
        if (Array.isArray(users)) {
          users.forEach(user => {
            if (userIds.includes(user.id)) {
              userMapping[user.id] = {
                name: user.name,
                email: user.email
              };
            }
          });
        }
        
        setUserMap(userMapping);
      } catch (userErr) {
        console.error("Failed to fetch user details:", userErr);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: number) => {
    setUpdateLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await orderService.updateServiceOrderStatus(orderId, newStatus);
      
      // Refresh the entire orders list to ensure we have the latest data
      await fetchOrders();
      
      // Show success message
      const statusLabel = ORDER_STATUS[newStatus]?.label || "Unknown";
      console.log(`Order #${orderId} status updated to ${statusLabel}`);
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return new Date(dateString).toLocaleString();
    }
  };

  // Filter orders based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredOrders(orders);
      return;
    }
    
    const filtered = orders.filter(order => {
      // Search by order ID
      if (order.id.toString().includes(term)) return true;
      
      // Search by service name
      if (order.service?.name.toLowerCase().includes(term)) return true;
      
      // Search by customer name
      if (userMap[order.userId]?.name.toLowerCase().includes(term)) return true;
      
      return false;
    });
    
    setFilteredOrders(filtered);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-6">
            Service Orders Dashboard
          </h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Orders for your organization
                  </h2>
                  <div className="ml-4">
                    <select
                      className="border rounded px-3 py-2 text-gray-700"
                      value={statusFilter === null ? "" : statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(ORDER_STATUS).map(([value, { label }]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={fetchOrders}
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  Refresh
                </button>
              </div>
              
              {/* Search box */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by order ID, service name, or customer name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredOrders(orders);
                    }}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center text-black">Loading orders...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-700 py-8">
                No orders found.{" "}
                {statusFilter !== null && "Try changing the status filter."}
              </div>
            ) : filteredOrders.length === 0 && searchTerm ? (
              <div className="text-center text-gray-700 py-8">
                No orders match your search for "{searchTerm}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-700 border-b">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Scheduled For</th>
                      <th className="pb-3">Created At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-4 text-black font-medium">
                          {order.id}
                        </td>
                        <td className="py-4 text-black">
                          {order.service?.name || "Unknown Service"}
                        </td>
                        <td className="py-4 text-black">
                          {userMap[order.userId]?.name || `User #${order.userId}`}
                        </td>
                        <td className="py-4 text-black">{order.quantity}</td>
                        <td className="py-4 text-black">
                          ${order.service?.price * order.quantity}
                        </td>
                        <td className="py-4 text-black">
                          {formatDate(order.scheduledFor)}
                        </td>
                        <td className="py-4 text-black">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-[15px] text-white text-xs ${
                              ORDER_STATUS[order.status]?.color || "bg-gray-500"
                            }`}
                          >
                            {ORDER_STATUS[order.status]?.label || "Unknown"}
                          </span>
                        </td>
                        <td className="py-4">
                          <select
                            className="border rounded px-2 py-1 text-black"
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                Number(e.target.value)
                              )
                            }
                            disabled={updateLoading[order.id]}
                          >
                            {Object.entries(ORDER_STATUS).map(
                              ([value, { label }]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </select>
                          {updateLoading[order.id] && (
                            <span className="ml-2 text-xs text-gray-500">
                              Updating...
                            </span>
                          )}
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

export default withAuth(StaffHomePage);
