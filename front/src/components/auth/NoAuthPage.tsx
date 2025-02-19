import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoAuthPage({ children }: React.PropsWithChildren) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    } else {
      setChecked(true);
    }
  }, [navigate]);

  if (!checked) return null;

  return <>{children}</>;
}
