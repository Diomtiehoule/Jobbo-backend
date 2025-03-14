import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { adminAuthorization } from 'src/utils/authorizationUser';
import { UpdateUserDto } from './dto/updateUser.dto';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-admin')
  createAdmin(@Request() req: any, @Body() credential: CreateUserDto) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.createAdmin(credential);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-admin')
  getAdmin(@Request() req: any) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const adminId: number = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.getAdmin(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-admin')
  getAllAdmin(@Request() req: any) {
    const { limit = 10, page = 1 } = req.query;
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.getAllAdmin(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-users')
  getAllUsers(@Request() req: any) {
    const { limit = 10, page = 1 } = req.query;
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.getAllUsers(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit-admin')
  editAdmin(@Request() req: any, @Body() data: UpdateUserDto) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const adminId: number = Number(req.query.id);
    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.editAdmin(+adminId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/lock-admin')
  lockAdmin(@Request() req: any) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const adminId: number = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.lockAdmin(adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/unlock-admin')
  unLockAdmin(@Request() req: any) {
    const userAuth: User = req.user;
    const isAdmin: boolean = adminAuthorization(userAuth.roleId);

    const adminId: number = Number(req.query.id);

    if (!isAdmin)
      return {
        message: 'Forbidden',
        code: 403,
      };
    return this.userService.unLockAdmin(adminId);
  }
}
