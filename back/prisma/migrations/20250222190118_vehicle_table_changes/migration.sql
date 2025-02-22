/*
  Warnings:

  - You are about to drop the column `category` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `type` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'MOTORCYCLE', 'VAN');

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "category",
ADD COLUMN     "type" "VehicleType" NOT NULL;
