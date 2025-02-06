-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CANCELED', 'FINISHED');

-- CreateEnum
CREATE TYPE "cnhCategory" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PASSENGER', 'DRIVER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "user_firstname" TEXT NOT NULL,
    "user_lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'PASSENGER',
    "credit" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rates" (
    "id" SERIAL NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "source_user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,

    CONSTRAINT "Rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Residence" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,

    CONSTRAINT "Residence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "ride_date" TIMESTAMP(3) NOT NULL,
    "number_of_seats" INTEGER NOT NULL,
    "ride_price" DECIMAL(65,30) NOT NULL,
    "ride_status" "RideStatus" NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "user_id" TEXT NOT NULL,
    "cnh_serial" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CNH" (
    "serial" TEXT NOT NULL,
    "category" "cnhCategory"[],
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "emission_date" TIMESTAMP(3) NOT NULL,
    "issued_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "category" "cnhCategory" NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "fabrication_year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crlv" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "emission_date" TIMESTAMP(3) NOT NULL,
    "issued_by" TEXT NOT NULL,

    CONSTRAINT "Crlv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Residence_user_id_idx" ON "Residence"("user_id");

-- CreateIndex
CREATE INDEX "Ride_driver_id_idx" ON "Ride"("driver_id");

-- CreateIndex
CREATE INDEX "Ride_passenger_id_idx" ON "Ride"("passenger_id");

-- CreateIndex
CREATE INDEX "Ride_ride_date_idx" ON "Ride"("ride_date");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_user_id_key" ON "Driver"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_cnh_serial_key" ON "Driver"("cnh_serial");

-- CreateIndex
CREATE INDEX "Driver_cnh_serial_idx" ON "Driver"("cnh_serial");

-- CreateIndex
CREATE UNIQUE INDEX "CNH_serial_key" ON "CNH"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_driver_id_idx" ON "Vehicle"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "Crlv_vehicle_id_key" ON "Crlv"("vehicle_id");

-- AddForeignKey
ALTER TABLE "Rates" ADD CONSTRAINT "Rates_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rates" ADD CONSTRAINT "Rates_source_user_id_fkey" FOREIGN KEY ("source_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_cnh_serial_fkey" FOREIGN KEY ("cnh_serial") REFERENCES "CNH"("serial") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crlv" ADD CONSTRAINT "Crlv_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
