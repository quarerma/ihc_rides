import { QueryClient } from "@tanstack/react-query";

export function logout(queryClient: QueryClient) {
  localStorage.removeItem("token");

  queryClient.clear(); // Clears the cache properly
  window.location.href = "/login";
}
