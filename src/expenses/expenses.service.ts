import { Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async createExpense(expenseBody: Prisma.ExpenseCreateInput): Promise<Expense> {
    return this.prisma.expense.create({
      data: expenseBody,
    });
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
