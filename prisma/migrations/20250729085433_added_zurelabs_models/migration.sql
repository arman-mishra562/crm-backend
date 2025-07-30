-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('SENT', 'PENDING', 'ACCEPTED', 'PAID', 'REJECTED');

-- CreateTable
CREATE TABLE "ZureClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZureClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZureProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZureProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZureProposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "proposalstatus" "ProposalStatus" NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZureProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZureClient_email_key" ON "ZureClient"("email");

-- AddForeignKey
ALTER TABLE "ZureProject" ADD CONSTRAINT "ZureProject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ZureClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZureProposal" ADD CONSTRAINT "ZureProposal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ZureClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
