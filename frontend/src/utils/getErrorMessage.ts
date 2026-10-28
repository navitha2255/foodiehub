import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Cannot reach the server. Is the backend running?';
  }
  return 'Something went wrong';
};