import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  createPaginationMeta,
  PaginationMeta,
} from '../../common/helpers/pagination.helper';
import { GetPostsDto } from './dto/get-posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async posts(
    params: GetPostsDto,
  ): Promise<{ data: Post[]; meta: { pagination: PaginationMeta } }> {
    const { skip, take, search } = params;
    const limit = take ?? 10;
    const offset = skip ?? 0;
    const page = Math.floor(offset / limit) + 1;

    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } }, // Added mode: 'insensitive' for better search
            { content: { contains: search, mode: 'insensitive' } }, // Added mode: 'insensitive' for better search
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: { id: 'desc' }, // Default ordering
      }),
      this.prisma.post.count({ where }),
    ]);

    const pagination = createPaginationMeta({ page, limit, total });

    return {
      data,
      meta: {
        pagination,
      },
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
