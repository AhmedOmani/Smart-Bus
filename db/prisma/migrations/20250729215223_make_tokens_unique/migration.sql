/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `black_listed_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "black_listed_tokens_token_key" ON "black_listed_tokens"("token");
