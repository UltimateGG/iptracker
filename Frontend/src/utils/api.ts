import axios from 'axios';
import { APIError, Application, Server, User } from './types';

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

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios('/users');

  return res.data as User[];
};

export const getUser = async (id: number): Promise<User> => {
  const res = await axios('/users/' + id);

  return res.data as User;
};

export const usernameAvailable = async (username: string): Promise<boolean> => {
  const res = await axios.get('/users/username-available?username=' + username);
  return res.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await axios.post('/users', user);

  return res.data as User;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const userToSend: any = user; // eslint-disable-line @typescript-eslint/no-explicit-any
  delete userToSend.authorities;

  const res = await axios.put('/users/' + id, userToSend);

  return res.data as User;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete('/users/' + id);
};

export const getMyApps = async (): Promise<Application[]> => {
  const res = await axios('/apps');

  return res.data as Application[];
};

export const getUsersApps = async (userId: number): Promise<Application[]> => {
  const res = await axios(`/users/${userId}/apps`);

  return res.data as Application[];
};

export const setUsersApps = async (userId: number, appIds: number[]): Promise<void> => {
  await axios.put(`/users/${userId}/apps`, appIds);
};

export const createApplication = async (description: string, allowedUsers: number[]): Promise<Application> => {
  const res = await axios.post('/apps', { description, allowedUsers });

  return res.data as Application;
};

export const deleteApplication = async (id: number): Promise<void> => {
  await axios.delete('/apps/' + id);
};

export const createServer = async (server: Partial<Server>): Promise<Server> => {
  const res = await axios.post('/servers', server);

  return res.data as Server;
};

export const updateServer = async (id: number, server: Partial<Server>): Promise<Server> => {
  const res = await axios.put('/servers/' + id, server);

  return res.data as Server;
};
