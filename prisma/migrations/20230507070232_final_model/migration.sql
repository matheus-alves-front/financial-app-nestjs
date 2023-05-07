-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isFixed" BOOLEAN NOT NULL,
    "isEntry" BOOLEAN NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "Expense_id_fkey" FOREIGN KEY ("id") REFERENCES "MonthResume" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("id", "isEntry", "isFixed", "name", "value") SELECT "id", "isEntry", "isFixed", "name", "value" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
