import axios from 'axios';
import axiosClient from './axiosClient';
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../types/auth';

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async getMe(): Promise<AuthUser> {
    const response = await axiosClient.get<AuthUser>('/auth/me');
    return response.data;
  },
};

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors).flat()[0];
      if (firstError) {
        return firstError;
      }
    }

    if (!error.response) {
      return 'Αδυναμία σύνδεσης με τον server. Βεβαιώσου ότι τρέχει το Backend API.';
    }
  }

  return fallbackMessage;
}