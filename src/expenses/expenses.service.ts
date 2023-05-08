import { Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from '../months/months.service';

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

  findAll() {
    return this.prisma.expense.findMany();
  }

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
