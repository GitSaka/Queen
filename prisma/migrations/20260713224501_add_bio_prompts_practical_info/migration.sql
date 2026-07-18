-- CreateEnum
CREATE TYPE "SmokingHabit" AS ENUM ('NE_FUME_PAS', 'FUMEUR_OCCASIONNEL', 'FUMEUR_REGULIER');

-- CreateEnum
CREATE TYPE "DrinkingHabit" AS ENUM ('NE_BOIT_PAS', 'BUVEUR_OCCASIONNEL', 'BUVEUR_REGULIER');

-- CreateEnum
CREATE TYPE "ChildrenStatus" AS ENUM ('PAS_D_ENFANTS', 'A_DES_ENFANTS', 'PREFERE_NE_PAS_DIRE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "childrenStatus" "ChildrenStatus",
ADD COLUMN     "drinkingHabit" "DrinkingHabit",
ADD COLUMN     "lookingFor" "RelationshipGoal",
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "smokingHabit" "SmokingHabit";

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPromptAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPromptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_question_key" ON "Prompt"("question");

-- CreateIndex
CREATE INDEX "UserPromptAnswer_userId_idx" ON "UserPromptAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPromptAnswer_userId_promptId_key" ON "UserPromptAnswer"("userId", "promptId");

-- AddForeignKey
ALTER TABLE "UserPromptAnswer" ADD CONSTRAINT "UserPromptAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPromptAnswer" ADD CONSTRAINT "UserPromptAnswer_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
