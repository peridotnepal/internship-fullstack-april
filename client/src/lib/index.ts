import axios from "axios";

const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL2,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const api = axios.create(apiConfig);

if (process.env.NODE_ENV !== "production") {
  console.log(process.env.NEXT_PUBLIC_BASE_URL2);
}

export default api