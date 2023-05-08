import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';

@Module({
  providers: [
    PrismaService, 
    PrismaRelations, 
    DateService
  ]
})
export class PrismaModule {}
