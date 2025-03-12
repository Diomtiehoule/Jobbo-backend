import {
  Body,
  Controller,
  Delete,
  UseGuards,
  Request,
  Post,
  Get,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';
import { adminAuthorization } from 'src/utils/authorizationUser';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-category')
  createCategory(@Request() req, @Body() credential: CreateCategoryDto) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.categoryService.createCategory(credential);
  }

  @Get('/get-category')
  getCategory(@Request() req) {
    const categoryId = Number(req.query.id);
    return this.categoryService.getCategory(categoryId);
  }

  @Get('/get-all-categories')
  getAllCategories(@Request() req) {
    const { limit = 10, page = 1 } = req.query;
    return this.categoryService.getAllCategories(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit-category')
  editCategory(@Request() req, @Body() data: UpdateCategoryDto) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const categoryId = Number(req.query.id);
    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.categoryService.editSuburb(+categoryId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-category')
  deleteCategory(@Request() req) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const disctrictId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.categoryService.deleteSuburb(disctrictId);
  }
}
