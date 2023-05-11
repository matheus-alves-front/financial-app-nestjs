import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';
import { MonthsService } from './months.service';
import { MonthsController } from './months.controller';
import { ExpensesCalculatorService } from './expenseMonthCalculator.service';

@Module({
  controllers: [MonthsController],
  providers: [
    PrismaService, 
    PrismaRelations, 
    DateService,
    MonthsService,
    ExpensesCalculatorService
  ]
})
export class MonthsModule {}
