'use client'
import { useQuery } from "@tanstack/react-query"
import { getTimePeriod } from "../api/getTimePeriod"

export const useTimePeriod = () => {
    return useQuery({
        queryKey: ['timePeriod'],
        queryFn: getTimePeriod
    })
}