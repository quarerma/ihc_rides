export type Vehicle = {
  id: string;
  type: "CAR" | "MOTORCYCLE" | "VAN";
  brand: string;
  model: string;
  fabrication_year: number;
  color: string;
  plate: string;
  driver_id: string;
  crlv: Crlv;
};

export type Crlv = {
  id: string;
  expiration_date: Date;
  emission_date: Date;
  issued_by: string;
};
