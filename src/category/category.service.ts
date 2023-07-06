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
  ) {}

  async createCategory(categoryName: string) {
    const categoryCreated = await this.prisma.category.create({
      data: {
        name: categoryName
      }
    })

    return categoryCreated
  }

  async findUniqueCategory(profileId: number, categoryId: number) {
    const allCategoriesExpenses = await this.prisma.categoryExpense.findFirst({
      where: {
        profileId,
        categoryId
      },
      select: {
        category: true
      },
      distinct: ['categoryId']
    })

    return allCategoriesExpenses?.category || null
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
      const existingCategory = acc.find((item) => {
        item.expenses = item.expenses.filter((expense: Expense) => expense !== null);
        return item.id === category.id
      })
     
    
      if (existingCategory && expense) {
        if(expense) existingCategory.expenses.push(expense)
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

  async findUniqueCategoryWithExpenses(profileId: number, categoryId: number) {
    const getAllCategoriesExpenses = await this.prisma.categoryExpense.findMany({
      where: {
        profileId,
        categoryId
      },
      select: {
        category: true,
        expense: true
      }
    })

    const groupedCategoriesWithExpenses = getAllCategoriesExpenses.reduce((acc, { category, expense }) => {
      const existingCategory = acc.find((item) => {
        item.expenses = item.expenses.filter((expense: Expense) => expense !== null);
        return item.id === category.id
      })
     
    
      if (existingCategory && expense) {
        if(expense) existingCategory.expenses.push(expense)
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

    return getAllCategoriesExpenses.length && groupedCategoriesWithExpenses || false
  }

  async deleteCategory(profileId: number, categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId
      }
    })

    if (!category) {
      return false
    }

    const categoryExpense = await this.prisma.categoryExpense.findMany({
      where: {
        profileId,
        categoryId
      }
    })

    if (categoryExpense.length > 1) {
      return false
    }
    
    await this.prisma.categoryExpense.deleteMany({
      where: {
        profileId,
        categoryId
      }
    })

    await this.prisma.category.delete({
      where: {
        id: categoryId
      }
    })

    return true
  }
}
