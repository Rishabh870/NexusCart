import axios from "axios";

// export const BASE_URL = "http://localhost:5000";
export const BASE_URL = "https://nexuscartbackend.onrender.com";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use(
  (config) => {
    const TOKEN = localStorage.getItem("token");
    config.headers["token"] = `Bearer ${TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
