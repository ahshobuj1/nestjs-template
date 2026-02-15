import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateCategoryDto } from './dto/create-category-dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ResponseMessage('Category has been created successfully!')
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }

  @Get()
  @ResponseMessage('Categories are retrieved successfully!')
  categories(@Query() query: Record<string, any>) {
    return this.categoryService.categories(query);
  }
}
