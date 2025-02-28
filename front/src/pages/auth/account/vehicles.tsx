import { get } from "@/boot/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Car, Plus, Bike } from "lucide-react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading_blue_car.json";
import { useState } from "react";
import CreateVehicleDialog from "./components/create-vehicle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/utils/formatter";

export default function Vehicles() {
  const {
    data: vehicles,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await get("/vehicle/driver");
      console.log(response.data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return response.data as Vehicle[];
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <div className="py-5 max-w-lg space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/account"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Vehicles</h1>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <Lottie
            animationData={loadingAnimation}
            className="w-full h-full top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      ) : vehicles?.length === 0 ? (
        // No Vehicles Registered
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-500">You have no vehicles registered.</p>
          <Button
            onClick={() => setOpen(true)}
            className="bg-card text-black w-full border border-border shadow-lg"
          >
            <Plus /> Register Vehicle
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {vehicles?.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader className="flex text-lg  font-semibold">
                  <div className="flex items-center">
                    {(() => {
                      switch (vehicle.type) {
                        case "MOTORCYCLE":
                          return (
                            <Bike className="w-5 h-5 mr-2 text-gray-600" />
                          );
                        case "CAR":
                          return <Car className="w-5 h-5 mr-2 text-gray-600" />;
                        default:
                          return <Car className="w-5 h-5 mr-2 text-gray-600" />;
                      }
                    })()}
                    <h1>
                      {vehicle.brand} {vehicle.model}
                    </h1>
                  </div>
                </CardHeader>
                <CardContent className="text-gray-700 text-base space-y-2">
                  <div className="flex space-x-5 justify-between  items-center h-5">
                    <Label>Cor: </Label>
                    <Label>{vehicle.color}</Label>
                  </div>
                  <div className="flex justify-between items-center h-5">
                    <Label>Placa: </Label>
                    <Label>{vehicle.plate}</Label>
                  </div>
                  <div className="flex justify-between items-center h-5">
                    <Label>Ano de Fabricação: </Label>
                    <Label>{vehicle.fabrication_year}</Label>
                  </div>
                  <div className="flex justify-between items-center h-5">
                    <Label>Data Emissão Crlv: </Label>
                    <Label>{formatDate(vehicle.Crlv.emission_date)}</Label>
                  </div>
                  <div className="flex justify-between items-center h-5">
                    <Label>Data Expiração Crlv: </Label>
                    <Label>{formatDate(vehicle.Crlv.expiration_date)}</Label>
                  </div>
                  <div className="flex justify-between items-center h-5">
                    <Label>Instituição emitora: </Label>
                    <Label>{vehicle.Crlv.issued_by}</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Register New Vehicle Button */}
          <Button
            onClick={() => setOpen(true)}
            className="bg-card text-black w-full border border-border shadow-lg"
          >
            <Plus /> Register New Vehicle
          </Button>
        </>
      )}

      {/* Create Vehicle Dialog */}
      <CreateVehicleDialog open={open} setOpen={setOpen} refetch={refetch} />
    </div>
  );
}
