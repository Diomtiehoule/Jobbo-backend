import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMunicipalityDto {
  @ApiProperty({
    default: 'Cocody',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
