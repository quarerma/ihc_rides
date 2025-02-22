import { useState } from "react";
import { get } from "@/boot/axios";
import { useUserSession } from "@/hooks/session";
import { Button } from "@/components/ui/button";
import BecomeDriverDialog from "./components/register-driver-dialog";

export default function Documents() {
  const { user } = useUserSession();
  const [open, setOpen] = useState(false);

  const fetchCpf = async () => (await get("/user/cpf")).data as string;

  return (
    <div className="py-5 space-y-4">
      {/* <h1>CPF: {fetchCpf()}</h1> */}
      {user?.role === "PASSENGER" && (
        <Button onClick={() => setOpen(true)}>Become a Driver</Button>
      )}
      <BecomeDriverDialog open={open} setOpen={setOpen} />
    </div>
  );
}
