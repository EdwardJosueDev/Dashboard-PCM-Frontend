// src/api/HttpClient.ts
import api from './axiosInstance';
import { AxiosResponse } from 'axios';
import axios from 'axios';

class httpClient {
  private handleDirect<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      throw new Error(error.response.data?.message || `Error ${status}`);
    }
    throw error instanceof Error ? error : new Error('Error desconocido');
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await api.get<any>(url, { params });
      return this.handleDirect(response as AxiosResponse<T>);
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await api.post<any>(url, data);
      return this.handleDirect(response as AxiosResponse<T>);
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    try {
      const response = await api.patch<any>(url, data);
      return this.handleDirect(response as AxiosResponse<T>);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T = void>(url: string): Promise<T> {
    try {
      const response = await api.delete<any>(url);
      return this.handleDirect(response as AxiosResponse<T>);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const HttpClient = new httpClient();
export default HttpClient;