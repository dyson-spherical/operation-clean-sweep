// src/services/api/halClient.ts
import authService from '@/services/authService';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

/**
 * HAL Client for communicating with Spring REST Repositories
 * Handles authentication, error handling, and HAL+JSON format
 */
class HalClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      headers: {
        'Accept': 'application/hal+json',
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - adds auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = authService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handles auth errors and general error formatting
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Handle specific HTTP error codes
          switch (error.response.status) {
            case 401: // Unauthorized
              console.warn('Authentication required. Redirecting to login...');
              // Initiate login flow if not already on login/callback page
              const currentPath = window.location.pathname;
              if (!currentPath.includes('/login') && !currentPath.includes('/callback')) {
                authService.login();
              }
              break;

            case 403: // Forbidden
              console.error('Access forbidden. You do not have permission to access this resource.');
              break;

            case 404: // Not Found
              console.error('Resource not found:', error.config.url);
              break;

            case 500: // Server Error
              console.error('Server error occurred:', error.response.data);
              break;
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received from server. Network issue or server down.');
        } else {
          // Error in setting up the request
          console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Perform a GET request
   * @param url - The URL to request
   * @param config - Optional Axios config
   * @returns Promise with the response data
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'GET', url);
      throw error;
    }
  }

  /**
   * Perform a POST request
   * @param url - The URL to request
   * @param data - The data to send
   * @param config - Optional Axios config
   * @returns Promise with the response data
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'POST', url);
      throw error;
    }
  }

  /**
   * Perform a PUT request
   * @param url - The URL to request
   * @param data - The data to send
   * @param config - Optional Axios config
   * @returns Promise with the response data
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'PUT', url);
      throw error;
    }
  }

  /**
   * Perform a PATCH request
   * @param url - The URL to request
   * @param data - The data to send
   * @param config - Optional Axios config
   * @returns Promise with the response data
   */
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'PATCH', url);
      throw error;
    }
  }

  /**
   * Perform a DELETE request
   * @param url - The URL to request
   * @param config - Optional Axios config
   * @returns Promise with the response data
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error, 'DELETE', url);
      throw error;
    }
  }

  /**
   * Handle and log API errors
   * @param error - The error object
   * @param method - The HTTP method that was used
   * @param url - The URL that was requested
   */
  private handleError(error: any, method: string, url: string): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error(`API Error (${method} ${url}) [${status}]:`, data);

      // Additional application-specific error handling can be added here
      // For example, showing toast notifications or updating error state
    } else {
      console.error(`API Error (${method} ${url}):`, error);
    }
  }

  /**
   * Extract a resource ID from a HAL self link
   * @param resource - HAL resource with _links.self
   * @returns The extracted ID or undefined if not found
   */
  public extractResourceId(resource: any): string | undefined {
    if (resource?._links?.self?.href) {
      const href = resource._links.self.href;
      const parts = href.split('/');
      return parts[parts.length - 1];
    }
    return undefined;
  }

  /**
   * Follow a HAL link relation from a resource
   * @param resource - HAL resource with _links
   * @param rel - The link relation to follow
   * @returns Promise with the linked resource data
   */
  public async followLink<T>(resource: any, rel: string): Promise<T> {
    if (!resource?._links?.[rel]?.href) {
      throw new Error(`Link relation "${rel}" not found in resource`);
    }

    const href = resource._links[rel].href;
    return this.get<T>(href);
  }

  /**
   * Create a resource with a POST request and extract its ID
   * @param url - The collection URL
   * @param data - The resource data
   * @returns Promise with the created resource ID
   */
  public async createAndGetId<T>(url: string, data: any): Promise<string> {
    const response = await this.post<T>(url, data);
    const id = this.extractResourceId(response);

    if (!id) {
      throw new Error('Could not extract ID from created resource');
    }

    return id;
  }
}

// Export a singleton instance
export default new HalClient();
