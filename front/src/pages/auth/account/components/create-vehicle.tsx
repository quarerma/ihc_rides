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
                <Label>Type</Label>
                <Select
                  onValueChange={(value) => setValue("type", value as any)}
                  value={watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAR">Car</SelectItem>
                    <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-sm h-5">
                  {errors.type?.message}
                </p>
              </div>

              <div>
                <Label>Brand</Label>
                <Input {...register("brand")} placeholder="Vehicle brand..." />
                <p className="text-red-500 text-sm  h-5">
                  {errors.brand?.message}
                </p>
              </div>

              <div>
                <Label>Model</Label>
                <Input {...register("model")} placeholder="Vehicle model..." />
                <p className="text-red-500 text-sm  h-5">
                  {errors.model?.message}
                </p>
              </div>

              <div>
                <Label>Fabrication Year</Label>
                <Input
                  type="text"
                  {...register("fabrication_year", {
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Enter a valid 4-digit year",
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
                <Label>Color</Label>
                <Input {...register("color")} placeholder="Vehicle color..." />
                <p className="text-red-500 text-sm  h-5">
                  {errors.color?.message}
                </p>
              </div>

              <div>
                <Label>Plate</Label>
                <Input {...register("plate")} placeholder="AAA1A11" />
                <p className="text-red-500 text-sm  h-5">
                  {errors.plate?.message}
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleNextStep}>
                  Next <ArrowRight className="ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>CRLV - Emission Date</Label>
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
                <Label>CRLV - Expiration Date</Label>
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
                <Label>CRLV - Issued By</Label>
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
                  <ArrowLeft className="mr-2" /> Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}{" "}
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
