import { cnhCategory } from "@prisma/client";

export class createCnhDTO {
  serial: string;
  category: cnhCategory[];
  expiration_date: Date;
  emission_date: Date;
  issued_by: string;
}
