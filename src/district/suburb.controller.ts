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
import { CreateSuburbDto } from './dto/createSuburb.dto';
import { UpdateSuburbDto } from './dto/updateSuburb.dto';
import { SuburbService } from './suburb.service';
import { adminAuthorization } from 'src/utils/authorizationUser';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
}

@Controller('suburb')
export class SuburbController {
  constructor(private readonly SuburbService: SuburbService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-suburb')
  createSuburb(@Request() req: any, @Body() credential: CreateSuburbDto) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const municipalityId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.SuburbService.createSuburb(municipalityId, credential);
  }

  @Get('/get-suburb')
  getSuburb(@Request() req: any) {
    const SuburbId = Number(req.query.id);
    return this.SuburbService.getSuburb(SuburbId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit-suburb')
  editSuburb(@Request() req: any, @Body() data: UpdateSuburbDto) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const SuburbId = Number(req.query.id);
    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.SuburbService.editSuburb(+SuburbId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-suburb')
  deleteSuburb(@Request() req: any) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const disctrictId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.SuburbService.deleteSuburb(disctrictId);
  }
}
