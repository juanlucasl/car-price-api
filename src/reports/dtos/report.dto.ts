import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  kilometers: number;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
