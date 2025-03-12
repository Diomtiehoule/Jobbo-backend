import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(private db: PrismaService) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const roles = ['superAdmin', 'admin', 'user'];

    for (const role of roles) {
      const existingRole = await this.db.role.findFirst({
        where: { name: role },
      });

      if (!existingRole) {
        await this.db.role.create({
          data: { name: role },
        });
        console.log(`✅ Role "${role}" ajouté.`);
      }
    }
  }
}
