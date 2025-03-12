import { Module } from '@nestjs/common';
import { SuburbController } from './suburb.controller';
import { SuburbService } from './suburb.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuburbController],
  providers: [SuburbService],
})
export class SuburbModule {}
