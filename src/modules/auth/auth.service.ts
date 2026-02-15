import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
// import { User } from 'prisma/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists)
      throw new ConflictException('User with this email already exists!');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
      },
    });

    const tokens = await this.generateTokens(user);

    const result = {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return result;
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);

    const result = {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return result;
  }

  async refresh(id: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // console.log(id, token, user);

    if (!user?.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(token, user.refreshToken);

    if (!match) throw new UnauthorizedException();

    // return this.generateTokens(user);

    const tokens = await this.generateTokens(user);

    const result = {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return result;
  }

  async generateTokens(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')!,
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN')!,
    });

    const hash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hash },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
