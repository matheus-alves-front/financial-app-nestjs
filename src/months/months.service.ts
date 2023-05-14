import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';

@Injectable()
export class MonthsService {
  constructor(
    private prisma: PrismaService, 
    private dateService: DateService,
    private prismaRelations: PrismaRelations
  ) {}

  async createMonth(profileId: number) {
    const monthId = await this.prismaRelations.findMonthIdsByProfile(profileId)

    const {year, month} = this.dateService.getDate()
    
    if (!monthId) {
      return await this.prisma.month.create({
          data: {
            month,
            year,
            totalExpenses: 0, 
            totalFixedExpenses: 0,
            totalEntryExpenses: 0,
            totalFixedEntryExpenses: 0,
            totalAmountLeft: 0
          }
      })
    }
    
    const actualMonth = await this.prisma.month.findUnique({
      where: {
        id: monthId
      }
    })

    if (
      !actualMonth || 
      actualMonth.month !== month ||
      actualMonth.year !== year  
      ) {
      return await this.prisma.month.create({
        data: {
          month,
          year,
          totalExpenses: 0, 
          totalFixedExpenses: 0,
          totalEntryExpenses: 0,
          totalFixedEntryExpenses: 0,
          totalAmountLeft: 0
        }
      })
    } else return actualMonth
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

  async updateTotalExpenses(@Param() 
    totalExpenses: number, 
    totalFixedExpenses: number
  ) {
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
        totalExpenses,
        totalFixedExpenses
      }
    })

    return updatedMonth
  }

  async updateTotalEntryExpenses(@Param() 
    totalEntryExpenses: number, 
    totalFixedEntryExpenses: number
  ) {
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
        totalEntryExpenses,
        totalFixedEntryExpenses
      }
    })

    return updatedMonth
  }
}
