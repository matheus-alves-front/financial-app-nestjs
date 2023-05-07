import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaClient],
  controllers: [ExpensesController],
  providers: [ExpensesService, PrismaService]
})
export class ExpensesModule {}
