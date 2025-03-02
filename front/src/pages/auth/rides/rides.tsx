import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CarIcon, UserIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import CreateRideDialog from "../account/components/create-ride-dialog";
import SearchRideDrawer from "./components/search-ride";
import { useUserSession } from "@/hooks/session";

const mockRides = [
  {
    id: "1",
    driver: { first_name: "Carlos", last_name: "Silva" },
    vehicle: { brand: "Toyota", model: "Corolla" },
    origin: "Centro",
    destination: "Independência",
    ride_date: "2024-03-05T14:00:00Z",
    number_of_seats: 3,
    ride_price: "15.00",
  },
  {
    id: "2",
    driver: { first_name: "Ana", last_name: "Souza" },
    vehicle: { brand: "Honda", model: "Civic" },
    origin: "Centro",
    destination: "Portão Norte",
    ride_date: "2024-03-05T14:30:00Z",
    number_of_seats: 2,
    ride_price: "12.00",
  },
];

export default function Rides() {
  const [open, setOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [counterOffer, setCounterOffer] = useState("");
  const [passengers, setPassengers] = useState(1);
  const { user } = useUserSession();

  const handleAcceptRide = (ride) => {
    setSelectedRide(ride);
    setPassengers(1);
    setCounterOffer(ride.ride_price);
    setOpen(true);
  };

  return (
    <div className="mt-5 flex flex-col space-y-2">
      <header className="flex items-center space-x-2">
        <CarIcon size={32} />
        <h1 className="text-bold text-2xl">Caronas</h1>
      </header>
      <CreateRideDialog open={open} setOpen={setOpen} />
      <SearchRideDrawer />
      {user?.role === "DRIVER" && (
        <div className="w-full">
          <Button className="w-full bg-blue-500">+ Publicar Nova Carona</Button>
        </div>
      )}

      {/* <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-xl">
        Busque Caronas para exbir aqui!
      </h1> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {mockRides.map((ride) => (
          <Card key={ride.id} className="shadow-lg">
            <CardHeader className="flex flex-row items-center space-x-2">
              <CarIcon size={18} />
              <CardTitle className="text-sm">
                {ride.vehicle.brand} {ride.vehicle.model}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-xs">
                <UserIcon size={14} />
                <span>
                  {ride.driver.first_name} {ride.driver.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs">
                <MapPinIcon size={14} />
                <span>
                  {ride.origin} → {ride.destination}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs">
                <CalendarIcon size={14} />
                <span>{new Date(ride.ride_date).toLocaleString()}</span>
              </div>
              <div className="mt-2 font-semibold text-sm">
                Assentos: {ride.number_of_seats} | R$ {ride.ride_price}
              </div>
              <Button
                onClick={() => handleAcceptRide(ride)}
                className="mt-3 w-full text-xs"
              >
                Aceitar Carona
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Carona</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <label className="text-xs">Número de Pessoas:</label>
            <Input
              type="number"
              min="1"
              max={selectedRide?.number_of_seats}
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
            <label className="text-xs">Contra Proposta (R$):</label>
            <Input
              type="number"
              min="1"
              value={counterOffer}
              onChange={(e) => setCounterOffer(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
