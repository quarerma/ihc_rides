/*
  Warnings:

  - You are about to drop the column `passenger_id` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `ride_status` on the `Ride` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_passenger_id_fkey";

-- DropIndex
DROP INDEX "Ride_passenger_id_idx";

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "passenger_id",
DROP COLUMN "ride_status";
