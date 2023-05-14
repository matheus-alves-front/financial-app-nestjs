import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('profile/:profileId/months')
export class MonthsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.month.findMany();
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
