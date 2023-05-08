import { Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from '../months/months.service';
import path from 'path';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService, private monthService: MonthsService) {}

  async createExpense(expenseBody: Prisma.ExpenseCreateInput): Promise<Expense> {
    await this.monthService.createMonth()

    const {
      name,
      isEntry,
      isFixed,
      value
    } = expenseBody

    const createExpense = this.prisma.expense.create({
      data: {
        name,
        isEntry,
        isFixed,
        value,
      }
    });

    return createExpense
  }

  async findAll() {
    return await this.prisma.expense.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.expense.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, updatedExpense: Prisma.ExpenseUpdateInput) {
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

    return await this.prisma.expense.update({
      where: {
        id
      },
      data: {
        name: updatedExpense.name || name,
        value: updatedExpense.value || value,
        isEntry: updatedExpense.isEntry || isEntry,
        isFixed: updatedExpense.isFixed || isFixed
      }
    }); 
  }

  async remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
