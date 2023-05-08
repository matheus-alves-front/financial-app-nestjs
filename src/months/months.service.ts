import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MonthsService {
  constructor(private prisma: PrismaService) {}

  async createMonth() {
    const actualMonth = await this.prisma.month.findFirst({
      orderBy: {
        id: 'desc'
      }
    })

    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear()

    if (
      !actualMonth || 
      actualMonth.month !== month ||
      actualMonth.year !== year  
    ) {
      console.log('criou novo mes')
      await this.prisma.month.create({
        data: {
          month,
          totalAmountLeft: 0,
          totalExpenses: 0,
          year
        }
      })
    } else console.log('não criou outro mes')
  }

  findAll() {
    return this.prisma.month.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
