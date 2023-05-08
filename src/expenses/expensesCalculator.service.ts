import { Injectable, Param } from "@nestjs/common";
import { Expense } from "@prisma/client";

@Injectable()
export class ExpensesCalculatorService {
  calcTotalExpenses(@Param() expenses: Expense[]) {
    let totalExpenses = 0
    let totalFixedExpenses = 0

    for(let expense of expenses) {
      if (!expense.isEntry) {
        totalExpenses = totalExpenses + expense.value

        if (expense.isFixed) totalFixedExpenses = totalFixedExpenses + expense.value
      }
    }

    return {
      totalExpenses,
      totalFixedExpenses
    }
  }

  calcTotalEntryExpenses(@Param() expenses: Expense[]) {
    let totalEntryExpenses = 0
    let totalFixedEntryExpenses = 0
    
    for(let expense of expenses) {
      if (expense.isEntry) {
        totalEntryExpenses = totalEntryExpenses + expense.value

        if (expense.isFixed) totalFixedEntryExpenses = totalFixedEntryExpenses + expense.value
      }
    }

    return {
      totalEntryExpenses,
      totalFixedEntryExpenses
    }
  }


  calcTotalAmountLeft(@Param() expenses: Expense[]) {
    let totalAmountLeft = 0

    for(let expense of expenses) {
      if (expense.isEntry) totalAmountLeft = totalAmountLeft + expense.value
      else totalAmountLeft = totalAmountLeft - expense.value
    }

    return totalAmountLeft
  }

    
}