import axios from 'axios';
import { APIError, User } from './types';

axios.defaults.baseURL = '/api'; // Vite proxy directs to backend so we dont have to mess with CORS

// Wrap any and all errors to our json shape.
axios.interceptors.response.use(
  res => res,
  err => {
    const apiError: APIError = {
      error: true,
      status: err.response?.status || 500,
      message: err.message || 'Unknown error'
    };

    return Promise.reject(apiError);
  }
);

export const getUser = async (id: number): Promise<User> => {
  const res = await axios('/users/' + id);

  return res.data as User;
};
