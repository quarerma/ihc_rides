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
import { Cnh, cnhSchema } from "@/schema/cnh.schema";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { post } from "@/boot/axios";

export default function BecomeDriverDialog({
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
    formState: { errors },
  } = useForm<Cnh>({
    resolver: zodResolver(cnhSchema),
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [emissionDate, setEmissionDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      setValue("category", newCategories as string[]);
      return newCategories;
    });
  };

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

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "expiration" | "emission"
  ) => {
    const formattedDate = formatDate(e.target.value);
    if (type === "expiration") {
      setExpirationDate(formattedDate);
      setValue("expiration_date", formattedDate, { shouldValidate: true });
    } else {
      setEmissionDate(formattedDate);
      setValue("emission_date", formattedDate, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: Cnh) => {
    setLoading(true);
    try {
      data.expiration_date = convertToISO(expirationDate);
      data.emission_date = convertToISO(emissionDate);
      console.log("CNH Data:", data);

      const response = await post("users/register-cnh", data);
      console.log("Response:", response);

      toast("Driver registration submitted successfully");
      setOpen(false);
    } catch (error) {
      toast("Failed to submit driver registration", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%]">
        <DialogHeader>
          <DialogTitle>Become a Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Serial</Label>
            <Input
              {...register("serial")}
              placeholder="Type the serial number..."
            />
            {errors.serial?.message && (
              <p className="text-red-500 text-sm">{errors.serial.message}</p>
            )}
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full" variant="outline">
                  Select Categories
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-2">
                  {["A", "B", "C", "D", "E"].map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>
          <div>
            <Label>Emission Date</Label>
            <Input
              type="text"
              placeholder="DD/MM/YYYY"
              value={emissionDate}
              maxLength={10}
              onChange={(e) => handleDateChange(e, "emission")}
            />
            {errors.emission_date && (
              <p className="text-red-500">{errors.emission_date.message}</p>
            )}
          </div>
          <div>
            <Label>Expiration Date</Label>
            <Input
              type="text"
              placeholder="DD/MM/YYYY"
              value={expirationDate}
              maxLength={10}
              onChange={(e) => handleDateChange(e, "expiration")}
            />
            {errors.expiration_date && (
              <p className="text-red-500">{errors.expiration_date.message}</p>
            )}
          </div>

          <div>
            <Label>Issued By</Label>
            <Input {...register("issued_by")} />
            {errors.issued_by && (
              <p className="text-red-500">{errors.issued_by.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
