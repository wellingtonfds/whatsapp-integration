/*
  Warnings:

  - Added the required column `address` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
