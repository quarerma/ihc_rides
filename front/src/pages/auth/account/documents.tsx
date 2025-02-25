import { useState } from "react";
import { get } from "@/boot/axios";
import { useUserSession } from "@/hooks/session";
import { Button } from "@/components/ui/button";
import BecomeDriverDialog from "./components/register-driver-dialog";
import { useQuery } from "@tanstack/react-query";
import { Cnh } from "@/schema/cnh.schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, IdCard, Car, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";

export default function Documents() {
  const { user } = useUserSession();
  const [open, setOpen] = useState(false);
  const [cpfVisible, setCpfVisible] = useState(false);
  const [serialVisible, setSerialVisible] = useState(false);

  const { data: cpf } = useQuery({
    queryKey: ["cpf"],
    queryFn: async () => {
      const res = await get("/users/cpf");
      return res.data.cpf;
    },
  });

  const { data: cnh } = useQuery({
    queryKey: ["cnh"],
    queryFn: async () => {
      const res = (await get("/users/cnh")).data as Cnh;
      return res;
    },
    enabled: user?.role === "DRIVER",
  });

  const formatDate = (date: Date) =>
    date
      ? format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
      : "-";

  const maskString = (str: string) => str?.replace(/.(?=.{3})/g, "*");

  return (
    <div className="py-5  max-w-lg space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          to="/account"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Documents</h1>
      </div>

      <Card className="shadow-md border border-gray-200 rounded-lg">
        <CardHeader className="flex items-center text-lg font-semibold">
          <div className="flex items-center">
            <IdCard className="w-5 h-5 mr-2 text-gray-600" />
            <h1>CPF</h1>
          </div>
        </CardHeader>
        <CardContent className="text-gray-700 text-base flex items-center">
          {cpfVisible ? cpf : maskString(cpf)}
          <button className="ml-2" onClick={() => setCpfVisible(!cpfVisible)}>
            {cpfVisible ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </CardContent>
      </Card>

      {user?.role === "DRIVER" && (
        <Card className="shadow-md border border-gray-200 rounded-lg ">
          <CardHeader className="flex items-center text-lg font-semibold">
            <div className="flex items-center">
              <Car className="mr-2 text-gray-600" />
              <span>CNH</span>
            </div>
          </CardHeader>
          <CardContent className="text-gray-700 text-base space-y-3">
            <div className="flex justify-between items-center h-5">
              <Label>Categoria:</Label>
              <Label>{cnh?.category}</Label>
            </div>
            <div className="flex justify-between items-center h-5">
              <Label>Serial:</Label>
              <div className="flex items-center">
                <Label>
                  {serialVisible ? cnh?.serial : maskString(cnh?.serial)}
                </Label>
                <button
                  className="ml-2"
                  onClick={() => setSerialVisible(!serialVisible)}
                >
                  {serialVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center h-5">
              <Label>Data de Emissão:</Label>
              <Label>{formatDate(cnh?.emission_date)}</Label>
            </div>
            <div className="flex justify-between items-center h-5">
              <Label>Data de Expiração:</Label>
              <Label>{formatDate(cnh?.expiration_date)}</Label>
            </div>
            <div className="flex justify-between items-center h-5">
              <Label>Emitido por:</Label>
              <Label>{cnh?.issued_by}</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === "PASSENGER" && (
        <Button className="w-full" onClick={() => setOpen(true)}>
          Become a Driver
        </Button>
      )}

      <BecomeDriverDialog open={open} setOpen={setOpen} />
    </div>
  );
}
