import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleService, PrismaService],
  exports: [RoleService],
})
export class RoleModule {}
