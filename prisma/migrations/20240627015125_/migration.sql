/*
  Warnings:

  - Added the required column `status` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "status" TEXT NOT NULL;
