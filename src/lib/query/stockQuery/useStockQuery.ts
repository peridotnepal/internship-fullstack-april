import { getStock } from "@/lib/api/getStock"
import { useQuery } from "@tanstack/react-query"


export const useStockQuery = (stock: string) =>{
    return useQuery({
        queryKey: ['stock', stock],
        queryFn: () => getStock(stock),
        enabled: !!stock, // prevents query from running with empty sector
    })
}

