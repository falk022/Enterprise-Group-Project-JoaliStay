/**
 * Authentication service for handling login, logout, and token management
 */
import { ApiClient } from "./ApiClient";
import {
  LoginParams,
  ApiResponse,
  InitialPasswordResetParams,
} from "../types/types";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/axiosInstace";

export class AuthService extends ApiClient {
  /**
   * Login with email and password
   * @param params Login credentials
   * @returns API response with tokens and user info
   */
  async login(params: LoginParams): Promise<ApiResponse> {
    try {
      console.log("Auth service login with params:", {
        ...params,
        password: "***",
      });
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Auth/Login`,
        params
      );

      console.log("Login response from API:", response.data);

      // The API might return tokens in different formats
      // Check different possible locations for the token
      const accessToken =
        response.data.accessToken ||
        (response.data.data && response.data.data.accessToken) ||
        (response.data.token && response.data.token.accessToken);

      const refreshToken =
        response.data.refreshToken ||
        (response.data.data && response.data.data.refreshToken) ||
        (response.data.token && response.data.token.refreshToken) ||
        "";

      // Store token if we found it
      if (accessToken) {
        console.log("Storing tokens in localStorage");
        this.setLocalStorage(accessToken, refreshToken);

        // Also store user info immediately
        this.storeUserInfo();
      } else {
        console.log("No token found in response");
      }

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  }

  /**
   * Logout the current user
   * @returns API response
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Auth/Logout`
      );

      // Clear tokens regardless of API response
      this.clearTokens();

      // Clear user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("role");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("hotels");
        localStorage.removeItem("Role");
        localStorage.removeItem("hasBooking");
        localStorage.removeItem("OrgId");
      }

      return response.data;
    } catch (error: any) {
      // Still clear tokens on error
      this.clearTokens();

      const message =
        error.response?.data?.message || error.message || "Logout failed";
      throw new Error(message);
    }
  }

  /**
   * Reset initial password for new staff
   * @param params Password reset parameters
   * @returns API response
   */
  async resetInitialPassword(
    params: InitialPasswordResetParams
  ): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.baseUrl}/api/Auth/ResetPassword`,
        params
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      throw new Error(message);
    }
  }

  /**
   * Extract user information from JWT token
   * @returns User information from token
   */
  getUserInfoFromToken(): Record<string, any> | null {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    try {
      const decoded = jwtDecode(accessToken) as { [key: string]: any };
      return {
        name: decoded["name"] || decoded.name || "User",
        userId: decoded["userId"] || "",
        role: decoded["role"] || "",
        staffRole: decoded["staffRole"] || false,
        hasBooking: decoded["hasBooking"] || false,
        orgId: decoded["OrgId"] || "",
        email: decoded["email"] || "",
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  /**
   * Store user information from token in localStorage
   */
  storeUserInfo(): void {
    const userInfo = this.getUserInfoFromToken();
    if (!userInfo || typeof window === "undefined") return;

    localStorage.setItem("user_name", userInfo.name);
    localStorage.setItem("user_id", userInfo.userId);
    localStorage.setItem("role", userInfo.role);
    localStorage.setItem("hasBooking", String(userInfo.hasBooking));
    localStorage.setItem("OrgId", userInfo.orgId);
    localStorage.setItem("staffRole", userInfo.staffRole);
    localStorage.setItem("user_email", userInfo.email);
  }
}

// Export a singleton instance
export const authService = new AuthService();
