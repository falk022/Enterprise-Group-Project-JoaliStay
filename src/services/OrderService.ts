/**
 * Service for handling service orders and payments
 */
import { ApiClient } from "./ApiClient";
import {
  ServiceOrderParams,
  ServiceOrderFilters,
  ApiResponse,
} from "../types/types";
import axiosInstance from "@/utils/axiosInstace";

export class OrderService extends ApiClient {
  /**
   * Pay for a booking
   * @param bookingId The booking/order id to pay for
   * @returns API response
   */
  async payForBooking(bookingId: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/service/pay`,
        String(bookingId)
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Payment failed";
      throw new Error(message);
    }
  }

  /**
   * Places a new service order and returns the booking ID
   * @param order Order parameters
   * @returns Booking ID if successful
   */
  async placeServiceOrder(order: ServiceOrderParams): Promise<number> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/ServiceOrder/place`,
        order
      );
      // bookingId is response.data.data.id
      return response.data?.data?.id;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order";
      throw new Error(message);
    }
  }

  /**
   * Extracts the bookingId from a placeServiceOrder API response object
   * @param response API response object
   * @returns bookingId (number) or undefined
   */
  getBookingIdFromOrderResponse(response: any): number | undefined {
    return response?.data?.id;
  }

  /**
   * Get orders for the current user
   * @returns List of user's orders
   */
  async getMyServiceOrders(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/ServiceOrder/my-orders`
      );
      return response.data || [];
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch your orders";
      throw new Error(message);
    }
  }

  /**
   * Get all service orders (admin/org)
   * @param params Optional filters: { orgId, status, from, to, ... }
   * @param params.status - 0 - pending 1 - confirmed 2 - cancelled 3 - completed
   * @returns List of all orders
   */
  async getAllServiceOrders(params?: ServiceOrderFilters): Promise<any[]> {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null && v !== "")
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`
          )
          .join("&")
      : "";
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/ServiceOrder/all${query}`
      );
      return response.data || [];
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch all orders";
      throw new Error(message);
    }
  }

  /**
   * Update the status of a service order
   * @param id Order ID
   * @param status New status
   * @returns API response
   */
  async updateServiceOrderStatus(
    id: number,
    status: number
  ): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.put(
        `${this.baseUrl}/api/ServiceOrder/update-status/${id}?status=${status}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update order status";
      throw new Error(message);
    }
  }
}

// Export a singleton instance
export const orderService = new OrderService();
