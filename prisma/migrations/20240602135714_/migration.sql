/*
  Warnings:

  - Added the required column `dueDate` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `effectiveDate` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "effectiveDate" TIMESTAMP(3) NOT NULL;
