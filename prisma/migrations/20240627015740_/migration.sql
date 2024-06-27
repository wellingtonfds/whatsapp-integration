/*
  Warnings:

  - You are about to drop the column `status` on the `Bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "status" TEXT;
