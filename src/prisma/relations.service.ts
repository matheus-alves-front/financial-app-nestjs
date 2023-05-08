import { Injectable } from '@nestjs/common';
import { Expense, MonthExpense, Prisma } from '@prisma/client';
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


  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
