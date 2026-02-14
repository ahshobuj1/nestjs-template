/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostsService Search and Filter', () => {
  let service: PostsService;
  let prisma: PrismaService;

  const mockPrisma = {
    post: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should apply search correctly', async () => {
    const query = { search: 'test' };
    await service.posts(query);

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { content: { contains: 'test', mode: 'insensitive' } },
          ],
        }),
      }),
    );
  });

  it('should apply filters correctly', async () => {
    const query = { authorId: 1, published: true };
    await service.posts(query);

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          authorId: 1,
          published: true,
        }),
      }),
    );
  });

  it('should combine search and filter', async () => {
    const query = { search: 'test', authorId: 1 };
    await service.posts(query);

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { content: { contains: 'test', mode: 'insensitive' } },
          ],
          authorId: 1,
        }),
      }),
    );
  });

  it('should handle pagination correctly', async () => {
    const query = { page: 2, limit: 5 };
    await service.posts(query);

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
      }),
    );
  });

  it('should handle string values for filters and convert them correctly', async () => {
    const query = { authorId: '1', published: 'true' };
    await service.posts(query);

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          authorId: 1,
          published: true,
        }),
      }),
    );
  });
});
