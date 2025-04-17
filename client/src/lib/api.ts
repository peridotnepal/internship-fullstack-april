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
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw error;
  }
}
export async function fetchRelatedNews(category: string | null | undefined, currentNewsId: string | null): Promise<NewsResponse> {
  try {
    if (!category) {
      throw new Error("Category is required to fetch related news");
    }

    // Build URL with keyword1 filter (using it as category), exclude current news ID, and limit to 4 items
    let url = `/newsses?populate=thumbnail&pagination[pageSize]=4&sort[0][publishedAt]=desc`;
    
    // Use keyword1 as the category filter
    url += `&filters[keyword1][$eq]=${encodeURIComponent(category)}`;
    
    // If keyword1 doesn't match, try keyword2 as fallback
    url += `&filters[$or][1][keyword2][$eq]=${encodeURIComponent(category)}`;
    
    // Exclude current news item
    if (currentNewsId) {
      url += `&filters[id][$ne]=${currentNewsId}`;
    }
    
    console.log("Fetching related news with URL:", url);
    const response = await axiosInstance.get(url);
    console.log("Related news response:", response?.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching related news:", error);
    throw error;
  }
}