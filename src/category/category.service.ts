import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly db: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const categoryExist = await this.db.category.findFirst({
      where: {
        title: data.title,
        description: data.description,
        isActive: true,
      },
    });

    if (categoryExist)
      return {
        message: 'Category exist',
        code: 400,
      };

    await this.db.category.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return {
      message: 'OK',
      code: 201,
    };
  }

  async getCategory(id: number) {
    const isCategory = await this.db.category.findFirst({
      where: { id: id, isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    if (!isCategory)
      return {
        message: 'Not found',
        code: 404,
      };

    return {
      message: 'Category found',
      code: 200,
      data: isCategory,
    };
  }

  async getAllCategories(page: number, limit: number) {
    const pageNumber: any = page;
    const limitNumber: number = limit;
    const skip: any = (pageNumber - 1) * limitNumber;

    const totalCategories = await this.db.category.count({
      where: { isActive: true },
    });

    const totalPages: number = Math.ceil(totalCategories / limitNumber);

    const allCategories = await this.db.category.findMany({
      orderBy: { createdAt: 'desc' },
      where: { isActive: true },
      skip,
      take: Number(limit),
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    if (!allCategories.length)
      return {
        message: 'Empty list',
        code: 200,
        data: [],
      };

    return {
      message: 'Categories list',
      code: 200,
      currentPage: pageNumber,
      totalPages,
      totalCategories,
      data: allCategories,
    };
  }

  async editSuburb(id: number, data: UpdateCategoryDto) {
    const isCategory = await this.db.category.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isCategory)
      return {
        message: 'Not found',
        code: 404,
      };

    const categoryExist = await this.db.category.findFirst({
      where: { title: data.title, description: data.description },
    });

    if (categoryExist)
      return {
        message: 'Category exist',
        code: 400,
      };

    await this.db.category.update({
      where: { id: isCategory.id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
    return {
      message: 'OK',
      code: 200,
    };
  }

  async deleteSuburb(id: number) {
    const isCategory = await this.db.category.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isCategory)
      return {
        message: 'Not found',
        code: 404,
      };

    await this.db.category.update({
      where: { id: isCategory.id },
      data: { isActive: false },
    });

    return {
      code: 204,
    };
  }
}
