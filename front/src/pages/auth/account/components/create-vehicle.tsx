import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { VehicleSchema, CreateVehicle } from "@/schema/vehicle.schema";
import { post } from "@/boot/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import { QueryObserverResult } from "@tanstack/react-query";

export default function CreateVehicleDialog({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => Promise<QueryObserverResult<Vehicle[], Error>>;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [emissionDate, setEmissionDate] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CreateVehicle>({
    resolver: zodResolver(VehicleSchema),
  });

  function formatDate(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 10);
  }

  function convertToISO(dateStr: string) {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
  }

  const handleDateChange = (e, type) => {
    const formattedDate = formatDate(e.target.value);
    if (type === "expiration") {
      setExpirationDate(formattedDate);
      setValue("crlv.expiration_date", formattedDate, { shouldValidate: true });
    } else {
      setEmissionDate(formattedDate);
      setValue("crlv.emission_date", formattedDate, { shouldValidate: true });
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger([
      "type",
      "brand",
      "model",
      "fabrication_year",
      "color",
      "plate",
    ]);
    console.log("isValid:", isValid);
    if (isValid) setStep(2);
  };

  const onSubmit = async (data: CreateVehicle) => {
    setLoading(true);
    try {
      data.crlv.expiration_date = convertToISO(expirationDate);
      data.crlv.emission_date = convertToISO(emissionDate);
      console.log("Vehicle Data:", data);
      await post("/vehicle", data);
      await refetch();
      toast("Vehicle created successfully");
      setOpen(false);
    } catch (error) {
      toast("Failed to create vehicle", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90%] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Vehicle Details" : "CRLV Details"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div>
                <Label>Tipo</Label>
                <Select
                  onValueChange={(value) => setValue("type", value as any)}
                  value={watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona tipo de Veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAR">Carro</SelectItem>
                    <SelectItem value="MOTORCYCLE">Motocicleta</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-sm h-5">
                  {errors.type?.message}
                </p>
              </div>

              <div>
                <Label>Marca</Label>
                <Input
                  {...register("brand")}
                  placeholder="Marca do veículo..."
                />
                <p className="text-red-500 text-sm  h-5">
                  {errors.brand?.message}
                </p>
              </div>

              <div>
                <Label>Modelo</Label>
                <Input
                  {...register("model")}
                  placeholder="Modelo do veículo..."
                />
                <p className="text-red-500 text-sm  h-5">
                  {errors.model?.message}
                </p>
              </div>

              <div>
                <Label>Ano de Fabricação</Label>
                <Input
                  type="text"
                  {...register("fabrication_year", {
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Digite um ano válido",
                    },
                  })}
                  placeholder="YYYY"
                  maxLength={4}
                  inputMode="numeric"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 4);
                  }}
                />
                <p className="text-red-500 text-sm  h-5">
                  {errors.fabrication_year?.message}
                </p>
              </div>

              <div>
                <Label>Cor</Label>
                <Input {...register("color")} placeholder="Cor do veículo..." />
                <p className="text-red-500 text-sm  h-5">
                  {errors.color?.message}
                </p>
              </div>

              <div>
                <Label>Placa</Label>
                <Input {...register("plate")} placeholder="AAA1A11" />
                <p className="text-red-500 text-sm  h-5">
                  {errors.plate?.message}
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleNextStep}>
                  Próximo <ArrowRight className="ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>CRLV - Data de Emissão</Label>{" "}
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={emissionDate}
                  maxLength={10}
                  onChange={(e) => handleDateChange(e, "emission")}
                />
                <p className="text-red-500 text-sm  h-5">
                  {errors.crlv?.emission_date?.message}
                </p>
              </div>

              <div>
                <Label>CRLV - Data de Expiração</Label>{" "}
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={expirationDate}
                  maxLength={10}
                  onChange={(e) => handleDateChange(e, "expiration")}
                />
                <p className="text-red-500 text-sm  h-5">
                  {errors.crlv?.expiration_date?.message}
                </p>
              </div>

              <div>
                <Label>CRLV - Emitido Por</Label>{" "}
                <Input
                  {...register("crlv.issued_by")}
                  placeholder="Issuing authority..."
                />
                <p className="text-red-500 text-sm  h-5">
                  {errors.crlv?.issued_by?.message}
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2" /> Voltar
                </Button>
                <Button type="submit" disabled={loading}>
                  {carregando ? "Enviando..." : "Enviar"}{" "}
                  <Check className="ml-2" />
                  <Check className="ml-2" />
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
