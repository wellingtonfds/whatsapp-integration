/*
  Warnings:

  - The values [MonthlyFee,MembershipFee] on the enum `BillType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BillType_new" AS ENUM ('Cooperativa', 'Mensalidade');
ALTER TABLE "Bill" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Bill" ALTER COLUMN "type" TYPE "BillType_new" USING ("type"::text::"BillType_new");
ALTER TYPE "BillType" RENAME TO "BillType_old";
ALTER TYPE "BillType_new" RENAME TO "BillType";
DROP TYPE "BillType_old";
ALTER TABLE "Bill" ALTER COLUMN "type" SET DEFAULT 'Mensalidade';
COMMIT;

-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "type" SET DEFAULT 'Mensalidade';
