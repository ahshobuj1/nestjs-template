import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryBuilder } from '../../common/builder/QueryBuilder';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async posts(query: Record<string, any>) {
    const queryBuilder = new QueryBuilder(this.prisma.post, query)
      .search(['title', 'content'])
      .filter()
      .sort()
      .pagination()
      .include({
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      });

    const data = await queryBuilder.exec();
    const meta = await queryBuilder.countTotal();

    return {
      data,
      meta,
    };
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { data, where } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
