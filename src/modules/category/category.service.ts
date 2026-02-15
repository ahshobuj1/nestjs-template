import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category-dto';
import { QueryBuilder } from 'src/common/builder/QueryBuilder';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const isExist = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (isExist) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = await this.prisma.category.create({
      data,
    });

    return category;
  }

  async categories(query: Record<string, any>) {
    const queryBuilder = new QueryBuilder(this.prisma.category, query)
      .search(['slug'])
      .filter()
      .sort();

    const data = await queryBuilder.exec();
    const meta = await queryBuilder.countTotal();

    return {
      data,
      meta,
    };
  }
}
