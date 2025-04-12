import axios from "axios"

// Create a custom axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://peridotnepal.xyz/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Permission": "2021D@T@f@RSt6&%2-D@T@"
  },
})

// Add a request interceptor for handling auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.status, error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error Request:", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error Message:", error.message)
    }
    return Promise.reject(error)
  },
)

export default api
