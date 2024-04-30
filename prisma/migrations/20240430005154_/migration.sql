/*
  Warnings:

  - You are about to drop the `BillNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillNotification" DROP CONSTRAINT "BillNotification_billId_fkey";

-- DropForeignKey
ALTER TABLE "BillNotification" DROP CONSTRAINT "BillNotification_notificationId_fkey";

-- DropTable
DROP TABLE "BillNotification";

-- CreateTable
CREATE TABLE "_BillNotification" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BillNotification_AB_unique" ON "_BillNotification"("A", "B");

-- CreateIndex
CREATE INDEX "_BillNotification_B_index" ON "_BillNotification"("B");

-- AddForeignKey
ALTER TABLE "_BillNotification" ADD CONSTRAINT "_BillNotification_A_fkey" FOREIGN KEY ("A") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillNotification" ADD CONSTRAINT "_BillNotification_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
