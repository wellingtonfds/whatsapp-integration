-- CreateTable
CREATE TABLE "Bill" (
    "id" BIGSERIAL NOT NULL,
    "crmId" INTEGER NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "paymentIdList" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillNotification" (
    "id" BIGSERIAL NOT NULL,
    "billId" BIGINT NOT NULL,
    "notificationId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillNotification" ADD CONSTRAINT "BillNotification_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillNotification" ADD CONSTRAINT "BillNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
