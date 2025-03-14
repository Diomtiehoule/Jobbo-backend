import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE, STATUS } from 'src/utils/type';

@Injectable()
export class KpiService {
  constructor(private readonly db: PrismaService) {}

  async getAllStatusPost() {
    try {
      const [allPublishedPost, allPendingPost, allRejectedPost] =
        await Promise.all([
          this.db.post.count({
            where: { isActive: true, status: STATUS.PUBLISH },
          }),
          this.db.post.count({
            where: { isActive: true, status: STATUS.PENDING },
          }),
          this.db.post.count({
            where: { isActive: true, status: STATUS.REJECTED },
          }),
        ]);

      return { allPublishedPost, allPendingPost, allRejectedPost };
    } catch (error) {
      console.error('Error fetching post status counts:', error);
      throw new Error('Failed to retrieve post status data.');
    }
  }

  async getAllUsers() {
    const allUsers = await this.db.user.count({
      where: { isActive: true, roleId: ROLE.USER },
    });

    return allUsers;
  }

  async getAllAgglomerationInfo() {
    try {
      const [allCities, allMunicipalities, allSuburbs] = await Promise.all([
        this.db.city.count({ where: { isActive: true } }),
        this.db.municipality.count({ where: { isActive: true } }),
        this.db.suburb.count({ where: { isActive: true } }),
      ]);

      return { allCities, allMunicipalities, allSuburbs };
    } catch (error) {
      console.error('Error fetching agglomeration info:', error);
      throw new Error('Failed to retrieve agglomeration data.');
    }
  }

  async getPostsByYear() {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const years = [lastYear, currentYear];

    const posts = await this.db.post.findMany({
      where: {
        createdAt: {
          gte: new Date(`${lastYear}-01-01T00:00:00.000Z`),
          lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const postCounts: Record<number, Record<number, number>> = {};

    years.forEach((year) => {
      postCounts[year] = {};
      for (let month = 1; month <= 12; month++) {
        postCounts[year][month] = 0;
      }
    });

    posts.forEach((post) => {
      const year = post.createdAt.getFullYear();
      const month = post.createdAt.getMonth() + 1;
      postCounts[year][month] += 1;
    });

    return years.map((year) => ({
      year,
      months: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        totalPosts: postCounts[year][i + 1],
      })),
    }));
  }
}
