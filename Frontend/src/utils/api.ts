import axios from 'axios';
import { APIError, User } from './types';

axios.defaults.baseURL = '/api'; // Vite proxy directs to backend so we dont have to mess with CORS

const TOKEN_KEY = 'cbtoken';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const parseToken = (token: string) => JSON.parse(atob(token.split('.')[1])); // jwt decode
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

let unauthorizedReactHook = () => {};

export const setUnauthorizedHook = (fn: () => void) => {
  unauthorizedReactHook = fn;
};

axios.interceptors.request.use(config => {
  const token = getToken();

  // Add auth token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    const parsed = parseToken(token);

    if (parsed.exp * 1000 < Date.now()) unauthorizedReactHook(); // Token expired
  }

  return config;
});

// Wrap any and all errors to our json shape.
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) unauthorizedReactHook(); // Unauthorized, make user log in again

    const apiError: APIError = {
      error: true,
      status: err.response?.status || 500,
      message: err.response?.data?.message || err.message || 'Unknown error'
    };

    return Promise.reject(apiError);
  }
);

export const login = async (username: string, password: string): Promise<void> => {
  const res = await axios.post('/auth/login', { username, password });

  setToken(res.data.token);
};

export const getUser = async (id: number): Promise<User> => {
  const res = await axios('/users/' + id);

  return res.data as User;
};
