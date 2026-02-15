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

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (existingUsername) {
      throw new ConflictException('User with this username already exists');
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(query: Record<string, any>) {
    const queryBuilder = new QueryBuilder(this.prisma.user, query)
      .search(['email', 'username', 'name'])
      .filter()
      .sort()
      .pagination();

    const users = await queryBuilder.exec();
    const meta = await queryBuilder.countTotal();

    return {
      data: users,
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

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

// import { Injectable } from '@nestjs/common';

// import { PrismaService } from '../prisma/prisma.service';
// import { QueryBuilder } from '../../common/builder/QueryBuilder';
// import { Post, Prisma } from 'prisma/generated/prisma/client';

// @Injectable()
// export class PostsService {
//   constructor(private prisma: PrismaService) {}

//   async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
//     return this.prisma.post.findUnique({
//       where: postWhereUniqueInput,
//     });
//   }

//   async posts(query: Record<string, any>) {
//     const queryBuilder = new QueryBuilder(this.prisma.post, query)
//       .search(['title', 'content'])
//       .filter()
//       .sort()
//       .pagination()
//       .select({
//         id: true,
//         title: true,
//         content: false,

//         author: {
//           select: {
//             id: true,
//             email: true,s
//           },
//         },
//       });

//     const data = await queryBuilder.exec();
//     const meta = await queryBuilder.countTotal();

//     return {
//       data,
//       meta,
//     };
//   }

//   async createPost(data: Prisma.PostCreateInput): Promise<Post> {
//     return this.prisma.post.create({
//       data,
//     });
//   }

//   async updatePost(params: {
//     where: Prisma.PostWhereUniqueInput;
//     data: Prisma.PostUpdateInput;
//   }): Promise<Post> {
//     const { data, where } = params;
//     return this.prisma.post.update({
//       data,
//       where,
//     });
//   }

//   async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
//     return this.prisma.post.delete({
//       where,
//     });
//   }
// }
