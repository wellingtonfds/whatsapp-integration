/*
  Warnings:

  - The primary key for the `BillNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BillNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillNotification" DROP CONSTRAINT "BillNotification_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "BillNotification_pkey" PRIMARY KEY ("billId", "notificationId");
