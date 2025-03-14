import { Module } from '@nestjs/common';
import { AuthModule } from 'src/configuration/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
