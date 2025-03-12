import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'username',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    default: '0000000000',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    default: 'user@test.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    default: 'userpassword',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  photo?: string;
  roleId: number;
}
