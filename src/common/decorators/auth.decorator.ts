import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';

import { AccessGuard } from '../guards/access.guard';

export const Auth = (...roles: string[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AccessGuard));
