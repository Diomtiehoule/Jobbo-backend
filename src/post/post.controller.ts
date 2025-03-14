import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { adminAuthorization } from 'src/utils/authorizationUser';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create-post')
  @UseGuards(JwtAuthGuard)
  createPost(@Body() data: CreatePostDto, @Request() req: any) {
    const user = req.user;

    if (!user)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.createPost(user.id, data);
  }

  @Get('/get-post')
  getPost(@Request() req: any) {
    const postId = Number(req.query.id);
    return this.postService.getPost(postId);
  }

  @Get('/get-posts-mobile')
  getAllPostMobile(@Request() req: any) {
    const { limit = 10, page = 1 } = req.query;
    return this.postService.getAllPostMobile(+page, +limit);
  }

  @Get('/get-posts-backOffice')
  @UseGuards(JwtAuthGuard)
  getAllPostBackOffice(@Request() req: any) {
    const { limit = 10, page = 1 } = req.query;

    const user = req.user;
    const isAdmin = adminAuthorization(user.roleId);
    if (!isAdmin)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.getAllPostsBackOffice(+page, +limit);
  }

  @Get('/get-posts-user')
  @UseGuards(JwtAuthGuard)
  getAllUserPosts(@Request() req: any) {
    const { limit = 10, page = 1 } = req.query;

    const user = req.user;
    if (!user)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.getAllUserPosts(user.id, +page, +limit);
  }

  @Put('/edit-post')
  @UseGuards(JwtAuthGuard)
  editPost(@Request() req: any, @Body() data: UpdatePostDto) {
    const postId = Number(req.query.id);
    const user = req.user;

    if (!user)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.editPost(user.id, postId, data);
  }

  @Delete('/delete-post')
  @UseGuards(JwtAuthGuard)
  deletePost(@Request() req: any) {
    const postId = Number(req.query.id);
    const user = req.user;

    if (!user)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.deletePost(user.id, postId);
  }

  @Put('/publish-post')
  @UseGuards(JwtAuthGuard)
  publishPost(@Request() req: any) {
    const postId = Number(req.query.id);
    const user = req.user;
    const isAdmin = adminAuthorization(user.roleId);

    if (!isAdmin)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.publishPost(postId);
  }

  @Put('/reject-post')
  @UseGuards(JwtAuthGuard)
  rejectPost(@Request() req: any) {
    const postId = Number(req.query.id);
    const user = req.user;
    const isAdmin = adminAuthorization(user.roleId);

    if (!isAdmin)
      return {
        code: 403,
        message: 'Forbbiden',
      };
    return this.postService.rejectPost(postId);
  }
}
