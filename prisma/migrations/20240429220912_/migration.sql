/*
  Warnings:

  - Added the required column `pixTaxId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "paymentValue" DECIMAL(65,30),
ADD COLUMN     "pixCreatedAt" TIMESTAMP(3),
ADD COLUMN     "pixExpiration" TIMESTAMP(3),
ADD COLUMN     "pixKey" TEXT,
ADD COLUMN     "pixQrCode" TEXT,
ADD COLUMN     "pixTaxId" TEXT NOT NULL;
