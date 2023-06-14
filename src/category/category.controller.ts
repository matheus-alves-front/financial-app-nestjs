import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

    await this.prismaRelations.addCategoryRelation(profileIdNumber, categoryCreated?.name)

    return categoryCreated
  }

  @Get() 
  async findAllCategories(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)
    const categories = this.categoryService.findAllCategories(profileIdNumber)

    return categories
  }

  @Get('/name/:categoryName')
  async findUniqueCategory(
    @Param('profileId') profileId: string,
    @Param('categoryName') categoryName: string
  ) {
    const profileIdNumber = Number(profileId)

    const category = await this.categoryService.findUniqueCategory(profileIdNumber, categoryName)
    
    return category || {message: 'Essa categoria não existe!'}
  }

  @Get('/expenses')
  async findAllCategoriesWithExpenses(@Param('profileId') profileId: string) {
    const profileIdNumber = Number(profileId)
    const categoriesWithProducts = await this.categoryService.findAllCategoriesWithExpenses(profileIdNumber)
  
    return categoriesWithProducts
  }

  @Get('/name/:categoryName/expenses')
  async findUniqueCategoryWithExpenses(
    @Param('profileId') profileId: string,
    @Param('categoryName') categoryName: string
  ) {
    const profileIdNumber = Number(profileId)

    const category = await this.categoryService.findUniqueCategoryWithExpenses(profileIdNumber, categoryName)
    
    return category || {message: 'Essa categoria não existe!'}
  }

  @Delete('/:categoryName')
  async deleteCategory(
    @Param('profileId') profileId: string,
    @Param('categoryName') categoryName: string
  ) {
    const profileIdNumber = Number(profileId)

    const categoryDeleted = await this.categoryService.deleteCategory(profileIdNumber, categoryName)

    if (categoryDeleted) {
      return { message: `Categoria ${categoryName} deletado`}
    } else {
      return { message: `Não é possivel excluir uma categoria com gastos relacionados a ela. Por favor remova todos os gastos relacionados a esta categoria`}
    }
  }
}
