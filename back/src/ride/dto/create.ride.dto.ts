export class CreateRideDto {
  origin: string;
  destination: string;
  ride_date: Date;
  number_of_seats: number;
  ride_price: number;
  vehicle_id: string;
}
