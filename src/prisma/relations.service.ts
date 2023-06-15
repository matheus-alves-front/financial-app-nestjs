import { Injectable } from '@nestjs/common';
import { CategoryExpense, Expense, MonthExpense, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaRelations {
  constructor(private prisma: PrismaService) {}

  async addExpenseToActualMonth(
    expenseCreated: Expense, 
    profileId: number, 
    monthId: number
  ): Promise<MonthExpense> {
    const {id: expenseId} = expenseCreated

    const newMonthExpense = await this.prisma.monthExpense.create({
      data: {
        expenseId,
        monthId,
        profileId
      },
    });

    return newMonthExpense
  }

  async getFixedMonthExpensesToAddNewMonth(
    profileId: number, 
    monthId: number, 
    newMonthId: number,
    actualDate: {
      month: number,
      year: number
    }
  ) {
    const monthExpenses = await this.prisma.monthExpense.findMany({
      where: {
        monthId
      },
      select: {
        expense: true,
        month: true
      },
      distinct: ['expenseId']
    })

    const monthExpensesFixedData = []

    if (monthExpenses.length > 0) {
      for (let i = 0; i < monthExpenses.length; i++) {
        if (
          monthExpenses[i].expense.isFixed &&
          monthExpenses[i].expense.expiresInMonth >= actualDate.month && 
          monthExpenses[i].expense.expiresInYear >= actualDate.year
        ) {
          const expenseId = monthExpenses[i].expense.id
          const monthExpensesFormat = {
            expenseId,
            monthId: newMonthId,
            profileId
          }
  
          monthExpensesFixedData.push(monthExpensesFormat)        
        }
      }
    }

    return monthExpensesFixedData
  }

  async addFixedMonthExpensesToNewMonth(monthExpensesArray: Omit<MonthExpense, 'id'>[]) {
    if (monthExpensesArray.length < 1) {
      return
    }

    const resolveLoopCreationMonthExpense = monthExpensesArray.map(async (monthExpense) => {
      await this.prisma.monthExpense.create({
        data: monthExpense
      });
    });
  
    await Promise.all(resolveLoopCreationMonthExpense);
    return monthExpensesArray
  }

  async addCategoryRelation(profileId: number, categoryName: string, expense?: Expense | null): Promise<CategoryExpense> {
    const newCategoryExpense = await this.prisma.categoryExpense.create({
      data: {
        expenseId: expense ? expense.id : null,
        categoryName,
        profileId
      },
    });

    return newCategoryExpense
  }

  async findMonthIdsByProfile(profileId: number) {
    const monthExpense = await this.prisma.monthExpense.findFirst({
      where: {
        profileId
      },
      orderBy: {
        monthId: 'desc'
      }
    })

    if (monthExpense) {
      return monthExpense.monthId 
    } 

    return false
  }

  async findAllDataFromProfile(profileId: number) {
    const monthExpense = await this.prisma.monthExpense.findMany({
      where: {
        profileId
      },
      orderBy: {
        monthId: 'desc'
      },
      include: {
        expense: true,
        month: true,
        profile: true
      }
    })

    return monthExpense
  }
}
