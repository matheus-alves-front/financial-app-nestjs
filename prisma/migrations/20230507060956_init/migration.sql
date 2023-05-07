-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isFixed" BOOLEAN NOT NULL,
    "isEntry" BOOLEAN NOT NULL,
    "value" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "MonthResume" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "totalExpenses" REAL NOT NULL,
    "totalAmount" REAL NOT NULL
);
