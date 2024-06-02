-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "sicoobLoteCobvId" BIGINT;

-- CreateTable
CREATE TABLE "SicoobLoteCobv" (
    "id" BIGSERIAL NOT NULL,
    "expiredData" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "validateAfterExpiredData" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SicoobLoteCobv_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_sicoobLoteCobvId_fkey" FOREIGN KEY ("sicoobLoteCobvId") REFERENCES "SicoobLoteCobv"("id") ON DELETE SET NULL ON UPDATE CASCADE;
