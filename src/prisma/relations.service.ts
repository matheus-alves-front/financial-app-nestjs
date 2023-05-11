import { Injectable } from '@nestjs/common';
import { Expense, MonthExpense } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaRelations {
  constructor(private prisma: PrismaService) {}

  async addExpenseToActualMonth(expenseCreated: Expense): Promise<MonthExpense> {
    const {id: monthId} = await this.prisma.month.findFirst({
      orderBy: {
        id: 'desc'
      }
    })

    const {id: expenseId} = expenseCreated

    const newMonthExpense = await this.prisma.monthExpense.create({
      data: {
        expenseId,
        monthId,
      },
    });

    return newMonthExpense
  }

  // async removeExpenseToMonth(expenseCreated: Expense): Promise<MonthExpense> {
  //   const {id: monthId} = await this.prisma.month.findFirst({
  //     orderBy: {
  //       id: 'desc'
  //     }
  //   })

  //   const {id: expenseId} = expenseCreated

  //   const newMonthExpense = await this.prisma.monthExpense.create({
  //     data: {
  //       expense: { connect: { id: expenseId } },
  //       month: { connect: { id: monthId } },
  //     },
  //   });

  //   return newMonthExpense
  // }
}
