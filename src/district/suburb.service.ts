import { Injectable } from '@nestjs/common';
import { CreateSuburbDto } from './dto/createSuburb.dto';
import { UpdateSuburbDto } from './dto/updateSuburb.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuburbService {
  constructor(private readonly db: PrismaService) {}

  async createSuburb(id: number, data: CreateSuburbDto) {
    const municipalityExist = await this.db.municipality.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
      },
    });

    if (!municipalityExist)
      return {
        message: 'Not found',
        code: 404,
      };

    const SuburbExist = await this.db.suburb.findFirst({
      where: { name: data.name, isActive: true, municipalityId: id },
    });

    if (SuburbExist)
      return {
        message: 'Suburb exist',
        code: 400,
      };

    await this.db.suburb.create({
      data: {
        name: data.name,
        municipalityId: municipalityExist.id,
      },
    });

    return {
      message: 'OK',
      code: 201,
    };
  }

  async getSuburb(id: number) {
    const isSuburb = await this.db.suburb.findFirst({
      where: { id: id, isActive: true },
      select: {
        id: true,
        name: true,
      },
    });

    if (!isSuburb)
      return {
        message: 'Not found',
        code: 404,
      };

    return {
      message: 'Suburb found',
      code: 200,
      data: isSuburb,
    };
  }

  async editSuburb(id: number, data: UpdateSuburbDto) {
    const isSuburb = await this.db.suburb.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isSuburb)
      return {
        message: 'Not found',
        code: 404,
      };

    const SuburbExist = await this.db.suburb.findFirst({
      where: { name: data.name, municipalityId: id },
    });

    if (SuburbExist)
      return {
        message: 'Suburb exist',
        code: 400,
      };

    await this.db.suburb.update({
      where: { id: isSuburb.id },
      data: {
        name: data.name,
      },
    });
    return {
      message: 'OK',
      code: 200,
    };
  }

  async deleteSuburb(id: number) {
    const isSuburb = await this.db.suburb.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isSuburb)
      return {
        message: 'Not found',
        code: 404,
      };

    await this.db.suburb.update({
      where: { id: isSuburb.id },
      data: { isActive: false },
    });

    return {
      code: 204,
    };
  }
}
