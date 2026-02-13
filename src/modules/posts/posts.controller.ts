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

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost({
      ...createPostDto,
      author: { connect: { email: createPostDto.authorEmail } },
    });
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.postsService.posts({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : undefined,
    });
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
