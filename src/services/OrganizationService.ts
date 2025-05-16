/**
 * Organization service for handling organization-related operations
 */
import { ApiClient } from "./ApiClient";
import {
  Organization,
  OrganizationCreateParams,
  ApiResponse,
} from "../types/types";
import axiosInstance from "@/utils/axiosInstace";

export class OrganizationService extends ApiClient {
  /**
   * Get all organizations
   * @param orgType Optional organization type filter
   * @returns List of organizations
   */
  async getAllOrganizations(orgType?: number): Promise<Organization[]> {
    try {
      const url =
        orgType !== undefined
          ? `${this.baseUrl}/api/Organization/?orgType=${orgType}`
          : `${this.baseUrl}/api/Organization/`;

      const response = await axiosInstance.get(url);
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching organizations:", error);
      return [];
    }
  }

  /**
   * Get organization by ID
   * @param id Organization ID
   * @returns Organization or null if not found
   */
  async getOrganizationById(id: number): Promise<Organization | null> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/Organization/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching organization ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new organization
   * @param org Organization creation parameters
   * @returns API response
   */
  async createOrganization(
    org: OrganizationCreateParams
  ): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Organization/create`,
        org
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create organization";
      throw new Error(message);
    }
  }

  /**
   * Toggle organization active status
   * @param id Organization ID
   * @returns API response
   */
  async toggleOrganization(id: number): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.put(
        `${this.baseUrl}/api/Organization/toggle/${id}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle organization";
      throw new Error(message);
    }
  }
}

// Export a singleton instance
export const organizationService = new OrganizationService();
