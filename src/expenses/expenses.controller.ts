import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense, Prisma } from '@prisma/client'
import { PrismaRelations } from 'src/prisma/relations.service';
import { MonthsService } from '../months/months.service';

@Controller('profile/:profileId/expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService, 
    private relation: PrismaRelations,
    private monthService: MonthsService
  ) {}

  @Post('/')
  async create(@Body() createExpense: Expense, @Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)

    const {id: monthId} = await this.monthService.createMonth(profileIdNumber)

    const expenseCreation = await this.expensesService.createExpense(createExpense); 
    
    await this.relation.addExpenseToActualMonth(expenseCreation, profileIdNumber, monthId)

    return expenseCreation
  }

  @Get()
  findAll(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)

    return this.expensesService.findAll(profileIdNumber);
  }

  @Get('/:id')
  async findOne(@Param('profileId') profileId: string, @Param('id') id: string) {
    const idNumber = Number(id)

    const expense = await this.expensesService.findOne(idNumber) 

    return expense || 'Este Expense Não Existe'
  }

  @Put('/:id')
  async update(@Param('profileId') profileId: string, @Param('id') id: string, @Body() expenseUpdated: Prisma.ExpenseUpdateInput) {
    const idNumber = Number(id)

    return await this.expensesService.update(idNumber, expenseUpdated);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    const idNumber = Number(id)

    return this.expensesService.remove(idNumber);
  }
}
