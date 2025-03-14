import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateMunicipalityDto } from './dto/createMunicipality.dto';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';
import { UpdateMunicipalityDto } from './dto/updateMunicipality.dto';
import { MunicipalityService } from './municipality.service';
import { adminAuthorization } from 'src/utils/authorizationUser';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
}

@Controller('municipality')
export class MunicpalityController {
  constructor(private readonly municipalite: MunicipalityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-municipality')
  createMunicipalite(
    @Request() req: any,
    @Body() credential: CreateMunicipalityDto,
  ) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const cityId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.municipalite.createMunicipality(cityId, credential);
  }

  @Get('/get-municipality')
  getMunicipality(@Request() req: any) {
    const cityId = Number(req.query.id);
    return this.municipalite.getMunicipality(cityId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit-municipality')
  editMunicipality(@Request() req: any, @Body() data: UpdateMunicipalityDto) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const cityId = Number(req.query.id);
    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.municipalite.editMunicipality(+cityId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-municipality')
  deleteMunicipality(@Request() req: any) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const cityId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.municipalite.deleteMunicipality(cityId);
  }
}
