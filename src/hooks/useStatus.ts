import { useQuery } from "@tanstack/react-query";
import { STATUS_URL } from "@/config";

export interface BotStatus { avatar_url?: string; guilds?: number; users?: number }

export const useStatus = () =>
  useQuery({
    queryKey: ["status"],
    queryFn: async (): Promise<BotStatus> => {
      const res = await fetch(STATUS_URL);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
