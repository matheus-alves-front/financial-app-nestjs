import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense } from '@prisma/client'
import { PrismaRelations } from 'src/prisma/relations.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService, private relation: PrismaRelations) {}

  @Post()
  async create(@Body() createExpense: Expense) {
    const expenseCreation = await this.expensesService.createExpense(createExpense); 
    
    await this.relation.addExpenseToActualMonth(expenseCreation)

    // console.log(relation)
    return expenseCreation
  }

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, ) {
    return this.expensesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
