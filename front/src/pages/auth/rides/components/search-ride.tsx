import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchRideDrawer() {
  const [open, setOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState("car");

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="relative w-full max-w-md">
          <Input placeholder="Buscar Carona" className="pl-10" readOnly />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Busque uma carona!</h2>
        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de veículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Carro</SelectItem>
            <SelectItem value="motorcycle">Moto</SelectItem>
            <SelectItem value="van">Van</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Dia (DD/MM)</Label>
            <Input type="text" placeholder="DD/MM" />
          </div>
          <div>
            <Label>Hora (HH:MM)</Label>
            <Input type="text" placeholder="HH:MM" />
          </div>
        </div>
        <div>
          <Label>Origem</Label>
          <Input type="text" placeholder="Enter origin" />
        </div>
        <div>
          <Label>Destino</Label>
          <Input type="text" placeholder="Enter destiny" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Preço Máximo ($)</Label>
            <Input type="number" placeholder="Max cost" />
          </div>
          <div>
            <Label>Assentos Mínimos</Label>
            <Input type="number" placeholder="Min seats" />
          </div>
        </div>
        <Button className="w-full">Search</Button>
      </DrawerContent>
    </Drawer>
  );
}
