/*
  Warnings:

  - Added the required column `vehicle_id` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "vehicle_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Ride_vehicle_id_idx" ON "Ride"("vehicle_id");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
