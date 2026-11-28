import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAlbumDto {
  @IsString({ message: 'El nombre del álbum debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del álbum es obligatorio' })
  @MaxLength(80, {
    message: 'El nombre del álbum no puede superar los 80 caracteres',
  })
  nombre: string;
}
