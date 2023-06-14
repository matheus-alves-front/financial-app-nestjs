import { Injectable, Param } from '@nestjs/common';
import { Expense } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { DateService } from 'src/utils/getDate.service';

export interface categoryExpenses {
  category: {
    id: number
    name: string
    expenses: Expense[]
  }
}

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

  async findAllCategories(profileId: number) {
    const allCategoriesExpenses = await this.prisma.categoryExpense.findMany({
      where: {
        profileId
      },
      select: {
        category: true
      },
      distinct: ['categoryId']
    })

    const categories = allCategoriesExpenses.map((item) => item.category);

    return categories || false
  }

  async findAllCategoriesWithExpenses(profileId: number) {
    const getAllCategoriesExpenses = await this.prisma.categoryExpense.findMany({
      where: {
        profileId
      },
      select: {
        category: true,
        expense: true
      }
    })

    const groupedCategoriesWithExpenses = getAllCategoriesExpenses.reduce((acc, { category, expense }) => {
      const existingCategory = acc.find((item) => item.id === category.id)
  
      if (existingCategory) {
        existingCategory.expenses.push(expense)
      } else {
        const newCategory = {
          id: category.id,
          name: category.name,
          expenses: [expense]
        };
        acc.push(newCategory)
      }
  
      return acc
    }, []);
  
    return groupedCategoriesWithExpenses || false
  }
}
