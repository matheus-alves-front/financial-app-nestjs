import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateService } from 'src/utils/getDate.service';

@Injectable()
export class MonthsService {
  constructor(
    private prisma: PrismaService, 
    private dateService: DateService,
  ) {}

  async createMonth() {
    const actualMonth = await this.prisma.month.findFirst({
      orderBy: {
        id: 'desc'
      }
    })

    const {year, month} = this.dateService.getDate()

    if (
      !actualMonth || 
      actualMonth.month !== month ||
      actualMonth.year !== year  
    ) {
      console.log('criou novo mes')
      await this.prisma.month.create({
        data: {
          month,
          year,
          totalAmountLeft: 0,
          totalExpenses: 0
        }
      })
    } else console.log('não criou outro mes')
  }

  findAll() {
    return this.prisma.month.findMany();
  }

  async updateAmountLeft(@Param() totalAmountLeft: number) {
    const {id: monthId} = await this.prisma.month.findFirst({
      orderBy: {
        id: 'desc'
      }
    })

    const updatedMonth = await this.prisma.month.update({
      where: {
        id: monthId
      },
      data: {
        totalAmountLeft
      }
    })

    return updatedMonth
  }

  async updateTotalExpenses(@Param() totalExpenses: number) {
    const {id: monthId} = await this.prisma.month.findFirst({
      orderBy: {
        id: 'desc'
      }
    })

    const updatedMonth = await this.prisma.month.update({
      where: {
        id: monthId
      },
      data: {
        totalExpenses
      }
    })

    return updatedMonth
  }
}
