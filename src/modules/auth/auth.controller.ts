import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';

import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ResponseMessage('User has been created successfully!')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.register(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  @ResponseMessage('Login successfully!')
  async login(@Body() dto: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;

    const tokens = await this.auth.refresh(user.sub, req.cookies.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }
}
