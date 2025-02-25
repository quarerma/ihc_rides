import { getSession } from "@/boot/axios";
import { useQuery } from "@tanstack/react-query";

export const useUserSession = () => {
  const {
    data: user,
    refetch: refetchUser,
    ...query
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => getSession(),
  });

  return { user, refetchUser, ...query }; // Returning `user` along with other query properties if needed
};
