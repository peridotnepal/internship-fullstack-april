import { useQuery } from "@tanstack/react-query";
import { SectorStock } from "../api/sector-stock";

export const SectorStockQuery = () => {
  return useQuery({
    queryKey: ["sector-stock"],
    queryFn: () => SectorStock(),
  });
};
