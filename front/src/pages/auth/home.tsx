import { logout } from "@/utils/logout";
import { useQueryClient } from "@tanstack/react-query";

export default function HomePage() {
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout(queryClient);
  };
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
