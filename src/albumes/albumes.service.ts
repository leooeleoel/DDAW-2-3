
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity.js';
import { CreateAlbumDto } from './dto/create-album.dto.js';
import { UpdateAlbumDto } from './dto/update-album.dto.js';

@Injectable()
export class AlbumesService {
  constructor(
    @InjectRepository(Album)
    private readonly albumesRepo: Repository<Album>,
  ) {}

  // Consultar todos los álbumes ordenados por ID
  findAll() {
    return this.albumesRepo.find({
      order: { id: 'ASC' },
    });
  }

  async create(datos: CreateAlbumDto): Promise<Album> {
    const existente = await this.albumesRepo.findOneBy({
      nombre: datos.nombre,
    });

    if (existente) {
      throw new ConflictException('Ya existe un álbum con ese nombre');
    }

    return this.albumesRepo.save(this.albumesRepo.create(datos));
  }

  async update(id: number, datos: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumesRepo.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(`Álbum ${id} no encontrado`);
    }

    if (datos.nombre !== undefined && datos.nombre !== album.nombre) {
      const existente = await this.albumesRepo.findOneBy({
        nombre: datos.nombre,
      });

      if (existente) {
        throw new ConflictException('Ya existe un álbum con ese nombre');
      }

      album.nombre = datos.nombre;
    }

    return this.albumesRepo.save(album);
  }

  async remove(id: number): Promise<void> {
    const album = await this.albumesRepo.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(`Álbum ${id} no encontrado`);
    }

    await this.albumesRepo.remove(album);
  }

  // Consultar un álbum incluyendo todas sus fotos
  async findFotos(id: number) {
    const album = await this.albumesRepo.findOne({
      where: { id },
      relations: {
        fotos: true,
      },
    });

    if (!album) {
      throw new NotFoundException(`Álbum ${id} no encontrado`);
    }

    return album;
  }
}
