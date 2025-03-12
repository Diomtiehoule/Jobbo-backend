import { Module } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { MunicpalityController } from './municipality.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MunicpalityController],
  providers: [MunicipalityService],
})
export class MunicipalityModule {}
