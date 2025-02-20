import { ReactNode, useState, useEffect } from "react";
import { useUserSession } from "@/hooks/session"; // Adjust path if needed

interface SecurePageProps {
  children: ReactNode;
}

export default function SecurePage({ children }: SecurePageProps) {
  const { user, isLoading } = useUserSession();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setChecked(true);
    }
  }, [isLoading]);

  if (!checked) return null; // Ensures a blank screen until check completes

  if (!user) return <p>Unauthorized: Please log in.</p>; // Redirect or handle unauthorized access

  return <>{children}</>;
}
