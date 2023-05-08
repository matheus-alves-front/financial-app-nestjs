import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpensesModule } from './expenses/expenses.module';
import { MonthsModule } from './months/months.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ExpensesModule, 
    MonthsModule, 
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
