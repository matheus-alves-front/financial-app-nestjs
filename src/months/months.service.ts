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

    const {year} = this.dateService.getDate()

    const month = 10
    
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
    
    const {month: actualMonth} = await this.prisma.monthExpense.findFirst({
      where: {
        monthId
      },
      select: {
        month: true
      }
    })

    if (
      !actualMonth || 
      actualMonth.month !== month ||
      actualMonth.year !== year  
      ) {
      const newActualMonth = await this.prisma.month.create({
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
      
      const fixedExpensesToadd = await this.prismaRelations.getFixedMonthExpensesToAddNewMonth(
        profileId,
        monthId,
        newActualMonth.id
      )

      await this.prismaRelations.addFixedMonthExpensesToNewMonth(fixedExpensesToadd)
    
      return newActualMonth
    } 
    else return actualMonth
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

    const monthsFiltered = [];

    months.forEach((item) => {
      const exists = monthsFiltered.find((newItem) => newItem.id === item.id);
      if (!exists) {
        monthsFiltered.push(item);
      }
    });

    monthsFiltered.sort((a, b) => b.id - a.id);

    return monthsFiltered;
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
