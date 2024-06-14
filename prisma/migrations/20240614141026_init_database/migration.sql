-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TEMPLATE', 'TEXT');

-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('MonthlyFee', 'MembershipFee');

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" JSONB NOT NULL,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "sent" TIMESTAMP(3),
    "contactId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" BIGSERIAL NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "paymentIdList" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "description" TEXT,
    "pixTaxId" TEXT NOT NULL,
    "pixKey" TEXT,
    "pixQrCode" TEXT,
    "type" "BillType" NOT NULL DEFAULT 'MembershipFee',
    "pixCreatedAt" TIMESTAMP(3),
    "paymentValue" DECIMAL(65,30),
    "pixExpiration" TIMESTAMP(3),
    "crmUpdate" TIMESTAMP(3),
    "contactId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" BIGSERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "CPF" TEXT,
    "name" TEXT NOT NULL,
    "crmId" INTEGER,
    "mainCrmId" INTEGER,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
