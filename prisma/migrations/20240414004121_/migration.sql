-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TEMPLATE', 'TEXT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" JSONB NOT NULL,
    "to" TEXT NOT NULL,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "sent" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
