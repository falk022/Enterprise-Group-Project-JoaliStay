/**
 * User service for handling user-related operations
 */
import { ApiClient, apiClient } from "./ApiClient";
import {
  CustomerRegisterParams,
  User,
  StaffCreateParams,
  ApiResponse,
} from "../types/types";
import axiosInstance from "@/utils/axiosInstace";

export class UserService extends ApiClient {
  /**
   * Register a new customer
   * @param params Customer registration parameters
   * @returns API response
   */
  async customerRegister(params: CustomerRegisterParams): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/User/CustomerRegister?apiKey=${this.apiKey}`,
        params
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(message);
    }
  }

  /**
   * Get all users (admin only)
   * @returns List of users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/User/AllUsers?apiKey=${this.apiKey}`
      );
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  /**
   * Toggle user active status
   * @param email User email
   * @returns API response
   */
  async toggleUser(email: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.put(
        `${this.baseUrl}/api/User/ToggleUser?apiKey=${this.apiKey}&email=${email}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle user";
      throw new Error(message);
    }
  }

  /**
   * Create a new staff member
   * @param staff Staff creation parameters
   * @returns API response
   */
  async createStaff(staff: StaffCreateParams): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/User/NewStaff?apiKey=${this.apiKey}`,
        staff
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create staff";
      throw new Error(message);
    }
  }

  /**
   * Set staff role
   * @param email Staff email
   * @param Role 0 - Admin, 1 - Manager, 2 - Staff
   * @returns API response
   */
  async setStaffRole(email: String, Role: Number): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/User/SetStaffRole?apiKey=${this.apiKey}&email=${email}&role=${Role}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to set staff role";
      throw new Error(message);
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
