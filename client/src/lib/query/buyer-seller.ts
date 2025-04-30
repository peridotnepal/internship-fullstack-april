import { useQuery } from "@tanstack/react-query"
import { gainer, loser } from "../api/gainer-loser-api"
import { getBroker, getStocks, stockBuySellBroker, topBuySell } from "../api/buyer-seller"

export const allBroker = () => {
  return useQuery({
    queryKey: ['allBroker'],
    queryFn: () => getBroker(),
  })
}

export const topFive = (brokerId: string) => {
  return useQuery({
    queryKey: ['topFive', brokerId],
    queryFn: () => topBuySell(brokerId), 
    enabled: !!brokerId,
  })
}

export const stockBuySell = (symbol: string, buyOrSell: string) => {
  return useQuery({
    queryKey: ['stokBuySell', symbol, buyOrSell],
    queryFn: () => stockBuySellBroker(symbol, buyOrSell), 
    enabled: !!symbol && !!buyOrSell
  })
}

// export const allLosers = () => {
//   return useQuery({
//     queryKey: ['allLosers'],
//     queryFn: () => loser(), 
//   })
// }

export const allStocks = () => {
  return useQuery({
    queryKey: ['allStocks'],
    queryFn: () => getStocks(),
  })
}