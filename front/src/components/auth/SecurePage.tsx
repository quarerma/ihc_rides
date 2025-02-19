import { getSession } from "@/boot/axios";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";

interface SecurePageProps {
  children: ReactNode;
}

export default function SecurePage({ children }: SecurePageProps) {
  const [checked, setChecked] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getSession(),
  });

  useEffect(() => {
    if (!isLoading) {
      setChecked(true);
    }
  }, [isLoading]);

  if (!checked) return null; // Ensures a blank screen until check completes

  return <>{children}</>;
}
