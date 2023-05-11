import { Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from '../months/months.service';
import { ExpensesCalculatorService } from 'src/months/expenseMonthCalculator.service';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService, 
    private monthService: MonthsService,
    private expensesCalc: ExpensesCalculatorService
  ) {}

  async createExpense(expenseBody: Prisma.ExpenseCreateInput): Promise<Expense> {
    await this.monthService.createMonth()

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
      }
    });

    const expenses = await this.prisma.expense.findMany()

    await this.expensesCalc.updateMonthRepository(expenses)

    return createExpense
  }

  async findAll() {
    await this.monthService.createMonth()

    const expenses = await this.prisma.expense.findMany()
    
    await this.expensesCalc.updateMonthRepository(expenses)

    return expenses;
  }

  async findOne(id: number) {
    return await this.prisma.expense.findUnique({
      where: {
        id
      }
    });
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

    const expenses = await this.prisma.expense.findMany()
    
    await this.expensesCalc.updateMonthRepository(expenses)

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

    const expenses = await this.prisma.expense.findMany()

    await this.expensesCalc.updateMonthRepository(expenses)

    return `${expense.name} foi Excluído`;
  }
}
