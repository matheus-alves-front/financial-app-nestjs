import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense, Prisma } from '@prisma/client'
import { PrismaRelations } from 'src/prisma/relations.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService, private relation: PrismaRelations) {}

  @Post()
  async create(@Body() createExpense: Expense) {
    const expenseCreation = await this.expensesService.createExpense(createExpense); 
    
    await this.relation.addExpenseToActualMonth(expenseCreation)

    return expenseCreation
  }

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const idNumber = Number(id)

    const expense = await this.expensesService.findOne(idNumber) 

    return expense || 'Este Expense Não Existe'
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() expenseUpdated: Prisma.ExpenseUpdateInput) {
    const idNumber = Number(id)

    return await this.expensesService.update(idNumber, expenseUpdated);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
