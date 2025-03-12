import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    default: 'username',
  })
  fullName: string;

  @ApiProperty({
    default: '0000000000',
  })
  phone: string;

  @ApiProperty({
    default: 'mail@test.com',
  })
  email?: string;
  photo?: string;
}
