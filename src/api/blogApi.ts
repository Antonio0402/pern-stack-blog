import axios, { AxiosError } from "axios";
import { Post } from "../store";
import posts from "../data/posts.json";

const BASE_URL = import.meta.env.MODE === "production"
  ? "https://fullstack-blog-api.onrender.com/api/v1"
  : "http://localhost:5001/api/v1"

const blogApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true
})

export const getAllPostByCate = async (cate: string): Promise<Post[] | undefined> => {
  try {
    const result = await blogApi.get(`/posts${cate}`)
    if (result.data.length) {
      return result.data;
    }
    return posts as Post[];
  } catch (error) {
    if (error instanceof AxiosError) throw error
  }
}

export const getPost = async (id: string): Promise<Post | undefined> => {
  try {
    return id
      ? await blogApi.get(`posts/${id}`).then(res => res.data)
      : await Promise.reject(new Error('Invalid id'));
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) throw error
  }
}

export const upload = async (file: File | null): Promise<string | undefined> => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await blogApi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data.file;
    }
    return await Promise.reject(new Error('Invalid file'))
  } catch (error: AxiosError | unknown) {
    console.log(error);
    if (error instanceof AxiosError) throw error
  }
};

export const createPost = async (data: Partial<Post>, id?: string): Promise<Post | undefined> => {
  try {
    if (id) {
      const res = await blogApi.post(`/posts/${id}`, data);
      return res.data;
    } else {
      const res = await blogApi.post("/posts", data);
      console.log(res)
      return res.data
    }
  } catch (error) {
    if (error instanceof AxiosError) throw error
  }
}

export const deletePost = async (id: number) => {
  try {
    return id
      ? await blogApi.delete(`/posts/${id}`)
      : await Promise.reject(new Error('Invalid id'));
  } catch (error) {
    if (error instanceof AxiosError) throw error
  }
}