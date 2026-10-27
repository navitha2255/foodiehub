import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface HealthResponse {
  success: boolean;
  message: string;
}

export const checkBackendHealth = async (): Promise<HealthResponse> => {
  const response = await axios.get<HealthResponse>(`${API_URL}/health`);
  return response.data;
};