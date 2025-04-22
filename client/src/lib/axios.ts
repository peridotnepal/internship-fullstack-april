import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { decryptMessage } from "@/hashing/decrypt";

// Create an axios instance with strict typing based on AxiosInstance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Permission: "2021D@T@f@RSt6&%2-D@T@",
  },
});

// Set up the response interceptor with full type annotations
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const url = response.config.url;
    if (
      url?.includes("economy") ||
      url?.includes("financial_breakdown/loan/compare") ||
      url?.includes("report") ||
      url?.includes("/screener") ||
      url?.includes("heat-map")
    ) {
      try {
        // Ensure the decoded response is typed as unknown,
        // so consumers of the response can later narrow it to the expected type.
        const decodedResponse: unknown = decryptMessage(response.data.data);
        response.data.data = decodedResponse;
      } catch (err) {
        console.error("Cannot decode", err);
      }
    }
    return response;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Define a strict type for the request options.
// T represents the type for the request body,
// and defaults to unknown if not specified.
export interface RequestOptions<T = unknown> {
  token: string;
  url: string;
  method?: Method;
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  body?: T;
}

// Generic request function.
// T is the type of the request body,
// U is the type of the expected response data,
// both default to unknown if not specified.
const request = async <T = unknown, U = unknown>(
  options: RequestOptions<T>
): Promise<AxiosResponse<U>> => {
  const { token, url, method = "GET", params, headers = {}, body } = options;

  if (!url) {
    throw new Error("URL is required for making a request.");
  }

  // Merge the passed headers with the Authorization header
  const updatedHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  // Create an axios request using the provided parameters, ensuring type safety with generics.
  return api.request<U>({
    url,
    method,
    params,
    headers: updatedHeaders,
    data: body,
  });
};

export default request;
