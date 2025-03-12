import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    default: 'Abidjan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
