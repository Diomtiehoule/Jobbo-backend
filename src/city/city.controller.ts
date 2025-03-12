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
import { CreateCityDto } from './dto/createCity.dto';
import { UpdateCityDto } from './dto/updateCity.dto';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';
import { adminAuthorization } from 'src/utils/authorizationUser';
import { CityService } from './city.service';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-city')
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(CreateCityDto),
    },
  })
  createCity(@Request() req, @Body() credential: CreateCityDto) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.cityService.createCity(credential);
  }

  @Get('/get-city')
  getCity(@Request() req) {
    const cityId = Number(req.query.id);
    return this.cityService.getCity(cityId);
  }

  @Get('/get-all-city')
  getAllCity(@Request() req) {
    const { limit = 10, page = 1 } = req.query;

    return this.cityService.getAllCity(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit-city')
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(UpdateCityDto),
    },
  })
  editCity(@Request() req, @Body() data: UpdateCityDto) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const cityId = Number(req.query.id);
    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.cityService.editCity(+cityId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-city')
  deleteCity(@Request() req) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const cityId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.cityService.deleteCity(cityId);
  }
}
