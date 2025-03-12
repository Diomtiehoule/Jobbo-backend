import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/configuration/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [AuthModule, PrismaModule, ConfigModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
