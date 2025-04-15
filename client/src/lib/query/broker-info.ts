import { useQuery } from '@tanstack/react-query';
import { allBrokerInfo, brokerDetailsById, topFive } from '../api/broker-api';

export const allBrokers = () => {
  return useQuery({
    queryKey: ['brokerInfo'],
    queryFn: () => allBrokerInfo()
  })
}

export const brokerById = (selectedBrokerId: number) => {
  return useQuery({
    queryKey: ['selectedBroker', selectedBrokerId],
    queryFn: () => brokerDetailsById(selectedBrokerId), 
    enabled: !!selectedBrokerId
  })
}

export const topFiveBuySell = (selectedBrokerId: number) => {
  return useQuery({
    queryKey: ['topFive', selectedBrokerId],
    queryFn: () => topFive(selectedBrokerId), 
    enabled: !!selectedBrokerId
  })
}