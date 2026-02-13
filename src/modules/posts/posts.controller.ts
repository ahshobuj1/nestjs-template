import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage('Post created successfully')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost({
      ...createPostDto,
      author: { connect: { email: createPostDto.authorEmail } },
    });
  }

  @Get()
  @ResponseMessage('Posts retrieved successfully')
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const pageLimit = take ? Number(take) : 10;
    const offset = skip ? Number(skip) : 0;

    const { data, total } = await this.postsService.posts({
      skip: offset,
      take: pageLimit,
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : undefined,
    });

    const totalPages = Math.ceil(total / pageLimit);
    const currentPage = Math.floor(offset / pageLimit) + 1;

    return {
      data,
      meta: {
        pagination: {
          page: currentPage,
          limit: pageLimit,
          total,
          totalPages,
          hasNext: currentPage < totalPages,
          hasPrevious: currentPage > 1,
        },
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.post({ id: Number(id) });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const { ...rest } = updatePostDto;
    return this.postsService.updatePost({
      where: { id: Number(id) },
      data: rest,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.deletePost({ id: Number(id) });
  }
}
