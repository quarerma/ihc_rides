import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 2000000,
});

export async function get_no_auth(url: string, options = {}) {
  console.log("get_no_auth", url, options);
  const response = await axiosInstance.get(url, {
    ...options,
  });

  return response;
}

export async function post_no_auth(endpoint: string, data = {}, options = {}) {
  return await axiosInstance.post(endpoint, data, {
    params: { ...options },
  });
}

export async function get(endpoint: string, options = {}) {
  return await axiosInstance.get(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export async function post(endpoint: string, data = {}, options = {}) {
  return await axiosInstance.post(endpoint, data, {
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}
