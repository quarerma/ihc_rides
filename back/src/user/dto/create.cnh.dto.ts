import { cnhCategory } from "@prisma/client";

export class createCnh {
  serial: string;
  category: cnhCategory[];
  expiration_date: Date;
  emission_date: Date;
  issued_by: string;
}
