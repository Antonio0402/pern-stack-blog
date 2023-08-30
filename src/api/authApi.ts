import axios, { AxiosError } from "axios";
import { Profile, User } from "../store";

const BASE_URL = import.meta.env.MODE === "production"
  ? "https://pern-stack-blog-340de8e0841d.herokuapp.com/api/v1"
  : "http://localhost:5001/api/v1"

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true
})

export const login = async (username: string, password: string): Promise<User | undefined> => {
  try {
    return username && password
      ? await authApi.post('/login', JSON.stringify({ username, password })).then(res => res.data)
      : await Promise.reject(new Error('Invalid email or password'));
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) throw error
  }

}

export const register = async (username: string, password: string): Promise<string | undefined> => {
  try {
    return username && password
      ? await authApi.post('/register', JSON.stringify({ username, password })).then(res => res.data)
      : await Promise.reject(new Error('Invalid email or password'));
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) throw error
  }

}

export const logout = async (): Promise<{ message: string } | undefined> => {
  try {
    const result = await authApi.post('/logout');
    return result.data.message;
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) throw error
  }
}

export const getUser = async (): Promise<Profile | undefined> => {
  try {
    const result = await authApi.get('/user')
    return result.data;
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) throw error
  }
}