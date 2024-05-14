/*
  Warnings:

  - You are about to drop the column `crmId` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `_BillNotification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactId` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BillNotification" DROP CONSTRAINT "_BillNotification_A_fkey";

-- DropForeignKey
ALTER TABLE "_BillNotification" DROP CONSTRAINT "_BillNotification_B_fkey";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "crmId",
ADD COLUMN     "contactId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "to",
ADD COLUMN     "contactId" BIGINT NOT NULL;

-- DropTable
DROP TABLE "_BillNotification";

-- CreateTable
CREATE TABLE "Contact" (
    "id" BIGSERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "name" TEXT,
    "crmId" INTEGER,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
