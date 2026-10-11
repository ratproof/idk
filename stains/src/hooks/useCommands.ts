import { useQuery } from "@tanstack/react-query";
import { fetchCommands } from "@/lib/api";

export const useCommands = () =>
  useQuery({
    queryKey: ["commands"],
    queryFn: fetchCommands,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
