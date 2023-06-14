import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService, 
    private dateService: DateService,
    private prismaRelations: PrismaRelations
  ) {}

  async createCategory(categoryName: string) {
    const categoryCreated = await this.prisma.category.create({
      data: {
        name: categoryName
      }
    })

    return categoryCreated
  }
}
