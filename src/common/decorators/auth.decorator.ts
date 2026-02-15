import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { UserRole } from 'prisma/generated/prisma/enums';
import { AccessGuard } from '../guards/access.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ROLES_KEY } from './roles.decorator';

export const Auth = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AccessGuard, RolesGuard),
  );
