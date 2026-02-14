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
import { GetPostsDto } from './dto/get-posts.dto';
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
      author: { connect: { id: createPostDto.authorId } },
    });
  }

  @Get()
  @ResponseMessage('Posts retrieved successfully')
  findAll(@Query() query: GetPostsDto) {
    return this.postsService.posts(query);
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
