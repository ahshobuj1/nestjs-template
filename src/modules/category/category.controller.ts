import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateCategoryDto } from './dto/create-category-dto';

import { UserRole } from 'prisma/generated/prisma/enums';
import { Auth } from 'src/common/decorators/auth.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(UserRole.ADMIN, UserRole.SELLER)
  @ResponseMessage('Category has been created successfully!')
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ResponseMessage('Categories are retrieved successfully!')
  categories(@Query() query: Record<string, any>) {
    return this.categoryService.categories(query);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.SELLER)
  @ResponseMessage('Category has been updated successfully!')
  update(@Param('id') id: string, @Body() data: CreateCategoryDto) {
    return this.categoryService.updateCategory(id, data);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ResponseMessage('Category has been deleted successfully!')
  delete(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
