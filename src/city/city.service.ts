import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityDto } from './dto/createCity.dto';
import { UpdateCityDto } from './dto/updateCity.dto';

@Injectable()
export class CityService {
  constructor(private readonly db: PrismaService) {}

  async createCity(data: CreateCityDto) {
    const cityExist = await this.db.city.findFirst({
      where: { name: data.name, isActive: true },
    });

    if (cityExist)
      return {
        message: 'City exist',
        code: 400,
      };

    const newCity = await this.db.city.create({
      data: {
        name: data.name,
      },
    });

    return {
      message: 'OK',
      code: 201,
    };
  }

  async getCity(id: number) {
    const isCity = await this.db.city.findFirst({
      where: { id: id, isActive: true },
      select: {
        id: true,
        name: true,
        municipality: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
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
        },
      },
    });

    if (!isCity)
      return {
        message: 'Not found',
        code: 404,
      };

    return {
      message: 'City found',
      code: 200,
      data: isCity,
    };
  }

  async getAllCity(page: number, limit: number) {
    const pageNumber = page;
    const limitNumber = limit;
    const skip = (pageNumber - 1) * limitNumber;

    const totalCities = await this.db.city.count({
      where: { isActive: true },
    });

    const totalPages = Math.ceil(totalCities / limitNumber);

    const allCity = await this.db.city.findMany({
      orderBy: { createdAt: 'desc' },
      where: { isActive: true },
      skip,
      take: Number(limitNumber),
      select: {
        id: true,
        name: true,
        municipality: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
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
        },
      },
    });

    if (!allCity.length)
      return {
        message: 'List empty',
        code: 200,
        data: [],
      };

    return {
      message: 'Citys list',
      code: 200,
      currentPage: Number(pageNumber),
      totalPages,
      totalCities,
      data: allCity,
    };
  }

  async editCity(id: number, data: UpdateCityDto) {
    const isCity = await this.db.city.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isCity)
      return {
        message: 'Not found',
        code: 404,
      };

    const cityExist = await this.db.city.findFirst({
      where: { name: data.name },
    });

    if (cityExist)
      return {
        message: 'City exist',
        code: 400,
      };

    const editCity = await this.db.city.update({
      where: { id: isCity.id },
      data: {
        name: data.name,
      },
    });
    return {
      message: 'OK',
      code: 200,
    };
  }

  async deleteCity(id: number) {
    const isCity = await this.db.city.findFirst({
      where: { id: id, isActive: true },
    });

    if (!isCity)
      return {
        message: 'Not found',
        code: 404,
      };

    const deleteCity = await this.db.city.update({
      where: { id: isCity.id },
      data: { isActive: false },
    });

    return {
      code: 204,
    };
  }
}
