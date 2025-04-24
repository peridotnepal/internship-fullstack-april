import { useQuery } from "@tanstack/react-query"
import { gainer, loser } from "../api/gainer-loser-api"

export const allGainer = () => {
  return useQuery({
    queryKey: ['gainer'],
    queryFn: () => gainer(), 
  })
}

export const allLosers = () => {
  return useQuery({
    queryKey: ['allLosers'],
    queryFn: () => loser(), 
  })
}