import { Injectable } from '@nestjs/common';
import { Expense, MonthExpense } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaRelations {
  constructor(private prisma: PrismaService) {}

  async addExpenseToActualMonth(expenseCreated: Expense, profileId: number, monthId: number): Promise<MonthExpense> {
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
