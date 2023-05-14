import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense, Prisma } from '@prisma/client'
import { PrismaRelations } from 'src/prisma/relations.service';
import { MonthsService } from '../months/months.service';
import { ExpensesCalculatorService } from 'src/months/expenseMonthCalculator.service';

@Controller('profile/:profileId/expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService, 
    private relation: PrismaRelations,
    private monthService: MonthsService,
    private expensesCalcService: ExpensesCalculatorService
  ) {}

  @Post('/')
  async create(@Body() createExpense: Expense, @Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)

    const {id: monthId} = await this.monthService.createMonth(profileIdNumber)

    const expenseCreation = await this.expensesService.createExpense(createExpense); 
    
    await this.relation.addExpenseToActualMonth(expenseCreation, profileIdNumber, monthId)

    const expenses = await this.expensesService.findAll(profileIdNumber)

    await this.expensesCalcService.updateMonthRepository(expenses, monthId)

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
    const profileIdNumber = Number(profileId)

    const expense = await this.expensesService.findOne(idNumber, profileIdNumber) 

    return expense || 'Este Expense Não Existe'
  }

  @Put('/:id')
  async update(@Param('profileId') profileId: string, @Param('id') id: string, @Body() expenseUpdate: Prisma.ExpenseUpdateInput) {
    const idNumber = Number(id)
    const profileIdNumber = Number(profileId)

    const expense = await this.expensesService.findOne(idNumber, profileIdNumber) 

    if (!expense) return 'Esse Expense Não Existe'
    
    const expenseUpdated = await this.expensesService.update(idNumber, expenseUpdate) 

    const {id: monthId} = await this.monthService.createMonth(profileIdNumber)

    const expenses = await this.expensesService.findAll(profileIdNumber)

    await this.expensesCalcService.updateMonthRepository(expenses, monthId)

    return expenseUpdated;
  }

  @Delete('/:id')
  async remove(@Param('profileId') profileId: string, @Param('id') id: string) {
    const idNumber = Number(id)
    const profileIdNumber = Number(profileId)

    const expense = await this.expensesService.findOne(idNumber, profileIdNumber) 

    if (!expense) return 'Esse Expense Não Existe'

    const {id: monthId} = await this.monthService.createMonth(profileIdNumber)
    
    await this.expensesService.remove(idNumber) 

    const expenses = await this.expensesService.findAll(profileIdNumber)

    if (!expenses.length) {
      await this.monthService.deleteMonth(monthId)
    } else {
      await this.expensesCalcService.updateMonthRepository(expenses, monthId)
    }

    return `${id} foi excluido`;
  }
}
