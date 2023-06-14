import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';

@Controller('profile/:profileId/category')
export class CategoryController {
  constructor(
    private readonly prisma: PrismaService,
    private categoryService: CategoryService
  ) {}

  @Post()
  async createCategory(
    @Param('profileId') profileId: string,
    @Body() createCategory: Category 
  ) {
    const { name: categoryName } = createCategory
    const categoryCreated = await this.categoryService.createCategory(categoryName)

    return categoryCreated
  }
}
