import { Injectable, Param } from "@nestjs/common";
import { Expense } from "@prisma/client";
import { MonthsService } from "./months.service";

@Injectable()
export class ExpensesCalculatorService {
  constructor(
    private monthsService: MonthsService
  ) {}

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

  async updateMonthRepository(@Param() expenses: Expense[]) {
    const {
      totalExpenses, 
      totalFixedExpenses
    } = this.calcTotalExpenses(expenses)

    const {
      totalEntryExpenses, 
      totalFixedEntryExpenses
    } = this.calcTotalEntryExpenses(expenses)

    const totalAmountLeft = this.calcTotalAmountLeft(expenses) 
    
    await this.monthsService.updateTotalExpenses(totalExpenses, totalFixedExpenses)
    await this.monthsService.updateTotalEntryExpenses(totalEntryExpenses, totalFixedEntryExpenses)
    await this.monthsService.updateAmountLeft(totalAmountLeft)
    
    const monthUpdatedData = {
      totalExpenses,
      totalFixedExpenses,
      totalEntryExpenses,
      totalFixedEntryExpenses,
      totalAmountLeft
    }

    return monthUpdatedData
  }
}