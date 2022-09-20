import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getUTCFullYear())
  year: number;

  @IsNumber()
  @Min(0)
  kilometers: number;

  @IsNumber()
  @IsLongitude()
  longitude: number;

  @IsNumber()
  @IsLatitude()
  latitude: number;
}
