import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE } from 'src/utils/type';
import { LoginRootDto } from './dto/rootLogin.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/configuration/auth.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly db: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async loginRoot(credential: LoginRootDto) {
    const isAdminCredential = await this.db.user.findFirst({
      where: { email: credential.email, roleId: ROLE.ROOT, isActive: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        photo: true,
        roleId: true,
        isActive: true,
        password: true,
      },
    });

    if (!isAdminCredential)
      return {
        message: 'Email or password incorrect',
        code: 400,
      };

    const isAdminPassword = await bcrypt.compare(
      credential.password,
      isAdminCredential.password as string,
    );

    if (!isAdminPassword)
      return {
        message: 'Email or password incorrect',
        code: 400,
      };

    const token = this.auth.generateToken({ userId: isAdminCredential.id });

    return {
      code: 200,
      user: isAdminCredential,
      token,
    };
  }
}
