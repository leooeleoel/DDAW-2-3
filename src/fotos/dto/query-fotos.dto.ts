import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryFotosDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La calificación mínima debe ser un número' })
  @Min(0, { message: 'La calificación mínima no puede ser menor que 0' })
  @Max(5, { message: 'La calificación mínima no puede ser mayor que 5' })
  min: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La calificación máxima debe ser un número' })
  @Min(0, { message: 'La calificación máxima no puede ser menor que 0' })
  @Max(5, { message: 'La calificación máxima no puede ser mayor que 5' })
  max: number = 5;

  @IsOptional()
  @IsString({ message: 'El texto de búsqueda debe ser un texto' })
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser como mínimo 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser como mínimo 1' })
  @Max(50, { message: 'El límite no puede ser mayor que 50' })
  limit: number = 10;
}