import { Controller, Post, Body, Request } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { LoginRootDto } from './dto/rootLogin.dto';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/login-root')
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(LoginRootDto),
    },
  })
  loginRoot(@Body() credential: LoginRootDto) {
    return this.loginService.loginRoot(credential);
  }
}
