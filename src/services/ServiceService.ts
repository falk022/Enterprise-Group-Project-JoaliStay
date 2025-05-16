/**
 * Service for handling services and service types operations
 */
import { ApiClient, apiClient } from "./ApiClient";
import { Service, ServiceType, ApiResponse } from "../types/types";
import axiosInstance from "@/utils/axiosInstace";

export class ServiceService extends ApiClient {
  /**
   * Fetch all services or filtered services
   * @param filters Optional filters: { orgId, typeId, ... }
   * @returns List of services
   */
  async getAllServices(filters?: {
    orgId?: number | string;
    typeId?: number | string;
    [key: string]: any;
  }): Promise<Service[]> {
    let url = `${this.baseUrl}/api/Service/all`;
    if (filters && Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
      url += `?${params.toString()}`;
    }
    try {
      const response = await axiosInstance.get(url);
      let data = response.data;
      if (!Array.isArray(data)) data = [];
      return data;
    } catch (error: any) {
      console.error("Error fetching services:", error);
      return [];
    }
  }

  /**
   * Create a new service
   * @param service Service creation parameters
   * @returns API response
   */
  async createService(service: Service): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Service/create`,
        service
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create service";
      throw new Error(message);
    }
  }

  /**
   * Toggle service active status
   * @param id Service ID
   * @returns API response
   */
  async toggleService(id: number): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Service/toggle/${id}`
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle service";
      throw new Error(message);
    }
  }

  /**
   * Get all service types
   * @returns List of service types
   */
  async getAllServiceTypes(): Promise<ServiceType[]> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/api/Service/all-service-types`
      );
      let data = response.data;
      if (!Array.isArray(data)) data = [];
      return data;
    } catch (error: any) {
      console.error("Error fetching service types:", error);
      return [];
    }
  }

  /**
   * Create a new service type
   * @param serviceType Service type creation parameters
   * @returns API response
   */
  async createServiceType(serviceType: ServiceType): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Service/create-service-type`,
        serviceType
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create service type";
      throw new Error(message);
    }
  }
}

// Export a singleton instance
export const serviceService = new ServiceService();
