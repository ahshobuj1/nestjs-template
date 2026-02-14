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
    const { authorId, ...rest } = createPostDto;
    return this.postsService.createPost({
      ...rest,
      author: { connect: { id: authorId } },
    });
  }

  @Get()
  @ResponseMessage('Posts retrieved successfully')
  findAll(@Query() query: Record<string, any>) {
    return this.postsService.posts(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.post({ id: Number(id) });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const { authorId, ...rest } = updatePostDto;
    return this.postsService.updatePost({
      where: { id: Number(id) },
      data: {
        ...rest,
        ...(authorId ? { author: { connect: { id: authorId } } } : {}),
      },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.deletePost({ id: Number(id) });
  }
}
