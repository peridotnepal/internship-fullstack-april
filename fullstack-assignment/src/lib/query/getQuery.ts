import FetchData from "@/components/fetchData"
import { useQuery } from "@tanstack/react-query"

const GetQuery = () => {
  return useQuery({
    queryKey: ['subIndices'],
    queryFn: FetchData
  })
}

export default GetQuery;