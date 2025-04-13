import { FetchPostData } from "@/components/fetchPostData";
import { useQuery } from "@tanstack/react-query";

const PostQuery = (page: number, sectors: string[]) => {
  return useQuery({
    queryKey: ['sectorData', page, sectors],
    queryFn: () =>  FetchPostData(page, sectors),
    enabled: Boolean(page) && sectors.length > 0,
    placeholderData: (previousData) => previousData,
  })
}

export default PostQuery