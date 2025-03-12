import { Module } from '@nestjs/common';
import { AuthModule } from 'src/configuration/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
