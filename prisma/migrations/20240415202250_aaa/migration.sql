/*
  Warnings:

  - You are about to drop the column `categoryName` on the `CategoryExpense` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `CategoryExpense` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoryExpense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expenseId" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "CategoryExpense_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CategoryExpense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoryExpense_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CategoryExpense" ("expenseId", "id", "profileId") SELECT "expenseId", "id", "profileId" FROM "CategoryExpense";
DROP TABLE "CategoryExpense";
ALTER TABLE "new_CategoryExpense" RENAME TO "CategoryExpense";
CREATE UNIQUE INDEX "CategoryExpense_expenseId_key" ON "CategoryExpense"("expenseId");
CREATE INDEX "CategoryExpense_categoryId_idx" ON "CategoryExpense"("categoryId");
CREATE INDEX "CategoryExpense_expenseId_idx" ON "CategoryExpense"("expenseId");
CREATE INDEX "CategoryExpense_profileId_idx" ON "CategoryExpense"("profileId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "MonthExpense_expenseId_idx" ON "MonthExpense"("expenseId");

-- CreateIndex
CREATE INDEX "MonthExpense_monthId_idx" ON "MonthExpense"("monthId");

-- CreateIndex
CREATE INDEX "MonthExpense_profileId_idx" ON "MonthExpense"("profileId");
