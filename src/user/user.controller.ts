import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { adminAuthorization } from 'src/utils/authorizationUser';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-admin')
  createAdmin(@Request() req, @Body() credential: CreateUserDto) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.createAdmin(credential);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-admin')
  getAdmin(@Request() req) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const adminId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.getAdmin(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-admin')
  getAllAdmin(@Request() req) {
    const { limit = 10, page = 1 } = req.query;
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.getAllAdmin(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit-admin')
  editAdmin(@Request() req, @Body() data: UpdateUserDto) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const adminId = Number(req.query.id);
    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.editAdmin(+adminId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/lock-admin')
  lockAdmin(@Request() req) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const adminId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.lockAdmin(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/unlock-admin')
  unLockAdmin(@Request() req) {
    const userAuth = req.user;
    const isAdmin = adminAuthorization(userAuth.roleId);

    const adminId = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.unLockAdmin(adminId);
  }
}
