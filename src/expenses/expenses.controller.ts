import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense, Prisma } from '@prisma/client'
import { PrismaRelations } from 'src/prisma/relations.service';
import { MonthsService } from '../months/months.service';
import { ExpensesCalculatorService } from 'src/months/expenseMonthCalculator.service';
import { ProfileService } from 'src/profile/profile.service';

@Controller('profile/:profileId/expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService, 
    private relation: PrismaRelations,
    private monthService: MonthsService,
    private expensesCalcService: ExpensesCalculatorService,
    private profileService: ProfileService
  ) {}

  @Post('/')
  async create(@Body() createExpense: Partial<Expense> & { category: string }, @Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)

    const profileExists = await this.profileService.findOne(profileIdNumber)

    if (!profileExists) return 'Usuário Não Existe'

    const {id: monthId} = await this.monthService.createMonth(profileIdNumber)

    const expenseCreation = await this.expensesService.createExpense(createExpense); 
    
    await this.relation.addExpenseToActualMonth(expenseCreation, profileIdNumber, monthId)
    await this.relation.addCategoryRelation(profileIdNumber, createExpense.category, expenseCreation)

    const expenses = await this.expensesService.findAllActualMonthExpense(profileIdNumber, monthId)

    await this.expensesCalcService.updateMonthRepository(expenses, monthId)

    return expenseCreation
  }

  @Get()
  async findAll(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)

    await this.monthService.createMonth(profileIdNumber)

    return await this.expensesService.findAll(profileIdNumber);
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

    const expenses = await this.expensesService.findAllActualMonthExpense(profileIdNumber, monthId)

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

    const expenses = await this.expensesService.findAllActualMonthExpense(profileIdNumber, monthId)

    if (!expenses.length) {
      await this.monthService.deleteMonth(monthId)
    } else {
      await this.expensesCalcService.updateMonthRepository(expenses, monthId)
    }

    return `${id} foi excluido`;
  }
}
