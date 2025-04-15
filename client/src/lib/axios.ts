import axios from "axios"

// Create a base axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: "https://news.peridot.com.np/api",
  headers: {
    "Content-Type": "application/json",
    // "Permission":  "2021D@T@f@RSt6&%2-D@T@"
  },
  timeout: 10000, // 10 seconds
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", error.response.status, error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request error:", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
