import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMunicipalityDto } from './dto/createMunicipality.dto';
import { UpdateMunicipalityDto } from './dto/updateMunicipality.dto';

@Injectable()
export class MunicipalityService {
  constructor(private readonly db: PrismaService) {}

  async createMunicipality(id: number, data: CreateMunicipalityDto) {
    const cityExist = await this.db.city.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
      },
    });

    if (!cityExist)
      return {
        message: 'Not found',
        code: 404,
      };

    const municipalityExist = await this.db.municipality.findFirst({
      where: { name: data.name, isActive: true },
    });

    if (municipalityExist)
      return {
        message: 'Minicipality exist',
        code: 400,
      };

    const newMunicipality = await this.db.municipality.create({
      data: {
        name: data.name,
        cityId: cityExist!.id,
      },
    });

    return {
      message: 'OK',
      code: 201,
    };
  }

  async getMunicipality(id: number) {
    const isMunicipality = await this.db.municipality.findFirst({
      where: { id: id, isActive: true },
      select: {
        id: true,
        name: true,
        disctrict: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!isMunicipality)
      return {
        message: 'Not found',
        code: 404,
      };

    return {
      message: 'Municipality found',
      code: 200,
      data: isMunicipality,
    };
  }

  async editMunicipality(id: number, data: UpdateMunicipalityDto) {
    const isMunicipality = await this.db.municipality.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isMunicipality)
      return {
        message: 'Not found',
        code: 404,
      };

    const municipalityExist = await this.db.municipality.findFirst({
      where: { name: data.name },
    });

    if (municipalityExist)
      return {
        message: 'Municipality exist',
        code: 400,
      };

    const editMunicipality = await this.db.municipality.update({
      where: { id: isMunicipality.id },
      data: {
        name: data.name,
      },
    });
    return {
      message: 'OK',
      code: 200,
    };
  }

  async deleteMunicipality(id: number) {
    const isMunicipality = await this.db.municipality.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isMunicipality)
      return {
        message: 'Not found',
        code: 404,
      };

    const deleteMunicipality = await this.db.municipality.update({
      where: { id: isMunicipality.id },
      data: { isActive: false },
    });

    return {
      code: 204,
    };
  }
}
