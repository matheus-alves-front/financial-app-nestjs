import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthsService } from './months.service';

@Controller('profile/:profileId/months')
export class MonthsController {
  constructor(
    private readonly prisma: PrismaService,
    private monthsService: MonthsService
  ) {}

  @Get()
  findAll(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)
    const months = this.monthsService.findAll(profileIdNumber)

    return months;
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const idNumber = Number(id)

    const month = await this.prisma.month.findUnique({
      where: {
        id: idNumber
      }
    }) 

    return month || 'Este Mês não foi criado ainda'
  }
}
