import { get } from "@/boot/axios";
import { Card } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading_blue_car.json";
import { useState } from "react";
import CreateVehicleDialog from "./components/create-vehicle";
import { Button } from "@/components/ui/button";

export default function Vehicles() {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await get("/vehicle/driver");
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
            className="bg-blue-500 text-white"
          >
            Register Vehicle
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {vehicles?.map((vehicle) => (
              <Card key={vehicle.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      {vehicle.brand} {vehicle.model}
                    </h2>
                    <p className="text-sm text-gray-500">{vehicle.plate}</p>
                  </div>
                  <Link
                    to={`/account/vehicles/${vehicle.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    See more
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Register New Vehicle Button */}
          <Card className="p-4 flex justify-center">
            <Button
              onClick={() => setOpen(true)}
              className="bg-blue-500 text-white"
            >
              Register New Vehicle
            </Button>
          </Card>
        </>
      )}

      {/* Create Vehicle Dialog */}
      <CreateVehicleDialog open={open} setOpen={setOpen} />
    </div>
  );
}
