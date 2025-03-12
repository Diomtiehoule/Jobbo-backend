import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRootDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'example@test.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    default: '******',
  })
  @IsNotEmpty()
  password: string;
}
