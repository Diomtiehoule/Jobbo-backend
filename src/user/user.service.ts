import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ConfigService } from '@nestjs/config';
import { ROLE } from 'src/utils/type';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    setTimeout(async () => {
      await this.seedSuperAdmin();
    }, 5000);
  }

  private async seedSuperAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPwd = this.configService.get<string>('ADMIN_PWD');
    const hashAdminPwd = await bcrypt.hash(adminPwd as string, 10);

    const adminExist = await this.db.user.findFirst({
      where: { email: adminEmail, isActive: true, roleId: ROLE.ROOT },
    });

    if (!adminExist) {
      await this.db.user.create({
        data: {
          fullName: this.configService.get<string>('ADMIN_FULLNAME') as string,
          email: adminEmail,
          phone: this.configService.get<string>('ADMIN_PHONE') as string,
          password: hashAdminPwd,
          photo: null,
          roleId: ROLE.ROOT,
        },
      });
      console.log(`Created`);
    }
  }

  async createAdmin(data: CreateUserDto) {
    const emailUsed = await this.db.user.findFirst({
      where: { email: data.email, roleId: ROLE.ADMIN, isActive: true },
    });

    if (emailUsed)
      return {
        message: 'Email used',
        code: 400,
      };

    const hashPassword = await bcrypt.hash(data.password, 10);

    await this.db.user.create({
      data: {
        fullName: data.fullName,
        email: data.email ?? null,
        phone: data.phone,
        password: hashPassword,
        photo: data.photo,
        roleId: ROLE.ADMIN,
      },
    });

    return {
      message: 'OK',
      code: 201,
    };
  }

  async getAdmin(id: number) {
    const isAdmin = await this.db.user.findFirst({
      where: { id: id, isActive: true, roleId: ROLE.ADMIN },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        photo: true,
        isActive: true,
      },
    });

    if (!isAdmin)
      return {
        message: 'Not found',
        code: 404,
      };

    return {
      message: 'Admin found',
      code: 200,
      data: isAdmin,
    };
  }

  async getAllAdmin(page: number, limit: number) {
    const pageNumber: any = page;
    const limitNumber: number = limit;
    const skip: any = (pageNumber - 1) * limitNumber;

    const totalAdmin = await this.db.user.count({
      where: { roleId: ROLE.ADMIN },
    });

    const totalPages: number = Math.ceil(totalAdmin / limitNumber);

    const allAdmin = await this.db.user.findMany({
      orderBy: { createdAt: 'desc' },
      where: { roleId: ROLE.ADMIN },
      skip,
      take: Number(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        photo: true,
        isActive: true,
      },
    });

    if (!allAdmin.length)
      return {
        message: 'List empty',
        code: 200,
        currentPage: Number(pageNumber),
        totalPages,
        totalAdmin,
        data: [],
      };

    return {
      message: 'Admins list',
      code: 200,
      currentPage: Number(pageNumber),
      totalPages,
      totalAdmin,
      data: allAdmin,
    };
  }

  async editAdmin(id: number, data: UpdateUserDto) {
    const isAdmin = await this.db.user.findFirst({
      where: { id: id, isActive: true, roleId: ROLE.ADMIN },
    });

    if (!isAdmin)
      return {
        message: 'Not found',
        code: 404,
      };

    const emailUsed = await this.db.user.findFirst({
      where: { email: data.email, isActive: true, roleId: ROLE.ADMIN },
    });

    if (emailUsed)
      return {
        message: 'Email used',
        code: 400,
      };

    await this.db.user.update({
      where: { id: isAdmin.id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        photo: data.photo ?? null,
      },
    });
    return {
      message: 'OK',
      code: 200,
    };
  }

  async lockAdmin(id: number) {
    const isAdmin = await this.db.user.findFirst({
      where: { id: id, isActive: true, roleId: ROLE.ADMIN },
    });

    if (!isAdmin)
      return {
        message: 'Not found',
        code: 404,
      };

    await this.db.user.update({
      where: { id: isAdmin.id },
      data: { isActive: false },
    });

    return {
      message: 'Admin locked',
      code: 200,
    };
  }

  async unLockAdmin(id: number) {
    const isAdmin = await this.db.user.findFirst({
      where: { id: id, isActive: false, roleId: ROLE.ADMIN },
    });

    if (!isAdmin)
      return {
        message: 'Not found',
        code: 404,
      };

    await this.db.user.update({
      where: { id: isAdmin.id },
      data: { isActive: true },
    });

    return {
      message: 'Admin unlocked',
      code: 200,
    };
  }

  async getAllUsers(page: number, limit: number) {
    const pageNumber: number = page;
    const limitNumber: number = limit;
    const skip: number = (pageNumber - 1) * limitNumber;

    const totalUsers = await this.db.user.count({
      where: { isActive: true, roleId: ROLE.USER },
    });

    const totalPages: number = Math.ceil(totalUsers / limitNumber);

    const allUsers = await this.db.user.findMany({
      orderBy: { createdAt: 'desc' },
      where: { roleId: ROLE.USER, isActive: true },
      skip,
      take: Number(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        photo: true,
        isActive: true,
      },
    });

    if (!allUsers.length)
      return {
        message: 'List empty',
        code: 200,
        currentPage: Number(pageNumber),
        totalPages,
        totalUsers,
        data: [],
      };

    return {
      message: 'Users list',
      code: 200,
      currentPage: Number(pageNumber),
      totalPages,
      totalUsers,
      data: allUsers,
    };
  }
}
