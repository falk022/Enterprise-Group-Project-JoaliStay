/**
 * Base API client that provides common functionality for all API services
 */
import { API_BASE, API_KEY } from "../types/types";

export class ApiClient {
  public baseUrl: string;
  public apiKey: string;

  constructor(baseUrl: string = API_BASE, apiKey: string = API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Get authentication headers for API requests
   */
  public getAuthHeaders(): Record<string, string> {
    const accessToken = this.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  }

  /**
   * Set tokens in localStorage
   */
  public setLocalStorage(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  /**
   * Clear tokens from localStorage
   */
  public clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  /**
   * Get access token from localStorage
   */
  public getAccessToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  }

  /**
   * Get refresh token from localStorage
   */
  public getRefreshToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null;
  }

  /**
   * Refresh the access token if needed
   * Uses direct fetch to avoid circular dependency with axios interceptors
   */
  public async refreshTokenIfNeeded(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    if (!accessToken || !refreshToken) return false;

    try {
      // Use a direct fetch here instead of axiosInstance to avoid circular token refresh
      const response = await fetch(`${this.baseUrl}/api/Auth/RefreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      const data = await response.json();

      if (
        response.ok &&
        data.token &&
        data.token.accessToken &&
        data.token.refreshToken
      ) {
        this.setLocalStorage(data.token.accessToken, data.token.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
