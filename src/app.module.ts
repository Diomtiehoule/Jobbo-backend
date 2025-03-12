import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityService } from './city/city.service';
import { MunicipalityService } from './municipality/municipality.service';
import { SuburbService } from './district/suburb.service';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { CityModule } from './city/city.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { SuburbModule } from './district/suburb.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './configuration/auth.module';
import { CategoryService } from './category/category.service';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    PrismaModule,
    LoginModule,
    UserModule,
    CityModule,
    MunicipalityModule,
    SuburbModule,
    AuthModule,
    RoleModule,
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CityService,
    MunicipalityService,
    SuburbService,
    UserService,
    RoleService,
    CategoryService,
    LoginService,
  ],
})
export class AppModule {}
