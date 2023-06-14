import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaRelations } from 'src/prisma/relations.service';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';

@Controller('profile/:profileId/category')
export class CategoryController {
  constructor(
    private readonly prisma: PrismaService,
    private categoryService: CategoryService,
    private prismaRelations: PrismaRelations
  ) {}

  @Post()
  async createCategory(
    @Param('profileId') profileId: string,
    @Body() createCategory: Category 
  ) {
    const profileIdNumber = Number(profileId)
    const { name: categoryName } = createCategory
    const categoryCreated = await this.categoryService.createCategory(categoryName)

    await this.prismaRelations.addCategoryRelation(profileIdNumber, categoryCreated?.id)

    return categoryCreated
  }

  @Get() 
  async findAllCategories(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)
    const categories = this.categoryService.findAllCategories(profileIdNumber)

    return categories
  }

  @Get('/expenses')
  async findAllCategoriesWithProducts(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)
    const categoriesWithProducts = await this.categoryService.findAllCategoriesWithExpenses(profileIdNumber)
  
    return categoriesWithProducts
  }
}
