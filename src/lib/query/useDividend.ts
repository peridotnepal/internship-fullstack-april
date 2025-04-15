import { useQuery } from "@tanstack/react-query"
import { getDividend } from "../api/getDividend"

export const useDividend = (payload: string) => {
    return useQuery({
        queryKey: ['dividend', payload],
        queryFn: () => getDividend(payload),
        enabled: !!payload
    })
}