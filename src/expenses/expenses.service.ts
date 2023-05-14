import { Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService
  ) {}

  async createExpense(expenseBody: Prisma.ExpenseCreateInput): Promise<Expense> {
    const {
      name,
      isEntry,
      isFixed,
      value
    } = expenseBody

    const createExpense = await this.prisma.expense.create({
      data: {
        name,
        isEntry,
        isFixed,
        value,
      },
    });

    return createExpense
  }

  async findAll(profileId: number) {
    const monthExpenses = await this.prisma.monthExpense.findMany({
      where: {
        profileId: profileId,
      },
      include: {
        expense: true
      },
    });
  
    const expenses = monthExpenses.map(({ expense }) => expense);

    return expenses;
  }

  async findOne(id: number, profileId: number) {
    const monthExpenses = await this.prisma.monthExpense.findMany({
      where: {
        profileId: profileId,
      },
      include: {
        expense: true
      },
    });

    const expenseId = monthExpenses.find(({expense}) => expense.id === id);

    return expenseId?.expense || false;
  }

  async update(id: number, updateExpense: Prisma.ExpenseUpdateInput) {
    const {
      name,
      value,
      isEntry,
      isFixed
    } = await this.prisma.expense.findUnique({
      where: {
        id
      }
    })

    const expenseUpdated = await this.prisma.expense.update({
      where: {
        id
      },
      data: {
        name: updateExpense.name || name,
        value: updateExpense.value || value,
        isEntry: updateExpense.isEntry || isEntry,
        isFixed: updateExpense.isFixed || isFixed
      }
    });

    return expenseUpdated
  }

  async remove(expenseId: number) {
    const expense = await this.prisma.expense.findUnique({ where: { id: expenseId } })

    if (!expense) {
      throw new Error(`Expense com o ID ${expenseId} não encontrado.`)
    }

    // Encontra a relação MonthExpense associada ao registro de expense
    const monthExpense = await this.prisma.monthExpense.findUnique({
      where: {
        expenseId: expenseId
      }
    })

    if (monthExpense) {
      await this.prisma.monthExpense.delete({ where: { id: monthExpense.id } })
    }

    await this.prisma.expense.delete({ where: { id: expenseId } })

    return `${expense.name} foi Excluído`;
  }
}
