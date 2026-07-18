-- CreateEnum
CREATE TYPE "MatchSource" AS ENUM ('LIKE_MUTUEL', 'MESSAGE_DIRECT');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "source" "MatchSource" NOT NULL DEFAULT 'LIKE_MUTUEL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOpenToDirectMessages" BOOLEAN NOT NULL DEFAULT false;
