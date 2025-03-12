import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSuburbDto {
  @ApiProperty({
    default: 'Zone 3',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
