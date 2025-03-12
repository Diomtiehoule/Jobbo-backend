import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly db: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      const user = await this.db.user.findFirst({
        where: { id: decoded.userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          password: true,
          roleId: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
