import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from '../months/months.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';
import { ExpensesCalculatorService } from 'src/months/expenseMonthCalculator.service';

@Module({
  imports: [PrismaClient],
  controllers: [ExpensesController],
  providers: [
    ExpensesService,
    PrismaService, 
    MonthsService, 
    PrismaRelations, 
    DateService,
    ExpensesCalculatorService
  ]
})
export class ExpensesModule {}
