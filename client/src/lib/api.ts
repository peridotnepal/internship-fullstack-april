import axiosInstance from "./axios"

export interface NewsItem {
  id: number
  attributes: {
    title: string
    short_description: string
    description: string
    date: string
    source: string | null
    isOnCarousel: boolean
    keyword1: string | null
    keyword2: string | null
    createdAt: string
    updatedAt: string
    publishedAt: string
    thumbnail: {
      data: Array<{
        id: number
        attributes: {
          name: string
          alternativeText: string | null
          caption: string | null
          width: number
          height: number
          formats: {
            small?: {
              url: string
              width: number
              height: number
            }
            medium?: {
              url: string
              width: number
              height: number
            }
            thumbnail?: {
              url: string
              width: number
              height: number
            }
          }
          url: string
        }
      }>
    }
  }
}

export interface NewsResponse {
  data: NewsItem[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface NewsDetailResponse {
  data: NewsItem
  meta: {}
}

export async function fetchNews(page = 1, pageSize = 7, category?: string): Promise<NewsResponse> {
  try {
    let url = `/newsses?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=thumbnail&sort[0][publishedAt]=desc`;

    // Add category filter if provided
    if (category && category !== "all") {
      url += `&filters[keyword1][$containsi]=${category}`;
    }

    console.log("Fetching news with URL:", url);
    const response = await axiosInstance.get(url);
    console.log("Response data:", response.data);
    return response?.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function fetchNewsById(newsId: string): Promise<NewsDetailResponse> {
  try {
    const url = `/newsses/${newsId}?populate=thumbnail&sort[0][createdAt]=desc`;
    console.log("Fetching news detail with URL:", url);
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw error;
  }
}