-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isEntry" BOOLEAN NOT NULL,
    "isFixed" BOOLEAN NOT NULL,
    "expiresInMonth" INTEGER NOT NULL,
    "expiresInYear" INTEGER NOT NULL,
    "value" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Month" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalExpenses" REAL NOT NULL,
    "totalFixedExpenses" REAL NOT NULL,
    "totalEntryExpenses" REAL NOT NULL,
    "totalFixedEntryExpenses" REAL NOT NULL,
    "totalAmountLeft" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "MonthExpense" (
    "expenseId" INTEGER NOT NULL,
    "monthId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    PRIMARY KEY ("expenseId", "monthId"),
    CONSTRAINT "MonthExpense_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MonthExpense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MonthExpense_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryExpense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expenseId" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "CategoryExpense_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CategoryExpense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoryExpense_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_name_key" ON "Profile"("name");

-- CreateIndex
CREATE INDEX "MonthExpense_expenseId_idx" ON "MonthExpense"("expenseId");

-- CreateIndex
CREATE INDEX "MonthExpense_monthId_idx" ON "MonthExpense"("monthId");

-- CreateIndex
CREATE INDEX "MonthExpense_profileId_idx" ON "MonthExpense"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryExpense_expenseId_key" ON "CategoryExpense"("expenseId");

-- CreateIndex
CREATE INDEX "CategoryExpense_categoryId_idx" ON "CategoryExpense"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryExpense_expenseId_idx" ON "CategoryExpense"("expenseId");

-- CreateIndex
CREATE INDEX "CategoryExpense_profileId_idx" ON "CategoryExpense"("profileId");
