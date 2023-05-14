import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from 'src/months/months.service';
import { DateService } from 'src/utils/getDate.service';
import { PrismaRelations } from 'src/prisma/relations.service';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService, 
    PrismaService,
    MonthsService,
    DateService,
    PrismaRelations
  ]
})
export class ProfileModule {}
