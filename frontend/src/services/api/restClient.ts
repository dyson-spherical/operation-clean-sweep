import authService from '@/services/authService';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

/**
 * REST Client for communicating with regular REST endpoints
 * Handles authentication and error handling
 */
class RestClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      headers: {
        'Accept': 'application/json',
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
          console.log('Authorization header set with token');
        } else {
          console.warn('No token available for request');
          delete config.headers.Authorization;
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
          switch (error.response.status) {
            case 401:
              console.warn('Authentication required - clearing auth state');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('current_user');
              break;

            case 403:
              console.error('Access forbidden. You do not have permission to access this resource.');
              break;

            case 404:
              console.error('Resource not found:', error.config.url);
              break;

            case 500:
              console.error('Server error occurred:', error.response.data);
              break;
          }
        } else if (error.request) {
          console.error('No response received from server. Network issue or server down.');
        } else {
          console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Perform a GET request
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
   */
  private handleError(error: any, method: string, url: string): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error(`API Error (${method} ${url}) [${status}]:`, data);
    } else {
      console.error(`API Error (${method} ${url}):`, error);
    }
  }
}

// Export a singleton instance
export default new RestClient();