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

  async deleteMonth(monthId: number) {
    return this.prisma.month.delete({
      where: {
        id: monthId
      }
    })
  }

  async findAll(profileId: number) {
    const monthExpenses = await this.prisma.monthExpense.findMany({
      where: {
        profileId: profileId,
      },
      include: {
        month: true
      },
    });
  
    const months = monthExpenses.map(({ month }) => month);

    const monthsArray = [];

    months.forEach((item) => {
      const exists = monthsArray.find((newItem) => newItem.id === item.id);
      if (!exists) {
        monthsArray.push(item);
      }
    });

    return monthsArray;
  }

  async findOne(id: number, profileId: number) {
    const monthExpenses = await this.prisma.monthExpense.findMany({
      where: {
        profileId: profileId,
      },
      include: {
        month: true
      },
    });

    const month = monthExpenses.find(({month}) => month.id === id);

    return month || false;
  }

  async updateAmountLeft( 
    monthId: number, 
    totalAmountLeft: number
  ) {
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

  async updateTotalExpenses(
    monthId: number,
    totalExpenses: number, 
    totalFixedExpenses: number
  ) {
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

  async updateTotalEntryExpenses(
    monthId: number,
    totalEntryExpenses: number, 
    totalFixedEntryExpenses: number
  ) {
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
