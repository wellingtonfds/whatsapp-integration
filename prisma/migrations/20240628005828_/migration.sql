-- CreateEnum
CREATE TYPE "BillStatusType" AS ENUM ('Pendente', 'Cancelado', 'Pago');

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "status" "BillStatusType" NOT NULL DEFAULT 'Pendente';
