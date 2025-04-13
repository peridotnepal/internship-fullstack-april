import { getSectorWise } from "@/lib/api/getSectorWise"
import { useQuery } from "@tanstack/react-query"

export const useSectorWiseQuery = (sector: string, stock: string) =>{
    return useQuery({
        queryKey: ['sector',stock, sector],
        queryFn: () => getSectorWise(sector, stock),
        enabled: Boolean(sector) && Boolean(stock), // prevents query from running with empty sector
    })
}