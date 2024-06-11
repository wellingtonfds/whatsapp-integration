-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('MonthlyFee', 'MembershipFee');

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "type" "BillType" NOT NULL DEFAULT 'MembershipFee';
