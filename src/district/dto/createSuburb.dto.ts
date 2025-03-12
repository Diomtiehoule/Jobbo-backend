import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuburbDto {
  @ApiProperty({
    default: 'Zone 3',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
