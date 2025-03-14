import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { STATUS } from 'src/utils/type';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(private readonly db: PrismaService) {}

  async createPost(userId: number, data: CreatePostDto) {
    const {
      title,
      description,
      address,
      addressTechnique,
      contact,
      photos,
      categories,
    } = data;

    const existingCategories = await this.db.category.findMany({
      where: {
        isActive: true,
        title: { in: categories },
      },
      select: { id: true },
    });

    if (existingCategories.length !== categories.length) {
      return { code: 404, message: 'Not found' };
    }

    await this.db.post.create({
      data: {
        title,
        description,
        address,
        addressTechnique,
        contact,
        photos,
        userId,
        categories: {
          connect: existingCategories.map((cat) => ({ id: cat.id })),
        },
      },
    });

    return {
      code: 201,
      message: 'OK',
    };
  }

  async getPost(id: number) {
    const isPost = await this.db.post.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        addressTechnique: true,
        userId: true,
        contact: true,
        photos: true,
        status: true,
        categories: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!isPost)
      return {
        code: 404,
        message: 'Not found',
      };

    return {
      code: 200,
      message: 'Post found',
      data: isPost,
    };
  }

  async getAllPostMobile(page: number, limit: number) {
    const pageNumber: any = page;
    const limitNumber: number = limit;
    const skip: any = (pageNumber - 1) * limitNumber;

    const totalPosts = await this.db.post.count({
      where: { isActive: true, status: STATUS.PUBLISH },
    });

    const totalPages: number = Math.ceil(totalPosts / limitNumber);

    const allPost = await this.db.post.findMany({
      where: { isActive: true, status: STATUS.PUBLISH },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        addressTechnique: true,
        contact: true,
        photos: true,
        userId: true,
        status: true,
        categories: true,
      },
      skip,
      take: Number(limit),
    });

    if (!allPost.length)
      return {
        code: 200,
        message: 'List Empty',
        currentPage: Number(pageNumber),
        totalPages,
        totalPosts,
        data: [],
      };

    return {
      code: 200,
      message: 'Posts list',
      currentPage: Number(pageNumber),
      totalPages,
      totalPosts,
      data: allPost,
    };
  }

  async getAllPostsBackOffice(page: number, limit: number) {
    const pageNumber: any = page;
    const limitNumber: number = limit;
    const skip: any = (pageNumber - 1) * limitNumber;

    const totalPosts = await this.db.post.count({
      where: { isActive: true },
    });

    const totalPages: number = Math.ceil(totalPosts / limitNumber);

    const allPost = await this.db.post.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        addressTechnique: true,
        contact: true,
        photos: true,
        userId: true,
        status: true,
        categories: true,
      },
      skip,
      take: Number(limit),
    });

    if (!allPost.length)
      return {
        code: 200,
        currentPage: Number(pageNumber),
        totalPages,
        totalPosts,
        message: 'List Empty',
        data: [],
      };

    return {
      code: 200,
      message: 'Posts list',
      currentPage: Number(pageNumber),
      totalPages,
      totalPosts,
      data: allPost,
    };
  }

  async getAllUserPosts(userId: number, page: number, limit: number) {
    const pageNumber: any = page;
    const limitNumber: number = limit;
    const skip: any = (pageNumber - 1) * limitNumber;

    const totalPosts = await this.db.post.count({
      where: { isActive: true, userId },
    });

    const totalPages: number = Math.ceil(totalPosts / limitNumber);

    const allPost = await this.db.post.findMany({
      where: { isActive: true, userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        addressTechnique: true,
        contact: true,
        photos: true,
        userId: true,
        status: true,
        categories: true,
      },
      skip,
      take: Number(limit),
    });

    if (!allPost.length)
      return {
        code: 200,
        message: 'List Empty',
        currentPage: Number(pageNumber),
        totalPages,
        totalPosts,
        data: [],
      };

    return {
      code: 200,
      message: 'Posts list',
      currentPage: Number(pageNumber),
      totalPages,
      totalPosts,
      data: allPost,
    };
  }

  async editPost(userId: number, id: number, data: UpdatePostDto) {
    const isPost = await this.db.post.findFirst({
      where: { id, isActive: true, userId },
    });

    if (!isPost)
      return {
        code: 404,
        message: 'Not found',
      };

    const {
      title,
      description,
      address,
      addressTechnique,
      contact,
      photos,
      categories,
    } = data;

    let categoryConnections: any = [];

    if (categories.length) {
      const existingCategories = await this.db.category.findMany({
        where: { title: { in: categories } },
        select: { id: true },
      });

      categoryConnections = existingCategories.map((cat) => ({ id: cat.id }));

      if (categoryConnections.length !== categories.length) {
        throw new Error(
          "Certaines catégories n'existent pas dans la base de données.",
        );
      }
    }

    await this.db.post.update({
      where: { id: isPost.id, isActive: true },
      data: {
        title,
        description,
        address,
        addressTechnique,
        contact,
        photos: photos ?? [],
        categories: {
          connect: categoryConnections,
        },
      },
    });

    return {
      code: 200,
      message: 'OK',
    };
  }

  async deletePost(userId: number, id: number) {
    const isPost = await this.db.post.findFirst({
      where: { id, isActive: true, userId },
    });

    if (!isPost)
      return {
        code: 404,
        message: 'Not found',
      };

    await this.db.post.update({
      where: { id: isPost.id, isActive: true },
      data: { isActive: false },
    });

    return {
      code: 204,
    };
  }

  async publishPost(id: number) {
    const isPost = await this.db.post.findFirst({
      where: { id, isActive: true, status: STATUS.PENDING },
    });

    if (!isPost)
      return {
        code: 404,
        message: 'Not found',
      };

    await this.db.post.update({
      where: { id: isPost.id, isActive: true },
      data: { status: STATUS.PUBLISH },
    });

    return {
      code: 200,
      message: 'Post published',
    };
  }

  async rejectPost(id: number) {
    const isPost = await this.db.post.findFirst({
      where: { id, isActive: true, status: { not: STATUS.REJECTED } },
    });

    if (!isPost)
      return {
        code: 404,
        message: 'Not found',
      };

    await this.db.post.update({
      where: { id: isPost.id, isActive: true },
      data: { status: STATUS.REJECTED },
    });

    return {
      code: 200,
      message: 'Post rejected',
    };
  }
}
