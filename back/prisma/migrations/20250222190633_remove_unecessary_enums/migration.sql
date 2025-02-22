/*
  Warnings:

  - The `category` column on the `CNH` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CNH" DROP COLUMN "category",
ADD COLUMN     "category" TEXT[];

-- DropEnum
DROP TYPE "cnhCategory";
