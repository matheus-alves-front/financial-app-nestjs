import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from '../months/months.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';

@Module({
  providers: [
    PrismaService, 
    PrismaRelations, 
    DateService
  ]
})
export class ExpensesModule {}
