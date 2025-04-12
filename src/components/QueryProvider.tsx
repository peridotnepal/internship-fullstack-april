"use client"
import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
interface Props {
  children: React.ReactNode
}

const QueryProvider: React.FC<Props> = ({children}) => {
    const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider