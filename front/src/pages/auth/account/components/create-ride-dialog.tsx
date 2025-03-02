import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreateRideSchema, CreateRideDto } from "@/schema/ride.schema";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { post, get } from "@/boot/axios";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/types/vehicle";

export default function CreateRideDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRideDto>({
    resolver: zodResolver(CreateRideSchema),
  });

  const [rideDay, setRideDay] = useState("");
  const [rideHour, setRideHour] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: vehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await get("/vehicle/driver");
      return response.data as Vehicle[];
    },
  });

  const selectedVehicleId = watch("vehicle_id");
  const selectedVehicle = vehicles?.find((v) => v.id === selectedVehicleId);

  function formatDate(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 5);
  }

  function formatHour(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{2})/, "$1:$2")
      .slice(0, 5);
  }
  function convertToISO(dateStr: string, timeStr: string) {
    const currentYear = new Date().getFullYear();
    const [day, month] = dateStr.split("/").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    return new Date(currentYear, month - 1, day, hour, minute).toISOString();
  }

  const handleRideDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "day" | "hour"
  ) => {
    if (type === "day") {
      setRideDay(formatDate(e.target.value));
    } else {
      setRideHour(formatHour(e.target.value));
    }
  };

  const onSubmit = async (data: CreateRideDto) => {
    setLoading(true);
    try {
      data.ride_date = convertToISO(rideDay, rideHour);
      await post("/ride", data);
      toast("Ride created successfully");
      setOpen(false);
    } catch (error) {
      toast("Failed to create ride", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publique uma Carona</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Origem</Label>
            <Input {...register("origin")} placeholder="Enter origin..." />
            {errors.origin && (
              <p className="text-red-500 text-sm">{errors.origin.message}</p>
            )}
          </div>

          <div>
            <Label>Destino</Label>
            <Input
              {...register("destination")}
              placeholder="Enter destination..."
            />
            {errors.destination && (
              <p className="text-red-500 text-sm">
                {errors.destination.message}
              </p>
            )}
          </div>

          <div>
            <Label>Data</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="DD/MM"
                value={rideDay}
                maxLength={5}
                onChange={(e) => handleRideDateChange(e, "day")}
              />
              <Input
                type="text"
                placeholder="HH:MM"
                value={rideHour}
                maxLength={5}
                onChange={(e) => handleRideDateChange(e, "hour")}
              />
            </div>
            {errors.ride_date && (
              <p className="text-red-500 text-sm">{errors.ride_date.message}</p>
            )}
          </div>

          <div>
            <Label>Número de vagas</Label>
            <Input
              type="number"
              {...register("number_of_seats", { valueAsNumber: true })}
              placeholder="Enter number of seats..."
            />
            {errors.number_of_seats && (
              <p className="text-red-500 text-sm">
                {errors.number_of_seats.message}
              </p>
            )}
          </div>

          <div>
            <Label>Preço $</Label>
            <Input
              type="number"
              {...register("ride_price", { valueAsNumber: true })}
              placeholder="Enter price..."
            />
            {errors.ride_price && (
              <p className="text-red-500 text-sm">
                {errors.ride_price.message}
              </p>
            )}
          </div>

          <div>
            <Label>Veículo</Label>
            <Select
              value={selectedVehicleId}
              onValueChange={(value) => setValue("vehicle_id", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vehicle">
                  {selectedVehicle
                    ? `${selectedVehicle.brand}  ${selectedVehicle.model}`
                    : "Select a vehicle"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((vehicle) => (
                  <SelectItem value={vehicle.id} key={vehicle.id}>
                    {vehicle.brand} {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_id && (
              <p className="text-red-500 text-sm">
                {errors.vehicle_id.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Ride"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
