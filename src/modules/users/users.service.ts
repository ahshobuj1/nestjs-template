/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryBuilder } from 'src/common/builder/QueryBuilder';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(query: Record<string, any>) {
    const queryBuilder = new QueryBuilder(this.prisma.user, query)
      .search(['email', 'name'])
      .filter()
      .sort()
      .pagination()
      .include({
        _count: {
          select: {
            posts: true,
          },
        },
      });

    const users = await queryBuilder.exec();
    const meta = await queryBuilder.countTotal();

    // Transform result to rename _count.posts → posts
    const data = users.map(({ _count, ...user }) => ({
      ...user,
      post: _count.posts,
    }));

    return {
      data,
      meta,
    };
  }

  // async findAll(params: GetUsersDto) {
  //   const { skip, take, search } = params;
  //   const limit = take ?? 10;
  //   const offset = skip ?? 0;
  //   const page = Math.floor(offset / limit) + 1;

  //   const where: Prisma.UserWhereInput = search
  //     ? {
  //         OR: [
  //           { email: { contains: search, mode: 'insensitive' } },
  //           { name: { contains: search, mode: 'insensitive' } },
  //         ],
  //       }
  //     : {};

  //   const [users, total] = await Promise.all([
  //     this.prisma.user.findMany({
  //       skip: offset,
  //       take: limit,
  //       where,
  //       orderBy: { id: 'desc' },
  //       include: {
  //         _count: {
  //           select: {
  //             posts: true,
  //           },
  //         },
  //       },
  //     }),
  //     this.prisma.user.count({ where }),
  //   ]);

  //   const pagination = createPaginationMeta({ page, limit, total });

  //   // Transform result to rename _count.posts → posts
  //   const data = users.map(({ _count, ...user }) => ({
  //     ...user,
  //     posts: _count.posts,
  //   }));

  //   return {
  //     data,
  //     meta: {
  //       pagination,
  //     },
  //   };
  // }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
