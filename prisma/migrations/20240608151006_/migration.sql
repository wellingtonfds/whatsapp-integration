/*
  Warnings:

  - You are about to drop the column `sicoobLoteCobvId` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the `SicoobLoteCobv` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_sicoobLoteCobvId_fkey";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "sicoobLoteCobvId";

-- DropTable
DROP TABLE "SicoobLoteCobv";
